import React, { useEffect } from "react";
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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import {
  useBusinessAnalytics,
  BusinessAnalyticsDto,
} from "@/api/hooks/useUserAnalytics";

interface BusinessAnalyticsScreenProps {
  userId: string;
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

  const data: BusinessAnalyticsDto | null = apiData ?? null;

  // Futuristic Entrance Animation
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.95);

  useEffect(() => {
    if (!isLoading && data) {
      fadeAnim.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      });
      scaleAnim.value = withSpring(1, { damping: 12, stiffness: 100 });
    }
  }, [isLoading, data]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: scaleAnim.value }],
  }));

  if (isLoading) {
    return (
      <View
        style={[
          styles.centerContainer,
          isDark ? styles.darkBg : styles.lightBg,
        ]}
      >
        <ActivityIndicator size="large" color="#00FF66" />
        <Text
          style={[
            styles.loadingText,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          SYNCING NEURAL ANALYTICS...
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
        <Ionicons name="pulse-outline" size={48} color="#FF3366" />
        <Text
          style={[
            styles.errorTitle,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          TELEMETRY FAILURE
        </Text>
        <Text style={styles.errorSubText}>
          {error ? error.message : "Data stream disrupted."}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>RE-ESTABLISH LINK</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const funnelData = [
    { label: "TOTAL", count: data.totalApplicantsReceived, color: "#00E5FF" },
    {
      label: "SHORTLIST",
      count: data.shortlistedCandidatesCount,
      color: "#00FF66",
    },
  ];
  const maxFunnel = Math.max(...funnelData.map((d) => d.count), 1);

  const maxListingsCount = Math.max(
    ...data.topListings.map((l) => l.applicantCount),
    1,
  );

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={[animatedContainerStyle, { paddingBottom: 32 }]}>
        {/* Core Metrics Grid */}
        <Text style={styles.sectionTitle}>// CORE_TELEMETRY</Text>
        <View style={styles.grid}>
          <View
            style={[
              styles.statCard,
              isDark ? styles.darkCard : styles.lightCard,
            ]}
          >
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: "rgba(0, 255, 102, 0.1)" },
              ]}
            >
              <Ionicons name="terminal-outline" size={20} color="#00FF66" />
            </View>
            <Text
              style={[
                styles.statValue,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              {data.activeJobListings}
            </Text>
            <Text style={styles.statLabel}>ACTIVE NODES</Text>
          </View>

          <View
            style={[
              styles.statCard,
              isDark ? styles.darkCard : styles.lightCard,
            ]}
          >
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: "rgba(0, 229, 255, 0.1)" },
              ]}
            >
              <Ionicons name="git-network-outline" size={20} color="#00E5FF" />
            </View>
            <Text
              style={[
                styles.statValue,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              {data.totalApplicantsReceived}
            </Text>
            <Text style={styles.statLabel}>INBOUND STREAM</Text>
          </View>
        </View>

        {/* GRAPH 1: Recruitment Funnel */}
        <Text style={styles.sectionTitle}>// CONVERSION_MATRIX</Text>
        <View
          style={[
            styles.chartCard,
            isDark ? styles.darkCard : styles.lightCard,
          ]}
        >
          <Text
            style={[
              styles.chartHeader,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Stage Distribution Protocol
          </Text>
          <Svg height={150} width={screenWidth}>
            <Line
              x1="0"
              y1={120}
              x2={screenWidth}
              y2={120}
              stroke={isDark ? "#1F2937" : "#E5E7EB"}
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            {funnelData.map((item, index) => {
              const barHeight = (item.count / maxFunnel) * 85;
              const x = index * (screenWidth / 2) + (screenWidth / 4 - 20);
              const y = 120 - barHeight;

              return (
                <React.Fragment key={item.label}>
                  <SvgText
                    x={x + 20}
                    y={y - 6}
                    fill={isDark ? "#00FF66" : "#006837"}
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
                    rx="2"
                  />
                  <SvgText
                    x={x + 20}
                    y={138}
                    fill={isDark ? "#9CA3AF" : "#6B7280"}
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {item.label}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        </View>

        {/* GRAPH 2: Listing Performance */}
        <Text style={styles.sectionTitle}>// NODE_LOAD_ANALYTICS</Text>
        <View
          style={[
            styles.chartCard,
            isDark ? styles.darkCard : styles.lightCard,
          ]}
        >
          <Text
            style={[
              styles.chartHeader,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Throughput per Primary Node
          </Text>
          <Svg
            height={Math.max(data.topListings.length * 36 + 10, 40)}
            width={screenWidth}
          >
            {data.topListings.map((listing, index) => {
              const barWidth =
                (listing.applicantCount / maxListingsCount) *
                (screenWidth - 120);
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
                    fill="#00FF66"
                    rx="2"
                  />
                  <SvgText
                    x={108 + barWidth}
                    y={y + 17}
                    fill={isDark ? "#00FF66" : "#006837"}
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
        <Text style={styles.sectionTitle}>// ACTIVE_VECTORS</Text>
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
                  {listing.applicantCount} units synchronized
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      listing.status === "Active"
                        ? "rgba(0, 255, 102, 0.15)"
                        : "rgba(255, 255, 255, 0.05)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        listing.status === "Active" ? "#00FF66" : "#9CA3AF",
                    },
                  ]}
                >
                  {listing.status.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>
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
  lightBg: { backgroundColor: "#F4F6F9" },
  darkBg: { backgroundColor: "#030712" },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#00E5FF",
    letterSpacing: 1.5,
    marginTop: 24,
    marginBottom: 10,
  },
  grid: { flexDirection: "row", gap: 12 },
  statCard: { flex: 1, padding: 16, borderRadius: 8, borderWidth: 1 },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "700",
    letterSpacing: 1,
  },
  chartCard: { padding: 16, borderRadius: 8, borderWidth: 1, marginTop: 4 },
  chartHeader: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  listContainer: { paddingBottom: 12 },
  listingCard: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listingTitle: { fontSize: 13, fontWeight: "700" },
  listingSub: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 2,
    fontFamily: "monospace",
  },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  lightCard: { backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#0B0F19", borderColor: "#1F2937" },
  lightText: { color: "#111827" },
  darkText: { color: "#F9FAFB" },
  loadingText: {
    marginTop: 12,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#00FF66",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 12,
    textAlign: "center",
    letterSpacing: 1,
    color: "#FF3366",
  },
  errorSubText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#00FF66",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  retryButtonText: {
    color: "#00FF66",
    fontWeight: "700",
    fontSize: 11,
    letterSpacing: 1,
  },
});
