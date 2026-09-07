import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";
import { useStudentAnalytics } from "@/api/hooks/useUserAnalytics"; // Adjust path to your TanStack query hook

export default function StudentAnalyticsScreen() {
  const isDark = useColorScheme() === "dark";
  const screenWidth = Dimensions.get("window").width - 72; // Padding adjustment

  // Replace with the logged-in student's actual user/student ID from your auth state/context
  const studentId = "7c9e6679-7425-40de-944b-e07fc1f90ae7";

  const { data, isLoading, error } = useStudentAnalytics(studentId);

  // Map the recent applications received from the API into monthly velocity data points for the graph
  const getMonthlyVelocityData = (
    applications: Array<{ appliedAtUtc: string }>,
  ) => {
    const counts: { [key: string]: number } = {};

    // Initialize last 6 months or default labels if empty
    applications.forEach((app) => {
      const date = new Date(app.appliedAtUtc);
      const monthLabel = date.toLocaleString("en-ZA", { month: "short" });
      counts[monthLabel] = (counts[monthLabel] || 0) + 1;
    });

    const formattedData = Object.keys(counts).map((label) => ({
      label,
      count: counts[label],
    }));

    // Fallback if no application history exists yet
    if (formattedData.length === 0) {
      return [
        { label: "Apr", count: 0 },
        { label: "May", count: 0 },
        { label: "Jun", count: 0 },
        { label: "Jul", count: 0 },
        { label: "Aug", count: 0 },
        { label: "Sep", count: 0 },
      ];
    }

    return formattedData;
  };

  const graphData = data ? getMonthlyVelocityData(data.recentApplications) : [];
  const maxVal = Math.max(...graphData.map((d) => d.count), 1);
  const chartHeight = 140;
  const barWidth = 24;

  if (isLoading) {
    return (
      <View
        style={[
          styles.centerContainer,
          isDark ? styles.darkBg : styles.lightBg,
        ]}
      >
        <ActivityIndicator size="large" color="#006837" />
        <Text style={[styles.mutedText, { marginTop: 12 }]}>
          Loading analytics...
        </Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View
        style={[
          styles.centerContainer,
          isDark ? styles.darkBg : styles.lightBg,
        ]}
      >
        <Text style={styles.errorText}>Failed to load student analytics.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Overview Grid */}
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.grid}>
        <View
          style={[styles.statCard, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View style={[styles.iconBadge, { backgroundColor: "#E6F0EB" }]}>
            <Ionicons name="eye-outline" size={20} color="#006837" />
          </View>
          <Text
            style={[
              styles.statValue,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            {data.profileViewsCount}
          </Text>
          <Text style={styles.statLabel}>Profile Views</Text>
        </View>

        <View
          style={[styles.statCard, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View style={[styles.iconBadge, { backgroundColor: "#E0F2FE" }]}>
            <Ionicons name="briefcase-outline" size={20} color="#0284C7" />
          </View>
          <Text
            style={[
              styles.statValue,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            {data.appliedJobsCount}
          </Text>
          <Text style={styles.statLabel}>Jobs Applied</Text>
        </View>

        <View
          style={[styles.statCard, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View style={[styles.iconBadge, { backgroundColor: "#F3E8FF" }]}>
            <Ionicons name="people-outline" size={20} color="#7C3AED" />
          </View>
          <Text
            style={[
              styles.statValue,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            {data.totalConnections}
          </Text>
          <Text style={styles.statLabel}>Connections</Text>
        </View>

        <View
          style={[styles.statCard, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View style={[styles.iconBadge, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="star-outline" size={20} color="#D97706" />
          </View>
          <Text
            style={[
              styles.statValue,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            {data.totalEndorsementsReceived}
          </Text>
          <Text style={styles.statLabel}>Endorsements</Text>
        </View>
      </View>

      {/* Application Activity Graph */}
      <Text style={styles.sectionTitle}>Application Velocity</Text>
      <View
        style={[styles.chartCard, isDark ? styles.darkCard : styles.lightCard]}
      >
        <Text
          style={[
            styles.chartHeader,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Monthly Submissions
        </Text>
        <Svg height={chartHeight + 30} width={screenWidth}>
          {/* Baseline Grid Line */}
          <Line
            x1="0"
            y1={chartHeight}
            x2={screenWidth}
            y2={chartHeight}
            stroke={isDark ? "#374151" : "#E5E7EB"}
            strokeWidth="1"
          />

          {graphData.map((item, index) => {
            const barHeight = (item.count / maxVal) * (chartHeight - 30);
            const x =
              index * (screenWidth / graphData.length) +
              screenWidth / graphData.length / 4;
            const y = chartHeight - barHeight;

            return (
              <React.Fragment key={item.label}>
                {/* Bar Value */}
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 6}
                  fill={isDark ? "#9CA3AF" : "#6B7280"}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {item.count}
                </SvgText>

                {/* SVG Bar */}
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#006837"
                  rx="4"
                />

                {/* Month Label */}
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight + 20}
                  fill={isDark ? "#9CA3AF" : "#6B7280"}
                  fontSize="12"
                  textAnchor="middle"
                >
                  {item.label}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 10,
  },

  // Grid
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: { width: "48%", padding: 16, borderRadius: 12, borderWidth: 1 },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: { fontSize: 22, fontWeight: "800", marginBottom: 2 },
  statLabel: { fontSize: 13, color: "#6B7280", fontWeight: "500" },

  // Graph Card
  chartCard: { padding: 16, borderRadius: 12, borderWidth: 1, marginTop: 4 },
  chartHeader: { fontSize: 15, fontWeight: "700", marginBottom: 12 },

  // Themes & States
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
  mutedText: { color: "#9CA3AF", fontSize: 14 },
  errorText: { color: "#EF4444", fontSize: 14 },
});
