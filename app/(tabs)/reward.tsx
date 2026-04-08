import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RewardScreen() {
  const [points, setPoints] = useState(120);
  const [tasksDone, setTasksDone] = useState(18);
  const [onTime, setOnTime] = useState(15);

  const user = {
    name: "Talha Ahmed",
    role: "Field Manager",
    image: "https://i.pravatar.cc/300",
  };

  const level =
    points > 200 ? "Gold" : points > 100 ? "Silver" : "Bronze";

  const claimReward = () => {
    if (points >= 100) {
      Alert.alert("🎉 Reward Claimed", "You received Rs 1000 bonus!");
      setPoints(points - 100);
    } else {
      Alert.alert("Not enough points");
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "#0A2540" }}>
      
      {/* 🔥 HEADER */}
      <LinearGradient colors={["#0A2540", "#1E3A5F"]} style={styles.header}>
        <Image source={{ uri: user.image }} style={styles.image} />

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>{user.role}</Text>

        <View style={styles.levelBox}>
          <Text style={styles.levelText}>{level} Level</Text>
        </View>
      </LinearGradient>

      {/* 📊 STATS */}
      <View style={styles.stats}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{tasksDone}</Text>
          <Text style={styles.statLabel}>Tasks Done</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>{onTime}</Text>
          <Text style={styles.statLabel}>On Time</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>{points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>

      {/* 🏆 REWARDS CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Earned Rewards</Text>

        <View style={styles.rewardItem}>
          <Ionicons name="trophy" size={20} color="#FFD700" />
          <Text style={styles.rewardText}>Top Performer</Text>
        </View>

        <View style={styles.rewardItem}>
          <Ionicons name="flash" size={20} color="#22c55e" />
          <Text style={styles.rewardText}>Fast Completion Bonus</Text>
        </View>

        <View style={styles.rewardItem}>
          <Ionicons name="star" size={20} color="#3B82F6" />
          <Text style={styles.rewardText}>5 Tasks Streak</Text>
        </View>
      </View>

      {/* 🎯 PROGRESS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Performance Progress</Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${points}%` }]} />
        </View>

        <Text style={styles.progressText}>
          {points}% towards next reward
        </Text>
      </View>

      {/* 🎁 CLAIM BUTTON */}
      <TouchableOpacity style={styles.claimBtn} onPress={claimReward}>
        <Text style={styles.claimText}>Claim Reward</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    padding: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#3B82F6",
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },

  role: {
    color: "#AFCBFF",
    marginBottom: 10,
  },

  levelBox: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },

  levelText: {
    color: "#fff",
    fontWeight: "600",
  },

  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },

  statBox: {
    alignItems: "center",
  },

  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  statLabel: {
    color: "#AFCBFF",
  },

  card: {
    backgroundColor: "#1E3A5F",
    margin: 16,
    borderRadius: 16,
    padding: 15,
  },

  cardTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },

  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  rewardText: {
    color: "#fff",
    marginLeft: 10,
  },

  progressBar: {
    height: 10,
    backgroundColor: "#0A2540",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
  },

  progressText: {
    color: "#AFCBFF",
    marginTop: 5,
  },

  claimBtn: {
    backgroundColor: "#22c55e",
    margin: 20,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },

  claimText: {
    color: "#fff",
    fontWeight: "600",
  },
});