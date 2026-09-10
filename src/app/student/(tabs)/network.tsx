import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  getMyConnections,
  getPendingRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection,
} from "@/api/hooks/useConnection";
import { useSearchProfiles, useProfileById } from "@/api/hooks/useProfile";

// Small component to fetch and render request user details safely when requester object is null
function PendingRequestRow({
  item,
  isDark,
  onAccept,
  onReject,
  acceptPending,
  rejectPending,
}: {
  item: any;
  isDark: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  acceptPending: boolean;
  rejectPending: boolean;
}) {
  const router = useRouter();

  // Fall back to fetching profile if item.requester is null/empty
  const shouldFetchProfile = !item?.requester || !item.requester.firstName;
  const { data: fetchedProfile } = useProfileById(
    shouldFetchProfile ? item?.requesterId : "",
  );

  const requester = item?.requester || fetchedProfile || {};
  const firstName = requester.firstName || "";
  const lastName = requester.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Loading User...";
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}` || "U";
  const role =
    requester.headline ||
    requester.programme ||
    requester.institution ||
    "Student / Alum";

  return (
    <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() =>
          router.push(`/student/profile/${item.requesterId}` as any)
        }
      >
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitials}>{initials}</Text>
        </View>
        <View style={styles.info}>
          <Text
            style={[styles.name, isDark ? styles.darkText : styles.lightText]}
          >
            {fullName}
          </Text>
          <Text style={styles.role}>{role}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.acceptBtn}
          onPress={() => onAccept(item.requesterId)}
          disabled={acceptPending}
        >
          <Ionicons name="checkmark" size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectBtn}
          onPress={() => onReject(item.requesterId)}
          disabled={rejectPending}
        >
          <Ionicons name="close" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function NetworkScreen() {
  const isDark = useColorScheme() === "dark";
  const [activeTab, setActiveTab] = useState<
    "People" | "Requests" | "Connections"
  >("People");

  const router = useRouter();

  // Search state for People directory tab
  const [searchItem, setSearchItem] = useState("");
  const [targetProgramme, setTargetProgramme] = useState("");

  const queryClient = useQueryClient();

  // Queries for real data
  const { data: connections = [], isLoading: isLoadingConnections } = useQuery({
    queryKey: ["connections"],
    queryFn: getMyConnections,
  });

  const { data: requests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ["connectionRequestsPending"],
    queryFn: getPendingRequests,
  });

  // Query for searching profiles directory using the unified custom hook
  const { data: profiles = [], isLoading: isLoadingProfiles } =
    useSearchProfiles({
      searchItem,
      targetProgramme,
    });

  // Mutations for actions
  const acceptMutation = useMutation({
    mutationFn: acceptConnectionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["connectionRequestsPending"],
      });
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
    onError: (err: any) => {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to accept request.",
      );
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectConnectionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["connectionRequestsPending"],
      });
    },
    onError: (err: any) => {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to reject request.",
      );
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
    onError: (err: any) => {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to remove connection.",
      );
    },
  });

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Header Tabs */}
      <View style={styles.tabContainer}>
        {(["People", "Requests", "Connections"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content Rendering */}
      {activeTab === "Requests" && (
        <View>
          <Text
            style={[
              styles.sectionTitle,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Connection Requests ({requests.length})
          </Text>

          {isLoadingRequests ? (
            <ActivityIndicator
              size="small"
              color="#006837"
              style={{ marginTop: 20 }}
            />
          ) : requests.length === 0 ? (
            <Text
              style={[
                styles.emptyText,
                isDark ? styles.darkMuted : styles.lightMuted,
              ]}
            >
              No pending connection requests.
            </Text>
          ) : (
            requests.map((item) => (
              <PendingRequestRow
                key={item.id}
                item={item}
                isDark={isDark}
                onAccept={(id) => acceptMutation.mutate(id)}
                onReject={(id) => rejectMutation.mutate(id)}
                acceptPending={acceptMutation.isPending}
                rejectPending={rejectMutation.isPending}
              />
            ))
          )}
        </View>
      )}

      {activeTab === "Connections" && (
        <View>
          <Text
            style={[
              styles.sectionTitle,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            My Connections ({connections.length})
          </Text>

          {isLoadingConnections ? (
            <ActivityIndicator
              size="small"
              color="#006837"
              style={{ marginTop: 20 }}
            />
          ) : connections.length === 0 ? (
            <Text
              style={[
                styles.emptyText,
                isDark ? styles.darkMuted : styles.lightMuted,
              ]}
            >
              You haven't added any connections yet.
            </Text>
          ) : (
            connections.map((item) => {
              const firstName = item?.firstName || "";
              const lastName = item?.lastName || "";
              const fullName =
                `${firstName} ${lastName}`.trim() || "Unknown User";
              const initials =
                `${firstName?.[0] || ""}${lastName?.[0] || ""}` || "U";

              return (
                <View
                  key={item.id}
                  style={[
                    styles.card,
                    isDark ? styles.darkCard : styles.lightCard,
                  ]}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    onPress={() =>
                      router.push(`/student/profile/${item.id}` as any)
                    }
                  >
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarInitials}>{initials}</Text>
                    </View>
                    <View style={styles.info}>
                      <Text
                        style={[
                          styles.name,
                          isDark ? styles.darkText : styles.lightText,
                        ]}
                      >
                        {fullName}
                      </Text>
                      <Text style={styles.role}>
                        {item.headline || item.institution || "Student / Alum"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeMutation.mutate(item.id)}
                    disabled={removeMutation.isPending}
                  >
                    <Ionicons
                      name="person-remove-outline"
                      size={18}
                      color="#EF4444"
                    />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      )}

      {activeTab === "People" && (
        <View>
          <Text
            style={[
              styles.sectionTitle,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Explore Directory
          </Text>

          {/* Search Inputs */}
          <View style={styles.searchContainer}>
            <TextInput
              style={[
                styles.searchInput,
                isDark ? styles.darkInput : styles.lightInput,
              ]}
              placeholder="Search by name, skill..."
              placeholderTextColor="#9CA3AF"
              value={searchItem}
              onChangeText={setSearchItem}
            />
            <TextInput
              style={[
                styles.searchInput,
                isDark ? styles.darkInput : styles.lightInput,
                { marginTop: 8 },
              ]}
              placeholder="Filter by programme..."
              placeholderTextColor="#9CA3AF"
              value={targetProgramme}
              onChangeText={setTargetProgramme}
            />
          </View>

          {isLoadingProfiles ? (
            <ActivityIndicator
              size="small"
              color="#006837"
              style={{ marginTop: 20 }}
            />
          ) : profiles.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 24 }}>
              <Ionicons name="people-outline" size={48} color="#9CA3AF" />
              <Text
                style={[
                  styles.emptyText,
                  isDark ? styles.darkText : styles.lightText,
                  { marginTop: 12 },
                ]}
              >
                No profiles found matching criteria.
              </Text>
            </View>
          ) : (
            profiles.map((item: any) => {
              const firstName = item?.firstName || "";
              const lastName = item?.lastName || "";
              const fullName =
                `${firstName} ${lastName}`.trim() || "Unknown User";
              const initials =
                `${firstName?.[0] || ""}${lastName?.[0] || ""}` || "U";

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.card,
                    isDark ? styles.darkCard : styles.lightCard,
                  ]}
                  onPress={() =>
                    router.push(`/student/profile/${item.id}` as any)
                  }
                >
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitials}>{initials}</Text>
                  </View>
                  <View style={styles.info}>
                    <Text
                      style={[
                        styles.name,
                        isDark ? styles.darkText : styles.lightText,
                      ]}
                    >
                      {fullName}
                    </Text>
                    <Text style={styles.role}>
                      {item.headline || item.programme || "Student / Alum"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  tabContainer: { flexDirection: "row", marginTop: 20, marginBottom: 10 },
  tab: { marginRight: 24, paddingBottom: 8 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#006837" },
  tabText: { fontSize: 15, fontWeight: "600" },
  activeTabText: { color: "#006837" },
  inactiveTabText: { color: "#9CA3AF" },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginVertical: 14 },
  searchContainer: { marginBottom: 14 },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 14,
  },
  lightInput: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    color: "#111827",
  },
  darkInput: {
    backgroundColor: "#1F2937",
    borderColor: "#374151",
    color: "#FFFFFF",
  },
  card: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: "center",
  },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarInitials: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700" },
  role: { color: "#6B7280", fontSize: 12, marginTop: 2 },
  actionButtons: { flexDirection: "row", gap: 8 },
  acceptBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
  },
  rejectBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { fontSize: 14, textAlign: "center", marginTop: 8 },
  lightMuted: { color: "#6B7280" },
  darkMuted: { color: "#9CA3AF" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
