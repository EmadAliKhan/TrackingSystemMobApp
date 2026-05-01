import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TaskStats {
  total: number;
  completed: number;
  onTime: number;
  streak: number;
  pending: number;
  accepted: number;
  rejected: number;
}

interface Badge {
  id: string;
  icon: string;
  title: string;
  desc: string;
  earned: boolean;
  color: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

// const CURRENT_USER_ID = "69d8eb0649052d70b41e4b03";
const API_BASE = "https://fyp-coral.vercel.app/api/tasks";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fetchStats = async (userId: string): Promise<TaskStats> => {
  const res = await fetch(`${API_BASE}?userId=${userId}`);
  const data = await res.json();
  console.log("data reward", data);

  if (!res.ok) throw new Error(data.error || "Failed to fetch");

  // FIX: Access "taskData" specifically as per your API structure
  const tasks: any[] = data.taskData || [];

  const total = tasks.length;
  const completed = tasks.filter(
    (t) => t.status?.toLowerCase() === "completed",
  ).length;
  const pending = tasks.filter(
    (t) => t.status?.toLowerCase() === "pending",
  ).length;
  const accepted = tasks.filter(
    (t) => t.status?.toLowerCase() === "accepted",
  ).length;
  const rejected = tasks.filter(
    (t) => t.status?.toLowerCase() === "rejected",
  ).length;

  // Streak logic: counting consecutive completed tasks from the newest entries
  let streak = 0;
  const sorted = [...tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  for (const t of sorted) {
    if (t.status?.toLowerCase() === "completed") streak++;
    else if (t.status?.toLowerCase() !== "completed") break;
  }

  return {
    total,
    completed,
    onTime: completed,
    streak,
    pending,
    accepted,
    rejected,
  };
};

const buildBadges = (stats: TaskStats): Badge[] => [
  {
    id: "first",
    icon: "ribbon-outline",
    title: "First Step",
    desc: "Complete your first task",
    earned: stats.completed >= 1,
    color: "#3B82F6",
  },
  {
    id: "trio",
    icon: "star-outline",
    title: "Hat Trick",
    desc: "Complete 3 tasks",
    earned: stats.completed >= 3,
    color: "#F59E0B",
  },
  {
    id: "five",
    icon: "trophy-outline",
    title: "High Five",
    desc: "Complete 5 tasks",
    earned: stats.completed >= 5,
    color: "#8B5CF6",
  },
  {
    id: "streak3",
    icon: "flame-outline",
    title: "On Fire",
    desc: "3 tasks streak",
    earned: stats.streak >= 3,
    color: "#EF4444",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, color }: any) => (
  <View style={sc.statCard}>
    <View style={[sc.iconCircle, { backgroundColor: color + "20" }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={sc.statValue}>{value}</Text>
    <Text style={sc.statLabel}>{label}</Text>
  </View>
);

const BadgeCard = ({ badge }: { badge: Badge }) => (
  <View style={[sc.badgeCard, !badge.earned && sc.badgeCardDim]}>
    <View
      style={[
        sc.badgeIcon,
        { backgroundColor: badge.earned ? badge.color + "20" : "#1E3A5F" },
      ]}
    >
      <Ionicons
        name={badge.icon as any}
        size={24}
        color={badge.earned ? badge.color : "#475569"}
      />
    </View>
    <Text style={[sc.badgeTitle, !badge.earned && { color: "#475569" }]}>
      {badge.title}
    </Text>
    <Text style={sc.badgeDesc} numberOfLines={2}>
      {badge.desc}
    </Text>
    <View
      style={[
        sc.earnedPill,
        { backgroundColor: badge.earned ? badge.color + "20" : "#0A2540" },
      ]}
    >
      <Text
        style={[
          sc.earnedTxt,
          { color: badge.earned ? badge.color : "#475569" },
        ]}
      >
        {badge.earned ? "Earned" : "Locked"}
      </Text>
    </View>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
interface UserProfile {
  name?: string;
  login?: boolean;
  email?: string;
  userId?: string;
}
export default function Rewards() {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Explicitly typing the decoded token
        const decoded = jwtDecode<UserProfile>(token);
        // setProfileData(decoded);
        console.log("Decoded Token:", decoded);
        const s = await fetchStats(decoded?.userId || "");
        setStats(s);
        // console.log("Decoded Id:", decoded.userId || "");

        // fetchTasks(decoded?.userId || "");
      }
    } catch (e: any) {
      Alert.alert("Error", "Could not load stats");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const badges = stats ? buildBadges(stats) : [];
  const earnedCount = badges.filter((b) => b.earned).length;
  const completionRate =
    stats && stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

  if (loading)
    return (
      <View style={[sc.screen, sc.center]}>
        <ActivityIndicator color="#3B82F6" size="large" />
      </View>
    );

  return (
    <View style={sc.screen}>
      <View style={sc.header}>
        <TouchableOpacity style={sc.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={sc.heading}>Performance</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor="#fff"
          />
        }
      >
        {/* Progress Overview */}
        <View style={sc.heroCard}>
          <View style={sc.heroLeft}>
            <Text style={sc.heroLabel}>Total Rewards (Current Month)</Text>
            <Text style={sc.heroValue}>
              {earnedCount} / {badges.length}
            </Text>
            <View style={sc.progressBar}>
              <View
                style={[
                  sc.progressFill,
                  { width: `${(earnedCount / badges.length) * 100}%` },
                ]}
              />
            </View>
          </View>
          <View style={sc.heroDivider} />
          <View style={sc.heroRight}>
            <Ionicons name="flame" size={30} color="#F59E0B" />
            <Text style={sc.streakNum}>{stats?.streak}</Text>
            <Text style={sc.streakLabel}>Streak</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <Text style={sc.sectionTitle}>Task Summary</Text>
        <View style={sc.statsGrid}>
          <StatCard
            icon="list"
            label="Total"
            value={stats?.total}
            color="#3B82F6"
          />
          <StatCard
            icon="checkmark-circle"
            label="Done"
            value={stats?.completed}
            color="#22C55E"
          />
          <StatCard
            icon="hourglass"
            label="Pending"
            value={stats?.pending}
            color="#F59E0B"
          />
          <StatCard
            icon="map"
            label="Accepted"
            value={stats?.accepted}
            color="#8B5CF6"
          />
          <StatCard
            icon="close-circle"
            label="Rejected"
            value={stats?.rejected}
            color="#EF4444"
          />
          <StatCard
            icon="trending-up"
            label="Rate"
            value={`${completionRate}%`}
            color="#EC4899"
          />
        </View>

        {/* Badges Section */}
        {/* <Text style={sc.sectionTitle}>Achievements</Text>
        <View style={sc.badgesGrid}>
          {badges.map((b) => (
            <BadgeCard key={b.id} badge={b} />
          ))}
        </View> */}
      </ScrollView>
    </View>
  );
}

// const sc = StyleSheet.create({

//   screen: { flex: 1, backgroundColor: "#0A2540", paddingHorizontal: 16, paddingTop: 50 },
//   header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
//   backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#1E3A5F", alignItems: "center", justifyContent: "center" },
//   heading: { color: "#fff", fontSize: 20, fontWeight: "bold" },
//   center: { justifyContent: "center", alignItems: "center" },

//   heroCard: { backgroundColor: "#1E3A5F", borderRadius: 20, padding: 20, flexDirection: "row", alignItems: "center", marginBottom: 25 },
//   heroLeft: { flex: 1 },
//   heroLabel: { color: "#7BA7D4", fontSize: 12 },
//   heroValue: { color: "#fff", fontSize: 28, fontWeight: "bold", marginVertical: 8 },
//   progressBar: { height: 6, backgroundColor: "#0A2540", borderRadius: 3 },
//   progressFill: { height: 6, backgroundColor: "#3B82F6", borderRadius: 3 },
//   heroDivider: { width: 1, height: 50, backgroundColor: "#2D4F72", marginHorizontal: 20 },
//   heroRight: { alignItems: "center" },
//   streakNum: { color: "#F59E0B", fontSize: 24, fontWeight: "bold" },
//   streakLabel: { color: "#7BA7D4", fontSize: 10 },

//   sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 15, marginTop: 10 },
//   statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between', gap: 10, marginBottom: 20 },
//   statCard: { backgroundColor: "#1E3A5F", borderRadius: 15, padding: 15, alignItems: "center", width: "31%" },
//   iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 8 },
//   statValue: { color: "#fff", fontSize: 18, fontWeight: "bold" },
//   statLabel: { color: "#7BA7D4", fontSize: 10, textAlign: "center" },

//   badgesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingBottom: 20 },
//   badgeCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, alignItems: "center", width: "48%" },
//   badgeCardDim: { backgroundColor: "#132D4A" },
//   badgeIcon: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center", marginBottom: 10 },
//   badgeTitle: { color: "#0F172A", fontWeight: "bold", fontSize: 13 },
//   badgeDesc: { color: "#64748B", fontSize: 10, textAlign: "center", marginTop: 4, marginBottom: 10, height: 30 },
//   earnedPill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
//   earnedTxt: { fontSize: 10, fontWeight: "bold" },
// });

const sc = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },

  heading: {
    color: "#0A2540",
    fontSize: 20,
    fontWeight: "bold",
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  /* HERO CARD */
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  heroLeft: {
    flex: 1,
  },

  heroLabel: {
    color: "#64748B",
    fontSize: 12,
  },

  heroValue: {
    color: "#0A2540",
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 8,
  },

  progressBar: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
  },

  progressFill: {
    height: 6,
    backgroundColor: "#3B82F6",
    borderRadius: 3,
  },

  heroDivider: {
    width: 1,
    height: 50,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 20,
  },

  heroRight: {
    alignItems: "center",
  },

  streakNum: {
    color: "#F59E0B",
    fontSize: 22,
    fontWeight: "bold",
  },

  streakLabel: {
    color: "#64748B",
    fontSize: 10,
  },

  /* SECTION */
  sectionTitle: {
    color: "#0A2540",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 15,
    marginTop: 10,
  },

  /* STATS */
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },

  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    width: "31%",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  statValue: {
    color: "#0A2540",
    fontSize: 18,
    fontWeight: "bold",
  },

  statLabel: {
    color: "#64748B",
    fontSize: 10,
    textAlign: "center",
  },

  /* BADGES */
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 20,
  },

  badgeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    width: "48%",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  badgeCardDim: {
    opacity: 0.6,
  },

  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  badgeTitle: {
    color: "#0A2540",
    fontWeight: "bold",
    fontSize: 13,
  },

  badgeDesc: {
    color: "#64748B",
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 10,
    height: 30,
  },

  earnedPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },

  earnedTxt: {
    fontSize: 10,
    fontWeight: "bold",
  },
});
