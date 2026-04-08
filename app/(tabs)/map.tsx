import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function MapScreen() {
  const [location, setLocation] = useState<any>(null);
  const [route, setRoute] = useState<any[]>([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startTracking();

    // 🔵 Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const startTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 2000,
        distanceInterval: 1,
      },
      (loc) => {
        const coords = loc.coords;

        setLocation(coords);

        // 🎯 Add to route path
        setRoute((prev) => [
          ...prev,
          {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        ]);
      }
    );
  };

  if (!location) {
    return (
      <View style={styles.loading}>
        <Text>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        showsUserLocation={false}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* 🎯 ROUTE LINE */}
        {route.length > 0 && (
          <Polyline
            coordinates={route}
            strokeWidth={4}
            strokeColor="#1E90FF"
          />
        )}

        {/* 🚗 CUSTOM MARKER */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
        >
          <Ionicons name="car-sport" size={30} color="#1E90FF" />
        </Marker>

        {/* 🔵 PULSING DOT */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
        >
          <Animated.View
            style={[
              styles.pulse,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        </Marker>
      </MapView>

      {/* 🚀 FLOATING BUTTON */}
      <TouchableOpacity style={styles.floatingBtn}>
        <Ionicons name="navigate" size={22} color="#fff" />
        <Text style={styles.btnText}>Tracking</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  floatingBtn: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#0A2540",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },

  btnText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },

  pulse: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "rgba(30,144,255,0.4)",
  },
});