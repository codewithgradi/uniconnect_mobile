import React from "react";
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

export default function UserProfileScreen() {
  const isDark = useColorScheme() === "dark";
  const routeParams = useLocalSearchParams<{ id?: string | string[] }>();

  // Safely normalize route param to a single string
  const profileId = Array.isArray(routeParams.id)
    ? routeParams.id[0]
    : (routeParams.id ?? "");

  const router = useRouter();

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

        {/* Action Button: Message */}
        <TouchableOpacity
          style={styles.messageButton}
          onPress={handleMessagePress}
        >
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color="#ffffff"
            style={styles.buttonIcon}
          />
          <Text style={styles.messageButtonText}>Leave a Message</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      {profile.bio && (
        <View
          style={[
            styles.sectionCard,
            isDark ? styles.darkCard : styles.lightCard,
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            About
          </Text>
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
          <Text
            style={[
              styles.sectionTitle,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Skills
          </Text>
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
          <Text
            style={[
              styles.sectionTitle,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Experience
          </Text>
          {profile.experiences.map((exp: any, index: number) => (
            <View
              key={index}
              style={[
                styles.experienceItem,
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
                {exp.startDate} - {exp.current ? "Present" : exp.endDate}
              </Text>
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
    backgroundColor: "#F9FAFB",
  },
  darkContainer: {
    backgroundColor: "#111827",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  headerCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 16,
  },
  lightCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
  },
  darkCard: {
    backgroundColor: "#1F2937",
    borderColor: "#374151",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  headline: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 6,
  },
  programme: {
    fontSize: 12,
    fontWeight: "600",
    color: "#006837",
    backgroundColor: "#E6F4EA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  messageButton: {
    flexDirection: "row",
    backgroundColor: "#006837",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonIcon: {
    marginRight: 8,
  },
  messageButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  sectionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  lightSkillBadge: {
    backgroundColor: "#F3F4F6",
  },
  darkSkillBadge: {
    backgroundColor: "#374151",
  },
  skillText: {
    fontSize: 12,
    fontWeight: "500",
  },
  lightSkillText: {
    color: "#374151",
  },
  darkSkillText: {
    color: "#D1D5DB",
  },
  experienceItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  lightBorder: {
    borderBottomColor: "#F3F4F6",
  },
  darkBorder: {
    borderBottomColor: "#374151",
  },
  expTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  expCompany: {
    fontSize: 13,
  },
  expDate: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  errorText: {
    fontSize: 16,
    marginVertical: 12,
    textAlign: "center",
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  lightBackButton: {
    backgroundColor: "#E5E7EB",
  },
  darkBackButton: {
    backgroundColor: "#374151",
  },
  backButtonText: {
    fontWeight: "600",
  },
  lightBackText: {
    color: "#374151",
  },
  darkBackText: {
    color: "#FFFFFF",
  },
  lightText: {
    color: "#111827",
  },
  darkText: {
    color: "#FFFFFF",
  },
  lightMuted: {
    color: "#6B7280",
  },
  darkMuted: {
    color: "#9CA3AF",
  },
});
