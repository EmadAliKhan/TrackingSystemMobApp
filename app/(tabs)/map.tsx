//Code working correctly
// import * as Location from "expo-location";
// import { router, useLocalSearchParams } from "expo-router";
// import React, { useEffect, useState } from "react";
// import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import MapView, { Marker, Polyline } from "react-native-maps";

// export default function MapScreen() {
//   const params = useLocalSearchParams();

//   const [userLocation, setUserLocation] = useState<any>(null);
//   const [routeCoords, setRouteCoords] = useState<any[]>([]);

//   // ✅ Parse backend data
//   const origin = params.origin ? JSON.parse(params.origin as string) : null;
//   const destination = params.destination
//     ? JSON.parse(params.destination as string)
//     : null;

//   if (!origin || !destination) {
//     return (
//       <View style={styles.center}>
//         <Text>Invalid Data ❌</Text>
//       </View>
//     );
//   }

//   const originCoords = {
//     latitude: origin.lat,
//     longitude: origin.lng,
//   };

//   const destinationCoords = {
//     latitude: destination.lat,
//     longitude: destination.lng,
//   };

//   // ✅ LIVE USER TRACK
//   useEffect(() => {
//     let sub: any;

//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();

//       if (status !== "granted") {
//         Alert.alert("Permission needed");
//         return;
//       }

//       sub = await Location.watchPositionAsync(
//         {
//           accuracy: Location.Accuracy.High,
//           timeInterval: 3000,
//           distanceInterval: 5,
//         },
//         (loc) => {
//           setUserLocation({
//             latitude: loc.coords.latitude,
//             longitude: loc.coords.longitude,
//           });
//         },
//       );
//     })();

//     return () => sub?.remove();
//   }, []);

//   // 🔥 OSRM ROUTE FETCH
//   useEffect(() => {
//     const getRoute = async () => {
//       try {
//         const res = await fetch(
//           `https://router.project-osrm.org/route/v1/driving/${originCoords.longitude},${originCoords.latitude};${destinationCoords.longitude},${destinationCoords.latitude}?overview=full&geometries=geojson`,
//         );

//         const data = await res.json();

//         if (data.routes.length) {
//           const coords = data.routes[0].geometry.coordinates;

//           // 🔥 Convert [lng, lat] → {latitude, longitude}
//           const formatted = coords.map((c: any) => ({
//             latitude: c[1],
//             longitude: c[0],
//           }));

//           setRouteCoords(formatted);
//         }
//       } catch (err) {
//         console.log("OSRM Error:", err);
//       }
//     };

//     getRoute();
//   }, []);

//   return (
//     <View style={{ flex: 1 }}>
//       <MapView
//         style={{ flex: 1 }}
//         showsUserLocation
//         followsUserLocation
//         initialRegion={{
//           latitude: originCoords.latitude,
//           longitude: originCoords.longitude,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}
//       >
//         {/* START */}
//         <Marker coordinate={originCoords} title="Start" pinColor="green" />

//         {/* DESTINATION */}
//         <Marker coordinate={destinationCoords} title="Destination" />

//         {/* USER */}
//         {userLocation && (
//           <Marker coordinate={userLocation} title="You" pinColor="blue" />
//         )}

//         {/* 🔥 REAL ROUTE FROM OSRM */}
//         {routeCoords.length > 0 && (
//           <Polyline coordinates={routeCoords} strokeWidth={4} />
//         )}
//       </MapView>

