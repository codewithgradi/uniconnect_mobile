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
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";

// Matching your C# DTOs
export interface RecentApplicationStatusDto {
  ApplicationId: string; // Guid
  JobTitle: string;
  CompanyName: string;
  Status:
    | "Submitted"
    | "Under Review"
    | "Shortlisted"
    | "Interview Scheduled"
    | "Rejected"
    | string;
  AppliedAtUtc: string; // DateTime ISO string
}

export interface StudentAnalyticsDto {
  StudentId: string; // Guid
  AppliedJobsCount: number;
  BookmarkedJobsCount: number;
  TotalConnections: number;
  PendingConnectionRequests: number;
  TotalEndorsementsReceived: number;
  ProfileViewsCount: number;
  RecentApplications: RecentApplicationStatusDto[];
}

// Monthly activity graph payload
interface ActivityDataPoint {
  label: string;
  count: number;
}

// Mock Data structure
const MOCK_ANALYTICS: StudentAnalyticsDto = {
  StudentId: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  AppliedJobsCount: 14,
  BookmarkedJobsCount: 8,
  TotalConnections: 128,
  PendingConnectionRequests: 5,
  TotalEndorsementsReceived: 23,
  ProfileViewsCount: 142,
  RecentApplications: [
    {
      ApplicationId: "a1b2c3d4-0001",
      JobTitle: "Junior .NET Developer",
      CompanyName: "Entelect",
      Status: "Under Review",
      AppliedAtUtc: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      ApplicationId: "a1b2c3d4-0002",
      JobTitle: "Frontend Engineer (React)",
      CompanyName: "BBD Software",
      Status: "Shortlisted",
      AppliedAtUtc: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      ApplicationId: "a1b2c3d4-0003",
      JobTitle: "Full Stack Developer Intern",
      CompanyName: "Derivco",
      Status: "Interview Scheduled",
      AppliedAtUtc: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
  ],
};

// Graph data for recent application activity
const MOCK_GRAPH_DATA: ActivityDataPoint[] = [
  { label: "Apr", count: 2 },
  { label: "May", count: 4 },
  { label: "Jun", count: 1 },
  { label: "Jul", count: 6 },
  { label: "Aug", count: 3 },
  { label: "Sep", count: 5 },
];

export default function StudentAnalyticsScreen() {
  const isDark = useColorScheme() === "dark";
  const data = MOCK_ANALYTICS;
  const screenWidth = Dimensions.get("window").width - 72; // Padding adjustment

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "shortlisted":
      case "interview scheduled":
        return { bg: "#D1FAE5", text: "#065F46" };
      case "under review":
        return { bg: "#FEF3C7", text: "#92400E" };
      case "rejected":
        return { bg: "#FEE2E2", text: "#991B1B" };
      default:
        return { bg: "#E0E7FF", text: "#3730A3" };
    }
  };

  // Graph render helpers
  const maxVal = Math.max(...MOCK_GRAPH_DATA.map((d) => d.count), 1);
  const chartHeight = 140;
  const barWidth = 24;

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
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
            {data.ProfileViewsCount}
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
            {data.AppliedJobsCount}
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
            {data.TotalConnections}
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
            {data.TotalEndorsementsReceived}
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

          {MOCK_GRAPH_DATA.map((item, index) => {
            const barHeight = (item.count / maxVal) * (chartHeight - 30);
            const x =
              index * (screenWidth / MOCK_GRAPH_DATA.length) +
              screenWidth / MOCK_GRAPH_DATA.length / 4;
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

      {/* Recent Applications List */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Recent Applications</Text>
        <Text style={styles.totalCount}>
          {data.RecentApplications.length} Recent
        </Text>
      </View>

      <View style={styles.listContainer}>
        {data.RecentApplications.map((app) => {
          const statusStyle = getStatusStyle(app.Status);
          return (
            <View
              key={app.ApplicationId}
              style={[
                styles.appCard,
                isDark ? styles.darkCard : styles.lightCard,
              ]}
            >
              <View style={styles.appMainInfo}>
                <Text
                  style={[
                    styles.jobTitle,
                    isDark ? styles.darkText : styles.lightText,
                  ]}
                >
                  {app.JobTitle}
                </Text>
                <Text style={styles.companyName}>{app.CompanyName}</Text>
                <Text style={styles.appliedDate}>
                  Applied: {formatDate(app.AppliedAtUtc)}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusStyle.bg },
                ]}
              >
                <Text style={[styles.statusText, { color: statusStyle.text }]}>
                  {app.Status}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
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
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalCount: { fontSize: 12, color: "#6B7280", fontWeight: "600" },

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

  // Applications
  listContainer: { paddingBottom: 32 },
  appCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  appMainInfo: { flex: 1, paddingRight: 8 },
  jobTitle: { fontSize: 15, fontWeight: "700" },
  companyName: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
    fontWeight: "500",
  },
  appliedDate: { fontSize: 11, color: "#9CA3AF", marginTop: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: "700" },

  // Themes
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
