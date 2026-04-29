import { db } from "@/firebase/firebaseConfig";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { push, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

// ── Write CURRENT location (live dot on manager map) ─────────────────────────
const writeLocationToFirebase = async (
  userId: string,
  coords: { latitude: number; longitude: number },
  taskId?: string,
) => {
  try {
    await set(ref(db, `employees/${userId}/location`), {
      lat: coords.latitude,
      lng: coords.longitude,
      taskId: taskId || null,
      timestamp: Date.now(),
      active: true,
    });
  } catch (e) {
    console.log("Firebase write error:", e);
  }
};

// ── Append coordinate to HISTORY list ────────────────────────────────────────
// Path: employees/{userId}/history/{autoId}
// Uses push() so every point gets a unique key — nothing is ever overwritten.
// Manager's TrackingPage reads this list to replay the full trail.
const appendCoordToHistory = async (
  userId: string,
  coords: { latitude: number; longitude: number },
  taskId?: string,
) => {
  try {
    await push(ref(db, `employees/${userId}/history`), {
      lat: coords.latitude,
      lng: coords.longitude,
      taskId: taskId || null,
      timestamp: Date.now(),
    });
  } catch (e) {
    console.log("Firebase history write error:", e);
  }
};

// ── Clear active location when employee finishes ──────────────────────────────
const clearLocationFromFirebase = async (userId: string) => {
  try {
    await set(ref(db, `employees/${userId}/location`), {
      lat: null,
      lng: null,
      timestamp: Date.now(),
      active: false,
    });
  } catch (e) {
    console.log("Firebase clear error:", e);
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const haversineDistance = (
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) => {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) *
      Math.cos(toRad(b.latitude)) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

const bearingBetween = (
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
};

// ── Hybrid routing ────────────────────────────────────────────────────────────
const STRAIGHT_LINE_THRESHOLD = 1000; // metres

const buildHybridRoute = async (
  points: { lat: number; lng: number }[],
): Promise<{
  coords: { latitude: number; longitude: number }[];
  isStraight: boolean;
}> => {
  if (points.length < 2) return { coords: [], isStraight: false };

  let totalMetres = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalMetres += haversineDistance(
      { latitude: points[i].lat, longitude: points[i].lng },
      { latitude: points[i + 1].lat, longitude: points[i + 1].lng },
    );
  }

  if (totalMetres < STRAIGHT_LINE_THRESHOLD) {
    return {
      coords: points.map((p) => ({ latitude: p.lat, longitude: p.lng })),
      isStraight: true,
    };
  }

  const coordString = points.map((p) => `${p.lng},${p.lat}`).join(";");
  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`,
  );
  const data = await res.json();
  if (!data.routes?.length) return { coords: [], isStraight: false };

  return {
    coords: data.routes[0].geometry.coordinates.map((c: number[]) => ({
      latitude: c[1],
      longitude: c[0],
    })),
    isStraight: false,
  };
};

const estimateWalkingEta = (distMetres: number) =>
  Math.round(distMetres / (5000 / 60));

// ─────────────────────────────────────────────────────────────────────────────
export default function MapScreen() {
  const params = useLocalSearchParams();

  const [userLocation, setUserLocation] = useState<any>(null);
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [isStraightRoute, setIsStraightRoute] = useState(false);
  const [eta, setEta] = useState<number | null>(null);
  const [trail, setTrail] = useState<any[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const router = useRouter();

  const userId = (params.userId as string) || "";
  const taskId = (params.taskId as string) || "";
  const TaskNo = (params.taskNo as string) || "";
  const MIN_DIST_M = 4;
  const TURN_DEG = 8;

  const stops = params.stops ? JSON.parse(params.stops as string) : [];

  // ── Fetch planned route ───────────────────────────────────────────────────
  const fetchRoute = async (currentLocation?: {
    latitude: number;
    longitude: number;
  }) => {
    try {
      let points = stops.map((s: any) => ({ lat: s.lat, lng: s.lng }));
      //if you want to start with current location than uncommet this
      // if (currentLocation) {
      //   points[0] = {
      //     lat: currentLocation.latitude,
      //     lng: currentLocation.longitude,
      //   };
      // }

      const { coords, isStraight } = await buildHybridRoute(points);
      setRouteCoords(coords);
      setIsStraightRoute(isStraight);

      if (isStraight) {
        let totalDist = 0;
        for (let i = 0; i < points.length - 1; i++) {
          totalDist += haversineDistance(
            { latitude: points[i].lat, longitude: points[i].lng },
            { latitude: points[i + 1].lat, longitude: points[i + 1].lng },
          );
        }
        setEta(estimateWalkingEta(totalDist));
      } else {
        const coordString = points
          .map((p: any) => `${p.lng},${p.lat}`)
          .join(";");
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=false`,
        );
        const data = await res.json();
        if (data.routes?.length)
          setEta(Math.round(data.routes[0].duration / 60));
      }
    } catch (err) {
      console.log("Route Error:", err);
    }
  };

  // ── Live location watcher + Firebase writes ───────────────────────────────
  useEffect(() => {
    let sub: any;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location permission required");
        return;
      }

      sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 2000,
          distanceInterval: 1,
        },
        (loc) => {
          const coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };

          setUserLocation(coords);

          // 1. Update live position (manager sees dot move)
          if (userId) {
            writeLocationToFirebase(userId, coords, taskId);
          }

          // 2. Append to persistent history + update local trail
          setTrail((prev) => {
            const lastPoint = prev.length > 0 ? prev[prev.length - 1] : null;
            const movedEnough =
              !lastPoint || haversineDistance(lastPoint, coords) >= MIN_DIST_M;

            // Only save to Firebase history if the employee actually moved
            // This prevents flooding Firebase with duplicate GPS reads
            if (movedEnough && userId) {
              appendCoordToHistory(userId, coords, taskId);
            }

            // ── Local trail (bearing-gated to reduce noise) ───────────────
            if (prev.length < 2) return [...prev, coords];

            const last = prev[prev.length - 1];
            const secondLast = prev[prev.length - 2];

            const dist = haversineDistance(last, coords);
            if (dist < MIN_DIST_M) return prev;

            const prevBearing = bearingBetween(secondLast, last);
            const newBearing = bearingBetween(last, coords);
            let delta = Math.abs(newBearing - prevBearing);
            if (delta > 180) delta = 360 - delta;

            if (delta < TURN_DEG) {
              const updated = [...prev];
              updated[updated.length - 1] = coords;
              return updated.length > 200 ? updated.slice(-200) : updated;
            }

            const updated = [...prev, coords];
            return updated.length > 200 ? updated.slice(-200) : updated;
          });

          fetchRoute(coords);
        },
      );
    })();

    fetchRoute();

    return () => sub?.remove();
  }, [taskId]);

  // ── Timer ─────────────────────────────────────────────────────────────────
  // useEffect(() => {
  //   if (!isRunning) return;   // ← guard
  //   let interval: number;
  //   if (isRunning) {
  //     interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
  //   }
  //   return () => clearInterval(interval);
  // }, [isRunning]);
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, taskId]);
  useEffect(() => {
    if (!taskId) return;
    setSeconds(0); // ⏱ reset timer
    setIsRunning(true); // ▶️ start timer again
  }, [taskId]);
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // const handleComplete = async () => {
  //   setIsRunning(false);
  //   if (userId) await clearLocationFromFirebase(userId);
  //   router.replace("/(tabs)/task");
  // };
  if (!stops || stops.length < 2) {
    return (
      <View style={styles.center}>
        <Text>Invalid Stops ❌</Text>
      </View>
    );
  }
  // const handleComplete = async () => {
  //   setIsRunning(false);

  //   // 1. Get final coordinates — use last known location
  //   const finalCoords = userLocation
  //     ? { lat: userLocation.latitude, lng: userLocation.longitude }
  //     : null;

  //   // 2. Get completed time as string
  //   // const completedTime = new Date().toISOString();
  //   console.log("Seconds:", seconds);

  //   // 3. Call your PUT API
  //   try {
  //     // const API_BASE = "https://fyp-coral.vercel.app/api/tasks"; // or your local IP
  //     const API_BASE = "http://192.168.3.103:3000/api/tasks"; // or your local IP
  //     await fetch(API_BASE, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         taskId: taskId, // from params
  //         // taskNo: TaskNo, // from params
  //         status: "completed",
  //         userId: userId, // from params
  //         completedTime: seconds,
  //         userFinalCoords: finalCoords,
  //       }),
  //     });
  //   } catch (e) {
  //     console.log("Complete API error:", e);
  //   }
  //   console.log("Task Completed:", {
  //     taskNo: TaskNo,
  //     status: "completed",
  //     userId: userId,
  //     completedTime: seconds,
  //     userFinalCoords: finalCoords,
  //   });

  //     // ✅ Reset everything BEFORE navigating
  // setSeconds(0);
  // setTrail([]);
  // setIsRunning(true);
  // setRouteCoords([]);
  // setEta(null);
  // setUserLocation(null);

  //   // 4. Clear Firebase
  //   if (userId) await clearLocationFromFirebase(userId);

  //   // 5. Go back
  //   router.replace("/(tabs)/task");
  // };

  const handleComplete = async () => {
    // 1. Save seconds FIRST before setting isRunning false
    const finalCoords = userLocation
      ? { lat: userLocation.latitude, lng: userLocation.longitude }
      : null;
    const completedSeconds = seconds; // ← capture before reset

    // 2. Call API with captured seconds
    try {
      // const API_BASE = "http://10.114.117.145:3000/api/tasks";
      const API_BASE = "http://fyp-coral.vercel.app/api/tasks";

      await fetch(API_BASE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: taskId,
          status: "completed",
          userId: userId,
          completedTime: completedSeconds, // ← use captured value
          userFinalCoords: finalCoords,
        }),
      });
    } catch (e) {
      console.log("Complete API error:", e);
    }

    // 3. Reset state
    setIsRunning(true);
    setSeconds(0);
    setTrail([]);
    setRouteCoords([]);
    setEta(null);
    setUserLocation(null);

    // 4. Clear Firebase
    if (userId) await clearLocationFromFirebase(userId);

    // 5. Navigate back
    router.replace("/(tabs)/task");
  };
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: stops[0].lat,
          longitude: stops[0].lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {stops.map((stop: any, index: number) => (
          <Marker
            key={index}
            coordinate={{ latitude: stop.lat, longitude: stop.lng }}
            title={`Stop ${index + 1}`}
            pinColor={index === stops.length - 1 ? "red" : "green"}
          />
        ))}

        {userLocation && (
          <Marker coordinate={userLocation} title="You" pinColor="blue" />
        )}

        {/* Planned route */}
        {routeCoords.length > 0 && !isStraightRoute && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor="#0f294d"
          />
        )}
        {routeCoords.length > 0 && isStraightRoute && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor="#16a34a"
            lineDashPattern={[8, 6]}
          />
        )}

        {/* Actual travelled trail */}
        {trail.length > 1 && (
          <Polyline coordinates={trail} strokeWidth={5} strokeColor="#2563EB" />
        )}
      </MapView>

      {eta !== null && (
        <View style={styles.etaBox}>
          <Text style={styles.etaText}>
            ETA: {eta} mins {isStraightRoute ? "🚶" : "🚗"}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.badgeBox,
          isStraightRoute ? styles.badgeStraight : styles.badgeRoad,
        ]}
      >
        <Text style={styles.badgeText}>
          {isStraightRoute ? "📏 Direct line" : "🛣️ Road route"}
        </Text>
      </View>

      <View style={styles.timerBox}>
        <Text style={styles.timerText}>⏱ {formatTime(seconds)}</Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleComplete}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Mark as Completed
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  btn: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#10B981",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  etaBox: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "#151414",
    padding: 10,
    borderRadius: 10,
  },
  etaText: { color: "#fff", fontWeight: "bold" },
  badgeBox: {
    position: "absolute",
    top: 110,
    left: 20,
    padding: 8,
    borderRadius: 10,
  },
  badgeStraight: { backgroundColor: "#16a34a" },
  badgeRoad: { backgroundColor: "#0f294d" },
  badgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  timerBox: {
    position: "absolute",
    top: 160,
    left: 20,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 10,
  },
  timerText: { color: "#fff", fontWeight: "bold" },
});
