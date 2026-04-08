// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "black",
//       }}
//     >
//       <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
//         Edit app/index.tsx to edit this screen.
//       </Text>
//     </View>
//   );
// }

import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Loader from "../components/Loader";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const signUp = () => {
    console.log(email, password, name);
    if (!name || !email || !password || !confirmPassword) {
      alert("all fields are required");
      return;
    }
    setLoading(true);
    router.push("/(auth)/otp");
    setName(" ");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    // Simulate API call delay
    // return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  if (loading) return <Loader showLogo={true} />;
  return (
    <View style={styles.container}>
      {/* Logo */}

      {/* Logo */}
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      {/* Title */}
      {/* <Text style={styles.title}>IndoorGo</Text>
      <Text style={styles.subtitle}>Your Sports Companion</Text> */}
      {/* Email Input */}
      <TextInput
        placeholder="Enter your name.."
        placeholderTextColor="#888"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Enter your Email.."
        placeholderTextColor="#888"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      {/* Password Input */}
      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#888"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {/* Login Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          setLoading(true);
          await signUp(); // apka signup function
          setLoading(false);
        }}
      >
        {/* <Text style={styles.buttonText}>SignUp</Text> */}
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>SignUp</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.signupText}>
        Have an account?{" "}
        <Text style={styles.signupLink} onPress={() => router.back()}>
          Login
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#01411C",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "#01411C",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#01411C",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signupText: {
    marginTop: 20,
    color: "#444",
  },
  signupLink: {
    color: "#01411C",
    fontWeight: "600",
  },
});
