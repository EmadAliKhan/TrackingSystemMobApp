import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // ✅ useNavigation import
import * as ImagePicker from "expo-image-picker";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/* ✅ CUSTOM USER TYPE */
type UserType = {
  employeeId?: string;
  email?: string;
  name?: string;
  phone?: string;
  image?: string;
};

export default function ProfileSettings() {
  const navigation = useNavigation<any>(); // ✅ useNavigation hook

  const [darkMode, setDarkMode] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [language, setLanguage] = useState("English");

  const [user, setUser] = useState<UserType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState<UserType | null>(null);
  const [logoutModal, setLogoutModal] = useState(false);

  /* 🔐 GET USER FROM TOKEN */
  const userData = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode<UserType>(token);
      setUser(decoded);
      setEditData(decoded);
    } catch (err) {
      console.log("JWT error", err);
    }
  };

  useEffect(() => {
    userData();
  }, []);

  /* 🎨 THEME */
  const colors = darkMode
    ? {
        bg: "#0A2540",
        card: "#1E3A5F",
        text: "#fff",
        sub: "#AFCBFF",
        primary: "#3B82F6",
      }
    : {
        bg: "#F1F5F9",
        card: "#ffffff",
        text: "#0A2540",
        sub: "#64748B",
        primary: "#2563EB",
      };

  /* 📷 IMAGE PICKER */
  const pickImage = async () => {
    Alert.alert("Change Profile", "Select option", [
      {
        text: "Camera",
        onPress: async () => {
          const res = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
          });
          if (!res.canceled && user) {
            setUser({ ...user, image: res.assets[0].uri });
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const res = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
          });
          if (!res.canceled && user) {
            setUser({ ...user, image: res.assets[0].uri });
          }
        },
      },
    ]);
  };

  /* 💾 SAVE PROFILE */
  const saveProfile = () => {
    if (editData) {
      setUser(editData);
    }
    setModalVisible(false);
  };

  /* 🚪 LOGOUT — FIXED with useNavigation */
  // const logout = () => {
  //   Alert.alert("Logout", "Confirm logout?", [
  //     { text: "Cancel", style: "cancel" },
  //     {
  //       text: "Logout",
  //       style: "destructive",
  //       onPress: () => {
  //         AsyncStorage.clear()
  //           .then(() => {
  //             // ✅ useNavigation reset karta hai pure stack ko
  //             navigation.reset({
  //               index: 0,
  //               routes: [{ name: "index" }], // apna root screen name yahan likho
  //             });
  //           })
  //           .catch((err) => {
  //             console.log("Logout error:", err);
  //           });
  //       },
  //     },
  //   ]);
  // };
  const logout = async () => {
    try {
      await AsyncStorage.clear();

      navigation.reset({
        index: 0,
        routes: [{ name: "index" }],
      });
    } catch (err) {
      console.log("Logout error:", err);
    }
  };
  /* ⚙️ SETTING ITEM */
  // const SettingItem = ({ icon, title, right }: any) => (
  //   <View style={styles.item}>
  //     <View style={{ flexDirection: "row", alignItems: "center" }}>
  //       <Ionicons name={icon} size={22} color={colors.primary} />
  //       <Text style={[styles.itemText, { color: colors.text }]}>{title}</Text>
  //     </View>
  //     {right}
  //   </View>
  // );

  const SettingItem = ({ icon, title, right }: any) => {
    return (
      <View style={styles.item}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Ionicons name={icon} size={22} color="#4F46E5" />

          <Text style={styles.itemText} numberOfLines={1}>
            {title ? String(title) : "Loading..."}
          </Text>
        </View>

        {right}
      </View>
    );
  };
  // return (
  //   <ScrollView style={{ backgroundColor: colors.bg }}>
  //     {/* HEADER */}
  //     <LinearGradient colors={[colors.bg, colors.card]} style={styles.header}>
  //       <TouchableOpacity onPress={pickImage}>
  //         <Image
  //           source={{
  //             uri:
  //               user?.image ||
  //               "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  //           }}
  //           style={styles.image}
  //         />
  //       </TouchableOpacity>

  //       <Text style={[styles.name, { color: colors.text }]}>
  //         {user?.name || "User Name"}
  //       </Text>

  //       <Text style={{ color: colors.sub }}>{user?.email || "No Email"}</Text>

  //       <TouchableOpacity onPress={() => setModalVisible(true)}>
  //         <Text style={{ color: colors.primary, marginTop: 5 }}>
  //           Edit Profile
  //         </Text>
  //       </TouchableOpacity>
  //     </LinearGradient>

  //     {/* SETTINGS */}
  //     <View style={[styles.card, { backgroundColor: colors.card }]}>
  //       <SettingItem
  //         icon="location-outline"
  //         title="Live Location Sharing"
  //         right={
  //           <Switch
  //             value={locationSharing}
  //             onValueChange={setLocationSharing}
  //           />
  //         }
  //       />

  //       <SettingItem
  //         icon="moon-outline"
  //         title="Dark Mode"
  //         right={<Switch value={darkMode} onValueChange={setDarkMode} />}
  //       />

  //       <SettingItem
  //         icon="language-outline"
  //         title="Language"
  //         right={
  //           <TouchableOpacity
  //             onPress={() =>
  //               setLanguage(language === "English" ? "Urdu" : "English")
  //             }
  //           >
  //             <Text style={{ color: colors.primary }}>{language}</Text>
  //           </TouchableOpacity>
  //         }
  //       />

  //       <SettingItem
  //         icon="lock-closed-outline"
  //         title="Change Password"
  //         right={
  //           <TouchableOpacity
  //             onPress={() => router.push("/forgot-password/email")}
  //           >
  //             <Ionicons name="chevron-forward" size={20} color={colors.sub} />
  //           </TouchableOpacity>
  //         }
  //       />
  //     </View>

  //     {/* ACCOUNT */}
  //     <View style={[styles.card, { backgroundColor: colors.card }]}>
  //       <SettingItem icon="call-outline" title={user?.employeeId || "N/A"} />
  //       <SettingItem icon="mail-outline" title={user?.email || "N/A"} />
  //     </View>

  //     {/* LOGOUT */}
  //     <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
  //       <Text style={{ color: "#fff" }}>Logout</Text>
  //     </TouchableOpacity>

  //     {/* EDIT MODAL */}
  //     <Modal visible={modalVisible} animationType="slide">
  //       <View style={styles.modal}>
  //         <Text style={styles.modalTitle}>Edit Profile</Text>

  //         <TextInput
  //           style={styles.input}
  //           placeholder="Name"
  //           value={editData?.name}
  //           onChangeText={(t) => setEditData((prev) => ({ ...prev!, name: t }))}
  //         />

  //         <TextInput
  //           style={styles.input}
  //           placeholder="Phone"
  //           value={editData?.phone}
  //           onChangeText={(t) =>
  //             setEditData((prev) => ({ ...prev!, phone: t }))
  //           }
  //         />

  //         <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
  //           <Text style={{ color: "#fff" }}>Save</Text>
  //         </TouchableOpacity>

  //         <TouchableOpacity onPress={() => setModalVisible(false)}>
  //           <Text style={{ textAlign: "center", marginTop: 10 }}>Cancel</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </Modal>
  //   </ScrollView>
  // );
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Modal visible={logoutModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            {/* Icon */}
            <View style={styles.iconCircle}>
              <Ionicons name="log-out-outline" size={30} color="#EF4444" />
            </View>

            {/* Title */}
            <Text style={styles.title}>Logout</Text>

            {/* Message */}
            <Text style={styles.message}>Are you sure you want to logout?</Text>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setLogoutModal(false)}
              >
                <Text style={{ color: "#0A2540", fontWeight: "600" }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.logoutBtn2} onPress={logout}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{
              uri:
                user?.image ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Text style={styles.name}>
          {user?.name
            ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
            : "User"}
        </Text>

        <Text style={styles.email}>{user?.email || "No Email"}</Text>
        {/* 
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity> */}
      </View>

      {/* SETTINGS CARD */}
      <View style={styles.card}>
        <SettingItem
          icon="location-outline"
          title="Live Location"
          right={
            <Switch
              value={locationSharing}
              onValueChange={setLocationSharing}
            />
          }
        />

        <SettingItem
          icon="moon-outline"
          title="Dark Mode"
          right={<Switch value={darkMode} onValueChange={setDarkMode} />}
        />

        <SettingItem
          icon="language-outline"
          title="Language"
          right={<Text style={styles.rightText}>{language}</Text>}
        />

        <SettingItem
          icon="lock-closed-outline"
          title="Change Password"
          right={<Ionicons name="chevron-forward" size={18} color="#999" />}
        />
      </View>

      {/* ACCOUNT CARD */}
      <View style={styles.card}>
        <SettingItem icon="id-card-outline" title={user?.employeeId || "N/A"} />
        <SettingItem icon="mail-outline" title={user?.email || "N/A"} />
      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => setLogoutModal(true)}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* 🎨 STYLES */
