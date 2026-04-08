import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Staff {
  id: string;
  name: string;
  role: string;
  location: string;
  status: "online" | "offline";
  lastSeen: string;
  image: string;
}

export default function StaffSearch() {
  const [search, setSearch] = useState("");

  const staffList: Staff[] = [
    {
      id: "1",
      name: "Ali Khan",
      role: "Field Manager",
      location: "DHA Phase 6",
      status: "online",
      lastSeen: "Now",
      image: "https://i.pravatar.cc/300?img=1",
    },
    {
      id: "2",
      name: "Usman Tariq",
      role: "Security Staff",
      location: "Gulshan Block 5",
      status: "offline",
      lastSeen: "10 min ago",
      image: "https://i.pravatar.cc/300?img=2",
    },
    {
      id: "3",
      name: "Ahmed Raza",
      role: "Supervisor",
      location: "Clifton",
      status: "online",
      lastSeen: "Now",
      image: "https://i.pravatar.cc/300?img=3",
    },
  ];

  const filteredStaff = staffList.filter((staff) =>
    staff.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderStaff = ({ item }: { item: Staff }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.card}>
      
      {/* PROFILE IMAGE */}
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.cardContent}>
        {/* NAME + STATUS */}
        <View style={styles.rowBetween}>
          <Text style={styles.name}>{item.name}</Text>

          <View
            style={[
              styles.statusDot,
              { backgroundColor: item.status === "online" ? "#22c55e" : "#ef4444" },
            ]}
          />
        </View>

        <Text style={styles.role}>{item.role}</Text>

        {/* LOCATION */}
        <View style={styles.row}>
          <Ionicons name="location-outline" size={16} color="#AFCBFF" />
          <Text style={styles.location}>{item.location}</Text>
        </View>

        {/* LAST SEEN */}
        <Text style={styles.lastSeen}>
          Last seen: {item.lastSeen}
        </Text>

        {/* ACTION BUTTONS */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.callBtn}>
            <Ionicons name="call-outline" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.trackBtn}>
            <Text style={styles.trackText}>Track</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      <Text style={styles.heading}>Staff Tracking</Text>

      {/* 🔍 SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#AFCBFF" />
        <TextInput
          placeholder="Search staff..."
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* LIST */}
      <FlatList
        data={filteredStaff}
        keyExtractor={(item) => item.id}
        renderItem={renderStaff}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No staff found.</Text>
        }
      />
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
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 15,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E3A5F",
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    marginLeft: 8,
    height: 45,
    color: "#fff",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#1E3A5F",
    borderRadius: 18,
    padding: 12,
    marginBottom: 15,
    elevation: 6,
  },

  image: {
    width: 65,
    height: 65,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#3B82F6",
  },

  cardContent: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  role: {
    color: "#AFCBFF",
    fontSize: 13,
    marginBottom: 4,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  location: {
    marginLeft: 6,
    color: "#AFCBFF",
    fontSize: 13,
  },

  lastSeen: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
  },

  callBtn: {
    backgroundColor: "#3B82F6",
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },

  trackBtn: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 10,
  },

  trackText: {
    color: "#fff",
    fontWeight: "600",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#AFCBFF",
  },
});