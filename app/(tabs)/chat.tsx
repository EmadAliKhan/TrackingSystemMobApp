import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { io } from "socket.io-client";
import Loader from "../components/Loader";
type ChatMessage = {
  id: string;
  direction: "sent" | "received";
  type: "text" | "image" | "document";
  text?: string;
  uri?: string;
  name?: string;
  timestamp?: string;
  createdAt?: string;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const socketRef = useRef<any>(null);
  const [MY_ID, setMY_ID] = useState<string | null>(null);
  const MANAGER_ID = "6953d738cdbafe07b7ef7f51";
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const decoded: any = jwtDecode(token);

        setMY_ID(decoded?.userId || null);
      } catch (error) {
        console.error("Auth Error:", error);
      }
    };

    checkUser();
  }, []);
  const getDateLabel = (dateString: any) => {
    const msgDate = safeDate(dateString);
    if (!msgDate) return "Unknown";

    const today = new Date();

    const isToday = msgDate.toDateString() === today.toDateString();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isYesterday = msgDate.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return msgDate.toLocaleDateString("en-GB");
  };
  const safeDate = (date: any) => {
    if (!date) return null;

    const d = new Date(date);

    if (isNaN(d.getTime())) return null; // 👈 INVALID DATE catch

    return d;
  };
  // const groupMessagesByDate = (messages: any[]) => {
  //   const grouped: any[] = [];

  //   let lastDate = "";

  //   messages.forEach((msg) => {
  //     const dateLabel = getDateLabel(msg.createdAt);

  //     if (dateLabel !== lastDate) {
  //       grouped.push({
  //         type: "date",
  //         id: `date-${dateLabel}`,
  //         label: dateLabel,
  //       });
  //       lastDate = dateLabel;
  //     }

  //     grouped.push({
  //       type: "message",
  //       ...msg,
  //     });
  //   });

  //   return grouped;
  // };
  const groupedMessages = React.useMemo(() => {
    const grouped: any[] = [];
    let lastDate = "";

    for (const msg of messages) {
      const dateLabel = getDateLabel(msg.createdAt);

      if (dateLabel !== lastDate) {
        grouped.push({
          type: "date",
          id: `date-${dateLabel}`,
          label: dateLabel,
        });
        lastDate = dateLabel;
      }

      grouped.push({ type: "message", ...msg });
    }

    return grouped;
  }, [messages]);
  /* ================= AUTO SCROLL ================= */

  /* ================= FORMAT MESSAGE ================= */
  // const formatMessage = (msg: any): ChatMessage => {
  //   return {
  //     id: msg._id,
  //     direction: msg.sender === MY_ID ? "sent" : "received",
  //     type:
  //       msg.fileType === "image" ? "image" : msg.fileType ? "document" : "text",
  //     text: msg.text,
  //     uri: msg.fileUrl,
  //     name: "File",
  //     timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     }),
  //   };
  // };
  const formatMessage = (msg: any): ChatMessage => {
    return {
      id: msg._id,
      direction: msg.sender === MY_ID ? "sent" : "received",
      type:
        msg.fileType === "image" ? "image" : msg.fileType ? "document" : "text",
      text: msg.text,
      uri: msg.fileUrl,
      name: "File",
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: msg.createdAt, // 👈 ADD THIS IMPORTANT
    };
  };
  /* ================= SOCKET CONNECT ================= */
  // useEffect(() => {
  //   socketRef.current = io("https://fypserver-production-3c70.up.railway.app", {
  //     query: { userId: MY_ID },
  //     transports: ["websocket"],
  //   });

  //   socketRef.current.on("connect", () => {
  //     console.log("🟢 Connected");
  //   });

  //   socketRef.current.on("receiveMessage", (msg: any) => {
  //     setMessages((prev) => [...prev, formatMessage(msg)]);
  //   });

  //   return () => {
  //     socketRef.current.disconnect();
  //   };
  // }, []);
  useEffect(() => {
    if (!MY_ID) return;

    socketRef.current = io("https://fypserver-production-3c70.up.railway.app", {
      query: { userId: MY_ID },
      transports: ["websocket"],
    });

    socketRef.current.on("receiveMessage", (msg: any) => {
      setMessages((prev) => [...prev, formatMessage(msg)]);
    });

    return () => socketRef.current?.disconnect();
  }, [MY_ID]);
  /* ================= LOAD OLD MESSAGES ================= */
  useEffect(() => {
    if (!MY_ID) return;
    fetchMessages();
  }, [MY_ID]);

  const fetchMessages = async () => {
    try {
      setLoading(true); // 👈 START LOADER
      const res = await fetch(
        `https://fypserver-production-3c70.up.railway.app/api/v1/message?senderId=${MY_ID}&receiverId=${MANAGER_ID}`,
      );

      const data = await res.json();

      const formatted = data.data.map((msg: any) => formatMessage(msg));
      // console.log("formated Messages", formatted);
      setMessages(formatted);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // 👈 STOP LOADER
    }
  };
  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  /* ================= SEND TEXT ================= */
  const handleSendText = async () => {
    if (!draft.trim()) return;

    try {
      await fetch(
        "https://fypserver-production-3c70.up.railway.app/api/v1/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: MY_ID,
            receiverId: MANAGER_ID,
            text: draft,
          }),
        },
      );

      setDraft(""); // ❗ socket se message ayega
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (result.canceled || !result.assets.length) return;

    const formData = new FormData();
    formData.append("senderId", MY_ID || "");
    formData.append("receiverId", MANAGER_ID);

    formData.append("file", {
      uri: result.assets[0].uri,
      name: "image.jpg",
      type: "image/jpeg",
    } as any);

    await fetch(
      "https://fypserver-production-3c70.up.railway.app/api/v1/message",
      {
        method: "POST",
        body: formData,
      },
    );
  };

  /* ================= SEND DOCUMENT ================= */
  const handleSendDocument = async () => {
    const formData = new FormData();
    formData.append("senderId", MY_ID || "");
    formData.append("receiverId", MANAGER_ID);

    formData.append("file", {
      uri: "file://dummy",
      name: "doc.pdf",
      type: "application/pdf",
    } as any);

    await fetch(
      "https://fypserver-production-3c70.up.railway.app/api/v1/message",
      {
        method: "POST",
        body: formData,
      },
    );
  };
  /* ================= RENDER MESSAGE ================= */
  // const renderMessage = ({ item }: { item: ChatMessage }) => {
  //   const isSent = item.direction === "sent";

  //   if (item.type === "image") {
  //     return (
  //       <View style={[styles.row, isSent && styles.rowEnd]}>
  //         <View style={[styles.bubble, isSent ? styles.sent : styles.received]}>
  //           <Image source={{ uri: item.uri }} style={styles.image} />
  //           <Text style={styles.time}>{item.timestamp}</Text>
  //         </View>
  //       </View>
  //     );
  //   }

  //   if (item.type === "document") {
  //     return (
  //       <View style={[styles.row, isSent && styles.rowEnd]}>
  //         <View style={[styles.bubble, styles.received]}>
  //           <View style={styles.docRow}>
  //             <Ionicons name="document-text-outline" size={22} />
  //             <View style={{ marginLeft: 10 }}>
  //               <Text style={styles.docTitle}>{item.name}</Text>
  //               <Text style={styles.docSub}>{item.text}</Text>
  //             </View>
  //           </View>
  //           <Text style={styles.time}>{item.timestamp}</Text>
  //         </View>
  //       </View>
  //     );
  //   }

  //   return (
  //     <View style={[styles.row, isSent && styles.rowEnd]}>
  //       <View style={[styles.bubble, isSent ? styles.sent : styles.received]}>
  //         <Text style={[styles.text, isSent && { color: "#070505" }]}>
  //           {item.text}
  //         </Text>
  //         <Text style={styles.time}>{item.timestamp}</Text>
  //       </View>
  //     </View>
  //   );
  // };

  const renderMessage = React.useCallback(({ item }: any) => {
    // 🔴 DATE LABEL UI
    if (item.type === "date") {
      return (
        <View style={styles.dateWrapper}>
          <Text style={styles.dateText}>{item.label}</Text>
        </View>
      );
    }

    const isSent = item.direction === "sent";

    if (item.type === "image") {
      return (
        <View style={[styles.row, isSent && styles.rowEnd]}>
          <View style={[styles.bubble, styles.received]}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <Text style={styles.time}>{item.timestamp}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.row, isSent && styles.rowEnd]}>
        <View style={[styles.bubble, styles.received]}>
          <Text style={styles.text}>{item.text}</Text>
          <Text style={styles.time}>{item.timestamp}</Text>
        </View>
      </View>
    );
  }, []);
  if (loading) {
    return (
      // <View style={styles.loaderContainer}>
      //   <Text style={styles.loaderText}>Loading chat...</Text>
      // </View>
      <Loader />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manager</Text>
        <Text style={styles.headerSub}>Online</Text>
      </View>

      {/* ================= CHAT ================= */}

      {/* <FlatList
        ref={flatListRef}
        // data={messages}
        data={groupedMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        keyboardShouldPersistTaps="handled"
      /> */}
      <FlatList
        ref={flatListRef}
        data={groupedMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      />

      {/* ================= INPUT ================= */}
      {/* <View style={styles.inputArea}>
        <TouchableOpacity onPress={handleSendImage}>
          <Ionicons name="image-outline" size={24} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSendDocument}>
          <Ionicons name="document-outline" size={24} />
        </TouchableOpacity>

        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Type message..."
          style={styles.input}
          multiline
        />

        <TouchableOpacity style={styles.sendBtn} onPress={handleSendText}>
          <Ionicons name="send" color="#fff" size={18} />
        </TouchableOpacity>
      </View> */}
      <View style={styles.inputWrapper}>
        {/* ATTACH MENU */}
        {showAttachMenu && (
          <View style={styles.attachMenu}>
            <TouchableOpacity
              style={styles.attachItem}
              onPress={() => {
                setShowAttachMenu(false);
                handleSendImage();
              }}
            >
              <Ionicons name="image-outline" size={22} color="#0A2540" />
              <Text style={styles.attachText}>Image</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.attachItem}
              onPress={() => {
                setShowAttachMenu(false);
                handleSendDocument();
              }}
            >
              <Ionicons name="document-outline" size={22} color="#0A2540" />
              <Text style={styles.attachText}>Document</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* INPUT BAR */}
        <View style={styles.inputArea}>
          {/* PIN ICON */}
          <TouchableOpacity onPress={() => setShowAttachMenu((prev) => !prev)}>
            <Ionicons name="attach" size={24} color="#0A2540" />
          </TouchableOpacity>

          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type message..."
            style={styles.input}
            multiline
          />

          <TouchableOpacity style={styles.sendBtn} onPress={handleSendText}>
            <Ionicons name="send" color="#fff" size={18} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // 👈 light gray like web
  },

  header: {
    backgroundColor: "#0A2540",
    padding: 18,
    paddingTop: 40,
  },
  inputWrapper: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: "#EEF2FF",
  },
  dateWrapper: {
    alignItems: "center",
    marginVertical: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },

  loaderText: {
    marginTop: 10,
    color: "#64748b",
    fontSize: 14,
  },
  dateText: {
    fontSize: 12,
    color: "#64748b",
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  attachMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 14,
    paddingVertical: 10,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  attachItem: {
    alignItems: "center",
  },

  attachText: {
    fontSize: 12,
    marginTop: 4,
    color: "#0A2540",
  },

  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 25,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  headerSub: { color: "#94A3B8", fontSize: 12 },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },

  rowEnd: {
    justifyContent: "flex-end",
  },

  bubble: {
    maxWidth: "80%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 28, // 👈 main magic
    backgroundColor: "#fff",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  sent: {
    backgroundColor: "#fff",
  },

  received: {
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 14,
    color: "#0f172a",
    lineHeight: 20,
  },

  time: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: "flex-end",
    color: "#64748b",
  },

  image: {
    width: 220,
    height: 160,
    borderRadius: 16,
    marginTop: 6,
  },

  docRow: { flexDirection: "row", alignItems: "center" },

  docTitle: { fontWeight: "600" },
  docSub: { fontSize: 12, color: "#666" },

  // inputArea: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   padding: 10,
  //   backgroundColor: "#fff",
  //   marginBottom: 20,
  // },

  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 14,
  },

  sendBtn: {
    backgroundColor: "#0A2540",
    padding: 10,
    borderRadius: 20,
  },
});
