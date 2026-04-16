import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Task {
  _id: string;
  TaskNo: number;
  Task: string;
  status: "pending" | "accepted" | "completed";
  distance?: number;
  estimatedTime?: number;
  locationLink?: string;
  updatedAt?: string;
}

type TabType = "pending" | "accepted" | "completed";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const MY_USER_ID = "69d8eb0649052d70b41e4b03"; 
const API_BASE = "https://fyp-coral.vercel.app/api/tasks";

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  // 1. FETCH DATA
  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}?userId=${MY_USER_ID}`);
      const json = await response.json();
      
      if (response.ok) {
        setTasks(json.taskData || []);
      } else {
        console.error("API Error:", json.error);
      }
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 2. ACCEPT TASK LOGIC
  const handleAccept = async (taskNo: number) => {
    try {
      const response = await fetch(API_BASE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskNo: taskNo,
          status: "accepted",
          userId: MY_USER_ID
        }),
      });

      if (response.ok) {
        // Update local state immediately
        setTasks(prev => 
          prev.map(t => t.TaskNo === taskNo ? { ...t, status: "accepted" as const } : t)
        );
        Alert.alert("Success", "Task accepted! Check the 'Accepted' tab.");
        setActiveTab("accepted");
      } else {
        Alert.alert("Error", "Could not accept task.");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Check your internet.");
    }
  };

  // 3. FILTER TASKS (Using normalized status strings)
  const filteredData = tasks.filter(t => 
    t.status?.toLowerCase() === activeTab.toLowerCase()
  );

  const renderItem = ({ item }: { item: Task }) => (
    <View style={s.card}>
      <View style={s.cardLeft}>
        <Text style={s.taskNo}>TASK #{item.TaskNo}</Text>
        <Text style={s.taskTitle}>{item.Task}</Text>
        <Text style={s.taskSub}>
          {item.distance ? `${item.distance.toFixed(2)} km` : "N/A"} • 
          {item.estimatedTime ? ` ${item.estimatedTime.toFixed(0)} mins` : " --"}
        </Text>
      </View>

      <View style={s.cardRight}>
        {/* Case 1: Pending */}
        {item.status === "pending" && (
          <TouchableOpacity style={s.btnAccept} onPress={() => handleAccept(item.TaskNo)}>
            <Text style={s.btnTxt}>Accept</Text>
          </TouchableOpacity>
        )}

        {/* Case 2: Accepted */}
        {item.status === "accepted" && (
          <TouchableOpacity 
            style={s.btnMap} 
            onPress={() => router.push({
              pathname: "/map",
              params: { 
                taskNo: item.TaskNo, 
                taskTitle: item.Task, 
                link: item.locationLink || "" 
              }
            })}
          >
            <Ionicons name="map" size={16} color="#fff" />
            <Text style={s.btnTxt}> Map</Text>
          </TouchableOpacity>
        )}

        {/* Case 3: Completed */}
        {item.status === "completed" && (
          <View style={s.doneBadge}>
            <Ionicons name="checkmark-done-circle" size={24} color="#10B981" />
            <Text style={s.doneTxt}>Completed</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      <Text style={s.header}>Task Board</Text>

      {/* TABS */}
      <View style={s.tabContainer}>
        {(["pending", "accepted", "completed"] as TabType[]).map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[s.tab, activeTab === tab && s.tabActive]} 
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[s.tabTxt, activeTab === tab && s.tabTxtActive]}>
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={() => {setRefreshing(true); fetchTasks();}} 
              tintColor="#fff"
            />
          }
          ListEmptyComponent={
            <View style={s.emptyBox}>
              <Ionicons name="clipboard-outline" size={48} color="#1E3A5F" />
              <Text style={s.emptyTxt}>No {activeTab} tasks found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A2540", paddingHorizontal: 20, paddingTop: 60 },
  header: { color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  tabContainer: { flexDirection: "row", gap: 8, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, backgroundColor: "#1E3A5F", borderRadius: 10, alignItems: "center" },
  tabActive: { backgroundColor: "#3B82F6" },
  tabTxt: { color: "#7BA7D4", fontSize: 11, fontWeight: "bold" },
  tabTxtActive: { color: "#fff" },
  card: { 
    backgroundColor: "#fff", 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  cardLeft: { flex: 1 },
  taskNo: { fontSize: 10, color: "#94A3B8", fontWeight: "bold", letterSpacing: 1 },
  taskTitle: { fontSize: 16, fontWeight: "bold", color: "#1E293B", marginVertical: 4 },
  taskSub: { fontSize: 12, color: "#64748B" },
  cardRight: { marginLeft: 10 },
  btnAccept: { backgroundColor: "#F59E0B", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  btnMap: { 
    backgroundColor: "#3B82F6", 
    paddingVertical: 10, 
    paddingHorizontal: 14, 
    borderRadius: 10, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  btnTxt: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  doneBadge: { alignItems: 'center' },
  doneTxt: { color: "#10B981", fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  emptyBox: { alignItems: 'center', marginTop: 100 },
  emptyTxt: { color: "#7BA7D4", marginTop: 10, fontSize: 14 }
});