import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const MY_USER_ID = "69d8eb0649052d70b41e4b03"; 
const API_BASE = "https://fyp-coral.vercel.app/api/tasks";

export default function MapScreen() {
  // Retrieve the task details passed from the Task Page
  const { taskNo, taskTitle, link } = useLocalSearchParams();

  // 1. UPDATE TASK TO COMPLETED
  const handleFinishTask = async () => {
    try {
      const response = await fetch(API_BASE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskNo: Number(taskNo), // Convert string param to number
          status: "completed",
          userId: MY_USER_ID
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Task marked as Completed! ✅", [
          { text: "OK", onPress: () => router.replace("/") } // Redirect back to list
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Update Failed", errorData.error || "Could not complete task.");
      }
    } catch (error) {
      Alert.alert("Network Error", "Check your internet connection.");
    }
  };

  // 2. OPEN EXTERNAL GOOGLE MAPS
  const openExternalMaps = () => {
    if (link) {
      Linking.openURL(link.toString()).catch(() => {
        Alert.alert("Error", "Could not open Google Maps app.");
      });
    } else {
      Alert.alert("Error", "No navigation link provided for this task.");
    }
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        
        {/* Header with Back Button */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Active Navigation</Text>
        </View>

        {/* Content Area */}
        <View style={s.content}>
          <View style={s.infoCard}>
            <Text style={s.label}>TASK NUMBER</Text>
            <Text style={s.value}>#{taskNo}</Text>
            
            <View style={s.divider} />
            
            <Text style={s.label}>DESTINATION / TASK</Text>
            <Text style={s.value}>{taskTitle}</Text>
          </View>

          <Text style={s.instruction}>
            Use the button below to start GPS navigation in Google Maps.
          </Text>

          <TouchableOpacity style={s.navBtn} onPress={openExternalMaps}>
            <Ionicons name="navigate" size={20} color="#fff" />
            <Text style={s.navBtnTxt}>Start GPS Navigation</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Completion Button */}
        <View style={s.footer}>
          <TouchableOpacity style={s.completeBtn} onPress={handleFinishTask}>
            <Text style={s.completeBtnTxt}>Mark as Completed</Text>
            <Ionicons name="checkmark-done" size={20} color="#fff" style={{marginLeft: 8}} />
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0A2540" },
  container: { flex: 1, backgroundColor: "#F1F5F9" },
  
  header: { 
    backgroundColor: "#0A2540", 
    padding: 20, 
    flexDirection: "row", 
    alignItems: "center" 
  },
  backBtn: { padding: 5, marginRight: 15 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  content: { flex: 1, padding: 25, alignItems: "center", justifyContent: "center" },
  
  infoCard: { 
    backgroundColor: "#fff", 
    width: "100%", 
    padding: 20, 
    borderRadius: 15, 
    elevation: 3, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    marginBottom: 30
  },
  label: { fontSize: 10, color: "#94A3B8", fontWeight: "bold", letterSpacing: 1 },
  value: { fontSize: 18, color: "#1E293B", fontWeight: "bold", marginTop: 4, marginBottom: 15 },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginBottom: 15 },

  instruction: { textAlign: "center", color: "#64748B", marginBottom: 20, fontSize: 14 },

  navBtn: { 
    backgroundColor: "#3B82F6", 
    flexDirection: "row", 
    paddingVertical: 15, 
    paddingHorizontal: 25, 
    borderRadius: 10, 
    alignItems: "center" 
  },
  navBtnTxt: { color: "#fff", fontWeight: "bold", marginLeft: 10 },

  footer: { padding: 20, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#E2E8F0" },
  completeBtn: { 
    backgroundColor: "#10B981", 
    flexDirection: 'row',
    paddingVertical: 18, 
    borderRadius: 12, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  completeBtnTxt: { color: "#fff", fontSize: 18, fontWeight: "bold" }
});