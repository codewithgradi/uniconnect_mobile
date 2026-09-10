import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProfileById } from "@/api/hooks/useProfile";

export interface ExperienceDto {
  id?: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface CertificationDto {
  id?: string;
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  credentialId?: string;
}

export interface SkillDto {
  id: string;
  name: string;
  endorsementsCount?: number;
}

export interface ProfileDto {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  headline?: string;
  systemHeadline?: string;
  bio?: string;
  programme?: string;
  cvUrl?: string;
  skills?: SkillDto[];
  experiences?: ExperienceDto[];
  certifications?: CertificationDto[];
}

export interface CreateProfileDto {
  fullName: string;
  headline?: string;
  bio?: string;
  targetProgramme?: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  headline?: string;
  bio?: string;
  targetProgramme?: string;
}

export interface AddExperienceDto {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface AddCertificationDto {
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  credentialId?: string;
}

// Helper to format dates like "2024-03" or "2024-03-01" into "Mar 2024"
const formatFriendlyDate = (dateString?: string) => {
  if (!dateString) return "";
  try {
    // If it's just a year or partial format like "YYYY-MM"
    if (dateString.length === 7 && dateString.includes("-")) {
      const [year, month] = dateString.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export default function UserProfileScreen() {
  const isDark = useColorScheme() === "dark";
  const routeParams = useLocalSearchParams<{ id?: string | string[] }>();

  // Safely normalize route param to a single string
  const profileId = Array.isArray(routeParams.id)
    ? routeParams.id[0]
    : (routeParams.id ?? "");

  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);

  const { data: profile, isLoading, error } = useProfileById(profileId);

  const handleMessagePress = () => {
    if (!profile?.id) return;
    router.push({
      pathname: "student/messages/[id]" as any,
      params: {
        id: profile.id,
        name: (profile.firstName || "") + " " + (profile.lastName || ""),
      },
    });
  };

  const handleConnectPress = () => {
    setIsConnected(!isConnected);
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.centerContainer,
          isDark ? styles.darkContainer : styles.lightContainer,
        ]}
      >
        <ActivityIndicator size="large" color="#006837" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View
        style={[
          styles.centerContainer,
          isDark ? styles.darkContainer : styles.lightContainer,
        ]}
      >
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text
          style={[
            styles.errorText,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Could not load profile information.
        </Text>
        <TouchableOpacity
          style={[
            styles.backButton,
            isDark ? styles.darkBackButton : styles.lightBackButton,
          ]}
          onPress={() => router.back()}
        >
          <Text
            style={[
              styles.backButtonText,
              isDark ? styles.darkBackText : styles.lightBackText,
            ]}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        isDark ? styles.darkContainer : styles.lightContainer,
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header / Basic Info */}
      <View
        style={[styles.headerCard, isDark ? styles.darkCard : styles.lightCard]}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {profile.firstName && profile.lastName
              ? profile.firstName.charAt(0).toUpperCase() +
                profile.lastName.charAt(0).toUpperCase()
              : "U"}
          </Text>
        </View>
        <Text
          style={[styles.name, isDark ? styles.darkText : styles.lightText]}
        >
          {(profile.firstName || "") + " " + (profile.lastName || "")}
        </Text>
        {profile.headline ? (
          <Text
            style={[
              styles.headline,
              isDark ? styles.darkMuted : styles.lightMuted,
            ]}
          >
            {profile.headline}
          </Text>
        ) : null}
        <Text style={styles.programme}>{profile.programme || "Student"}</Text>

        {/* Action Buttons Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.connectButton,
              isConnected && styles.connectedButton,
              isConnected && isDark && styles.darkConnectedButton,
            ]}
            onPress={handleConnectPress}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isConnected ? "checkmark-outline" : "person-add-outline"}
              size={16}
              color={isConnected ? (isDark ? "#FFFFFF" : "#006837") : "#FFFFFF"}
              style={styles.buttonIcon}
            />
            <Text
              style={[
                styles.connectButtonText,
                isConnected && styles.connectedButtonText,
                isConnected && isDark && styles.darkConnectedText,
              ]}
            >
              {isConnected ? "Connected" : "Connect"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.messageButton}
            onPress={handleMessagePress}
            activeOpacity={0.8}
          >
            <Ionicons
              name="chatbubble-outline"
              size={16}
              color="#006837"
              style={styles.buttonIcon}
            />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
      {profile.bio && (
        <View
          style={[
            styles.sectionCard,
            isDark ? styles.darkCard : styles.lightCard,
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#006837"
              style={styles.sectionIcon}
            />
            <Text
              style={[
                styles.sectionTitle,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              About
            </Text>
          </View>
          <Text
            style={[
              styles.sectionBody,
              isDark ? styles.darkMuted : styles.lightMuted,
            ]}
          >
            {profile.bio}
          </Text>
        </View>
      )}

      {/* Skills Section */}
      {profile.skills && profile.skills.length > 0 && (
        <View
          style={[
            styles.sectionCard,
            isDark ? styles.darkCard : styles.lightCard,
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <Ionicons
              name="flash-outline"
              size={18}
              color="#006837"
              style={styles.sectionIcon}
            />
            <Text
              style={[
                styles.sectionTitle,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              Skills
            </Text>
          </View>
          <View style={styles.skillsContainer}>
            {profile.skills.map((skill: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.skillBadge,
                  isDark ? styles.darkSkillBadge : styles.lightSkillBadge,
                ]}
              >
                <Text
                  style={[
                    styles.skillText,
                    isDark ? styles.darkSkillText : styles.lightSkillText,
                  ]}
                >
                  {skill.name || skill}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Experience Section */}
      {profile.experiences && profile.experiences.length > 0 && (
        <View
          style={[
            styles.sectionCard,
            isDark ? styles.darkCard : styles.lightCard,
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <Ionicons
              name="briefcase-outline"
              size={18}
              color="#006837"
              style={styles.sectionIcon}
            />
            <Text
              style={[
                styles.sectionTitle,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              Experience
            </Text>
          </View>
          {profile.experiences.map((exp: any, index: number) => (
            <View
              key={index}
              style={[
                styles.experienceItem,
                index === profile.experiences!.length - 1 &&
                  styles.lastExperienceItem,
                isDark ? styles.darkBorder : styles.lightBorder,
              ]}
            >
              <Text
                style={[
                  styles.expTitle,
                  isDark ? styles.darkText : styles.lightText,
                ]}
              >
                {exp.title}
              </Text>
              <Text
                style={[
                  styles.expCompany,
                  isDark ? styles.darkMuted : styles.lightMuted,
                ]}
              >
                {exp.company}
              </Text>
              <Text style={styles.expDate}>
                {formatFriendlyDate(exp.startDate)} –{" "}
                {exp.current ? "Present" : formatFriendlyDate(exp.endDate)}
              </Text>
              {exp.description ? (
                <Text
                  style={[
                    styles.expDescription,
                    isDark ? styles.darkMuted : styles.lightMuted,
                  ]}
                >
                  {exp.description}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: "#F4F6F8",
  },
  darkContainer: {
    backgroundColor: "#0B0F17",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 48,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  headerCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  lightCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
  },
  darkCard: {
    backgroundColor: "#161E2E",
    borderColor: "#2D3748",
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#006837",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  headline: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  programme: {
    fontSize: 12,
    fontWeight: "600",
    color: "#006837",
    backgroundColor: "#E6F4EA",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  connectButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#006837",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  connectedButton: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  darkConnectedButton: {
    backgroundColor: "#1E293B",
    borderColor: "#475569",
  },
  messageButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#006837",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 6,
  },
  connectButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  connectedButtonText: {
    color: "#006837",
    fontWeight: "600",
    fontSize: 14,
  },
  darkConnectedText: {
    color: "#E2E8F0",
  },
  messageButtonText: {
    color: "#006837",
    fontWeight: "600",
    fontSize: 14,
  },
  sectionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  lightSkillBadge: {
    backgroundColor: "#F1F5F9",
  },
  darkSkillBadge: {
    backgroundColor: "#1E293B",
  },
  skillText: {
    fontSize: 13,
    fontWeight: "500",
  },
  lightSkillText: {
    color: "#334155",
  },
  darkSkillText: {
    color: "#CBD5E1",
  },
  experienceItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  lastExperienceItem: {
    marginBottom: 0,
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  lightBorder: {
    borderBottomColor: "#F1F5F9",
  },
  darkBorder: {
    borderBottomColor: "#2D3748",
  },
  expTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  expCompany: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },
  expDate: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
    marginBottom: 6,
  },
  expDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    marginVertical: 12,
    textAlign: "center",
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  lightBackButton: {
    backgroundColor: "#E2E8F0",
  },
  darkBackButton: {
    backgroundColor: "#334155",
  },
  backButtonText: {
    fontWeight: "600",
  },
  lightBackText: {
    color: "#334155",
  },
  darkBackText: {
    color: "#FFFFFF",
  },
  lightText: {
    color: "#0F172A",
  },
  darkText: {
    color: "#F8FAFC",
  },
  lightMuted: {
    color: "#64748B",
  },
  darkMuted: {
    color: "#94A3B8",
  },
});
