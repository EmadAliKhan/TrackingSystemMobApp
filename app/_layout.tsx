// import { Ionicons } from "@expo/vector-icons";
// import { Tabs } from "expo-router";

// export default function TabLayout() {
//   return (
//     <Tabs
//     // screenOptions={{
//     //   headerShown: false, // 👈 ye line add karo
//     // }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           headerShown: false,
//           title: "Home",
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="home" size={25} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="settings"
//         options={{
//           title: "Settings",
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="settings" size={25} color={color} />
//           ),
//         }}
//       />
//       {/* <!-- Add more tabs here --> */}
//     </Tabs>
//   );
// }

// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       {/* Auth Screens */}
//       <Stack.Screen name="(auth)" />

//       {/* App Screens with Footer */}
//       <Stack.Screen name="(tabs)" />
//     </Stack>
//   );
// }

import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
