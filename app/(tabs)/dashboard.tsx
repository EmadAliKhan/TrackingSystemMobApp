import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
const screenWidth = Dimensions.get("window").width;

// TYPES
interface UserProfile {
  name?: string;
  login?: boolean;
  email?: string;
  userId?: string;
}

interface DashboardStat {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const Dashboard = () => {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [pendingTask, setPendingTask] = useState("");
  const [reward, setReward] = useState("");
  const [rejectedTask, setRejectedTask] = useState("");
  const [completedTask, setCompletedTask] = useState("");
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const API_BASE = "https://bawdicsoft-coral.vercel.app/api/dashboardData";
  const [locationEnabled, setLocationEnabled] = useState(false);
  const checkLocationStatus = async () => {
    try {
      // Permission check
      const { status } = await Location.requestForegroundPermissionsAsync();
      // console.log(status);
      if (status !== "granted") {
        setLocationEnabled(false);
        return;
      }

      // GPS check
      const enabled = await Location.hasServicesEnabledAsync();

      setLocationEnabled(enabled);
    } catch (err) {
      console.log("Location Error:", err);
      setLocationEnabled(false);
    }
  };
  const getData = async (userId: String) => {
    // console.log(userId);

    const data = await fetch(`${API_BASE}?userId=${userId}`);
    // console.log("data", await data.json());
    let response = await data.json();
    // console.log("response", response?.tasks);
    setPendingTask(response?.tasks?.pending);
    setReward(response?.reward);
    setRejectedTask(response?.tasks?.rejected);
    setCompletedTask(response?.tasks?.completed);
  };

  useEffect(() => {
    const checkUser = async () => {
      let userId;
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode<UserProfile>(token);
          setProfileData(decoded);
          // console.log("decoded", decoded);
          userId = decoded?.userId;
          getData(userId || "");
          // console.log("decoded login", decoded?.login);
          if (decoded?.login === false) {
            Alert.alert(
              "Action Required 🔒",
              "Please update your password first.",
              [
                {
                  text: "Change Password",
                  onPress: () => router.push("/forgot-password/email"),
                },
              ],
              { cancelable: false },
            );
          }
        }
      } catch (error) {
        console.error("Auth Error:", error);
      }
    };
    checkUser();
    checkLocationStatus();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      checkLocationStatus();
    }, 3000); // every 3 sec

    return () => clearInterval(interval);
  }, []);
  const stats: DashboardStat[] = [
    { title: "Rewards", value: reward, icon: "gift-outline", color: "#8B5CF6" },
    {
      title: "Completed",
      value: completedTask,
      icon: "checkmark-done-outline",
      color: "#22C55E",
    },
    {
      title: "Rejected",
      value: rejectedTask,
      icon: "close-circle-outline",
      color: "#EF4444",
    },
    {
      title: "Incomplete",
      value: pendingTask,
      icon: "time-outline",
      color: "#F59E0B",
    },
  ];
  const completed = Number(completedTask) || 0;
  const incomplete = Number(pendingTask) || 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Welcome Back 👋</Text>
            <Text style={styles.username}>
              {profileData?.name
                ? profileData.name.charAt(0).toUpperCase() +
                  profileData.name.slice(1)
                : "Loading..."}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              setHasNewNotifications(false);
              router.push("/notifications");
            }}
          >
            <Ionicons name="notifications-outline" size={22} color="#0A2540" />
            {hasNewNotifications && <View style={styles.redDot} />}
          </TouchableOpacity>
        </View>

        {/* STATUS CARD */}
        <View style={styles.statusCard}>
          <View>
            <Text style={styles.statusLabel}>Current Status</Text>
            {/* <Text style={styles.statusTitle}>Monitoring Active</Text> */}
            <Text style={styles.statusTitle}>
              {locationEnabled ? "Monitoring Active" : "Tracking Disabled"}
            </Text>
            <Text
              style={[
                styles.statusTime,
                { color: locationEnabled ? "#22C55E" : "#EF4444" },
              ]}
            >
              {locationEnabled ? "Live Tracking Enabled" : "Location Off"}
            </Text>
            {/* <Text style={styles.statusTime}>Live Tracking Enabled</Text> */}
          </View>

          {/* <View style={styles.iconCircle}>
            <Ionicons name="location" size={26} color="#fff" />
          </View> */}
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: locationEnabled ? "#3B82F6" : "#9CA3AF" },
            ]}
          >
            <Ionicons name="location" size={26} color="#fff" />
          </View>
        </View>

        {/* STATS */}
        <View style={styles.cardsContainer}>
          {stats.map((item, index) => (
            <View key={index} style={styles.card}>
              <View
                style={[styles.iconWrapper, { backgroundColor: item.color }]}
              >
                <Ionicons name={item.icon} size={16} color="#fff" />
              </View>

              <Text style={styles.cardValue}>{item.value}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          ))}
        </View>

        {/* CHART */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Tracking Activity</Text>

          <LineChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              // datasets: [{ data: [5, 8, 6, 10, 7, 12] }],
              datasets: [
                {
                  data: [completed],
                  color: () => "#22C55E", // 🟢 Green
                  strokeWidth: 3,
                },
                {
                  data: [incomplete],
                  color: () => "#EF4444", // 🔴 Red
                  strokeWidth: 3,
                },
              ],

              legend: ["Completed", "Incomplete"], // 🔥 important
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(10,37,64,${opacity})`,
              labelColor: (opacity = 1) => `rgba(100,116,139,${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: "5", strokeWidth: "2", stroke: "#0A2540" },
            }}
            bezier
            style={{ borderRadius: 16 }}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

// STYLES
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    padding: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcome: {
    color: "#64748B",
    fontSize: 14,
  },
  username: {
    color: "#0A2540",
    fontSize: 22,
    fontWeight: "bold",
  },

  iconBtn: {
    backgroundColor: "#E2E8F0",
    padding: 10,
    borderRadius: 50,
    position: "relative",
  },
  redDot: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 10,
    height: 10,
    backgroundColor: "#EF4444",
    borderRadius: 5,
  },

  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statusLabel: {
    color: "#64748B",
    fontSize: 13,
  },
  statusTitle: {
    color: "#0A2540",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
  },
  statusTime: {
    color: "#22C55E",
    fontSize: 13,
  },

  iconCircle: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 50,
  },

  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  iconWrapper: {
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },

  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A2540",
    marginTop: 8,
  },
  cardTitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
  },

  chartCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  sectionTitle: {
    color: "#0A2540",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
});
