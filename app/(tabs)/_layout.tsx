import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Image } from "react-native";
interface UserProfile {
  name?: string;
  login?: boolean;
  email?: string;
  id?: string;
  image?: string;
}
export default function TabLayout() {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
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
        headerStyle: {
          backgroundColor: "#0A2540", // 👈 FULL top bar background
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          color: "#fff", // "Home" text white
          fontWeight: "bold",
        },
        // 🔥 BACKGROUND COLOR (main change)
        tabBarStyle: {
          backgroundColor: "#0A2540",
          // borderTopWidth: 0,

          // shadow (premium look)
          // elevation: 10,
          // height: 65,
          // paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          headerRight: () => (
            // <Ionicons
            //   name="person"
            //   size={24}
            //   color="#0A2540"
            //   style={{
            //     marginRight: 15,
            //     opacity: 0.8,
            //     backgroundColor: "#fff",
            //     padding: 6,
            //     borderRadius: 20,
            //   }}
            //   onPress={() => console.log("Settings clicked")}
            // />
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
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          title: "Task",
          tabBarIcon: ({ color }) => (
            <Ionicons name="checkmark-done-outline" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          // title: "Map",
          // tabBarIcon: ({ color }) => (
          //   <Ionicons name="map-outline" size={25} color={color} />
          href: null, // hide from tab bar
        }}
      />
      <Tabs.Screen
        name="reward"
        options={{
          title: "Reward",
          tabBarIcon: ({ color }) => (
            <Ionicons name="ribbon-outline" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notification",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={25} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
