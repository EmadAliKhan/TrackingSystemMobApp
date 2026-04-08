import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

const Dashboard = () => {
  const userName = "Talha Ahmed";

  const stats = [
    { title: "Employees Active", value: 12, icon: "people" },
    { title: "Checked In", value: 8, icon: "log-in" },
    { title: "Checked Out", value: 4, icon: "log-out" },
    { title: "Alerts", value: 2, icon: "warning" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Tracking System</Text>
            <Text style={styles.username}>{userName}</Text>
          </View>

          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ================= STATUS CARD ================= */}
        <View style={styles.statusCard}>
          <View>
            <Text style={styles.statusLabel}>Current Status</Text>
            <Text style={styles.statusTitle}>Monitoring Active</Text>
            <Text style={styles.statusTime}>Live Tracking Enabled</Text>
          </View>

          <View style={styles.iconCircle}>
            <Ionicons name="location" size={28} color="#fff" />
          </View>
        </View>

        {/* ================= STATS ================= */}
        <View style={styles.cardsContainer}>
          {stats.map((item, index) => (
            <View key={index} style={styles.card}>
              <Ionicons name={item.icon} size={26} color="#0A2540" />
              <Text style={styles.cardValue}>{item.value}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          ))}
        </View>

        {/* ================= ACTIVITY CHART ================= */}
        <Text style={styles.sectionTitle}>Tracking Activity</Text>

        <LineChart
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            datasets: [
              {
                data: [5, 8, 6, 10, 7, 12],
              },
            ],
          }}
          width={screenWidth - 30}
          height={220}
          chartConfig={{
            backgroundColor: "#0A2540",
            backgroundGradientFrom: "#0A2540",
            backgroundGradientTo: "#1E3A5F",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
            labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#fff",
            },
          }}
          bezier
          style={styles.chart}
        />

        {/* ================= RECENT ACTIVITY ================= */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>📍 Ali - Office Check-In (09:00 AM)</Text>
          <Text style={styles.summaryText}>📍 Sara - Location Updated</Text>
          <Text style={styles.summaryText}>📍 Ahmed - Check-Out (05:30 PM)</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A2540", // 🔥 main theme
  },

  container: {
    flex: 1,
    padding: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  welcome: {
    color: "#AFCBFF",
    fontSize: 14,
  },

  username: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  iconBtn: {
    backgroundColor: "#1E3A5F",
    padding: 10,
    borderRadius: 50,
  },

  /* STATUS CARD */
  statusCard: {
    backgroundColor: "#1E3A5F",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  statusLabel: {
    color: "#AFCBFF",
    fontSize: 13,
  },

  statusTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
  },

  statusTime: {
    color: "#4ADE80",
    fontSize: 13,
  },

  iconCircle: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    borderRadius: 50,
  },

  /* CARDS */
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#F1F5F9",
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: "center",
  },

  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A2540",
    marginTop: 8,
  },

  cardTitle: {
    fontSize: 12,
    color: "#334155",
    marginTop: 4,
    textAlign: "center",
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 15,
  },

  chart: {
    borderRadius: 16,
  },

  summaryBox: {
    backgroundColor: "#1E3A5F",
    padding: 15,
    borderRadius: 16,
    marginBottom: 30,
  },

  summaryText: {
    color: "#E2E8F0",
    marginBottom: 8,
  },
});