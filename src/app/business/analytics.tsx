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

export interface JobListingPerformanceDto {
  OpportunityId: string;
  Title: string;
  ApplicantCount: number;
  PostedAtUtc: string;
  Status: "Active" | "Closed" | "Draft" | string;
}

export interface BusinessAnalyticsDto {
  BusinessId: string;
  ActiveJobListings: number;
  TotalJobPostings: number;
  TotalApplicantsReceived: number;
  PendingApplicantReviews: number;
  ShortlistedCandidatesCount: number;
  ProfileViewsCount: number;
  TopListings: JobListingPerformanceDto[];
}

const MOCK_BUSINESS_ANALYTICS: BusinessAnalyticsDto = {
  BusinessId: "e8a719d3-3891-4e42-b054-61b6c0e81f18",
  ActiveJobListings: 8,
  TotalJobPostings: 14,
  TotalApplicantsReceived: 184,
  PendingApplicantReviews: 32,
  ShortlistedCandidatesCount: 19,
  ProfileViewsCount: 640,
  TopListings: [
    {
      OpportunityId: "b101",
      Title: "Flutter Intern",
      ApplicantCount: 68,
      PostedAtUtc: new Date(Date.now() - 86400000 * 12).toISOString(),
      Status: "Active",
    },
    {
      OpportunityId: "b102",
      Title: ".NET Backend Dev",
      ApplicantCount: 52,
      PostedAtUtc: new Date(Date.now() - 86400000 * 20).toISOString(),
      Status: "Active",
    },
    {
      OpportunityId: "b103",
      Title: "UI/UX Designer",
      ApplicantCount: 41,
      PostedAtUtc: new Date(Date.now() - 86400000 * 30).toISOString(),
      Status: "Active",
    },
    {
      OpportunityId: "b104",
      Title: "Data Analyst",
      ApplicantCount: 23,
      PostedAtUtc: new Date(Date.now() - 86400000 * 45).toISOString(),
      Status: "Closed",
    },
  ],
};

