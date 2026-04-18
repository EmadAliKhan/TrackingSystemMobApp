import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [employeeId, setEmployeeId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [secure, setSecure] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  // Animations
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Slide-up and Fade-in animations on mount
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

  // --- API Integration Logic ---
  const handleLogin = async () => {
    // 1. Validation
    if (!employeeId || !password) {
      Alert.alert("Error", "Please enter both Employee ID and Password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://fyp-coral.vercel.app/api/accounts/employee/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: employeeId,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Navigate to dashboard
        console.log("Login success 🚀 Token:", data.token);
        
        // Optional: Save token to SecureStore/AsyncStorage here
        AsyncStorage.setItem("token",data.token);
        
        router.replace("/(tabs)/dashboard"); 
      } else {
        // API returned an error (e.g., 401 Unauthorized)
        Alert.alert("Login Failed", data.error || "Invalid credentials");
      }
    } catch (error) {
      // Network or Server issues
      console.error("Network error:", error);
      Alert.alert("Connection Error", "Make sure you are connected to the internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: logoScale }],
          }}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={40} color="#0A2540" />
          </View>
        </Animated.View>
      </View>

      {/* Animated Card */}
      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.title}>Welcome Back</Text>

        {/* Employee ID */}
        <View style={styles.inputContainer}>
          <Feather name="user" size={18} color="#888" />
          <TextInput
            placeholder="EMP-1605"
            placeholderTextColor="#999"
            style={styles.input}
            value={employeeId}
            onChangeText={setEmployeeId}
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Feather name="lock" size={18} color="#888" />
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#999"
            secureTextEntry={secure}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Feather
              name={secure ? "eye-off" : "eye"}
              size={18}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/forgot-password/email")}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>LOGIN</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

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
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#F9FAFB",
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 25,
    padding: 20,
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
    marginBottom: 25,
    color: "#0A2540",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#000",
  },
  forgot: {
    textAlign: "right",
    color: "#3B82F6",
    marginBottom: 20,
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
});