import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Config ───────────────────────────────────────────────────────────────────
const CURRENT_USER_ID = "69d8eb0649052d70b41e4b03";
const API_BASE = "https://fyp-coral.vercel.app/api/tasks";

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "new_task" | "reward";
  time: string;
  taskNo?: number;
}

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotificationData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}?userId=${CURRENT_USER_ID}`);
      const data = await res.json();
      const tasks = data.taskData || [];

      const appNotifs: AppNotification[] = [];

      tasks.forEach((t: any) => {
        // 1. MANAGER SENT TASK (Status: Pending)
        if (t.status?.toLowerCase() === "pending") {
          appNotifs.push({
            id: `task-${t._id}`,
            title: "New Task Assigned 📩",
            message: `Manager assigned Task #${t.TaskNo}: ${t.Task}. Check the Pending tab.`,
            type: "new_task",
            time: "New",
            taskNo: t.TaskNo,
          });
        }

        // 2. REWARD NOTIFICATION (Status: Completed)
        if (t.status?.toLowerCase() === "completed") {
          appNotifs.push({
            id: `reward-${t._id}`,
            title: "Reward Earned! 🏆",
            message: `You successfully completed Task #${t.TaskNo}. Reward added to profile.`,
            type: "reward",
            time: "Completed",
          });
        }
      });

      // Sort: Newest "Pending" tasks at the very top
      setNotifications(
        appNotifs.sort((a, b) => (a.type === "new_task" ? -1 : 1)),
      );
    } catch (error) {
      console.error("Notif Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificationData();
  }, [fetchNotificationData]);

  const renderItem = ({ item }: { item: AppNotification }) => (
    <TouchableOpacity
      style={s.card}
      onPress={() => item.type === "new_task" && router.push("/(tabs)/task")}
    >
      <View
        style={[
          s.iconCircle,
          {
            backgroundColor:
              item.type === "new_task" ? "#3B82F620" : "#F59E0B20",
          },
        ]}
      >
        <Ionicons
          name={item.type === "new_task" ? "mail-unread" : "trophy"}
          size={24}
          color={item.type === "new_task" ? "#3B82F6" : "#F59E0B"}
        />
      </View>
      <View style={s.textContainer}>
        <View style={s.row}>
          <Text style={s.title}>{item.title}</Text>
          <Text
            style={[
              s.time,
              item.type === "new_task" && {
                color: "#3B82F6",
                fontWeight: "bold",
              },
            ]}
          >
            {item.time}
          </Text>
        </View>
        <Text style={s.message}>{item.message}</Text>
      </View>
      {item.type === "new_task" && <View style={s.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={s.container}>
      {/* <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>System Activity</Text>
        <View style={{ width: 24 }} />
      </View> */}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3B82F6"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchNotificationData();
              }}
              tintColor="#fff"
            />
          }
          ListEmptyComponent={
            <View style={s.emptyBox}>
              <Ionicons
                name="notifications-off-outline"
                size={50}
                color="#1E3A5F"
              />
              <Text style={s.emptyTxt}>No new tasks or rewards yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// const s = StyleSheet.create({

//   container: { flex: 1, backgroundColor: "#0A2540" },
//   header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
//   card: { backgroundColor: "#1E3A5F", borderRadius: 15, padding: 15, flexDirection: "row", alignItems: "center", marginBottom: 12 },
//   iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", marginRight: 15 },
//   textContainer: { flex: 1 },
//   row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
//   title: { color: "#fff", fontWeight: "bold", fontSize: 14 },
//   time: { color: "#7BA7D4", fontSize: 10 },
//   message: { color: "#CBD5E1", fontSize: 12, lineHeight: 18 },
//   unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3B82F6", marginLeft: 10 },
//   emptyBox: { alignItems: 'center', marginTop: 100 },
//   emptyTxt: { color: "#7BA7D4", marginTop: 10 }
// });

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  headerTitle: {
    color: "#0A2540",
    fontSize: 18,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  title: {
    color: "#0A2540",
    fontWeight: "bold",
    fontSize: 14,
  },

  time: {
    color: "#94A3B8",
    fontSize: 10,
  },

  message: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
    marginLeft: 10,
  },

  emptyBox: {
    alignItems: "center",
    marginTop: 120,
  },

  emptyTxt: {
    color: "#94A3B8",
    marginTop: 10,
    fontSize: 14,
  },
});