export default function BusinessAnalyticsScreen() {
  const isDark = useColorScheme() === "dark";
  const data = MOCK_BUSINESS_ANALYTICS;
  const screenWidth = Dimensions.get("window").width - 72;

  // Graph 1: Applicant Funnel Metrics
  const funnelData = [
    { label: "Total", count: data.TotalApplicantsReceived, color: "#0284C7" },
    { label: "Pending", count: data.PendingApplicantReviews, color: "#D97706" },
    {
      label: "Shortlisted",
      count: data.ShortlistedCandidatesCount,
      color: "#006837",
    },
  ];
  const maxFunnel = Math.max(...funnelData.map((d) => d.count), 1);

  // Graph 2: Top Listings Applicants Comparison
  const maxListingsCount = Math.max(
    ...data.TopListings.map((l) => l.ApplicantCount),
    1,
  );

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
    >
      {/* Overview Metric Cards */}
      <Text style={styles.sectionTitle}>Performance Overview</Text>
      <View style={styles.grid}>
        <View
          style={[styles.statCard, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View style={[styles.iconBadge, { backgroundColor: "#E6F0EB" }]}>
            <Ionicons name="briefcase-outline" size={20} color="#006837" />
          </View>
          <Text
            style={[
              styles.statValue,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            {data.ActiveJobListings}
          </Text>
          <Text style={styles.statLabel}>Active Listings</Text>
        </View>

        <View
          style={[styles.statCard, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View style={[styles.iconBadge, { backgroundColor: "#E0F2FE" }]}>
            <Ionicons name="people-outline" size={20} color="#0284C7" />
          </View>
          <Text
            style={[
              styles.statValue,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            {data.TotalApplicantsReceived}
          </Text>
          <Text style={styles.statLabel}>Total Applicants</Text>
        </View>

        <View
          style={[styles.statCard, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View style={[styles.iconBadge, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="time-outline" size={20} color="#D97706" />
          </View>
          <Text
            style={[
              styles.statValue,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            {data.PendingApplicantReviews}
          </Text>
          <Text style={styles.statLabel}>Pending Review</Text>
        </View>

        <View
          style={[styles.statCard, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View style={[styles.iconBadge, { backgroundColor: "#F3E8FF" }]}>
            <Ionicons name="eye-outline" size={20} color="#7C3AED" />
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
      </View>

      {/* GRAPH 1: Candidate Conversion Funnel */}
      <Text style={styles.sectionTitle}>Recruitment Funnel</Text>
      <View
        style={[styles.chartCard, isDark ? styles.darkCard : styles.lightCard]}
      >
        <Text
          style={[
            styles.chartHeader,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Candidate Stage Breakdown
        </Text>
        <Svg height={150} width={screenWidth}>
          <Line
            x1="0"
            y1={120}
            x2={screenWidth}
            y2={120}
            stroke={isDark ? "#374151" : "#E5E7EB"}
            strokeWidth="1"
          />
          {funnelData.map((item, index) => {
            const barHeight = (item.count / maxFunnel) * 85;
            const x = index * (screenWidth / 3) + (screenWidth / 6 - 20);
            const y = 120 - barHeight;

            return (
              <React.Fragment key={item.label}>
                <SvgText
                  x={x + 20}
                  y={y - 6}
                  fill={isDark ? "#9CA3AF" : "#6B7280"}
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {item.count}
                </SvgText>
                <Rect
                  x={x}
                  y={y}
                  width={40}
                  height={barHeight}
                  fill={item.color}
                  rx="6"
                />
                <SvgText
                  x={x + 20}
                  y={138}
                  fill={isDark ? "#9CA3AF" : "#6B7280"}
                  fontSize="11"
                  textAnchor="middle"
                >
                  {item.label}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      {/* GRAPH 2: Top Listing Volume Comparison */}
      <Text style={styles.sectionTitle}>Listing Performance</Text>
      <View
        style={[styles.chartCard, isDark ? styles.darkCard : styles.lightCard]}
      >
        <Text
          style={[
            styles.chartHeader,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Applicants per Top Listing
        </Text>
        <Svg height={data.TopListings.length * 36 + 10} width={screenWidth}>
          {data.TopListings.map((listing, index) => {
            const barWidth =
              (listing.ApplicantCount / maxListingsCount) * (screenWidth - 120);
            const y = index * 36;

            return (
              <React.Fragment key={listing.OpportunityId}>
                <SvgText
                  x={0}
                  y={y + 16}
                  fill={isDark ? "#E5E7EB" : "#374151"}
                  fontSize="11"
                  fontWeight="600"
                >
                  {listing.Title.length > 14
                    ? `${listing.Title.substring(0, 12)}...`
                    : listing.Title}
                </SvgText>
                <Rect
                  x={100}
                  y={y + 4}
                  width={barWidth}
                  height={18}
                  fill="#006837"
                  rx="4"
                />
                <SvgText
                  x={108 + barWidth}
                  y={y + 17}
                  fill={isDark ? "#9CA3AF" : "#6B7280"}
                  fontSize="10"
                  fontWeight="bold"
                >
                  {listing.ApplicantCount}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      {/* Top Listings Summary Table */}
      <Text style={styles.sectionTitle}>Top Opportunity Listings</Text>
      <View style={styles.listContainer}>
        {data.TopListings.map((listing) => (
          <View
            key={listing.OpportunityId}
            style={[
              styles.listingCard,
              isDark ? styles.darkCard : styles.lightCard,
            ]}
          >
            <View>
              <Text
                style={[
                  styles.listingTitle,
                  isDark ? styles.darkText : styles.lightText,
                ]}
              >
                {listing.Title}
              </Text>
              <Text style={styles.listingSub}>
                {listing.ApplicantCount} total applicants
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    listing.Status === "Active" ? "#D1FAE5" : "#E5E7EB",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: listing.Status === "Active" ? "#065F46" : "#374151",
                  },
                ]}
              >
                {listing.Status}
              </Text>
            </View>
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 10,
  },
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
  chartCard: { padding: 16, borderRadius: 12, borderWidth: 1, marginTop: 4 },
  chartHeader: { fontSize: 15, fontWeight: "700", marginBottom: 12 },
  listContainer: { paddingBottom: 32 },
  listingCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listingTitle: { fontSize: 14, fontWeight: "700" },
  listingSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: "700" },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
