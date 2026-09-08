import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedInput } from "@/components/ThemedInput";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  systemHeadline: string;
  programme: string;
}

interface JobApplicationItem {
  id: string;
  applicantId: string;
  applicant: UserProfile;
  cvFileUrl: string;
  appliedAtUtc: string;
}

const PAGE_SIZE = 8;

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const [applicants, setApplicants] = useState<JobApplicationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchApplicants = async (pageNumber: number) => {
    if (loading) return;
    setLoading(true);

    try {
      setTimeout(() => {
        const mockApplicants: JobApplicationItem[] = Array.from(
          { length: PAGE_SIZE },
          (_, index) => {
            const globalIndex = (pageNumber - 1) * PAGE_SIZE + index + 1;
            return {
              id: `app-guid-${globalIndex}`,
              applicantId: `user-profile-guid-${globalIndex}`,
              applicant: {
                id: `user-profile-guid-${globalIndex}`,
                firstName: `Student ${globalIndex}`,
                lastName: `Candidate`,
                systemHeadline: "Aspiring Software Developer & CS Enthusiast",
                programme: "Computer Science",
              },
              cvFileUrl: "https://example.com/cv.pdf",
              appliedAtUtc: new Date().toISOString(),
            };
          },
        );

        if (pageNumber >= 3) {
          setHasMore(false);
        }

        setApplicants((prev) => [...prev, ...mockApplicants]);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchApplicants(1);
    }
  }, [id]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchApplicants(nextPage);
    }
  };

  const filteredApplicants = applicants.filter(
    (item) =>
      `${item.applicant.firstName} ${item.applicant.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.applicant.programme
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const renderApplicantItem = ({ item }: { item: JobApplicationItem }) => (
    <TouchableOpacity
      style={[
        styles.applicantCard,
        isDark ? styles.darkCard : styles.lightCard,
      ]}
      activeOpacity={0.7}
      onPress={() => router.push(`business/applicant/${item.applicant.id}` as any)}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {item.applicant.firstName[0]}
          {item.applicant.lastName[0]}
        </Text>
      </View>
      <View style={styles.applicantInfo}>
        <Text
          style={[
            styles.applicantName,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          {item.applicant.firstName} {item.applicant.lastName}
        </Text>
        <Text
          style={[
            styles.headline,
            isDark ? styles.darkSubText : styles.lightSubText,
          ]}
          numberOfLines={1}
        >
          {item.applicant.systemHeadline}
        </Text>
        <Text style={styles.programmeText}>{item.applicant.programme}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={isDark ? "#4B5563" : "#9CA3AF"}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
    >
      <FlatList
        data={filteredApplicants}
        keyExtractor={(item) => item.id}
        renderItem={renderApplicantItem}
        contentContainerStyle={styles.listContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.sectionTitle}>Opportunity Metadata</Text>
            <View
              style={[
                styles.oppInfoBox,
                isDark ? styles.darkCard : styles.lightCard,
              ]}
            >
              <Text
                style={[
                  styles.oppIdText,
                  isDark ? styles.darkSubText : styles.lightSubText,
                ]}
              >
                Identifier: {id}
              </Text>
              <Text
                style={[
                  styles.sectionHeader,
                  isDark ? styles.darkText : styles.lightText,
                ]}
              >
                Applicants List ({applicants.length}+)
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Filter Candidates</Text>
            <View style={styles.searchWrapper}>
              <ThemedInput
                placeholder="Search candidates by name..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        }
        ListFooterComponent={
          loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" color="#006837" />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  headerContainer: { marginBottom: 4 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 10,
  },
  oppInfoBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  oppIdText: {
    fontSize: 12,
    marginBottom: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "800",
  },
  searchWrapper: {
    marginBottom: 4,
  },
  listContainer: {
    paddingBottom: 32,
  },
  applicantCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 10,
  },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#00683722",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#006837",
    fontWeight: "800",
    fontSize: 15,
  },
  applicantInfo: {
    flex: 1,
    marginRight: 8,
  },
  applicantName: {
    fontSize: 15,
    fontWeight: "800",
  },
  headline: {
    fontSize: 13,
    marginTop: 2,
  },
  programmeText: {
    fontSize: 11,
    color: "#006837",
    fontWeight: "700",
    marginTop: 4,
  },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
  lightSubText: { color: "#6B7280" },
  darkSubText: { color: "#9CA3AF" },
  loader: { marginVertical: 16 },
});
