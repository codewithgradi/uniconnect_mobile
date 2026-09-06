import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

export default function AdminDashboardScreen() {
  const isDark = useColorScheme() === "dark";

  const stats = [
    {
      label: "Total Users",
      value: "1,248",
      icon: "people",
      color: "#006837",
      bg: "#E6F0EB",
    },
    {
      label: "Pending Verifications",
      value: "342",
      icon: "checkmark-circle",
      color: "#0284C7",
      bg: "#E0F2FE",
    },
    {
      label: "Pending Approvals",
      value: "23",
      icon: "time",
      color: "#D97706",
      bg: "#FEF3C7",
    },
  ];

  const recentActivity = [
    {
      id: "1",
      title: "New user registration",
      subtitle: "Sarah Johnson",
      time: "2m ago",
      icon: "person-add-outline",
    },
    {
      id: "2",
      title: "Business verification pending",
      subtitle: "TechCorp Solutions",
      time: "15m ago",
      icon: "business-outline",
    },
    {
      id: "3",
      title: "New opportunity pending",
      subtitle: "Flutter Developer Intern",
      time: "1h ago",
      icon: "briefcase-outline",
    },
  ];

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={[
          styles.welcomeText,
          isDark ? styles.darkText : styles.lightText,
        ]}
      >
        Welcome, Admin
      </Text>
      <Text style={styles.subHeader}>Here's what's happening today</Text>

      {/* Grid Stats */}
      <View style={styles.grid}>
        {stats.map((item, idx) => (
          <View
            key={idx}
            style={[
              styles.statCard,
              isDark ? styles.darkCard : styles.lightCard,
            ]}
          >
            <View style={[styles.iconBadge, { backgroundColor: item.bg }]}>
              <Ionicons name={item.icon as any} size={18} color={item.color} />
            </View>
            <Text
              style={[
                styles.statValue,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              {item.value}
            </Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Recent Activity Section */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityList}>
        {recentActivity.map((act) => (
          <View
            key={act.id}
            style={[
              styles.activityCard,
              isDark ? styles.darkCard : styles.lightCard,
            ]}
          >
            <View style={styles.actLeft}>
              <View style={styles.actIcon}>
                <Ionicons name={act.icon as any} size={18} color="#006837" />
              </View>
              <View>
                <Text
                  style={[
                    styles.actTitle,
                    isDark ? styles.darkText : styles.lightText,
                  ]}
                >
                  {act.title}
                </Text>
                <Text style={styles.actSub}>{act.subtitle}</Text>
              </View>
            </View>
            <Text style={styles.actTime}>{act.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  welcomeText: { fontSize: 22, fontWeight: "800", marginTop: 16 },
  subHeader: { fontSize: 13, color: "#6B7280", marginBottom: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: { width: "48%", padding: 14, borderRadius: 12, borderWidth: 1 },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginTop: 24,
    marginBottom: 12,
  },
  activityList: { paddingBottom: 24 },
  activityCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  actLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  actIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E6F0EB",
    justifyContent: "center",
    alignItems: "center",
  },
  actTitle: { fontSize: 13, fontWeight: "700" },
  actSub: { fontSize: 12, color: "#6B7280" },
  actTime: { fontSize: 11, color: "#9CA3AF" },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
