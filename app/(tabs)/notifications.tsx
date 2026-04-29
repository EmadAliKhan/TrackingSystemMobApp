// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import React, { useCallback, useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   RefreshControl,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// // ─── Config ───────────────────────────────────────────────────────────────────
// const CURRENT_USER_ID = "69d8eb0649052d70b41e4b03";
// const API_BASE = "https://fyp-coral.vercel.app/api/tasks";

// interface AppNotification {
//   id: string;
//   title: string;
//   message: string;
//   type: "new_task" | "reward";
//   time: string;
//   taskNo?: number;
// }

// export default function NotificationScreen() {
//   const [notifications, setNotifications] = useState<AppNotification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchNotificationData = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_BASE}?userId=${CURRENT_USER_ID}`);
//       const data = await res.json();
//       const tasks = data.taskData || [];

//       const appNotifs: AppNotification[] = [];

//       tasks.forEach((t: any) => {
//         // 1. MANAGER SENT TASK (Status: Pending)
//         if (t.status?.toLowerCase() === "pending") {
//           appNotifs.push({
//             id: `task-${t._id}`,
//             title: "New Task Assigned 📩",
//             message: `Manager assigned Task #${t.TaskNo}: ${t.Task}. Check the Pending tab.`,
//             type: "new_task",
//             time: "New",
//             taskNo: t.TaskNo,
//           });
//         }

//         // 2. REWARD NOTIFICATION (Status: Completed)
//         if (t.status?.toLowerCase() === "completed") {
//           appNotifs.push({
//             id: `reward-${t._id}`,
//             title: "Reward Earned! 🏆",
//             message: `You successfully completed Task #${t.TaskNo}. Reward added to profile.`,
//             type: "reward",
//             time: "Completed",
//           });
//         }
//       });

//       // Sort: Newest "Pending" tasks at the very top
//       setNotifications(
//         appNotifs.sort((a, b) => (a.type === "new_task" ? -1 : 1)),
//       );
//     } catch (error) {
//       console.error("Notif Error:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchNotificationData();
//   }, [fetchNotificationData]);

//   const renderItem = ({ item }: { item: AppNotification }) => (
//     <TouchableOpacity
//       style={s.card}
//       onPress={() => item.type === "new_task" && router.push("/(tabs)/task")}
//     >
//       <View
//         style={[
//           s.iconCircle,
//           {
//             backgroundColor:
//               item.type === "new_task" ? "#3B82F620" : "#F59E0B20",
//           },
//         ]}
//       >
//         <Ionicons
//           name={item.type === "new_task" ? "mail-unread" : "trophy"}
//           size={24}
//           color={item.type === "new_task" ? "#3B82F6" : "#F59E0B"}
//         />
//       </View>
//       <View style={s.textContainer}>
//         <View style={s.row}>
//           <Text style={s.title}>{item.title}</Text>
//           <Text
//             style={[
//               s.time,
//               item.type === "new_task" && {
//                 color: "#3B82F6",
//                 fontWeight: "bold",
//               },
//             ]}
//           >
//             {item.time}
//           </Text>
//         </View>
//         <Text style={s.message}>{item.message}</Text>
//       </View>
//       {item.type === "new_task" && <View style={s.unreadDot} />}
//     </TouchableOpacity>
//   );

//   return (
//     <View style={s.container}>
//       {/* <View style={s.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={s.headerTitle}>System Activity</Text>
//         <View style={{ width: 24 }} />
//       </View> */}

//       {loading ? (
//         <ActivityIndicator
//           size="large"
//           color="#3B82F6"
//           style={{ marginTop: 50 }}
//         />
//       ) : (
//         <FlatList
//           data={notifications}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           contentContainerStyle={{ padding: 20 }}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={() => {
//                 setRefreshing(true);
//                 fetchNotificationData();
//               }}
//               tintColor="#fff"
//             />
//           }
//           ListEmptyComponent={
//             <View style={s.emptyBox}>
//               <Ionicons
//                 name="notifications-off-outline"
//                 size={50}
//                 color="#1E3A5F"
//               />
//               <Text style={s.emptyTxt}>No new tasks or rewards yet.</Text>
//             </View>
//           }
//         />
//       )}
//     </View>
//   );
// }

// // const s = StyleSheet.create({

// //   container: { flex: 1, backgroundColor: "#0A2540" },
// //   header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
// //   headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
// //   card: { backgroundColor: "#1E3A5F", borderRadius: 15, padding: 15, flexDirection: "row", alignItems: "center", marginBottom: 12 },
// //   iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", marginRight: 15 },
// //   textContainer: { flex: 1 },
// //   row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
// //   title: { color: "#fff", fontWeight: "bold", fontSize: 14 },
// //   time: { color: "#7BA7D4", fontSize: 10 },
// //   message: { color: "#CBD5E1", fontSize: 12, lineHeight: 18 },
// //   unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3B82F6", marginLeft: 10 },
// //   emptyBox: { alignItems: 'center', marginTop: 100 },
// //   emptyTxt: { color: "#7BA7D4", marginTop: 10 }
// // });

// const s = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//   },

//   header: {
//     paddingTop: 50,
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",

//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//     elevation: 3,
//   },

//   headerTitle: {
//     color: "#0A2540",
//     fontSize: 18,
//     fontWeight: "bold",
//   },

//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 14,
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,

//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//     elevation: 2,
//   },

//   iconCircle: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },

//   textContainer: {
//     flex: 1,
//   },

//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 4,
//   },

//   title: {
//     color: "#0A2540",
//     fontWeight: "bold",
//     fontSize: 14,
//   },

//   time: {
//     color: "#94A3B8",
//     fontSize: 10,
//   },

//   message: {
//     color: "#64748B",
//     fontSize: 12,
//     lineHeight: 18,
//   },

//   unreadDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#3B82F6",
//     marginLeft: 10,
//   },

//   emptyBox: {
//     alignItems: "center",
//     marginTop: 120,
//   },

//   emptyTxt: {
//     color: "#94A3B8",
//     marginTop: 10,
//     fontSize: 14,
//   },
// });

// app/(tabs)/notifications.tsx
// REPLACE your current notifications.tsx with this file entirely.
// ─────────────────────────────────────────────────────────────────────────────
// Uses NotificationContext instead of fetching tasks manually.
// Tapping a task notification → goes to /(tabs)/task (same as your current code).
// ─────────────────────────────────────────────────────────────────────────────

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppNotification, useNotifications } from "../context/NotificationContext";

// ── Time helper ───────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Icon + colour per notification type ──────────────────────────────────────
function notifStyle(type: AppNotification["type"]) {
  if (type === "task_assigned" || type === "task_completed")
    return { icon: "mail-unread" as const,  color: "#3B82F6", bg: "#3B82F620" };
  if (type === "reward_earned")
    return { icon: "trophy"     as const,  color: "#F59E0B", bg: "#F59E0B20" };
  return   { icon: "notifications" as const, color: "#6B7280", bg: "#6B728020" };
}

// ── Single card ───────────────────────────────────────────────────────────────
function NotifCard({
  item,
  onPress,
}: {
  item: AppNotification;
  onPress: () => void;
}) {
  const { icon, color, bg } = notifStyle(item.type);
  const isUnread = !item.read;

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.75}>
      <View style={[s.iconCircle, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>

      <View style={s.textContainer}>
        <View style={s.row}>
          <Text style={[s.title, isUnread && s.titleUnread]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[s.time, isUnread && { color: "#3B82F6", fontWeight: "bold" }]}>
            {timeAgo(item.createdAt)}
          </Text>
        </View>
        <Text style={s.message} numberOfLines={2}>
          {item.message}
        </Text>
      </View>

      {isUnread && <View style={s.unreadDot} />}
    </TouchableOpacity>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function NotificationScreen() {
  const { notifications, unreadCount, loading, refresh, markRead, markAllRead } =
    useNotifications();

  const handlePress = async (item: AppNotification) => {
    // Mark as read first
    if (!item.read) await markRead(item._id);

    // Navigate based on type — same routing your old code used
    if (item.type === "task_assigned" || item.type === "task_completed") {
      router.push("/(tabs)/task");
    } else if (item.type === "reward_earned") {
      router.push("/(tabs)/reward");
    }
  };

  return (
    <View style={s.container}>
      {/* Header row with "Mark all read" */}
      {unreadCount > 0 && (
        <View style={s.topBar}>
          <Text style={s.unreadLabel}>{unreadCount} unread</Text>
          <TouchableOpacity onPress={markAllRead} style={s.markAllBtn}>
            <Text style={s.markAllTxt}>Mark all read</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <NotifCard item={item} onPress={() => handlePress(item)} />
          )}
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={refresh}
              tintColor="#3B82F6"
            />
          }
          ListEmptyComponent={
            <View style={s.emptyBox}>
              <Ionicons name="notifications-off-outline" size={50} color="#1E3A5F" />
              <Text style={s.emptyTxt}>No notifications yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// ── Styles — kept identical to your existing style so UI looks the same ───────
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topBar: {
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "center",
    paddingHorizontal: 20,
    paddingTop:        14,
    paddingBottom:     4,
  },
  unreadLabel: {
    color:      "#3B82F6",
    fontSize:   12,
    fontWeight: "600",
  },
  markAllBtn: {
    paddingHorizontal: 12,
    paddingVertical:   6,
    backgroundColor:   "#EFF6FF",
    borderRadius:      10,
  },
  markAllTxt: {
    color:      "#3B82F6",
    fontSize:   12,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius:    16,
    padding:         14,
    flexDirection:   "row",
    alignItems:      "center",
    marginBottom:    12,
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 3 },
    shadowOpacity:   0.06,
    shadowRadius:    6,
    elevation:       2,
  },
  iconCircle: {
    width:           44,
    height:          44,
    borderRadius:    22,
    justifyContent:  "center",
    alignItems:      "center",
    marginRight:     12,
  },
  textContainer: { flex: 1 },
  row: {
    flexDirection:  "row",
    justifyContent: "space-between",
    marginBottom:   4,
  },
  title: {
    color:      "#0A2540",
    fontWeight: "bold",
    fontSize:   14,
    flex:       1,
    marginRight: 8,
  },
  titleUnread: {
    color: "#0A2540",
  },
  time: {
    color:    "#94A3B8",
    fontSize: 10,
  },
  message: {
    color:      "#64748B",
    fontSize:   12,
    lineHeight: 18,
  },
  unreadDot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: "#3B82F6",
    marginLeft:      10,
  },
  emptyBox: {
    alignItems:  "center",
    marginTop:   120,
  },
  emptyTxt: {
    color:    "#94A3B8",
    marginTop: 10,
  },
});