// const styles = StyleSheet.create({
//   header: {
//     alignItems: "center",
//     padding: 40,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 3,
//     borderColor: "#3B82F6",
//   },
//   name: { fontSize: 20, fontWeight: "bold" },

//   card: {
//     margin: 16,
//     borderRadius: 16,
//     padding: 10,
//   },

//   item: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 15,
//   },

//   itemText: { marginLeft: 10 },

//   logoutBtn: {
//     backgroundColor: "#EF4444",
//     margin: 20,
//     padding: 15,
//     borderRadius: 30,
//     alignItems: "center",
//   },

//   modal: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//   },

//   modalTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },

//   input: {
//     borderWidth: 1,
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 15,
//   },

//   saveBtn: {
//     backgroundColor: "#3B82F6",
//     padding: 12,
//     borderRadius: 10,
//     alignItems: "center",
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 15,
  },

  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 25,
  },

  avatar: {
    width: 95,
    height: 95,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#111827",
  },

  email: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  editBtn: {
    marginTop: 10,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },

  editText: {
    color: "#4F46E5",
    fontSize: 12,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    marginBottom: 15,
    color: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  itemText: {
    marginLeft: 10,
    color: "#111827",
    fontSize: 14,
  },

  rightText: {
    color: "#4F46E5",
    fontWeight: "500",
  },

  logoutBtn: {
    backgroundColor: "#EF4444",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },

  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A2540",
  },

  message: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginVertical: 10,
  },

  btnRow: {
    flexDirection: "row",
    marginTop: 15,
  },

  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    marginRight: 10,
  },

  logoutBtn2: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#EF4444",
  },
});
