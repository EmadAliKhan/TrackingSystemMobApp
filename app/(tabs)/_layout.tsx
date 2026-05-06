// import { Ionicons } from "@expo/vector-icons";
// import { Tabs, useRouter } from "expo-router";
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { useNotifications } from "../context/NotificationContext";

// export default function TabLayout() {
//   const router = useRouter();
//   const { unreadCount } = useNotifications();

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarActiveTintColor: "#3B82F6",
//         tabBarInactiveTintColor: "#7B96B3",
//         tabBarStyle: styles.tabBar,
//       }}
//     >
//       <Tabs.Screen
//         name="dashboard"
//         options={{
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="grid-outline" size={24} color={color} />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="task"
//         options={{
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="checkmark-done-outline" size={24} color={color} />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="chat"
//         options={{
//           tabBarIcon: () => null,
//           tabBarButton: (props) => {
//             const { style, delayLongPress, disabled, ...rest } = props;

//             return (
//               <TouchableOpacity
//                 {...rest}
//                 disabled={disabled ?? false} // ✅ FIX
//                 activeOpacity={0.85}
//                 delayLongPress={delayLongPress ?? undefined}
//                 onPress={() => router.push("/chat")}
//                 style={[style, styles.fabButton]}
//               >
//                 <View style={styles.fabInner}>
//                   <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
//                 </View>
//               </TouchableOpacity>
//             );
//           },
//         }}
//       />
//       {/* <Tabs.Screen name="map" options={{ href: null }} /> */}
//       {/* <Tabs.Screen name="profile" options={{ href: null }} /> */}
//       <Tabs.Screen
//         name="reward"
//         options={{
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="ribbon-outline" size={24} color={color} />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="notifications"
//         options={{
//           tabBarIcon: ({ color }) => (
//             <View style={styles.iconWithBadge}>
//               <Ionicons name="notifications-outline" size={24} color={color} />
//               {unreadCount > 0 && (
//                 <View style={styles.badge}>
//                   <Text style={styles.badgeText}>
//                     {unreadCount > 9 ? "9+" : unreadCount}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   tabBar: {
//     backgroundColor: "#0A2540",
//     height: 70,
//     borderTopWidth: 0,
//     elevation: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.16,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: -3 },
//   },
//   fabButton: {
//     top: -25,
//     width: 70,
//     height: 70,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   fabInner: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: "#3B82F6",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 6 },
//     elevation: 10,
//   },
//   iconWithBadge: {
//     width: 30,
//     height: 30,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   badge: {
//     position: "absolute",
//     top: -6,
//     right: -10,
//     minWidth: 18,
//     height: 18,
//     borderRadius: 9,
//     paddingHorizontal: 4,
//     backgroundColor: "#EF4444",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   badgeText: {
//     color: "#fff",
//     fontSize: 10,
//     fontWeight: "700",
//   },
// });

// FILE 2 OF 2:  app/(tabs)/_layout.tsx
// TWO small changes only:
//   1. Import useNotifications at the top
//   2. Add the badge View around the notifications bell icon
// Everything else is IDENTICAL to your current file.
// ══════════════════════════════════════════════════════════════════════════════

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Tabs } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"; // ← add StyleSheet, Text, View

// ── CHANGE 1: add this import ─────────────────────────────────────────────────
import { useNotifications } from "../context/NotificationContext";
interface UserProfile {
  name?: string;
  login?: boolean;
  email?: string;
  id?: string;
  image?: string;
}

export default function TabLayout() {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  // ── CHANGE 2: add this one line ───────────────────────────────────────────
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode<UserProfile>(token);
          setProfileData(decoded);
        }
      } catch (error) {
        console.error("Auth Error:", error);
      }
    };
    checkUser();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3B82F6",

        tabBarInactiveTintColor: "#c3cdda",
        headerStyle: { backgroundColor: "#0A2540" },
        headerTintColor: "#fff",
        headerTitleStyle: { color: "#fff", fontWeight: "bold" },
        tabBarStyle: { backgroundColor: "#0A2540" },
      }}
    >
      {/* ── dashboard — unchanged ─────────────────────────────────────────── */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          // headerRight: () => (
          //   <Image
          //     source={{
          //       uri:
          //         profileData?.image ||
          //         "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          //     }}
          //     style={{
          //       width: 34,
          //       height: 34,
          //       borderRadius: 17,
          //       marginRight: 15,
          //       borderWidth: 2,
          //       borderColor: "#3B82F6",
          //     }}
          //   />
          // ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <Image
                source={{
                  uri:
                    profileData?.image ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                }}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  marginRight: 15,
                  borderWidth: 2,
                  borderColor: "#3B82F6",
                }}
              />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={25} color={color} />
          ),
        }}
      />

      {/* ── task — unchanged ─────────────────────────────────────────────── */}
      <Tabs.Screen
        name="task"
        options={{
          title: "Task",
          tabBarIcon: ({ color }) => (
            <Ionicons name="checkmark-done-outline" size={25} color={color} />
          ),
        }}
      />

      {/* ── map — unchanged (hidden) ─────────────────────────────────────── */}
      <Tabs.Screen name="map" options={{ href: null }} />

      <Tabs.Screen
        name="chat"
        options={{
          headerShown: false,
          tabBarIcon: () => null, // hide default icon
          tabBarButton: () => (
            <TouchableOpacity
              onPress={() => router.push("/chat")}
              style={badge.fab}
            >
              <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      {/* ── reward — unchanged ───────────────────────────────────────────── */}
      <Tabs.Screen
        name="reward"
        options={{
          title: "Reward",
          tabBarIcon: ({ color }) => (
            <Ionicons name="ribbon-outline" size={25} color={color} />
          ),
        }}
      />

      {/* ── notifications — ONLY THIS ICON CHANGES (badge added) ─────────── */}
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notification",
          tabBarIcon: ({ color }) => (
            // ── CHANGE 3: wrap the icon in a View to show badge ────────────
            <View>
              <Ionicons name="notifications-outline" size={25} color={color} />
              {unreadCount > 0 && (
                <View style={badge.wrap}>
                  <Text style={badge.txt}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      {/* ── profile — unchanged ──────────────────────────────────────────── */}
      {/* <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={25} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}

// Badge styles
const badge = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  fab: {
    top: -25, // 👈 yeh usko upar uthata hai
    justifyContent: "center",
    alignItems: "center",
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: "#3B82F6",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  txt: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
});
