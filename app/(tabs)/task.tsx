import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Coords {
  lat: number;
  lng: number;
}
interface Task {
  _id: string;
  TaskNo: number;
  Task: string;
  status: "pending" | "accepted" | "completed" | "rejected";
  distance?: number;
  estimatedTime?: number;
  locationLink?: string;
  updatedAt?: string;
  totalDistance?: number;
  totalTime?: number;
  originCoords?: Coords;
  destinationCoords?: Coords;
  officeCoords?: Coords; // 🔥 multiple stops
  notified?: boolean;
}

type TabType = "pending" | "accepted" | "completed" | "rejected";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// const MY_USER_ID = "69d8eb0649052d70b41e4b03";
const API_BASE = "https://fyp-coral.vercel.app/api/tasks";
// const API_BASE = "http://10.114.117.145:3000/api/tasks";
// const API_BASE = "https://fyp-coral.vercel.app/api/tasks";

interface UserProfile {
  name?: string;
  login?: boolean;
  email?: string;
  userId?: string;
}

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [userId, setUserId] = useState<string>("");
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  // 1. FETCH DATA
  const fetchTasks = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE}?userId=${userId}`);
      const json = await response.json();
      console.log("API Response:", json);
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
    const checkUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          // Explicitly typing the decoded token
          const decoded = jwtDecode<UserProfile>(token);
          setProfileData(decoded);
          console.log("Decoded Token:", decoded);
          setUserId(decoded.userId || "");
          console.log("Decoded Id:", decoded.userId || "");

          fetchTasks(decoded?.userId || "");
        }
      } catch (error) {
        console.error("Auth Error:", error);
      }
    };
    checkUser();
  }, [fetchTasks]);

  // 2. ACCEPT TASK LOGIC
  // const handleAccept = async (taskNo: number) => {
  //   try {
  //     const response = await fetch(API_BASE, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         taskNo: taskNo,
  //         status: "accepted",
  //         userId: userId,
  //       }),
  //     });

  //     if (response.ok) {
  //       // Update local state immediately
  //       setTasks((prev) =>
  //         prev.map((t) =>
  //           t.TaskNo === taskNo ? { ...t, status: "accepted" as const } : t,
  //         ),
  //       );
  //       Alert.alert("Success", "Task accepted! Check the 'Accepted' tab.");

  //       setActiveTab("accepted");
  //     } else {
  //       Alert.alert("Error", "Could not accept task.");
  //     }
  //   } catch (error) {
  //     Alert.alert("Connection Error", "Check your internet.");
  //   }
  // };
  const isTaskLocked = (item: Task) => {
    if (item.TaskNo === 1) return false;

    const prevTask = tasks.find((t) => t.TaskNo === item.TaskNo - 1);

    return prevTask?.status !== "completed";
  };

  // const handleAccept = async (task: Task) => {
  //   try {
  //     const response = await fetch(API_BASE, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         taskNo: task.TaskNo,
  //         status: "accepted",
  //         userId: userId,
  //         taskId: task._id,
  //       }),
  //     });

  //     if (response.ok) {
  //       setTasks((prev) =>
  //         prev.map((t) =>
  //           t.TaskNo === task.TaskNo
  //             ? { ...t, status: "accepted" as const }
  //             : t,
  //         ),
  //       );

  //       // 🔥 DIRECT MAP OPEN
  //       // router.push({
  //       //   pathname: "/map",
  //       //   params: {
  //       //     taskNo: task.TaskNo,
  //       //     taskTitle: task.Task,
  //       //     origin: JSON.stringify((task as any).originCoords),
  //       //     destination: JSON.stringify((task as any).destinationCoords),
  //       //   },
  //       // });
  //       // ✅ MAP OPEN
  //       // router.push({
  //       //   pathname: "/map",
  //       //   params: {
  //       //     origin: JSON.stringify(task.originCoords),
  //       //     destination: JSON.stringify(task.destinationCoords),
  //       //   },
  //       // });

  //       router.push({
  //         pathname: "/map",
  //         params: {
  //           stops: JSON.stringify([
  //             task.originCoords || task.officeCoords, // 🔥 multiple stops
  //             task.destinationCoords,
  //             task.officeCoords, // 🔥 multiple stops
  //           ]),
  //           userId: userId,     // ← ADD THIS
  //           taskId: task._id,
  //           taskNo: task.TaskNo,
  //         },
  //       });
  //     } else {
  //       Alert.alert("Error", "Could not accept task.");
  //       const errorData = await response.json();
  //       console.error("API Error:", errorData);
  //     }
  //   } catch (error) {
  //     Alert.alert("Connection Error", "Check your internet.");
  //   }
  // };
  const handleAccept = async (task: Task) => {
<<<<<<< HEAD
    console.log("Accepting Task:", task.TaskNo);
    console.log("userId:", userId);
=======
    // 🔐 LOCK CHECK
    if (isTaskLocked(task)) {
      Alert.alert("Locked 🔒", "Complete previous task first!");
      return;
    }

>>>>>>> 5f2b62397379c948d75d40547c94fb97c35b9e2f
    try {
      const response = await fetch(API_BASE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskNo: task.TaskNo,
          status: "accepted",
          userId: userId,
          taskId: task._id,
        }),
      });
      // console.log("Accept Response:", response);
      const data = await response.json();
      console.log("Accept Response Data:", data);
      if (response.ok) {
<<<<<<< HEAD
        // setTasks((prev) =>
        //   prev.map((t) =>
        //     t.TaskNo === task.TaskNo
        //       ? { ...t, status: "accepted" as const }
        //       : t,
        //   ),
        // );
        console.log("Task accepted! Navigating to map...", response);

        // 🔥 DIRECT MAP OPEN
        // router.push({
        //   pathname: "/map",
        //   params: {
        //     taskNo: task.TaskNo,
        //     taskTitle: task.Task,
        //     origin: JSON.stringify((task as any).originCoords),
        //     destination: JSON.stringify((task as any).destinationCoords),
        //   },
        // });
        // ✅ MAP OPEN
        // router.push({
        //   pathname: "/map",
        //   params: {
        //     origin: JSON.stringify(task.originCoords),
        //     destination: JSON.stringify(task.destinationCoords),
        //   },
        // });
=======
        setTasks((prev) =>
          prev.map((t) =>
            t.TaskNo === task.TaskNo
              ? { ...t, status: "accepted" as const }
              : t,
          ),
        );
        console.log(
          "Task accepted:",
          task.originCoords,
          task.destinationCoords,
          task.officeCoords,
        );
>>>>>>> 5f2b62397379c948d75d40547c94fb97c35b9e2f

        router.push({
          pathname: "/map",
          params: {
            stops: JSON.stringify([task.originCoords, task.destinationCoords]),
            userId: userId,
            taskId: task._id,
            taskNo: task.TaskNo,
          },
        });
      } else {
        Alert.alert("Error", "Could not accept task.");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Check your internet.");
    }
  };
  const handleReject = async (task: Task) => {
    try {
      const response = await fetch(API_BASE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task._id,
          status: "rejected",
          userId: userId,
        }),
      });

      if (response.ok) {
        setTasks((prev) =>
          prev.map((t) =>
            t.TaskNo === task.TaskNo
              ? { ...t, status: "rejected" as const }
              : t,
          ),
        );

        Alert.alert("Rejected", "Task moved to rejected tab");
        setActiveTab("rejected");
      } else {
        Alert.alert("Error", "Could not reject task.");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Check your internet.");
    }
  };

  // 3. FILTER TASKS (Using normalized status strings)
  // const filteredData = tasks.filter(
  //   (t) => t.status?.toLowerCase() === activeTab.toLowerCase(),
  // );
  const sortedTasks = [...tasks].sort((a, b) => a.TaskNo - b.TaskNo);

  const filteredData = sortedTasks.filter(
    (t) => t.status?.toLowerCase() === activeTab.toLowerCase(),
  );

  // const renderItem = ({ item }: { item: Task }) => (

  //   <View style={s.card}>
  //     <View style={s.cardLeft}>
  //       <Text style={s.taskNo}>TASK #{item.TaskNo}</Text>
  //       <Text style={s.taskTitle}>{item.Task}</Text>
  //       <Text style={s.taskSub}>
  //         {item.distance !== undefined
  //           ? `${item.distance.toFixed(2)} km`
  //           : "N/A"}{" "}
  //         •
  //         {item.estimatedTime !== undefined
  //           ? ` ${item.estimatedTime.toFixed(0)} mins`
  //           : " --"}
  //       </Text>
  //     </View>

  //     <View style={s.cardRight}>
  //       {/* Case 1: Pending */}
  //       {/* {item.status === "pending" && (
  //         <TouchableOpacity
  //           style={s.btnAccept}
  //           onPress={() => handleAccept(item.TaskNo)}
  //         >
  //           <Text style={s.btnTxt}>Accept</Text>
  //         </TouchableOpacity>
  //       )} */}

  //       {item.status === "pending" && (
  //         <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
  //           {isTaskLocked(item) ? (
  //             <View style={{ alignItems: "center" }}>
  //               <Ionicons name="lock-closed" size={24} color="#9CA3AF" />
  //               <Text style={{ fontSize: 10, color: "#9CA3AF" }}>Locked</Text>
  //             </View>
  //           ) : (
  //             <Ionicons
  //               name="checkmark-circle"
  //               size={24}
  //               color="#10B981"
  //               onPress={() => handleAccept(item)}
  //             />
  //           )}

  //           <Ionicons
  //             name="close-circle"
  //             size={24}
  //             color="#EF4444"
  //             onPress={() => handleReject(item)}
  //           />
  //         </View>
  //       )}

  //       {item.status === "rejected" && (
  //         <View style={s.rejectBadge}>
  //           <Ionicons name="close-circle" size={24} color="#EF4444" />
  //           <Text style={s.rejectTxt}>Rejected</Text>
  //         </View>
  //       )}
  //       {/* Case 2: Accepted */}
  //       {/* {item.status === "accepted" && (
  //         <TouchableOpacity
  //           style={s.btnMap}
  //           onPress={() =>
  //             router.push({
  //               pathname: "/map",
  //               params: {
  //                 taskNo: item.TaskNo,
  //                 taskId: item.TaskId,
  //                 taskTitle: item.Task,

  //                 origin: JSON.stringify(item.originCoords),
  //                 destination: JSON.stringify(item.destinationCoords),
  //               },
  //             })
  //           }
  //         >
  //           <Ionicons name="map" size={16} color="#fff" />
  //           <Text style={s.btnTxt}> Map</Text>
  //         </TouchableOpacity>
  //       )} */}

  //       {item.status === "accepted" && (
  //         <TouchableOpacity
  //           style={s.btnMap}
  //           onPress={() =>
  //             router.push({
  //               pathname: "/map",
  //               params: {
  //                 stops: JSON.stringify([
  //                   item.originCoords || item.officeCoords,
  //                   item.destinationCoords,
  //                   item.officeCoords,
  //                 ]),
  //                 userId: userId, // ← ADD THIS
  //                 taskId: item._id, // ← ADD THIS
  //                 taskNo: item.TaskNo, // ← ADD THIS
  //               },
  //             })
  //           }
  //         >
  //           <Ionicons name="map" size={16} color="#fff" />
  //           <Text style={s.btnTxt}> Map</Text>
  //         </TouchableOpacity>
  //       )}

  //       {/* Case 3: Completed */}
  //       {item.status === "completed" && (
  //         <View style={s.doneBadge}>
  //           <Ionicons name="checkmark-done-circle" size={24} color="#10B981" />
  //           <Text style={s.doneTxt}>Completed</Text>
  //         </View>
  //       )}
  //     </View>
  //   </View>
  // );
  const renderItem = ({ item }: { item: Task }) => {
    // 🔥 DEBUG LOGS (Console me data dekhne ke liye)
    console.log("────────────────────────────");
    console.log(`🧾 TASK #${item.TaskNo}`);
    console.log("Status:", item.status);
    console.log("Distance:", item.distance);
    console.log("Total Distance:", item.totalDistance);
    console.log("Estimated Time:", item.estimatedTime);
    console.log("Origin Coords:", item.originCoords);
    console.log("Destination Coords:", item.destinationCoords);
    console.log("Office Coords:", item.officeCoords);
    console.log("────────────────────────────");

    return (
      <View style={s.card}>
        <View style={s.cardLeft}>
          <Text style={s.taskNo}>TASK #{item.TaskNo}</Text>
          <Text style={s.taskTitle}>{item.Task}</Text>

          <Text style={s.taskSub}>
            {item.distance !== undefined
              ? `${item.distance.toFixed(2)} km`
              : "N/A"}{" "}
            •
            {item.estimatedTime !== undefined
              ? ` ${item.estimatedTime.toFixed(0)} mins`
              : " --"}
          </Text>
        </View>

        <View style={s.cardRight}>
          {/* Pending */}
          {item.status === "pending" && (
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              {isTaskLocked(item) ? (
                <View style={{ alignItems: "center" }}>
                  <Ionicons name="lock-closed" size={24} color="#9CA3AF" />
                  <Text style={{ fontSize: 10, color: "#9CA3AF" }}>Locked</Text>
                </View>
              ) : (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#10B981"
                  onPress={() => handleAccept(item)}
                />
              )}

              <Ionicons
                name="close-circle"
                size={24}
                color="#EF4444"
                onPress={() => handleReject(item)}
              />
            </View>
          )}

          {/* Rejected */}
          {item.status === "rejected" && (
            <View style={s.rejectBadge}>
              <Ionicons name="close-circle" size={24} color="#EF4444" />
              <Text style={s.rejectTxt}>Rejected</Text>
            </View>
          )}

          {/* Accepted */}
          {item.status === "accepted" && (
            <TouchableOpacity
              style={s.btnMap}
              onPress={() =>
                router.push({
                  pathname: "/map",
                  params: {
                    stops: JSON.stringify([
                      item.originCoords || item.officeCoords,
                      item.destinationCoords,
                      item.officeCoords,
                    ]),
                    userId: userId,
                    taskId: item._id,
                    taskNo: item.TaskNo,
                  },
                })
              }
            >
              <Ionicons name="map" size={16} color="#fff" />
              <Text style={s.btnTxt}> Map</Text>
            </TouchableOpacity>
          )}

          {/* Completed */}
          {item.status === "completed" && (
            <View style={s.doneBadge}>
              <Ionicons
                name="checkmark-done-circle"
                size={24}
                color="#10B981"
              />
              <Text style={s.doneTxt}>Completed</Text>
            </View>
          )}
        </View>
      </View>
    );
  };
  return (
    <View style={s.container}>
      <Text style={s.header}>Task Board</Text>

      {/* TABS */}
      <View style={s.tabContainer}>
        {(["pending", "accepted", "completed", "rejected"] as TabType[]).map(
          (tab) => (
            <TouchableOpacity
              key={tab}
              style={[s.tab, activeTab === tab && s.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[s.tabTxt, activeTab === tab && s.tabTxtActive]}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3B82F6"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchTasks(userId);
              }}
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

// const s = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//     paddingHorizontal: 20,
//     paddingTop: 60,
//   },
//   header: {
//     color: "#3B82F6",
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   tabContainer: { flexDirection: "row", gap: 8, marginBottom: 20 },
//   tab: {
//     flex: 1,
//     paddingVertical: 12,
//     backgroundColor: "#1E3A5F",
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   tabActive: { backgroundColor: "#3B82F6" },
//   tabTxt: { color: "#7BA7D4", fontSize: 11, fontWeight: "bold" },
//   tabTxtActive: { color: "#fff" },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     elevation: 3, // Shadow for Android
//     shadowColor: "#000", // Shadow for iOS
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   cardLeft: { flex: 1 },
//   taskNo: {
//     fontSize: 10,
//     color: "#94A3B8",
//     fontWeight: "bold",
//     letterSpacing: 1,
//   },
//   taskTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#1E293B",
//     marginVertical: 4,
//   },
//   btnReject: {
//     backgroundColor: "#EF4444",
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//   },

//   rejectBadge: {
//     alignItems: "center",
//   },

//   rejectTxt: {
//     color: "#EF4444",
//     fontSize: 11,
//     fontWeight: "bold",
//     marginTop: 2,
//   },
//   taskSub: { fontSize: 12, color: "#64748B" },
//   cardRight: { marginLeft: 10 },
//   btnAccept: {
//     backgroundColor: "#F59E0B",
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//   },
//   btnMap: {
//     backgroundColor: "#3B82F6",
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   btnTxt: { color: "#fff", fontWeight: "bold", fontSize: 13 },
//   doneBadge: { alignItems: "center" },
//   doneTxt: { color: "#10B981", fontSize: 11, fontWeight: "bold", marginTop: 2 },
//   emptyBox: { alignItems: "center", marginTop: 100 },
//   emptyTxt: { color: "#7BA7D4", marginTop: 10, fontSize: 14 },
// });

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  header: {
    color: "#0A2540",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
  },

  tabContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
    alignItems: "center",
  },

  tabActive: {
    backgroundColor: "#3B82F6",
  },

  tabTxt: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "bold",
  },

  tabTxtActive: {
    color: "#fff",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  cardLeft: {
    flex: 1,
  },

  taskNo: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "bold",
    letterSpacing: 1,
  },

  taskTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0A2540",
    marginVertical: 4,
  },

  taskSub: {
    fontSize: 12,
    color: "#64748B",
  },

  cardRight: {
    marginLeft: 10,
  },

  btnMap: {
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  btnTxt: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },

  rejectBadge: {
    alignItems: "center",
  },

  rejectTxt: {
    color: "#EF4444",
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 2,
  },

  doneBadge: {
    alignItems: "center",
  },

  doneTxt: {
    color: "#10B981",
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 2,
  },

  emptyBox: {
    alignItems: "center",
    marginTop: 100,
  },

  emptyTxt: {
    color: "#94A3B8",
    marginTop: 10,
    fontSize: 14,
  },
});
