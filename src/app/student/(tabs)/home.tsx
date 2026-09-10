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
import { useLogout } from "@/api/hooks/useAuth";

export default function StudentHomeScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.replace("/");
      },
    });
  };

  const quickActions = [
    { title: "Events", icon: "calendar-outline", route: "/student/events" },
    { title: "Messages", icon: "chatbox-outline", route: "/student/messages" },
    {
      title: "AI Assistant",
      icon: "sparkles-outline",
      route: "/student/assistant",
    },
  ];

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text
            style={[
              styles.greeting,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Uniconnect
          </Text>
          <Text style={styles.subGreeting}>Ready to learn and grow?</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              isDark ? styles.darkLogoutBtn : styles.lightLogoutBtn,
            ]}
            onPress={handleLogout}
            disabled={isLoggingOut}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileAvatar}
            onPress={() => router.push("/student/profile")}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>UC</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Access */}
      <View style={styles.sectionContainer}>
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
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconCircle,
                  isDark ? styles.darkIconCircle : styles.lightIconCircle,
                ]}
              >
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  lightBg: {
    backgroundColor: "#F9FAFB",
  },
  darkBg: {
    backgroundColor: "#0B0F17",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
    paddingVertical: 8,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoutButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  lightLogoutBtn: {
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  darkLogoutBtn: {
    borderColor: "#374151",
    backgroundColor: "#1F2937",
  },
  profileAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#006837",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  sectionContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  quickAccessGrid: {
    flexDirection: "row",
    gap: 12,
  },
  quickCard: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  lightCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
  },
  darkCard: {
    backgroundColor: "#1F2937",
    borderColor: "#374151",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  lightIconCircle: {
    backgroundColor: "#E6F0EB",
  },
  darkIconCircle: {
    backgroundColor: "rgba(0, 104, 55, 0.15)",
  },
  quickText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  lightText: {
    color: "#111827",
  },
  darkText: {
    color: "#F3F4F6",
  },
});
