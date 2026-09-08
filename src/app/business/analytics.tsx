import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";
import {
  useBusinessAnalytics,
  BusinessAnalyticsDto,
  JobListingPerformanceDto,
} from "@/api/hooks/useUserAnalytics"; // Update path if needed

interface BusinessAnalyticsScreenProps {
  userId: string; // Pass the current user's ID to fetch specific analytics
}

export default function BusinessAnalyticsScreen({
  userId,
}: BusinessAnalyticsScreenProps) {
  const isDark = useColorScheme() === "dark";
  const screenWidth = Dimensions.get("window").width - 72;

  const {
    data: apiData,
    isLoading,
    error,
    refetch,
  } = useBusinessAnalytics(userId);

  // Directly assign apiData to data since it already matches BusinessAnalyticsDto
  const data: BusinessAnalyticsDto | null = apiData ?? null;

  if (isLoading) {
    return (
      <View
        style={[
          styles.centerContainer,
          isDark ? styles.darkBg : styles.lightBg,
        ]}
      >
        <ActivityIndicator size="large" color="#006837" />
        <Text
          style={[
            styles.loadingText,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Loading business analytics...
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
        <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
        <Text
          style={[
            styles.errorTitle,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Could not load analytics
        </Text>
        <Text style={styles.errorSubText}>
          {error ? error.message : "No analytics data available."}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Graph 1: Applicant Funnel Metrics
  const funnelData = [
    { label: "Total", count: data.totalApplicantsReceived, color: "#0284C7" },
    { label: "Pending", count: data.pendingApplicantReviews, color: "#D97706" },
    {
      label: "Shortlisted",
      count: data.shortlistedCandidatesCount,
      color: "#006837",
    },
  ];
  const maxFunnel = Math.max(...funnelData.map((d) => d.count), 1);

  // Graph 2: Top Listings Applicants Comparison
  const maxListingsCount = Math.max(
    ...data.topListings.map((l) => l.applicantCount),
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
            {data.activeJobListings}
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
            {data.totalApplicantsReceived}
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
            {data.pendingApplicantReviews}
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
            {data.profileViewsCount}
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
        <Svg
          height={Math.max(data.topListings.length * 36 + 10, 40)}
          width={screenWidth}
        >
          {data.topListings.map((listing, index) => {
            const barWidth =
              (listing.applicantCount / maxListingsCount) * (screenWidth - 120);
            const y = index * 36;

            return (
              <React.Fragment key={listing.opportunityId}>
                <SvgText
                  x={0}
                  y={y + 16}
                  fill={isDark ? "#E5E7EB" : "#374151"}
                  fontSize="11"
                  fontWeight="600"
                >
                  {listing.title.length > 14
                    ? `${listing.title.substring(0, 12)}...`
                    : listing.title}
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
                  {listing.applicantCount}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      {/* Top Listings Summary Table */}
      <Text style={styles.sectionTitle}>Top Opportunity Listings</Text>
      <View style={styles.listContainer}>
        {data.topListings.map((listing) => (
          <View
            key={listing.opportunityId}
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
                {listing.title}
              </Text>
              <Text style={styles.listingSub}>
                {listing.applicantCount} total applicants
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    listing.status === "Active" ? "#D1FAE5" : "#E5E7EB",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: listing.status === "Active" ? "#065F46" : "#374151",
                  },
                ]}
              >
                {listing.status}
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
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
  loadingText: { marginTop: 12, fontSize: 14 },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    textAlign: "center",
  },
  errorSubText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#006837",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: { color: "#FFFFFF", fontWeight: "600" },
});
