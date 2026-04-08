import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TaskStatus = "pending" | "accepted" | "rejected";

interface Task {
  id: string;
  title: string;
  location: string;
  time: string;
  status: TaskStatus;
  priority: "High" | "Medium" | "Low";
}

export default function Tasks() {
  const [activeTab, setActiveTab] = useState<TaskStatus>("pending");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const tasks: Task[] = [
    {
      id: "1",
      title: "Visit Client Office",
      location: "Karachi Office",
      time: "10:00 AM",
      status: "pending",
      priority: "High",
    },
    {
      id: "2",
      title: "Delivery Task",
      location: "Clifton Block 5",
      time: "02:00 PM",
      status: "accepted",
      priority: "Medium",
    },
    {
      id: "3",
      title: "Site Inspection",
      location: "Gulshan Area",
      time: "04:30 PM",
      status: "rejected",
      priority: "Low",
    },
  ];

  const filteredTasks = tasks.filter(
    (task) => task.status === activeTab
  );

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "pending":
        return "#FACC15";
      case "accepted":
        return "#22C55E";
      case "rejected":
        return "#EF4444";
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.taskTitle}>{item.title}</Text>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={18} color="#0A2540" />
        <Text style={styles.infoText}>{item.location}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={18} color="#0A2540" />
        <Text style={styles.infoText}>{item.time}</Text>
      </View>

      {/* Priority */}
      <View style={styles.infoRow}>
        <Ionicons name="alert-circle-outline" size={18} color="#0A2540" />
        <Text style={[styles.infoText, { fontWeight: "bold" }]}>
          {item.priority} Priority
        </Text>
      </View>

      {/* Pending countdown */}
      {item.status === "pending" && (
        <Text style={styles.pendingCountdown}>⏳ Complete before deadline!</Text>
      )}

      {/* 🔥 SHOW MORE BUTTON */}
      <TouchableOpacity
        style={styles.moreBtn}
        onPress={() => {
          setSelectedTask(item);
          setModalVisible(true);
        }}
      >
        <Text style={styles.moreText}>Show More</Text>
      </TouchableOpacity>
    </View>
  );

  const tabLabels = ["Pending", "Accepted", "Rejected"];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Tasks</Text>

      {/* TABS */}
      <View style={styles.tabsContainer}>
        {["pending", "accepted", "rejected"].map((status, index) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.tab,
              activeTab === status && styles.activeTab,
            ]}
            onPress={() => setActiveTab(status as TaskStatus)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === status && styles.activeTabText,
              ]}
            >
              {tabLabels[index]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
      />

      {/* 🔥 MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {selectedTask && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedTask.title}
                </Text>

                <Text>📍 {selectedTask.location}</Text>
                <Text>⏰ {selectedTask.time}</Text>
                <Text>⚠️ Priority: {selectedTask.priority}</Text>

                {/* DIFFERENT UI BASED ON STATUS */}
                {selectedTask.status === "pending" && (
                  <View style={styles.modalActions}>
                    <TouchableOpacity style={styles.acceptBtn}>
                      <Text style={styles.btnText}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.rejectBtn}>
                      <Text style={styles.btnText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {selectedTask.status === "accepted" && (
                  <TouchableOpacity
                    style={styles.trackBtn}
                    onPress={() => {
                      setModalVisible(false);
                      router.push("/map"); // 🔥 GO TO MAP SCREEN
                    }}
                  >
                    <Text style={styles.btnText}>
                      Start Live Tracking
                    </Text>
                  </TouchableOpacity>
                )}

                {selectedTask.status === "rejected" && (
                  <Text style={{ marginTop: 10, color: "#EF4444" }}>
                    ❌ This task was rejected
                  </Text>
                )}

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeBtn}
                >
                  <Text style={{ color: "#fff" }}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A2540",
    padding: 16,
  },

  heading: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },

  tab: {
    flex: 1,
    padding: 10,
    backgroundColor: "#1E3A5F",
    marginHorizontal: 5,
    borderRadius: 20,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#3B82F6",
  },

  tabText: {
    color: "#AFCBFF",
  },

  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#F1F5F9",
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  taskTitle: {
    fontWeight: "bold",
    color: "#0A2540",
  },

  statusBadge: {
    paddingHorizontal: 8,
    borderRadius: 10,
  },

  statusText: {
    color: "#fff",
    fontSize: 10,
  },

  infoRow: {
    flexDirection: "row",
    marginTop: 5,
  },

  infoText: {
    marginLeft: 8,
  },

  pendingCountdown: {
    marginTop: 5,
    fontStyle: "italic",
    color: "#F59E0B",
  },

  moreBtn: {
    marginTop: 10,
    backgroundColor: "#0A2540",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  moreText: {
    color: "#fff",
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  acceptBtn: {
    backgroundColor: "#22C55E",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },

  rejectBtn: {
    backgroundColor: "#EF4444",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },

  trackBtn: {
    marginTop: 15,
    backgroundColor: "#0A2540",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  closeBtn: {
    marginTop: 20,
    backgroundColor: "#1E3A5F",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});