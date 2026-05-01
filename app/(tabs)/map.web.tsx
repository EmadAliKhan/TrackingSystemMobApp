import { Link, useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MapWebFallback() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Map unavailable on web</Text>
        <Text style={styles.body}>
          The map experience is only supported on native iOS and Android builds.
          Use the Expo app or a native build to view live maps.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/dashboard")}
        >
          <Text style={styles.buttonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  card: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#0f172a",
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#334155",
    marginBottom: 24,
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#0ea5e9",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
