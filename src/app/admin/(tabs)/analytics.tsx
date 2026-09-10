import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, {
  Path,
  Rect,
  Text as SvgText,
  Line,
  Circle,
} from "react-native-svg";
import { useAdminAnalytics } from "@/api/hooks/useAdminAnalytics";

export default function AdminAnalyticsScreen() {
  const isDark = useColorScheme() === "dark";
  const { data: apiData, isLoading, isError } = useAdminAnalytics();
  const chartWidth = Dimensions.get("window").width - 72;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

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

  if (isLoading || !apiData) {
    return (
      <View
        style={[
          styles.container,
          isDark ? styles.darkBg : styles.lightBg,
          styles.centerState,
        ]}
      >
        <Animated.View
          style={[
            styles.pulseDot,
            { opacity: pulseAnim, transform: [{ scale: 1.5 }] },
          ]}
        />
        <Text
          style={[
            styles.stateText,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Loading live telemetry...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[
          styles.container,
          isDark ? styles.darkBg : styles.lightBg,
          styles.centerState,
        ]}
      >
        <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
        <Text
          style={[
            styles.stateText,
            isDark ? styles.darkText : styles.lightText,
            { marginTop: 12 },
          ]}
        >
          Failed to fetch analytics from API server.
        </Text>
      </View>
    );
  }

  const data = apiData;

  // --- Graph 1 Helper: Line Chart Path for Registrations ---
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

  // --- Graph 2 Helper: Opportunity Distribution Bars ---
  const oppData = [
    { label: "Published", val: data.publishedOpportunities, color: "#10B981" },
    { label: "Pending", val: data.pendingOpportunities, color: "#F59E0B" },
    { label: "Closed", val: data.closedOpportunities, color: "#EF4444" },
  ];
  const maxOpp = Math.max(...oppData.map((d) => d.val), 1);

  // --- Graph 3 Helper: User Breakdown Bars ---
  const userData = [
    { label: "Students", val: data.totalStudents, color: "#3B82F6" },
    { label: "Business", val: data.totalBusinesses, color: "#10B981" },
    { label: "Admins", val: data.totalAdmins, color: "#64748B" },
  ];
  const maxUser = Math.max(...userData.map((d) => d.val), 1);

  // --- Graph 4 Helper: Platform Social Volume Bars ---
  const socialData = [
    { label: "Posts", val: data.totalPosts, color: "#8B5CF6" },
    { label: "Comments", val: data.totalComments, color: "#06B6D4" },
    { label: "Likes", val: data.totalLikes, color: "#EC4899" },
    { label: "DMs", val: data.totalDirectMessages, color: "#3B82F6" },
  ];
  const maxSocial = Math.max(...socialData.map((d) => d.val), 1);

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* HUD Header Status */}
        <View style={styles.hudBar}>
          <View style={styles.hudBadge}>
            <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
            <Text style={styles.hudBadgeText}>TELEMETRY ACTIVE</Text>
          </View>
          <Text style={styles.hudVersion}>LIVE API FEED</Text>
        </View>

        {/* 1. Daily Registrations Line Chart */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>DAILY USER REGISTRATIONS</Text>
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
                {r.date ? r.date.substring(5, 10) : ""}
              </Text>
            ))}
          </View>
        </View>

        {/* 2. Opportunity Status Breakdown Bar Chart */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>OPPORTUNITY PIPELINE</Text>
          <View style={styles.titleLine} />
        </View>
        <View
          style={[
            styles.chartCard,
            isDark ? styles.darkCard : styles.lightCard,
          ]}
        >
          <View style={styles.cardCornerAccent} />
          <Svg height={120} width={chartWidth}>
            {oppData.map((d, i) => {
              const barHeight = (d.val / maxOpp) * 80;
              const barWidth = 42;
              const gap =
                (chartWidth - oppData.length * barWidth) / (oppData.length + 1);
              const x = gap + i * (barWidth + gap);
              const y = 100 - barHeight;

              return (
                <React.Fragment key={i}>
                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={d.color}
                    rx={6}
                    opacity={0.9}
                  />
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - 6}
                    fill={isDark ? "#F8FAFC" : "#0F172A"}
                    fontSize="11"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    {d.val}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
          <View style={styles.xLabels}>
            {oppData.map((d, i) => (
              <Text key={i} style={styles.chartLabel}>
                {d.label}
              </Text>
            ))}
          </View>
        </View>

        {/* 3. User Demographics Bar Chart */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>USER ROLE DISTRIBUTION</Text>
          <View style={styles.titleLine} />
        </View>
        <View
          style={[
            styles.chartCard,
            isDark ? styles.darkCard : styles.lightCard,
          ]}
        >
          <View style={styles.cardCornerAccent} />
          <Svg height={120} width={chartWidth}>
            {userData.map((d, i) => {
              const barHeight = (d.val / maxUser) * 80;
              const barWidth = 42;
              const gap =
                (chartWidth - userData.length * barWidth) /
                (userData.length + 1);
              const x = gap + i * (barWidth + gap);
              const y = 100 - barHeight;

              return (
                <React.Fragment key={i}>
                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={d.color}
                    rx={6}
                    opacity={0.9}
                  />
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - 6}
                    fill={isDark ? "#F8FAFC" : "#0F172A"}
                    fontSize="11"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    {d.val}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
          <View style={styles.xLabels}>
            {userData.map((d, i) => (
              <Text key={i} style={styles.chartLabel}>
                {d.label}
              </Text>
            ))}
          </View>
        </View>

        {/* 4. Platform Social Volume Bar Chart */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>SOCIAL & INTERACTION METRICS</Text>
          <View style={styles.titleLine} />
        </View>
        <View
          style={[
            styles.chartCard,
            isDark ? styles.darkCard : styles.lightCard,
          ]}
        >
          <View style={styles.cardCornerAccent} />
          <Svg height={120} width={chartWidth}>
            {socialData.map((d, i) => {
              const barHeight = (d.val / maxSocial) * 80;
              const barWidth = 32;
              const gap =
                (chartWidth - socialData.length * barWidth) /
                (socialData.length + 1);
              const x = gap + i * (barWidth + gap);
              const y = 100 - barHeight;

              return (
                <React.Fragment key={i}>
                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={d.color}
                    rx={5}
                    opacity={0.9}
                  />
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - 6}
                    fill={isDark ? "#F8FAFC" : "#0F172A"}
                    fontSize="10"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    {d.val}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
          <View style={styles.xLabels}>
            {socialData.map((d, i) => (
              <Text key={i} style={styles.chartLabel}>
                {d.label}
              </Text>
            ))}
          </View>
        </View>

        {/* Core System Telemetry Summary Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>SYSTEM OVERVIEW</Text>
          <View style={styles.titleLine} />
        </View>
        <View style={styles.metricGrid}>
          <View
            style={[
              styles.metricCard,
              isDark ? styles.darkCard : styles.lightCard,
            ]}
          >
            <Ionicons name="briefcase-outline" size={18} color="#10B981" />
            <Text
              style={[
                styles.metricVal,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              {data.totalJobApplications}
            </Text>
            <Text style={styles.metricLabel}>Applications</Text>
          </View>

          <View
            style={[
              styles.metricCard,
              isDark ? styles.darkCard : styles.lightCard,
            ]}
          >
            <Ionicons name="chatbubbles-outline" size={18} color="#3B82F6" />
            <Text
              style={[
                styles.metricVal,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              {data.totalDirectMessages}
            </Text>
            <Text style={styles.metricLabel}>Messages</Text>
          </View>

          <View
            style={[
              styles.metricCard,
              isDark ? styles.darkCard : styles.lightCard,
            ]}
          >
            <Ionicons name="people-outline" size={18} color="#F59E0B" />
            <Text
              style={[
                styles.metricVal,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              {data.totalConnections}
            </Text>
            <Text style={styles.metricLabel}>Connections</Text>
          </View>

          <View
            style={[
              styles.metricCard,
              isDark ? styles.darkCard : styles.lightCard,
            ]}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#EF4444"
            />
            <Text
              style={[
                styles.metricVal,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              {data.pendingBusinessVerifications}
            </Text>
            <Text style={styles.metricLabel}>Verifications</Text>
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
  centerState: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  stateText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
  },

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

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
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

  chartCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    marginBottom: 6,
  },
  cardCornerAccent: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 24,
    height: 2,
    backgroundColor: "#10B981",
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

  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  metricCard: {
    width: "48%",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  metricVal: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 6,
    letterSpacing: -0.5,
  },
  metricLabel: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "600",
  },

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