//       {/* COMPLETE BUTTON */}
//       <TouchableOpacity style={styles.btn} onPress={() => router.replace("/")}>
//         <Text style={{ color: "#fff", fontWeight: "bold" }}>
//           Mark as Completed
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   btn: {
//     position: "absolute",
//     bottom: 30,
//     left: 20,
//     right: 20,
//     backgroundColor: "#10B981",
//     padding: 18,
//     borderRadius: 12,
//     alignItems: "center",
//   },
// });
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function MapScreen() {
  const params = useLocalSearchParams();

  const [userLocation, setUserLocation] = useState<any>(null);
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [eta, setEta] = useState<number | null>(null);
  const [trail, setTrail] = useState<any[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  // ✅ Parse backend data
  const stops = params.stops ? JSON.parse(params.stops as string) : [];

  if (!stops || stops.length < 2) {
    return (
      <View style={styles.center}>
        <Text>Invalid Stops ❌</Text>
      </View>
    );
  }

  // 📍 Convert stops → [lng,lat] string
  const buildCoordsString = (points: any[]) => {
    return points.map((p) => `${p.lng},${p.lat}`).join(";");
  };

  // 🔥 FETCH ROUTE FUNCTION (Reusable)
  const fetchRoute = async (currentLocation?: any) => {
    try {
      let points = [...stops];

      // ✅ agar live location hai → start us se karo
      if (currentLocation) {
        points[0] = {
          lat: currentLocation.latitude,
          lng: currentLocation.longitude,
        };
      }

      const coordString = buildCoordsString(points);

      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`,
      );

      const data = await res.json();

      if (data.routes.length) {
        const route = data.routes[0];

        // 🔥 ROUTE LINE
        const formatted = route.geometry.coordinates.map((c: any) => ({
          latitude: c[1],
          longitude: c[0],
        }));

        setRouteCoords(formatted);

        // 🔥 ETA (seconds → minutes)
        setEta(Math.round(route.duration / 60));
      }
    } catch (err) {
      console.log("Route Error:", err);
    }
  };

  // ✅ LIVE LOCATION + RECALCULATION
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

          // 🔥 CONSOLE LOG
          console.log("📍 USER COORDS:", coords);
          // 🔥 Trail me add karo (but duplicate avoid karo)
          setTrail((prev) => {
            if (
              prev.length === 0 ||
              prev[prev.length - 1].latitude !== coords.latitude ||
              prev[prev.length - 1].longitude !== coords.longitude
            ) {
              const updated = [...prev, coords];

              // 🔥 limit 100 points (warna heavy ho jayega)
              if (updated.length > 100) {
                return updated.slice(-100);
              }

              return updated;
            }
            return prev;
          });
          // 🔥 Recalculate route from current position
          fetchRoute(coords);
        },
      );
    })();

    // 🔥 Initial route load
    fetchRoute();

    return () => sub?.remove();
  }, []);
  useEffect(() => {
    let interval: number;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
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
        {/* 🔥 MARKERS FOR ALL STOPS */}
        {stops.map((stop: any, index: number) => (
          <Marker
            key={index}
            coordinate={{
              latitude: stop.lat,
              longitude: stop.lng,
            }}
            title={`Stop ${index + 1}`}
            pinColor={index === stops.length - 1 ? "red" : "green"}
          />
        ))}

        {/* USER */}
        {userLocation && (
          <Marker coordinate={userLocation} title="You" pinColor="blue" />
        )}

        {/* ROUTE */}
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeWidth={4} />
        )}
        {/* 🔥 USER TRAIL */}
        {trail.length > 1 && (
          <Polyline coordinates={trail} strokeWidth={5} strokeColor="#2563EB" />
        )}
      </MapView>

      {/* ETA BOX */}
      {eta && (
        <View style={styles.etaBox}>
          <Text style={styles.etaText}>ETA: {eta} mins</Text>
        </View>
      )}
      <View style={styles.timerBox}>
        <Text style={styles.timerText}>⏱ {formatTime(seconds)}</Text>
      </View>

      {/* COMPLETE BUTTON */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          setIsRunning(false);
          router.replace("/dashboard");
        }}
      >
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
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 10,
  },

  etaText: {
    color: "#fff",
    fontWeight: "bold",
  },
  timerBox: {
    position: "absolute",
    top: 110,
    left: 20,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 10,
  },

  timerText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
