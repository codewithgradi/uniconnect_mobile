import React, { useEffect, useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
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
import { useAdminAnalytics } from "@/api/hooks/useAdminAnalytics";

export default function AdminDashboardScreen() {
  const isDark = useColorScheme() === "dark";
  const { data: apiData, isLoading, isError } = useAdminAnalytics();
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

  // Fallback data if query is loading or uninitialized
  const data = apiData || {
    totalUsers: 1248,
    pendingBusinessVerifications: 342,
    totalOpportunities: 23,
    recentRegistrations: [
      { date: "2026-09-01", count: 12 },
      { date: "2026-09-02", count: 19 },
      { date: "2026-09-03", count: 15 },
      { date: "2026-09-04", count: 28 },
      { date: "2026-09-05", count: 22 },
      { date: "2026-09-06", count: 35 },
    ],
  };

  const stats = [
    {
      label: "Total Users",
      value: data.totalUsers?.toLocaleString() || "1,248",
      change: "+12.4%",
      icon: "people",
      color: "#10B981",
      glowColor: "rgba(16, 185, 129, 0.15)",
    },
    {
      label: "Pending Verifications",
      value: data.pendingBusinessVerifications?.toString() || "342",
      change: "Action Req.",
      icon: "checkmark-circle",
      color: "#3B82F6",
      glowColor: "rgba(59, 130, 246, 0.15)",
    },
    {
      label: "Pending Approvals",
      value: data.totalOpportunities?.toString() || "23",
      change: "Priority",
      icon: "time",
      color: "#F59E0B",
      glowColor: "rgba(245, 158, 11, 0.15)",
    },
  ];

  // --- Line Chart Helpers ---
  const regList = data.recentRegistrations || [];
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
                  ? "OFFLINE CACHE"
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
          <TouchableOpacity style={styles.profileGlowBtn} activeOpacity={0.8}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
          </TouchableOpacity>
        </View>
      </Animated.View>

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
            <Path d={pathD} fill="none" stroke="#10B981" strokeWidth="2.5" />
            {regList.map((item, index) => {
              const x =
                regList.length > 1
                  ? (index / (regList.length - 1)) * (chartWidth - 20) + 10
                  : 10;
              const y = 110 - (item.count / maxReg) * 80;
              return (
                <Circle key={index} cx={x} cy={y} r="3.5" fill="#10B981" />
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
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  lightBg: { backgroundColor: "#F8FAFC" },
  darkBg: { backgroundColor: "#0B0F17" },

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
    marginBottom: 24,
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
