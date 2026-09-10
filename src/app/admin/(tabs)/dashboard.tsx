import React, { useEffect, useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { useRouter } from "expo-router";
import { useAdminAnalytics } from "@/api/hooks/useAdminAnalytics";
import { useLogout } from "@/api/hooks/useAuth";

export default function AdminDashboardScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const { data: apiData, isLoading, isError, refetch } = useAdminAnalytics();

  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const chartWidth = Dimensions.get("window").width - 72;

  // Motion & Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerTranslate = useRef(new Animated.Value(-20)).current;
  const statsFade = useRef(new Animated.Value(0)).current;
  const statsTranslate = useRef(new Animated.Value(20)).current;
  const chartFade = useRef(new Animated.Value(0)).current;
  const chartTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Staggered Entry Animation
    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(headerFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslate, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(statsFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(statsTranslate, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(chartFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(chartTranslate, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Continuous Live Status Pulse Effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const stats = [
    {
      label: "Total Users",
      value: apiData?.totalUsers?.toLocaleString() ?? "0",
      change: "+12.4%",
      icon: "people",
      color: "#10B981",
      glowColor: "rgba(16, 185, 129, 0.15)",
    },
    {
      label: "Pending Verifications",
      value: apiData?.pendingBusinessVerifications?.toString() ?? "0",
      change: "Action Req.",
      icon: "checkmark-circle",
      color: "#3B82F6",
      glowColor: "rgba(59, 130, 246, 0.15)",
    },
    {
      label: "Pending Approvals",
      value: apiData?.totalOpportunities?.toString() ?? "0",
      change: "Priority",
      icon: "time",
      color: "#F59E0B",
      glowColor: "rgba(245, 158, 11, 0.15)",
    },
  ];

  // --- Line Chart Helpers ---
  const regList = apiData?.recentRegistrations || [];
  const maxReg = Math.max(...regList.map((r) => r.count), 1);
  const linePoints = regList.map((item, index) => {
    const x =
      regList.length > 1
        ? (index / (regList.length - 1)) * (chartWidth - 20) + 10
        : 10;
    const y = 110 - (item.count / maxReg) * 80;
    return `${x},${y}`;
  });
  const pathD =
    linePoints.length > 0 ? `M ${linePoints.join(" L ")}` : "M 10,110";

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Futuristic Header & HUD Status Bar */}
      <Animated.View
        style={{
          opacity: headerFade,
          transform: [{ translateY: headerTranslate }],
        }}
      >
        <View style={styles.hudBar}>
          <View style={styles.hudBadge}>
            <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
            <Text style={styles.hudBadgeText}>
              {isLoading
                ? "SYNCING..."
                : isError
                  ? "ERROR FETCHING"
                  : "SYSTEM ONLINE"}
            </Text>
          </View>
          <Text style={styles.hudVersion}>CORE v2.4 // TELEMETRY</Text>
        </View>

        <View style={styles.welcomeRow}>
          <View>
            <Text
              style={[
                styles.welcomeText,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              Welcome, Admin
            </Text>
            <Text style={styles.subHeader}>
              Real-time platform telemetry & operations
            </Text>
          </View>
          <View style={styles.headerActionRow}>
            <TouchableOpacity style={styles.profileGlowBtn} activeOpacity={0.8}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutGlowBtn}
              activeOpacity={0.8}
              onPress={() =>
                logout(undefined, {
                  onSuccess: () => {
                    router.replace("/login");
                  },
                })
              }
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Quick Action Navigation Bar */}
      <View style={styles.quickNavContainer}>
        <TouchableOpacity
          style={[
            styles.quickNavLink,
            isDark ? styles.darkCard : styles.lightCard,
          ]}
          activeOpacity={0.8}
          onPress={() => router.push("/admin/eventpost" as any)}
        >
          <View style={styles.quickNavLeft}>
            <View style={styles.quickNavIconBadge}>
              <Ionicons name="calendar-sharp" size={18} color="#10B981" />
            </View>
            <View>
              <Text
                style={[
                  styles.quickNavTitle,
                  isDark ? styles.darkText : styles.lightText,
                ]}
              >
                Post Institutional Event
              </Text>
              <Text style={styles.quickNavSubtitle}>
                Publish new announcements & schedules
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Loading Indicator or Error State */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text
            style={[
              styles.loadingText,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Loading analytics telemetry...
          </Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
          <Text
            style={[
              styles.errorText,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Failed to load analytics data.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Futuristic Cyber Analytics Grid */}
          <Animated.View
            style={{
              opacity: statsFade,
              transform: [{ translateY: statsTranslate }],
            }}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>SYSTEM METRICS</Text>
              <View style={styles.titleLine} />
            </View>

            <View style={styles.grid}>
              {stats.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.85}
                  style={[
                    styles.statCard,
                    isDark ? styles.darkCard : styles.lightCard,
                    {
                      borderColor: isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.06)",
                    },
                  ]}
                >
                  <View style={styles.cardCornerAccent} />
                  <View style={styles.statTop}>
                    <View
                      style={[
                        styles.iconBadge,
                        { backgroundColor: item.glowColor },
                      ]}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={item.color}
                      />
                    </View>
                    <View
                      style={[
                        styles.changeBadge,
                        { backgroundColor: item.glowColor },
                      ]}
                    >
                      <Text style={[styles.changeText, { color: item.color }]}>
                        {item.change}
                      </Text>
                    </View>
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
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Daily User Registrations Line Graph */}
          <Animated.View
            style={{
              opacity: chartFade,
              transform: [{ translateY: chartTranslate }],
            }}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>REGISTRATION TELEMETRY</Text>
              <View style={styles.titleLine} />
            </View>

            <View
              style={[
                styles.chartCard,
                isDark ? styles.darkCard : styles.lightCard,
                styles.glowBorder,
              ]}
            >
              <View style={styles.cardCornerAccent} />
              {regList.length === 0 ? (
                <View style={styles.emptyChart}>
                  <Text style={styles.statLabel}>
                    No registration data available
                  </Text>
                </View>
              ) : (
                <>
                  <Svg height={130} width={chartWidth}>
                    <Line
                      x1="10"
                      y1="30"
                      x2={chartWidth - 10}
                      y2="30"
                      stroke={isDark ? "#1F2937" : "#E2E8F0"}
                      strokeDasharray="4 4"
                    />
                    <Line
                      x1="10"
                      y1="70"
                      x2={chartWidth - 10}
                      y2="70"
                      stroke={isDark ? "#1F2937" : "#E2E8F0"}
                      strokeDasharray="4 4"
                    />
                    <Path
                      d={pathD}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.5"
                    />
                    {regList.map((item, index) => {
                      const x =
                        regList.length > 1
                          ? (index / (regList.length - 1)) * (chartWidth - 20) +
                            10
                          : 10;
                      const y = 110 - (item.count / maxReg) * 80;
                      return (
                        <Circle
                          key={index}
                          cx={x}
                          cy={y}
                          r="3.5"
                          fill="#10B981"
                        />
                      );
                    })}
                  </Svg>
                  <View style={styles.xLabels}>
                    {regList.map((r, i) => (
                      <Text key={i} style={styles.chartLabel}>
                        {r.date ? r.date.substring(8, 10) + " Sep" : ""}
                      </Text>
                    ))}
                  </View>
                </>
              )}
            </View>
          </Animated.View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  lightBg: { backgroundColor: "#F8FAFC" },
  darkBg: { backgroundColor: "#0B0F17" },

  centerContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "600",
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "700",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#10B981",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },

  // HUD Elements
  hudBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  hudBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  hudBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#10B981",
    letterSpacing: 0.8,
  },
  hudVersion: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.5,
  },

  // Welcome Header
  welcomeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  subHeader: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  headerActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileGlowBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.25)",
  },
  logoutGlowBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.25)",
  },

  // Quick Nav Link Styles
  quickNavContainer: {
    marginBottom: 20,
  },
  quickNavLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    backgroundColor: "rgba(16, 185, 129, 0.03)",
  },
  quickNavLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quickNavIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickNavTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  quickNavSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "600",
  },

  // Section Headers
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 1.2,
  },
  titleLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(100, 116, 139, 0.2)",
  },

  // Grid Stats
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    position: "relative",
    overflow: "hidden",
  },
  cardCornerAccent: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 24,
    height: 2,
    backgroundColor: "#10B981",
  },
  statTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  changeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 4,
    fontWeight: "600",
  },

  // Chart Card Styles
  chartCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    marginBottom: 6,
  },
  emptyChart: {
    height: 130,
    justifyContent: "center",
    alignItems: "center",
  },
  xLabels: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 8,
  },
  chartLabel: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "700",
  },

  // Light & Dark Modes
  lightCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: "#111827",
    borderColor: "#1F2937",
  },
  lightText: { color: "#0F172A" },
  darkText: { color: "#F8FAFC" },
  glowBorder: {
    borderColor: "rgba(16, 185, 129, 0.25)",
  },
});
