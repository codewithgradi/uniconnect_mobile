import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ThemedButtonSecondary } from "@/components/ThemedButtonSecondary";

export default function NetworkScreen() {
  const isDark = useColorScheme() === "dark";
  const [activeTab, setActiveTab] = useState<
    "People" | "Requests" | "Connections"
  >("People");

  const requests = [
    { name: "James Mwangi", role: "Software Engineer at Google", mutual: 12 },
    {
      name: "Lerato Dlamini",
      role: "Product Designer at Microsoft",
      mutual: 8,
    },
  ];

  const suggestions = [
    { name: "Sipho Ndlovu", role: "Data Scientist at Amazon" },
    { name: "Amanda Van Wyk", role: "UX Designer at PayFast" },
  ];

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
    >
      {/* Header Tabs */}
      <View style={styles.tabContainer}>
        {(["People", "Requests", "Connections"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Connection Requests */}
      <Text
        style={[
          styles.sectionTitle,
          isDark ? styles.darkText : styles.lightText,
        ]}
      >
        Connection Requests
      </Text>
      {requests.map((item, index) => (
        <View
          key={index}
          style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>{item.name[0]}</Text>
          </View>
          <View style={styles.info}>
            <Text
              style={[styles.name, isDark ? styles.darkText : styles.lightText]}
            >
              {item.name}
            </Text>
            <Text style={styles.role}>{item.role}</Text>
            <Text style={styles.mutual}>{item.mutual} mutual connections</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.acceptBtn}>
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn}>
              <Ionicons name="close" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* People You May Know */}
      <Text
        style={[
          styles.sectionTitle,
          isDark ? styles.darkText : styles.lightText,
        ]}
      >
        People You May Know
      </Text>
      {suggestions.map((item, index) => (
        <View
          key={index}
          style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>{item.name[0]}</Text>
          </View>
          <View style={styles.info}>
            <Text
              style={[styles.name, isDark ? styles.darkText : styles.lightText]}
            >
              {item.name}
            </Text>
            <Text style={styles.role}>{item.role}</Text>
          </View>
          <ThemedButtonSecondary
            title="Connect"
            style={styles.connectBtn}
            textStyle={{ fontSize: 13 }}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  tabContainer: { flexDirection: "row", marginTop: 20, marginBottom: 10 },
  tab: { marginRight: 24, paddingBottom: 8 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#006837" },
  tabText: { fontSize: 15, fontWeight: "600" },
  activeTabText: { color: "#006837" },
  inactiveTabText: { color: "#9CA3AF" },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginVertical: 14 },
  card: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: "center",
  },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarInitials: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700" },
  role: { color: "#6B7280", fontSize: 12, marginTop: 2 },
  mutual: { color: "#9CA3AF", fontSize: 11, marginTop: 2 },
  actionButtons: { flexDirection: "row", gap: 8 },
  acceptBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
  },
  rejectBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  connectBtn: { width: 90, height: 36, marginVertical: 0 },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
