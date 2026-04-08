import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileSettings() {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");

  // 🔥 NEW STATES
  const [locationSharing, setLocationSharing] = useState(true);
  const [tracking, setTracking] = useState(true);
  const [alerts, setAlerts] = useState(true);
  const [privacy, setPrivacy] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(true);

  const [user, setUser] = useState({
    name: "Talha Ahmed",
    email: "talha8170407@gmail.com",
    phone: "+92 300 1234567",
    image: "https://i.pravatar.cc/300",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState(user);

  const colors = {
    bg: "#0A2540",
    card: "#1E3A5F",
    text: "#fff",
    sub: "#AFCBFF",
    primary: "#3B82F6",
  };

  /* 📷 IMAGE PICKER */
  const pickImage = async () => {
    Alert.alert("Change Profile", "Select option", [
      {
        text: "Camera",
        onPress: async () => {
          let res = await ImagePicker.launchCameraAsync({ allowsEditing: true });
          if (!res.canceled) setUser({ ...user, image: res.assets[0].uri });
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          let res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true });
          if (!res.canceled) setUser({ ...user, image: res.assets[0].uri });
        },
      },
    ]);
  };

  const saveProfile = () => {
    setUser(editData);
    setModalVisible(false);
  };

  const logout = () => {
    Alert.alert("Logout", "Confirm logout?", [
      { text: "Cancel" },
      { text: "Logout", onPress: () => router.replace("/") },
    ]);
  };

  const SettingItem = ({ icon, title, right }: any) => (
    <View style={styles.item}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name={icon} size={22} color={colors.primary} />
        <Text style={[styles.itemText, { color: colors.text }]}>
          {title}
        </Text>
      </View>
      {right}
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: colors.bg }}>
      
      {/* 🔥 PROFILE HEADER */}
      <LinearGradient colors={["#0A2540", "#1E3A5F"]} style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: user.image }} style={styles.image} />
        </TouchableOpacity>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={{ color: "#3B82F6", marginTop: 5, fontWeight: "600" }}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* 📊 STATS */}
      <View style={styles.stats}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Tasks</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>6</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>18</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
      </View>

      {/* ⚙️ SMART CONTROLS */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        
        <SettingItem
          icon="location-outline"
          title="Live Location Sharing"
          right={
            <Switch
              value={locationSharing}
              onValueChange={setLocationSharing}
              trackColor={{ false: "#ccc", true: "#3B82F6" }}
            />
          }
        />

        <SettingItem
          icon="navigate-outline"
          title="Auto Task Tracking"
          right={
            <Switch
              value={tracking}
              onValueChange={setTracking}
              trackColor={{ false: "#ccc", true: "#3B82F6" }}
            />
          }
        />

        <SettingItem
          icon="notifications-outline"
          title="Smart Alerts"
          right={
            <Switch
              value={alerts}
              onValueChange={setAlerts}
              trackColor={{ false: "#ccc", true: "#3B82F6" }}
            />
          }
        />

        <SettingItem
          icon="shield-checkmark-outline"
          title="Privacy Mode"
          right={
            <Switch
              value={privacy}
              onValueChange={setPrivacy}
              trackColor={{ false: "#ccc", true: "#3B82F6" }}
            />
          }
        />

        <SettingItem
          icon="flash-outline"
          title="Performance Mode"
          right={
            <Switch
              value={performanceMode}
              onValueChange={setPerformanceMode}
              trackColor={{ false: "#ccc", true: "#3B82F6" }}
            />
          }
        />

        <SettingItem
          icon="language-outline"
          title="Language"
          right={
            <TouchableOpacity
              onPress={() =>
                setLanguage(language === "English" ? "Urdu" : "English")
              }
            >
              <Text style={{ color: colors.primary }}>{language}</Text>
            </TouchableOpacity>
          }
        />
      </View>

      {/* ⚡ QUICK ACTIONS */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <SettingItem icon="map-outline" title="View My Location" />
        <SettingItem icon="time-outline" title="Task History" />
        <SettingItem icon="stats-chart-outline" title="Performance Stats" />
      </View>

      {/* ACCOUNT */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <SettingItem icon="call-outline" title={user.phone} />
        <SettingItem icon="mail-outline" title={user.email} />
      </View>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={{ color: "#fff", fontWeight: "600" }}>Logout</Text>
      </TouchableOpacity>

      {/* ✏️ EDIT MODAL */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Edit Profile</Text>

          <TextInput
            style={styles.input}
            value={editData.name}
            onChangeText={(t) => setEditData({ ...editData, name: t })}
          />
          <TextInput
            style={styles.input}
            value={editData.phone}
            onChangeText={(t) => setEditData({ ...editData, phone: t })}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
            <Text style={{ color: "#fff" }}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setModalVisible(false)}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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

  name: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  email: { color: "#AFCBFF" },

  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },

  statBox: { alignItems: "center" },

  statValue: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  statLabel: { color: "#AFCBFF" },

  card: {
    margin: 16,
    borderRadius: 16,
    padding: 10,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },

  itemText: { marginLeft: 10 },

  logoutBtn: {
    backgroundColor: "#EF4444",
    margin: 20,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },

  modal: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  saveBtn: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  cancelBtn: {
    marginTop: 10,
    alignItems: "center",
  },
});