import { Feather, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
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
  const [errorModal, setErrorModal] = useState({ visible: false, message: "" });
  const [successModal, setSuccessModal] = useState(false);

  // Animations
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ✅ RESET API
  const handleReset = async () => {
    if (!newPass || !confirmPass) {
      setErrorModal({ visible: true, message: "Please fill all fields" });
      return;
    }

    if (newPass !== confirmPass) {
      setErrorModal({ visible: true, message: "Passwords do not match" });
      return;
    }

    if (newPass.length < 6) {
      setErrorModal({
        visible: true,
        message: "Password must be at least 6 characters",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("reset Data", email, otp, newPass);
      const res = await fetch(
        "https://bawdicsoft-coral.vercel.app/api/accounts/employee/changePassword/resetPassword",
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
        },
      );

      const data = await res.json();
      console.log("data change", data);
      if (!res.ok) {
        throw new Error(data.message || "Reset failed");
      }

      setSuccessModal(true);
    } catch (err: any) {
      setErrorModal({
        visible: true,
        message: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* ERROR MODAL */}
      <Modal
        visible={errorModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setErrorModal({ visible: false, message: "" })}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setErrorModal({ visible: false, message: "" })}
        >
          <Pressable
            style={styles.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.errorIconCircle}>
              <Ionicons name="alert-circle-outline" size={36} color="#fff" />
            </View>

            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorMessage}>{errorModal.message}</Text>

            <TouchableOpacity
              style={styles.errorButton}
              onPress={() => setErrorModal({ visible: false, message: "" })}
            >
              <Text style={styles.errorButtonText}>Try Again</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal
        visible={successModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <Pressable style={styles.modalOverlay} onPress={() => {}}>
          <Pressable
            style={styles.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-circle" size={36} color="#fff" />
            </View>

            <Text style={styles.successTitle}>Success</Text>
            <Text style={styles.successMessage}>
              Password updated successfully!
            </Text>

            <TouchableOpacity
              style={styles.successButton}
              onPress={() => router.replace("/")}
            >
              <Text style={styles.successButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* HEADER */}
      <View style={styles.topSection}>
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ scale: logoScale }] }}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="lock-open" size={40} color="#0A2540" />
          </View>
        </Animated.View>
      </View>

      {/* CARD */}
      <Animated.View
        style={[styles.card, { transform: [{ translateY: slideAnim }] }]}
      >
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
            <Feather
              name={secureNew ? "eye-off" : "eye"}
              size={18}
              color="#888"
            />
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
            <Feather
              name={secureConfirm ? "eye-off" : "eye"}
              size={18}
              color="#888"
            />
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
        <TouchableOpacity
          onPress={() => router.replace("/forgot-password/otp")}
          style={styles.cancelLink}
        >
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(10, 25, 47, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalBox: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },

  errorIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  successIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0A2540",
    marginBottom: 12,
    textAlign: "center",
  },

  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0A2540",
    marginBottom: 12,
    textAlign: "center",
  },

  errorMessage: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 26,
  },

  successMessage: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 26,
  },

  errorButton: {
    width: "100%",
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  successButton: {
    width: "100%",
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#22C55E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  errorButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  successButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
