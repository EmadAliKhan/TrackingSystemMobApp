import { Ionicons } from "@expo/vector-icons";
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

export default function OtpScreen() {
  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  const inputs = useRef<TextInput[]>([]);

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

  // TIMER (no auto resend)
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // HANDLE INPUT
  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // VERIFY OTP
  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      Alert.alert("Error", "Enter complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://fyp-coral.vercel.app/api/accounts/employee/changePassword/verifyOtp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: finalOtp }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      router.push({
        pathname: "/forgot-password/reset",
        params: { email, otp: finalOtp },
      });

    } catch (err: any) {
      Alert.alert("Error", err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP
  const handleResend = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://fyp-coral.vercel.app/api/accounts/employee/changePassword/sendOtp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      inputs.current[0]?.focus();

      Alert.alert("Success", "OTP resent to your email 📩");

    } catch (err: any) {
      Alert.alert("Error", err.message || "Resend failed");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = () => {
    const sec = timer < 10 ? `0${timer}` : timer;
    return `00:${sec}`;
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
            <Ionicons name="mail-open" size={36} color="#0A2540" />
          </View>
        </Animated.View>
      </View>

      {/* CARD */}
      <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.title}>Verify OTP</Text>

        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to your email
        </Text>

        {/* OTP INPUT */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={[
                styles.otpInput,
                digit !== "" && styles.otpInputFilled,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              ref={(ref) => {
                if (ref) inputs.current[index] = ref;
              }}
            />
          ))}
        </View>

        {/* TIMER / RESEND */}
        <View style={styles.timerContainer}>
          {timer > 0 ? (
            <Text style={styles.timerText}>
              Resend available in {formatTime()}
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={loading}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* VERIFY BUTTON */}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>VERIFY CODE</Text>
          )}
        </TouchableOpacity>

        {/* BACK */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E5E7EB" },

  topSection: {
    height: 240,
    backgroundColor: "#0A2540",
    alignItems: "center",
    justifyContent: "flex-end",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    paddingBottom: 40,
  },

  iconCircle: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 50,
  },

  card: {
    backgroundColor: "#F9FAFB",
    marginHorizontal: 16,
    marginTop: -40,
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0A2540",
    marginBottom: 8,
  },

  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 13,
    marginBottom: 20,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },

  otpInput: {
    flex: 1,
    height: 50,
    marginHorizontal: 3,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A2540",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  otpInputFilled: {
    borderColor: "#0A2540",
    backgroundColor: "#fff",
  },

  timerContainer: {
    marginBottom: 15,
  },

  timerText: {
    color: "#6B7280",
    fontSize: 13,
  },

  resendText: {
    color: "#3B82F6",
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#0A2540",
    padding: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 1,
  },

  backLink: {
    marginTop: 15,
  },

  backText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
});