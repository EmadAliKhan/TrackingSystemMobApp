import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);

  // Animations
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Slide-up animation
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 6,
      useNativeDriver: true,
    }).start();

    // Logo animation
    Animated.parallel([
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

  const login = () => {
    if (!employeeId || !password) {
      alert("All fields required");
      return;
    }

    router.push("/(tabs)/dashboard");
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
            style={styles.input}
            value={employeeId}
            onChangeText={setEmployeeId}
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Feather name="lock" size={18} color="#888" />
          <TextInput
            placeholder="••••••••"
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

        {/* Forgot Password */}
        <Text style={styles.forgot}>Forgot Password?</Text>

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>LOGIN</Text>
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
    height: 250, // ✅ increased height (pushes card down)
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
    marginBottom: 15, // ✅ space below logo
  },

  card: {
    backgroundColor: "#F9FAFB",
    marginHorizontal: 20,
    marginTop: -40, // ✅ reduced negative margin → moves card DOWN
    borderRadius: 25,
    padding: 20,
    elevation: 10,
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
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 1,
  },
});