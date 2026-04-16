// // import { Text, View } from "react-native";

// // export default function Index() {
// //   return (
// //     <View
// //       style={{
// //         flex: 1,
// //         justifyContent: "center",
// //         alignItems: "center",
// //         backgroundColor: "black",
// //       }}
// //     >
// //       <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
// //         Edit app/index.tsx to edit this screen.
// //       </Text>
// //     </View>
// //   );
// // }

// import { useState } from "react";
// import {
//   Image,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function Index() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   return (
//     <View style={styles.container}>
//       {/* Logo */}
//       <Image
//         source={require("../assets/logo.png")}
//         style={styles.logo}
//         resizeMode="contain"
//       />

//       {/* Title */}
//       {/* <Text style={styles.title}>IndoorGo</Text>
//       <Text style={styles.subtitle}>Your Sports Companion</Text> */}

//       {/* Email Input */}
//       <TextInput
//         placeholder="Email"
//         placeholderTextColor="#888"
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//       />

//       {/* Password Input */}
//       <TextInput
//         placeholder="Password"
//         placeholderTextColor="#888"
//         secureTextEntry
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//       />

//       {/* Login Button */}
//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>

//       <Text style={styles.signupText}>
//         Don’t have an account? <Text style={styles.signupLink}>Sign Up</Text>
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 25,
//   },
//   logo: {
//     width: 120,
//     height: 120,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "700",
//     color: "#01411C",
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 40,
//   },
//   input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     padding: 15,
//     borderRadius: 12,
//     marginBottom: 15,
//     fontSize: 15,
//   },
//   button: {
//     width: "100%",
//     backgroundColor: "#01411C",
//     padding: 15,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 10,
//     shadowColor: "#01411C",
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 4,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   signupText: {
//     marginTop: 20,
//     color: "#444",
//   },
//   signupLink: {
//     color: "#01411C",
//     fontWeight: "600",
//   },
// });
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/login" />;
}
