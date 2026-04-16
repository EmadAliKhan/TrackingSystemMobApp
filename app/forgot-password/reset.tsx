import { Feather, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ResetPassword() {
  const { email, otp } = useLocalSearchParams<{
    email: string;
    otp: string;
  }>();

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  // Animations
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, friction: 6, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  // ✅ RESET API
  const handleReset = async () => {
    if (!newPass || !confirmPass) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (newPass !== confirmPass) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (newPass.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
        console.log("reset Data",email, otp, newPass)
      const res = await fetch(
        "https://fyp-coral.vercel.app/api/accounts/employee/changePassword/resetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            newPassword: newPass,
          }),
        }
      );

      const data = await res.json();
      console.log("data change",data)
      if (!res.ok) {
        throw new Error(data.message || "Reset failed");
      }

      Alert.alert("Success 🎉", "Password updated successfully", [
        {
          text: "Go to Login",
          onPress: () => router.replace("/"),
        },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* HEADER */}
      <View style={styles.topSection}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: logoScale }] }}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-open" size={40} color="#0A2540" />
          </View>
        </Animated.View>
      </View>

      {/* CARD */}
      <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.title}>Reset Password</Text>

        <Text style={styles.subtitle}>
          Create a strong password to secure your account
        </Text>

        {/* NEW PASSWORD */}
        <View style={styles.inputContainer}>
          <Feather name="lock" size={18} color="#888" />
          <TextInput
            placeholder="New Password"
            placeholderTextColor="#999"
            secureTextEntry={secureNew}
            style={styles.input}
            value={newPass}
            onChangeText={setNewPass}
          />
          <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
            <Feather name={secureNew ? "eye-off" : "eye"} size={18} color="#888" />
          </TouchableOpacity>
        </View>

        {/* CONFIRM PASSWORD */}
        <View style={styles.inputContainer}>
          <Feather name="shield" size={18} color="#888" />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry={secureConfirm}
            style={styles.input}
            value={confirmPass}
            onChangeText={setConfirmPass}
          />
          <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
            <Feather name={secureConfirm ? "eye-off" : "eye"} size={18} color="#888" />
          </TouchableOpacity>
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>UPDATE PASSWORD</Text>
          )}
        </TouchableOpacity>

        {/* BACK */}
        <TouchableOpacity onPress={() => router.replace("/forgot-password/otp")} style={styles.cancelLink}>
          <Text style={styles.cancelText}>Back</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

/* 🔥 STYLES (SAME FILE) */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E7EB",
  },

  topSection: {
    height: 250,
    backgroundColor: "#0A2540",
    alignItems: "center",
    justifyContent: "flex-end",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: 50,
  },

  iconCircle: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 50,
  },

  card: {
    backgroundColor: "#F9FAFB",
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 25,
    padding: 25,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#0A2540",
  },

  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 25,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
    height: 55,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    color: "#000",
  },

  button: {
    backgroundColor: "#0A2540",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    height: 55,
    justifyContent: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

  cancelLink: {
    marginTop: 20,
    alignItems: "center",
  },

  cancelText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
});