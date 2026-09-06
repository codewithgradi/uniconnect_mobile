import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, { Path, Rect, Text as SvgText } from "react-native-svg";

export interface DailyRegistrationDto {
  Date: string;
  Count: number;
}

export interface AdminAnalyticsDto {
  // System Totals
  TotalUsers: number;
  TotalStudents: number;
  TotalBusinesses: number;
  TotalAdmins: number;

  // Opportunities & Applications
  TotalOpportunities: number;
  PublishedOpportunities: number;
  PendingOpportunities: number;
  ClosedOpportunities: number;
  TotalJobApplications: number;

  // Social & Messaging
  TotalPosts: number;
  TotalComments: number;
  TotalLikes: number;
  TotalConnections: number;
  TotalDirectMessages: number;

  // Verification & Moderation
  PendingBusinessVerifications: number;

  // Growth & Activity Trends
  RecentRegistrations: DailyRegistrationDto[];
}

const MOCK_ANALYTICS: AdminAnalyticsDto = {
  TotalUsers: 1248,
  TotalStudents: 980,
  TotalBusinesses: 240,
  TotalAdmins: 28,

  TotalOpportunities: 342,
  PublishedOpportunities: 210,
  PendingOpportunities: 82,
  ClosedOpportunities: 50,
  TotalJobApplications: 1850,

  TotalPosts: 540,
  TotalComments: 1280,
  TotalLikes: 3420,
  TotalConnections: 1256,
  TotalDirectMessages: 4782,

  PendingBusinessVerifications: 14,

  RecentRegistrations: [
    { Date: "2026-09-01", Count: 12 },
    { Date: "2026-09-02", Count: 19 },
    { Date: "2026-09-03", Count: 15 },
    { Date: "2026-09-04", Count: 28 },
    { Date: "2026-09-05", Count: 22 },
    { Date: "2026-09-06", Count: 35 },
  ],
};

export default function AdminAnalyticsScreen() {
  const isDark = useColorScheme() === "dark";
  const data = MOCK_ANALYTICS;
  const chartWidth = Dimensions.get("window").width - 72;

  // --- Graph 1 Helper: Line Chart Path for Registrations ---
  const maxReg = Math.max(...data.RecentRegistrations.map((r) => r.Count), 1);
  const linePoints = data.RecentRegistrations.map((item, index) => {
    const x =
      (index / (data.RecentRegistrations.length - 1)) * (chartWidth - 20) + 10;
    const y = 110 - (item.Count / maxReg) * 80;
    return `${x},${y}`;
  });
  const pathD = `M ${linePoints.join(" L ")}`;

  // --- Graph 2 Helper: Opportunity Distribution Bars ---
  const oppData = [
    { label: "Published", val: data.PublishedOpportunities, color: "#006837" },
    { label: "Pending", val: data.PendingOpportunities, color: "#D97706" },
    { label: "Closed", val: data.ClosedOpportunities, color: "#DC2626" },
  ];
  const maxOpp = Math.max(...oppData.map((d) => d.val), 1);

  // --- Graph 3 Helper: User Breakdown Bars ---
  const userData = [
    { label: "Students", val: data.TotalStudents, color: "#0284C7" },
    { label: "Businesses", val: data.TotalBusinesses, color: "#10B981" },
    { label: "Admins", val: data.TotalAdmins, color: "#6B7280" },
  ];
  const maxUser = Math.max(...userData.map((d) => d.val), 1);

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Daily Registrations Line Chart */}
      <Text style={styles.sectionTitle}>Daily User Registrations</Text>
      <View
        style={[styles.chartCard, isDark ? styles.darkCard : styles.lightCard]}
      >
        <Svg height={130} width={chartWidth}>
          <Path d={pathD} fill="none" stroke="#006837" strokeWidth="3" />
        </Svg>
        <View style={styles.xLabels}>
          {data.RecentRegistrations.map((r, i) => (
            <Text key={i} style={styles.chartLabel}>
              {r.Date.substring(8, 10)} Sep
            </Text>
          ))}
        </View>
      </View>

      {/* 2. Opportunity Status Breakdown Bar Chart */}
      <Text style={styles.sectionTitle}>Opportunity Breakdown</Text>
      <View
        style={[styles.chartCard, isDark ? styles.darkCard : styles.lightCard]}
      >
        <Svg height={120} width={chartWidth}>
          {oppData.map((d, i) => {
            const barHeight = (d.val / maxOpp) * 80;
            const barWidth = 36;
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
                  rx={4}
                />
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 6}
                  fill={isDark ? "#FFF" : "#111"}
                  fontSize="11"
                  fontWeight="bold"
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
      <Text style={styles.sectionTitle}>User Role Distribution</Text>
      <View
        style={[styles.chartCard, isDark ? styles.darkCard : styles.lightCard]}
      >
        <Svg height={120} width={chartWidth}>
          {userData.map((d, i) => {
            const barHeight = (d.val / maxUser) * 80;
            const barWidth = 36;
            const gap =
              (chartWidth - userData.length * barWidth) / (userData.length + 1);
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
                  rx={4}
                />
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 6}
                  fill={isDark ? "#FFF" : "#111"}
                  fontSize="11"
                  fontWeight="bold"
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

      {/* Engagement Stats Grid */}
      <Text style={styles.sectionTitle}>Social & System Engagement</Text>
      <View style={styles.metricGrid}>
        <View
          style={[
            styles.metricCard,
            isDark ? styles.darkCard : styles.lightCard,
          ]}
        >
          <Ionicons name="briefcase-outline" size={18} color="#006837" />
          <Text
            style={[
              styles.metricVal,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            {data.TotalJobApplications}
          </Text>
          <Text style={styles.metricLabel}>Applications</Text>
        </View>

        <View
          style={[
            styles.metricCard,
            isDark ? styles.darkCard : styles.lightCard,
          ]}
        >
          <Ionicons name="chatbubbles-outline" size={18} color="#0284C7" />
          <Text
            style={[
              styles.metricVal,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            {data.TotalDirectMessages}
          </Text>
          <Text style={styles.metricLabel}>Messages</Text>
        </View>

        <View
          style={[
            styles.metricCard,
            isDark ? styles.darkCard : styles.lightCard,
          ]}
        >
          <Ionicons name="document-text-outline" size={18} color="#D97706" />
          <Text
            style={[
              styles.metricVal,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            {data.TotalPosts}
          </Text>
          <Text style={styles.metricLabel}>Posts</Text>
        </View>

        <View
          style={[
            styles.metricCard,
            isDark ? styles.darkCard : styles.lightCard,
          ]}
        >
          <Ionicons name="heart-outline" size={18} color="#DC2626" />
          <Text
            style={[
              styles.metricVal,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            {data.TotalLikes}
          </Text>
          <Text style={styles.metricLabel}>Likes</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 10,
  },
  chartCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  xLabels: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 8,
  },
  chartLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "600" },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingBottom: 32,
  },
  metricCard: {
    width: "48%",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  metricVal: { fontSize: 18, fontWeight: "800", marginTop: 6 },
  metricLabel: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
