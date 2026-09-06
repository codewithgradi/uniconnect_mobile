import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ThemedInput } from "../../../components/ThemedInput";

export default function StudentHomeScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  const quickActions = [
    { title: "Events", icon: "calendar-outline", route: "/student/events" },
    {
      title: "Opportunities",
      icon: "briefcase-outline",
      route: "/student/opportunities",
    },
    {
      title: "Connections",
      icon: "people-outline",
      route: "/student/network",
    },
    {
      title: "AI Assistant",
      icon: "sparkles-outline",
      route: "/student/assistant",
    },
  ];

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
    >
      {/* Greeting Header */}
      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.greeting,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Hi, Sarah! 👋
          </Text>
          <Text style={styles.subGreeting}>Ready to learn and grow?</Text>
        </View>
        <TouchableOpacity
          style={styles.profileAvatar}
          onPress={() => router.push("/student/profile")}
        >
          <Text style={styles.avatarText}>SJ</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <ThemedInput placeholder="Search people, jobs, events..." />
      </View>

      {/* Quick Access */}
      <Text
        style={[
          styles.sectionTitle,
          isDark ? styles.darkText : styles.lightText,
        ]}
      >
        Quick Access
      </Text>
      <View style={styles.quickAccessGrid}>
        {quickActions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.quickCard,
              isDark ? styles.darkCard : styles.lightCard,
            ]}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon as any} size={22} color="#006837" />
            </View>
            <Text
              style={[
                styles.quickText,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recommended for You */}
      <Text
        style={[
          styles.sectionTitle,
          isDark ? styles.darkText : styles.lightText,
        ]}
      >
        Recommended for You
      </Text>

      {/* Recommended Card 1 */}
      <View
        style={[
          styles.recommendCard,
          isDark ? styles.darkCard : styles.lightCard,
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTag}>New</Text>
          <Text style={styles.timeText}>2h ago</Text>
        </View>
        <Text
          style={[
            styles.cardTitle,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Software Engineering Internship
        </Text>
        <Text style={styles.cardSub}>TechCorp • Cape Town, South Africa</Text>
        <Text style={styles.cardMeta}>Full-time • Internship</Text>
      </View>

      {/* Recommended Card 2 */}
      <View
        style={[
          styles.recommendCard,
          isDark ? styles.darkCard : styles.lightCard,
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Campus Hackathon 2026
        </Text>
        <Text style={styles.cardSub}>Innovation for Impact</Text>
        <Text style={styles.cardMeta}>1 May 2026 • University Main Hall</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  greeting: { fontSize: 24, fontWeight: "700" },
  subGreeting: { fontSize: 14, color: "#6B7280", marginTop: 2 },
  profileAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  searchContainer: { marginVertical: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginVertical: 14 },
  quickAccessGrid: { flexDirection: "row", justifyContent: "space-between" },
  quickCard: {
    width: "22%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6F0EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  quickText: { fontSize: 11, fontWeight: "600", textAlign: "center" },
  recommendCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardTag: { color: "#006837", fontWeight: "700", fontSize: 12 },
  timeText: { color: "#9CA3AF", fontSize: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardSub: { color: "#4B5563", fontSize: 14, marginTop: 4 },
  cardMeta: { color: "#6B7280", fontSize: 12, marginTop: 6 },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
