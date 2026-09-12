import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useQueryClient } from "@tanstack/react-query";
import { useStudentAnalytics } from "@/api/hooks/useUserAnalytics";

export default function StudentAnalyticsScreen() {
  const isDark = useColorScheme() === "dark";
  const screenWidth = Dimensions.get("window").width - 72;
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  // Backend automatically identifies the student from the JWT token claims
  const { data, isLoading, error, refetch } = useStudentAnalytics();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["student-analytics"] });
    await refetch();
    setRefreshing(false);
  }, [queryClient, refetch]);

  const getMonthlyVelocityData = (
    applications: Array<{ appliedAtUtc: string }>,
  ) => {
    const counts: { [key: string]: number } = {};

    applications?.forEach((app) => {
      const date = new Date(app.appliedAtUtc);
      const monthLabel = date.toLocaleString("en-ZA", { month: "short" });
      counts[monthLabel] = (counts[monthLabel] || 0) + 1;
    });

    return Object.keys(counts).map((label) => ({
      label,
      count: counts[label],
    }));
  };

  const graphData = data ? getMonthlyVelocityData(data.recentApplications) : [];
  const maxVal = Math.max(...graphData.map((d) => d.count), 1);
  const chartHeight = 140;
  const barWidth = 24;

  if (isLoading && !refreshing) {
    return (
      <View
        style={[
          styles.centerContainer,
          isDark ? styles.darkBg : styles.lightBg,
        ]}
      >
        <ActivityIndicator size="large" color="#00E599" />
        <Text style={[styles.mutedText, { marginTop: 12 }]}>
          Syncing neural analytics...
        </Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.centerContainer,
          { flexGrow: 1 },
          isDark ? styles.darkBg : styles.lightBg,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00E599"
          />
        }
      >
        <Ionicons name="pulse-outline" size={40} color="#FF5C5C" />
        <Text style={[styles.errorText, { marginTop: 12 }]}>
          Failed to stream analytics telemetry. Pull down to retry.
        </Text>
      </ScrollView>
    );
  }

  const secondaryGraphData = [
    { label: "Applied Jobs", count: data.appliedJobsCount },
    { label: "Connections", count: data.totalConnections },
  ];
  const maxSecondaryVal = Math.max(
    ...secondaryGraphData.map((d) => d.count),
    1,
  );

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#00E599"
        />
      }
    >
      {/* Overview Section */}
      <Animated.Text
        entering={FadeInDown.duration(400).springify()}
        style={styles.sectionTitle}
      >
        Telemetry Overview
      </Animated.Text>

      <View style={styles.grid}>
        <Animated.View
          entering={FadeInDown.delay(100).duration(500).springify()}
          style={[styles.statCard, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View
            style={[
              styles.iconBadge,
              {
                backgroundColor: isDark ? "rgba(56, 189, 248, 0.1)" : "#E0F2FE",
              },
            ]}
          >
            <Ionicons name="briefcase-outline" size={20} color="#38BDF8" />
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
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(500).springify()}
          style={[styles.statCard, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View
            style={[
              styles.iconBadge,
              {
                backgroundColor: isDark ? "rgba(168, 85, 247, 0.1)" : "#F3E8FF",
              },
            ]}
          >
            <Ionicons name="people-outline" size={20} color="#A855F7" />
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
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(500).springify()}
          style={[styles.statCard, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View
            style={[
              styles.iconBadge,
              {
                backgroundColor: isDark ? "rgba(0, 229, 153, 0.1)" : "#E6F0EB",
              },
            ]}
          >
            <Ionicons name="document-text-outline" size={20} color="#00E599" />
          </View>
          <Text
            style={[
              styles.statValue,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            {data.recentApplications?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Submissions</Text>
        </Animated.View>
      </View>

      {/* Application Velocity Chart Section */}
      <Animated.Text
        entering={FadeInDown.delay(400).duration(400).springify()}
        style={styles.sectionTitle}
      >
        Application Velocity
      </Animated.Text>

      <Animated.View
        entering={FadeInUp.delay(500).duration(600).springify()}
        style={[styles.chartCard, isDark ? styles.darkCard : styles.lightCard]}
      >
        <View style={styles.chartHeaderRow}>
          <Text
            style={[
              styles.chartHeader,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Monthly Submissions
          </Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live Stream</Text>
          </View>
        </View>

        {graphData.length === 0 ? (
          <View style={styles.emptyGraphContainer}>
            <Ionicons
              name="pulse"
              size={32}
              color={isDark ? "#374151" : "#D1D5DB"}
            />
            <Text style={[styles.mutedText, { marginTop: 8 }]}>
              No transmission history detected yet.
            </Text>
          </View>
        ) : (
          <Svg height={chartHeight + 30} width={screenWidth}>
            <Line
              x1="0"
              y1={chartHeight}
              x2={screenWidth}
              y2={chartHeight}
              stroke={isDark ? "#1F2937" : "#E5E7EB"}
              strokeWidth="1.5"
            />

            {graphData.map((item, index) => {
              const barHeight = Math.max(
                (item.count / maxVal) * (chartHeight - 30),
                8,
              );
              const x =
                index * (screenWidth / graphData.length) +
                screenWidth / graphData.length / 4;
              const y = chartHeight - barHeight;

              return (
                <React.Fragment key={item.label}>
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - 8}
                    fill={isDark ? "#9CA3AF" : "#6B7280"}
                    fontSize="10"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {item.count}
                  </SvgText>

                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill="#00E599"
                    rx="6"
                  />

                  <SvgText
                    x={x + barWidth / 2}
                    y={chartHeight + 20}
                    fill={isDark ? "#9CA3AF" : "#6B7280"}
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {item.label}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        )}
      </Animated.View>

      {/* Secondary Engagement Distribution Chart */}
      <Animated.Text
        entering={FadeInDown.delay(550).duration(400).springify()}
        style={styles.sectionTitle}
      >
        Engagement Distribution
      </Animated.Text>

      <Animated.View
        entering={FadeInUp.delay(600).duration(600).springify()}
        style={[styles.chartCard, isDark ? styles.darkCard : styles.lightCard]}
      >
        <View style={styles.chartHeaderRow}>
          <Text
            style={[
              styles.chartHeader,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Network vs Applications
          </Text>
        </View>

        <Svg height={chartHeight + 30} width={screenWidth}>
          <Line
            x1="0"
            y1={chartHeight}
            x2={screenWidth}
            y2={chartHeight}
            stroke={isDark ? "#1F2937" : "#E5E7EB"}
            strokeWidth="1.5"
          />

          {secondaryGraphData.map((item, index) => {
            const barHeight = Math.max(
              (item.count / maxSecondaryVal) * (chartHeight - 30),
              8,
            );
            const x =
              index * (screenWidth / secondaryGraphData.length) +
              screenWidth / secondaryGraphData.length / 3;
            const y = chartHeight - barHeight;
            const barColor = index === 0 ? "#38BDF8" : "#A855F7";

            return (
              <React.Fragment key={item.label}>
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 8}
                  fill={isDark ? "#9CA3AF" : "#6B7280"}
                  fontSize="10"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {item.count}
                </SvgText>

                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={barColor}
                  rx="6"
                />

                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight + 20}
                  fill={isDark ? "#9CA3AF" : "#6B7280"}
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {item.label}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
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
  lightBg: { backgroundColor: "#F8FAFC" },
  darkBg: { backgroundColor: "#0A0F1D" },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginTop: 24,
    marginBottom: 12,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: {
    width: "31%",
    flexGrow: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  statLabel: { fontSize: 11, color: "#64748B", fontWeight: "600" },
  chartCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
  chartHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartHeader: { fontSize: 15, fontWeight: "800", letterSpacing: -0.3 },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 229, 153, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#00E599",
  },
  liveText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#00E599",
    letterSpacing: 0.2,
  },
  emptyGraphContainer: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  lightCard: { backgroundColor: "#FFFFFF", borderColor: "#F1F5F9" },
  darkCard: { backgroundColor: "#111827", borderColor: "#1F2937" },
  lightText: { color: "#0F172A" },
  darkText: { color: "#F8FAFC" },
  mutedText: { color: "#64748B", fontSize: 13, fontWeight: "500" },
  errorText: {
    color: "#FF5C5C",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});
