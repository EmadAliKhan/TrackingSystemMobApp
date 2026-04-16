import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

export default function EmailScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Animations (Matching Login, OTP & Reset)
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

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://fyp-coral.vercel.app/api/accounts/employee/changePassword/sendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        Alert.alert("Success", "OTP sent to your email address");
        router.push({
          pathname: "/forgot-password/otp",
          params: { email },
        });
      } else {
        const data = await response.json();
        Alert.alert("Error", data.error || "Failed to send OTP");
      }
    } catch (err) {
      Alert.alert("Error", "Connection error. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      {/* Top Section (Branding) */}
      <View style={styles.topSection}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: logoScale }] }}>
          <View style={styles.iconCircle}>
            <Ionicons name="key-outline" size={40} color="#0A2540" />
          </View>
        </Animated.View>
      </View>

      {/* Animated Card */}
      <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.title}>Change Password</Text>
        <Text style={styles.subtitle}>
          Enter your registered email address below and we'll send you a 6-digit OTP to reset your password.
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Feather name="mail" size={18} color="#888" />
          <TextInput
            placeholder="example@email.com"
            placeholderTextColor="#999"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Send OTP Button */}
        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleSendOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>SEND OTP</Text>
          )}
        </TouchableOpacity>

        {/* Back Link */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E7EB", // Light grey background like Login
  },
  topSection: {
    height: 250,
    backgroundColor: "#0A2540", // Dark Navy
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
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#F9FAFB",
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 25,
    padding: 25,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: "#0A2540",
  },
  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 25,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
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
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 1,
  },
  backLink: {
    marginTop: 20,
    alignItems: "center",
  },
  backText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
});