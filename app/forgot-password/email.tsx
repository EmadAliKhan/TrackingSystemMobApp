// import { Feather, Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { useEffect, useRef, useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     Animated,
//     KeyboardAvoidingView,
//     Platform,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";

// export default function EmailScreen() {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Animations (Matching Login, OTP & Reset)
//   const slideAnim = useRef(new Animated.Value(300)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const logoScale = useRef(new Animated.Value(0.7)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.spring(slideAnim, {
//         toValue: 0,
//         friction: 6,
//         useNativeDriver: true,
//       }),
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       Animated.spring(logoScale, {
//         toValue: 1,
//         friction: 5,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   const handleSendOtp = async () => {
//     if (!email) {
//       Alert.alert("Error", "Please enter your email address");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(
//         "https://bawdicsoft-coral.vercel.app/api/accounts/employee/changePassword/sendOtp",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email }),
//         },
//       );

//       if (response.ok) {
//         Alert.alert("Success", "OTP sent to your email address");
//         router.push({
//           pathname: "/forgot-password/otp",
//           params: { email },
//         });
//       } else {
//         const data = await response.json();
//         Alert.alert("Error", data.error || "Failed to send OTP");
//         console.log("error", data);
//       }
//     } catch (err) {
//       Alert.alert("Error", "Connection error. Please check your internet.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       {/* Top Section (Branding) */}
//       <View style={styles.topSection}>
//         <Animated.View
//           style={{ opacity: fadeAnim, transform: [{ scale: logoScale }] }}
//         >
//           <View style={styles.iconCircle}>
//             <Ionicons name="key-outline" size={40} color="#0A2540" />
//           </View>
//         </Animated.View>
//       </View>

//       {/* Animated Card */}
//       <Animated.View
//         style={[styles.card, { transform: [{ translateY: slideAnim }] }]}
//       >
//         <Text style={styles.title}>Change Password</Text>
//         <Text style={styles.subtitle}>
//           Enter your registered email address below and we'll send you a 6-digit
//           OTP to reset your password.
//         </Text>

//         {/* Email Input */}
//         <View style={styles.inputContainer}>
//           <Feather name="mail" size={18} color="#888" />
//           <TextInput
//             placeholder="example@email.com"
//             placeholderTextColor="#999"
//             style={styles.input}
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//         </View>

//         {/* Send OTP Button */}
//         <TouchableOpacity
//           style={[styles.button, loading && { opacity: 0.7 }]}
//           onPress={handleSendOtp}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>SEND OTP</Text>
//           )}
//         </TouchableOpacity>

//         {/* Back Link */}
//         <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
//           <Text style={styles.backText}>Back</Text>
//         </TouchableOpacity>
//       </Animated.View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#E5E7EB", // Light grey background like Login
//   },
//   topSection: {
//     height: 250,
//     backgroundColor: "#0A2540", // Dark Navy
//     alignItems: "center",
//     justifyContent: "flex-end",
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,
//     paddingBottom: 50,
//   },
//   iconCircle: {
//     backgroundColor: "#fff",
//     padding: 18,
//     borderRadius: 50,
//     marginBottom: 15,
//   },
//   card: {
//     backgroundColor: "#F9FAFB",
//     marginHorizontal: 20,
//     marginTop: -40,
//     borderRadius: 25,
//     padding: 25,
//     elevation: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 10,
//     color: "#0A2540",
//   },
//   subtitle: {
//     textAlign: "center",
//     color: "#6B7280",
//     fontSize: 14,
//     marginBottom: 25,
//     lineHeight: 22,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#E5E7EB",
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     marginBottom: 20,
//     height: 55,
//   },
//   input: {
//     flex: 1,
//     marginLeft: 10,
//     color: "#000",
//   },
//   button: {
//     backgroundColor: "#0A2540",
//     padding: 15,
//     borderRadius: 12,
//     alignItems: "center",
//     height: 55,
//     justifyContent: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "700",
//     letterSpacing: 1,
//   },
//   backLink: {
//     marginTop: 20,
//     alignItems: "center",
//   },
//   backText: {
//     color: "#3B82F6",
//     fontWeight: "600",
//   },
// });

import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

export default function EmailScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ visible: false, message: "" });

  // Animations (Matching Login, OTP & Reset)
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

  const handleSendOtp = async () => {
    if (!email) {
      setErrorModal({
        visible: true,
        message: "Please enter your email address",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://bawdicsoft-coral.vercel.app/api/accounts/employee/changePassword/sendOtp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      if (response.ok) {
        router.push({
          pathname: "/forgot-password/otp",
          params: { email },
        });
      } else {
        const data = await response.json();
        setErrorModal({
          visible: true,
          message: data.error || "Failed to send OTP",
        });
        console.log("error", data);
      }
    } catch (err) {
      setErrorModal({
        visible: true,
        message: "Connection error. Please check your internet.",
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

      {/* Top Section (Branding) */}
      <View style={styles.topSection}>
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ scale: logoScale }] }}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="key-outline" size={40} color="#0A2540" />
          </View>
        </Animated.View>
      </View>

      {/* Animated Card */}
      <Animated.View
        style={[styles.card, { transform: [{ translateY: slideAnim }] }]}
      >
        <Text style={styles.title}>Change Password</Text>
        <Text style={styles.subtitle}>
          Enter your registered email address below and we&apos;ll send you a
          6-digit OTP to reset your password.
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
        {/* <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity> */}
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
  errorTitle: {
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
  errorButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
