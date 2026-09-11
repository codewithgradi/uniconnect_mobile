import {
  useAddCertification,
  useAddExperience,
  useAddSkill,
  useDeleteCertification,
  useDeleteExperience,
  useMyProfile,
  useSaveCvUrl,
  useUpdateProfile,
} from "@/api/hooks/useProfile";
import { ThemedButtonSecondary } from "@/components/ThemedButtonSecondary";
import { SkillsManager } from "@/components/Themedskills";
import { STYLES } from "@/Constants/styles";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface ProfileFormState {
  firstName: string;
  lastName: string;
  studentNumber: string;
  programme: string;
  systemHeadline: string;
  aboutBio: string;
}

interface ExperienceFormState {
  companyName: string;
  title: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
}

interface CertificationFormState {
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  credentialUrl: string;
}

interface SelectedFileState {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
}

export default function StudentProfileScreen() {
  const isDark = useColorScheme() === "dark";

  // --- TanStack Query Hooks ---
  const { data: profile, isLoading, isError, refetch } = useMyProfile();

  const updateProfileMutation = useUpdateProfile();
  const saveCvUrlMutation = useSaveCvUrl();
  const addExperienceMutation = useAddExperience();
  const deleteExperienceMutation = useDeleteExperience();
  const addCertificationMutation = useAddCertification();
  const deleteCertificationMutation = useDeleteCertification();
  const addSkillMutation = useAddSkill();

  // --- UI States ---
  const [selectedCvFile, setSelectedCvFile] =
    useState<SelectedFileState | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<
    "profile" | "experience" | "certification"
  >("profile");

  // Inline Skill State
  const [newSkillInput, setNewSkillInput] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // Date Picker UI Control States
  const [activeDatePicker, setActiveDatePicker] = useState<
    "expStart" | "expEnd" | "certIssue" | null
  >(null);

  // Strictly Typed Form States
  const [editForm, setEditForm] = useState<ProfileFormState>({
    firstName: "",
    lastName: "",
    studentNumber: "",
    programme: "",
    systemHeadline: "",
    aboutBio: "",
  });

  // Synchronize form state when profile data changes or is fetched
  useEffect(() => {
    if (profile) {
      setEditForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        studentNumber: profile.studentNumber || "",
        programme: profile.programme || "",
        systemHeadline: profile.headline || "",
        aboutBio: profile.bio || "",
      });
    }
  }, [profile]);

  const [expForm, setExpForm] = useState<ExperienceFormState>({
    companyName: "",
    title: "",
    location: "",
    startDate: new Date(),
    endDate: null,
    isCurrent: false,
  });

  const [certForm, setCertForm] = useState<CertificationFormState>({
    name: "",
    issuingOrganization: "",
    issueDate: new Date(),
    credentialUrl: "",
  });

  const getInitials = (first?: string, last?: string) => {
    return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
  };

  const formatDateDisplay = (date: Date | string | null | undefined) => {
    if (!date) return "Present";
    const d = new Date(date);
    return isNaN(d.getTime()) ? String(date) : d.toISOString().split("T")[0];
  };

  const handleOpenEditModal = (
    tab: "profile" | "experience" | "certification",
  ) => {
    setActiveModalTab(tab);
    if (tab === "profile" && profile) {
      setEditForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        studentNumber: profile.studentNumber || "",
        programme: profile.programme || "",
        systemHeadline: profile.headline || "",
        aboutBio: profile.bio || "",
      });
    }
    setIsEditModalVisible(true);
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setActiveDatePicker(null);
    }

    if (selectedDate) {
      if (activeDatePicker === "expStart") {
        setExpForm((prev) => ({ ...prev, startDate: selectedDate }));
      } else if (activeDatePicker === "expEnd") {
        setExpForm((prev) => ({ ...prev, endDate: selectedDate }));
      } else if (activeDatePicker === "certIssue") {
        setCertForm((prev) => ({ ...prev, issueDate: selectedDate }));
      }
    }
  };

  // --- CV Operations ---

  const handleSelectCvDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedCvFile({
          uri: file.uri,
          name: file.name,
          size: file.size,
          mimeType: file.mimeType || "application/pdf",
        });
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to select document.");
    }
  };

  const handleSaveCvToBackend = async () => {
    if (!selectedCvFile) return;

    try {
      setIsUploading(true);

      await saveCvUrlMutation.mutateAsync({
        fileUri:
          Platform.OS === "android"
            ? selectedCvFile.uri
            : selectedCvFile.uri.replace("file://", ""),
        fileName: selectedCvFile.name,
        fileType: selectedCvFile.mimeType || "application/pdf",
      });

      setSelectedCvFile(null);
      await refetch();
      Alert.alert("Success", "CV uploaded successfully.");
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to save CV.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveCv = () => {
    Alert.alert(
      "Remove CV",
      "Are you sure you want to remove your uploaded CV document?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setIsUploading(true);
              const emptyFormData = new FormData();
              await saveCvUrlMutation.mutateAsync(emptyFormData as any);
              setSelectedCvFile(null);
              await refetch();
              Alert.alert("Success", "CV removed.");
            } catch (error: any) {
              Alert.alert("Error", error?.message || "Failed to remove CV.");
            } finally {
              setIsUploading(false);
            }
          },
        },
      ],
    );
  };

  const handleOpenCv = async (url?: string) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open URL.");
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to open document.");
    }
  };

  const handleSaveProfileDetails = async () => {
    try {
      const payload = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        studentNumber: editForm.studentNumber,
        programme: editForm.programme,
        headline: editForm.systemHeadline,
        bio: editForm.aboutBio,
      };
      await updateProfileMutation.mutateAsync(payload as any);
      await refetch(); // Force immediate pull of fresh backend data
      setIsEditModalVisible(false);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to update profile.");
    }
  };

  const handleAddSkillSubmit = async () => {
    if (!newSkillInput.trim()) return;
    try {
      await addSkillMutation.mutateAsync(newSkillInput.trim() as any);
      setNewSkillInput("");
      setIsAddingSkill(false);
      await refetch();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to add skill.");
    }
  };

  const handleAddExperienceSubmit = async () => {
    if (!expForm.title || !expForm.companyName) {
      Alert.alert("Required Fields", "Please enter title and company name.");
      return;
    }
    try {
      const payload = {
        title: expForm.title,
        companyName: expForm.companyName,
        location: expForm.location || "",
        startDate: expForm.startDate.toISOString(),
        endDate: expForm.isCurrent
          ? null
          : expForm.endDate
            ? expForm.endDate.toISOString()
            : null,
        isCurrent: expForm.isCurrent,
      };

      await addExperienceMutation.mutateAsync(payload as any);
      setExpForm({
        companyName: "",
        title: "",
        location: "",
        startDate: new Date(),
        endDate: null,
        isCurrent: false,
      });
      await refetch();
      setIsEditModalVisible(false);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to add experience.");
    }
  };

  const handleDeleteExperienceSubmit = (expId: string) => {
    Alert.alert(
      "Remove Experience",
      "Are you sure you want to delete this position?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteExperienceMutation.mutateAsync(expId as any);
              await refetch();
            } catch (error: any) {
              Alert.alert(
                "Error",
                error?.message || "Failed to delete experience.",
              );
            }
          },
        },
      ],
    );
  };

  const handleAddCertificationSubmit = async () => {
    if (!certForm.name || !certForm.issuingOrganization) {
      Alert.alert(
        "Required Fields",
        "Please enter title/name and issuing organization.",
      );
      return;
    }
    try {
      const payload = {
        name: certForm.name,
        issuingOrganization: certForm.issuingOrganization,
        issueDate: certForm.issueDate.toISOString(),
        credentialUrl: certForm.credentialUrl || "",
      };

      await addCertificationMutation.mutateAsync(payload as any);
      setCertForm({
        name: "",
        issuingOrganization: "",
        issueDate: new Date(),
        credentialUrl: "",
      });
      await refetch();
      setIsEditModalVisible(false);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to add certification.");
    }
  };

  const handleDeleteCertificationSubmit = (certId: string) => {
    Alert.alert(
      "Remove Certification",
      "Are you sure you want to delete this certification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCertificationMutation.mutateAsync(certId as any);
              await refetch();
            } catch (error: any) {
              Alert.alert(
                "Error",
                error?.message || "Failed to delete certification.",
              );
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View
        style={[
          localStyles.centered,
          isDark ? localStyles.darkBg : localStyles.lightBg,
        ]}
      >
        <ActivityIndicator size="large" color="#00E599" />
      </View>
    );
  }

  if (isError || !profile) {
    return (
      <View
        style={[
          localStyles.centered,
          isDark ? localStyles.darkBg : localStyles.lightBg,
        ]}
      >
        <Text
          style={[
            localStyles.errorText,
            isDark ? localStyles.darkText : localStyles.lightText,
          ]}
        >
          Failed to load profile details.
        </Text>
        <TouchableOpacity
          style={localStyles.primaryBtn}
          onPress={() => refetch()}
        >
          <Text style={localStyles.primaryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        localStyles.container,
        isDark ? localStyles.darkBg : localStyles.lightBg,
      ]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Profile Header */}
      <View style={localStyles.header}>
        <View style={localStyles.avatar}>
          <Text style={localStyles.avatarText}>
            {getInitials(profile.firstName, profile.lastName)}
          </Text>
        </View>

        <Text
          style={[
            localStyles.name,
            isDark ? localStyles.darkText : localStyles.lightText,
          ]}
        >
          {profile.firstName} {profile.lastName}
        </Text>
        <Text style={localStyles.subtext}>
          {profile.headline || "No headline added"}
        </Text>
        <Text style={localStyles.mutedText}>{profile.programme || "N/A"}</Text>
        <Text style={localStyles.mutedText}>
          ID: {profile.studentNumber || "N/A"}
        </Text>

        <ThemedButtonSecondary
          title="Edit Profile"
          style={localStyles.editBtn}
          textStyle={{ fontSize: 14 }}
          onPress={() => handleOpenEditModal("profile")}
        />
      </View>

      {/* CV Section */}
      <View
        style={[
          localStyles.card,
          isDark ? localStyles.darkCard : localStyles.lightCard,
        ]}
      >
        <Text
          style={[
            localStyles.cardTitle,
            isDark ? localStyles.darkText : localStyles.lightText,
          ]}
        >
          Curriculum Vitae (CV)
        </Text>

        {selectedCvFile ? (
          <View style={localStyles.stagedBox}>
            <Text style={localStyles.stagedLabel}>
              File loaded in application:
            </Text>
            <Text
              style={[
                localStyles.stagedFileName,
                isDark ? localStyles.darkText : localStyles.lightText,
              ]}
            >
              📄 {selectedCvFile.name}
            </Text>
            {selectedCvFile.size ? (
              <Text style={localStyles.mutedText}>
                {(selectedCvFile.size / 1024 / 1024).toFixed(2)} MB
              </Text>
            ) : null}
          </View>
        ) : (
          <Text style={localStyles.mutedText}>
            {profile.cvFileUrl ? "CV Uploaded" : "No CV document attached"}
          </Text>
        )}

        <View style={localStyles.rowWrapGap}>
          {profile.cvFileUrl && !selectedCvFile && (
            <TouchableOpacity
              style={localStyles.outlineBtn}
              onPress={() => handleOpenCv(profile.cvFileUrl ?? undefined)}
            >
              <Text style={localStyles.outlineBtnText}>View CV</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={
              isDark ? localStyles.secondaryBtnDark : localStyles.secondaryBtn
            }
            onPress={handleSelectCvDocument}
            disabled={isUploading}
          >
            <Text
              style={
                isDark
                  ? localStyles.secondaryBtnTextDark
                  : localStyles.secondaryBtnText
              }
            >
              {selectedCvFile ? "Change Loaded PDF" : "Choose PDF"}
            </Text>
          </TouchableOpacity>

          {selectedCvFile && (
            <TouchableOpacity
              style={localStyles.primaryBtn}
              onPress={handleSaveCvToBackend}
              disabled={isUploading || saveCvUrlMutation.isPending}
            >
              {isUploading || saveCvUrlMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={localStyles.primaryBtnText}>
                  Upload to Backend
                </Text>
              )}
            </TouchableOpacity>
          )}

          {selectedCvFile && (
            <TouchableOpacity
              style={localStyles.cancelBtn}
              onPress={() => setSelectedCvFile(null)}
            >
              <Text style={localStyles.mutedText}>Cancel</Text>
            </TouchableOpacity>
          )}

          {profile.cvFileUrl && !selectedCvFile && (
            <TouchableOpacity
              style={isDark ? localStyles.dangerBtnDark : localStyles.dangerBtn}
              onPress={handleRemoveCv}
              disabled={isUploading || saveCvUrlMutation.isPending}
            >
              <Text style={localStyles.dangerBtnText}>Remove CV</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* About Section */}
      <Text
        style={[
          localStyles.sectionTitle,
          isDark ? localStyles.darkText : localStyles.lightText,
        ]}
      >
        About
      </Text>
      <Text
        style={[
          localStyles.bodyText,
          isDark ? localStyles.darkSubtext : localStyles.lightSubtext,
        ]}
      >
        {profile.bio || "No bio information provided."}
      </Text>

      {/* Skills Section */}
      <SkillsManager />

      {isAddingSkill && (
        <View style={localStyles.inlineInputRow}>
          <TextInput
            style={[
              localStyles.input,
              isDark ? localStyles.darkInput : localStyles.lightInput,
            ]}
            placeholder="Skill Name or ID"
            placeholderTextColor="#9CA3AF"
            value={newSkillInput}
            onChangeText={setNewSkillInput}
          />
          <TouchableOpacity
            style={localStyles.primaryBtn}
            onPress={handleAddSkillSubmit}
            disabled={addSkillMutation.isPending}
          >
            {addSkillMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={localStyles.primaryBtnText}>Add</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <View style={localStyles.chipWrapper}>
        {!profile.skills || profile.skills.length === 0 ? (
          <Text style={localStyles.emptyText}>No skills added yet.</Text>
        ) : (
          profile.skills.map((skill: any, idx: number) => (
            <View
              key={skill.id || idx}
              style={[
                localStyles.chip,
                isDark ? localStyles.darkChip : localStyles.lightChip,
              ]}
            >
              <Text
                style={[
                  localStyles.chipText,
                  isDark ? localStyles.darkText : localStyles.lightText,
                ]}
              >
                {typeof skill === "string" ? skill : skill.name || skill.id}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Experience Section */}
      <View style={localStyles.sectionHeaderRow}>
        <Text
          style={[
            localStyles.sectionTitle,
            isDark ? localStyles.darkText : localStyles.lightText,
          ]}
        >
          Experience
        </Text>
        <TouchableOpacity
          onPress={() => handleOpenEditModal("experience")}
          style={localStyles.inlineActionBtn}
        >
          <Text style={localStyles.inlineActionText}>+ Add Experience</Text>
        </TouchableOpacity>
      </View>

      {!profile.experiences || profile.experiences.length === 0 ? (
        <Text style={localStyles.emptyText}>No experiences listed.</Text>
      ) : (
        profile.experiences.map((exp: any, idx: number) => (
          <View
            key={exp.id || idx}
            style={[
              localStyles.card,
              isDark ? localStyles.darkCard : localStyles.lightCard,
            ]}
          >
            <View style={localStyles.rowSpaceBetween}>
              <Text
                style={[
                  localStyles.itemTitle,
                  isDark ? localStyles.darkText : localStyles.lightText,
                ]}
              >
                {exp.title || exp.role}
              </Text>
              <TouchableOpacity
                onPress={() => handleDeleteExperienceSubmit(exp.id)}
              >
                <Text style={localStyles.deleteText}>Remove</Text>
              </TouchableOpacity>
            </View>
            <Text style={localStyles.subtext}>{exp.companyName}</Text>
            {exp.location ? (
              <Text style={localStyles.mutedText}>{exp.location}</Text>
            ) : null}
            <Text style={localStyles.mutedText}>
              {formatDateDisplay(exp.startDate)} -{" "}
              {exp.isCurrent ? "Present" : formatDateDisplay(exp.endDate)}
            </Text>
          </View>
        ))
      )}

      {/* Certifications Section */}
      <View style={localStyles.sectionHeaderRow}>
        <Text
          style={[
            localStyles.sectionTitle,
            isDark ? localStyles.darkText : localStyles.lightText,
          ]}
        >
          Certifications
        </Text>
        <TouchableOpacity
          onPress={() => handleOpenEditModal("certification")}
          style={localStyles.inlineActionBtn}
        >
          <Text style={localStyles.inlineActionText}>+ Add Certification</Text>
        </TouchableOpacity>
      </View>

      {!profile.certifications || profile.certifications.length === 0 ? (
        <Text style={localStyles.emptyText}>No certifications listed.</Text>
      ) : (
        profile.certifications.map((cert: any, idx: number) => (
          <View
            key={cert.id || idx}
            style={[
              localStyles.card,
              isDark ? localStyles.darkCard : localStyles.lightCard,
            ]}
          >
            <View style={localStyles.rowSpaceBetween}>
              <Text
                style={[
                  localStyles.itemTitle,
                  isDark ? localStyles.darkText : localStyles.lightText,
                ]}
              >
                {cert.name || cert.title}
              </Text>
              <TouchableOpacity
                onPress={() => handleDeleteCertificationSubmit(cert.id)}
              >
                <Text style={localStyles.deleteText}>Remove</Text>
              </TouchableOpacity>
            </View>
            <Text style={localStyles.subtext}>{cert.issuingOrganization}</Text>
            <Text style={localStyles.mutedText}>
              Issued: {formatDateDisplay(cert.issueDate)}
            </Text>
            {cert.credentialUrl ? (
              <TouchableOpacity
                onPress={() => handleOpenCv(cert.credentialUrl)}
              >
                <Text style={localStyles.inlineActionText}>
                  View Credential
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))
      )}

      {/* Modal View */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View
            style={[
              localStyles.modalContent,
              isDark ? localStyles.darkCard : localStyles.lightModal,
            ]}
          >
            <View
              style={[localStyles.tabRow, isDark && localStyles.darkTabRow]}
            >
              {(["profile", "experience", "certification"] as const).map(
                (tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      localStyles.tab,
                      activeModalTab === tab && localStyles.activeTab,
                    ]}
                    onPress={() => {
                      setActiveModalTab(tab);
                      setActiveDatePicker(null);
                    }}
                  >
                    <Text
                      style={[
                        localStyles.tabText,
                        activeModalTab === tab && localStyles.activeTabText,
                      ]}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {activeModalTab === "profile" && (
                <>
                  <Text
                    style={[localStyles.label, isDark && localStyles.darkLabel]}
                  >
                    First Name
                  </Text>
                  <TextInput
                    style={[
                      localStyles.input,
                      isDark ? localStyles.darkInput : localStyles.lightInput,
                    ]}
                    value={editForm.firstName}
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                    onChangeText={(val) =>
                      setEditForm((p) => ({ ...p, firstName: val }))
                    }
                    editable={!updateProfileMutation.isPending}
                  />

                  <Text
                    style={[localStyles.label, isDark && localStyles.darkLabel]}
                  >
                    Last Name
                  </Text>
                  <TextInput
                    style={[
                      localStyles.input,
                      isDark ? localStyles.darkInput : localStyles.lightInput,
                    ]}
                    value={editForm.lastName}
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                    onChangeText={(val) =>
                      setEditForm((p) => ({ ...p, lastName: val }))
                    }
                    editable={!updateProfileMutation.isPending}
                  />

                  <Text
                    style={[localStyles.label, isDark && localStyles.darkLabel]}
                  >
                    Student Number
                  </Text>
                  <TextInput
                    style={[
                      localStyles.input,
                      isDark ? localStyles.darkInput : localStyles.lightInput,
                    ]}
                    value={editForm.studentNumber}
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                    onChangeText={(val) =>
                      setEditForm((p) => ({ ...p, studentNumber: val }))
                    }
                    editable={!updateProfileMutation.isPending}
                  />

                  <Text
                    style={[localStyles.label, isDark && localStyles.darkLabel]}
                  >
                    Programme
                  </Text>
                  <TextInput
                    style={[
                      localStyles.input,
                      isDark ? localStyles.darkInput : localStyles.lightInput,
                    ]}
                    value={editForm.programme}
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                    onChangeText={(val) =>
                      setEditForm((p) => ({ ...p, programme: val }))
                    }
                    editable={!updateProfileMutation.isPending}
                  />

                  <Text
                    style={[localStyles.label, isDark && localStyles.darkLabel]}
                  >
                    Headline
                  </Text>
                  <TextInput
                    style={[
                      localStyles.input,
                      isDark ? localStyles.darkInput : localStyles.lightInput,
                    ]}
                    value={editForm.systemHeadline}
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                    onChangeText={(val) =>
                      setEditForm((p) => ({ ...p, systemHeadline: val }))
                    }
                    editable={!updateProfileMutation.isPending}
                  />

                  <Text
                    style={[localStyles.label, isDark && localStyles.darkLabel]}
                  >
                    About Bio
                  </Text>
                  <TextInput
                    style={[
                      localStyles.input,
                      localStyles.textArea,
                      isDark ? localStyles.darkInput : localStyles.lightInput,
                    ]}
                    multiline
                    numberOfLines={4}
                    value={editForm.aboutBio}
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                    onChangeText={(val) =>
                      setEditForm((p) => ({ ...p, aboutBio: val }))
                    }
                    editable={!updateProfileMutation.isPending}
                  />

                  <View style={localStyles.rowGap}>
                    <TouchableOpacity
                      style={localStyles.cancelBtn}
                      onPress={() => setIsEditModalVisible(false)}
                    >
                      <Text style={localStyles.mutedText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={localStyles.primaryBtn}
                      onPress={handleSaveProfileDetails}
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <Text style={localStyles.primaryBtnText}>Save</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {activeModalTab === "experience" && (
                <>
                  <Text
                    style={[localStyles.label, isDark && localStyles.darkLabel]}
                  >
                    Title *
                  </Text>
                  <TextInput
                    style={[
                      localStyles.input,
                      isDark ? localStyles.darkInput : localStyles.lightInput,
                    ]}
                    placeholder="e.g. Frontend Developer"
                    placeholderTextColor="#9CA3AF"
                    value={expForm.title}
                    onChangeText={(val) =>
                      setExpForm((p) => ({ ...p, title: val }))
                    }
                  />

                  <Text
                    style={[localStyles.label, isDark && localStyles.darkLabel]}
                  >
                    Company Name *
                  </Text>
                  <TextInput
                    style={[
                      localStyles.input,
                      isDark ? localStyles.darkInput : localStyles.lightInput,
                    ]}
                    placeholder="e.g. Acme Corp"
                    placeholderTextColor="#9CA3AF"
                    value={expForm.companyName}
                    onChangeText={(val) =>
                      setExpForm((p) => ({ ...p, companyName: val }))
                    }
                  />

                  <Text
                    style={[localStyles.label, isDark && localStyles.darkLabel]}
                  >
                    Location
                  </Text>
                  <TextInput
                    style={[
                      localStyles.input,
                      isDark ? localStyles.darkInput : localStyles.lightInput,
                    ]}
                    placeholder="e.g. Johannesburg, South Africa"
                    placeholderTextColor="#9CA3AF"
                    value={expForm.location}
                    onChangeText={(val) =>
                      setExpForm((p) => ({ ...p, location: val }))
                    }
                  />

                  <Text
                    style={[localStyles.label, isDark && localStyles.darkLabel]}
                  >
                    Start Date
                  </Text>
                  <TouchableOpacity
                    style={[
                      localStyles.datePickerButton,
                      isDark ? localStyles.darkInput : localStyles.lightInput,
                    ]}
                    onPress={() =>
                      setActiveDatePicker(
                        activeDatePicker === "expStart" ? null : "expStart",
                      )
                    }
                  >
                    <Text
                      style={
                        isDark ? localStyles.darkText : localStyles.lightText
                      }
                    >
                      {formatDateDisplay(expForm.startDate)}
                    </Text>
                  </TouchableOpacity>

                  {activeDatePicker === "expStart" && (
                    <DateTimePicker
                      value={expForm.startDate}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={handleDateChange}
                    />
                  )}

                  <View style={localStyles.rowSpaceBetween}>
                    <Text
                      style={[
                        localStyles.label,
                        isDark && localStyles.darkLabel,
                      ]}
                    >
                      Is Current Role?
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setExpForm((p) => ({
                          ...p,
                          isCurrent: !p.isCurrent,
                          endDate: !p.isCurrent ? null : new Date(),
                        }))
                      }
                    >
                      <Text style={localStyles.inlineActionText}>
                        {expForm.isCurrent ? "✓ Yes (Currently Working)" : "No"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {!expForm.isCurrent && (
                    <>
                      <Text
                        style={[
                          localStyles.label,
                          isDark && localStyles.darkLabel,
                        ]}
                      >
                        End Date
                      </Text>
                      <TouchableOpacity
                        style={[
                          localStyles.datePickerButton,
                          isDark
                            ? localStyles.darkInput
                            : localStyles.lightInput,
                        ]}
                        onPress={() => {
                          if (!expForm.endDate)
                            setExpForm((p) => ({ ...p, endDate: new Date() }));
                          setActiveDatePicker(
                            activeDatePicker === "expEnd" ? null : "expEnd",
                          );
                        }}
                      >
                        <Text
                          style={
                            isDark
                              ? localStyles.darkText
                              : localStyles.lightText
                          }
                        >
                          {formatDateDisplay(expForm.endDate)}
                        </Text>
                      </TouchableOpacity>

                      {activeDatePicker === "expEnd" && (
                        <DateTimePicker
                          value={expForm.endDate || new Date()}
                          mode="date"
                          display={
                            Platform.OS === "ios" ? "spinner" : "default"
                          }
                          onChange={handleDateChange}
                        />
                      )}
                    </>
                  )}

                  <View style={localStyles.rowGap}>
                    <TouchableOpacity
                      style={localStyles.cancelBtn}
                      onPress={() => setIsEditModalVisible(false)}
                    >
                      <Text style={localStyles.mutedText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={localStyles.primaryBtn}
                      onPress={handleAddExperienceSubmit}
                      disabled={addExperienceMutation.isPending}
                    >
                      {addExperienceMutation.isPending ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <Text style={localStyles.primaryBtnText}>Add</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {activeModalTab === "certification" && (
                <>
                  <Text
                    style={[localStyles.label, isDark && localStyles.darkLabel]}
                  >
                    Certification Name *
                  </Text>
                  <TextInput
                    style={[
                      localStyles.input,
                      isDark ? localStyles.darkInput : localStyles.lightInput,
                    ]}
                    placeholder="e.g. AWS Solutions Architect"
                    placeholderTextColor="#9CA3AF"
                    value={certForm.name}
                    onChangeText={(val) =>
                      setCertForm((p) => ({ ...p, name: val }))
                    }
                  />

                  <Text
                    style={[localStyles.label, isDark && localStyles.darkLabel]}
                  >
                    Issuing Organization *
                  </Text>
                  <TextInput
                    style={[
                      localStyles.input,
                      isDark ? localStyles.darkInput : localStyles.lightInput,
                    ]}
                    placeholder="e.g. Amazon Web Services"
                    placeholderTextColor="#9CA3AF"
                    value={certForm.issuingOrganization}
                    onChangeText={(val) =>
                      setCertForm((p) => ({ ...p, issuingOrganization: val }))
                    }
                  />

                  <Text
                    style={[localStyles.label, isDark && localStyles.darkLabel]}
                  >
                    Credential URL
                  </Text>
                  <TextInput
                    style={[
                      localStyles.input,
                      isDark ? localStyles.darkInput : localStyles.lightInput,
                    ]}
                    placeholder="e.g. https://credly.com/your-badge"
                    placeholderTextColor="#9CA3AF"
                    value={certForm.credentialUrl}
                    onChangeText={(val) =>
                      setCertForm((p) => ({ ...p, credentialUrl: val }))
                    }
                  />

                  <Text
                    style={[localStyles.label, isDark && localStyles.darkLabel]}
                  >
                    Issue Date
                  </Text>
                  <TouchableOpacity
                    style={[
                      localStyles.datePickerButton,
                      isDark ? localStyles.darkInput : localStyles.lightInput,
                    ]}
                    onPress={() =>
                      setActiveDatePicker(
                        activeDatePicker === "certIssue" ? null : "certIssue",
                      )
                    }
                  >
                    <Text
                      style={
                        isDark ? localStyles.darkText : localStyles.lightText
                      }
                    >
                      {formatDateDisplay(certForm.issueDate)}
                    </Text>
                  </TouchableOpacity>

                  {activeDatePicker === "certIssue" && (
                    <DateTimePicker
                      value={certForm.issueDate}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={handleDateChange}
                    />
                  )}

                  <View style={localStyles.rowGap}>
                    <TouchableOpacity
                      style={localStyles.cancelBtn}
                      onPress={() => setIsEditModalVisible(false)}
                    >
                      <Text style={localStyles.mutedText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={localStyles.primaryBtn}
                      onPress={handleAddCertificationSubmit}
                      disabled={addCertificationMutation.isPending}
                    >
                      {addCertificationMutation.isPending ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <Text style={localStyles.primaryBtnText}>Add</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  ...STYLES,
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  darkBg: { backgroundColor: "#0A0F1D" },
  lightBg: { backgroundColor: "#F8FAFC" },
  darkCard: {
    backgroundColor: "#111827",
    borderColor: "#1F2937",
    borderWidth: 1,
  },
  lightCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#F1F5F9",
    borderWidth: 1,
  },
  lightModal: { backgroundColor: "#FFFFFF" },
  darkText: { color: "#F8FAFC" },
  lightText: { color: "#0F172A" },
  darkSubtext: { color: "#9CA3AF" },
  lightSubtext: { color: "#4B5563" },
  darkInput: {
    backgroundColor: "#1F2937",
    color: "#F8FAFC",
    borderColor: "#374151",
    borderWidth: 1,
  },
  lightInput: {
    backgroundColor: "#F3F4F6",
    color: "#111827",
    borderColor: "#E5E7EB",
    borderWidth: 1,
  },
  darkChip: { backgroundColor: "#1F2937" },
  lightChip: { backgroundColor: "#E5E7EB" },
  container: { flex: 1, padding: 16 },
  header: { alignItems: "center", marginVertical: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#00E599",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { color: "#0A0F1D", fontSize: 28, fontWeight: "bold" },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  subtext: { fontSize: 14, color: "#64748B", marginBottom: 2 },
  mutedText: { fontSize: 13, color: "#9CA3AF" },
  editBtn: { marginTop: 12 },
  card: { padding: 16, borderRadius: 16, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  stagedBox: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0, 229, 153, 0.08)",
    marginVertical: 8,
  },
  stagedLabel: { fontSize: 12, color: "#00E599", fontWeight: "600" },
  stagedFileName: { fontSize: 14, fontWeight: "500", marginVertical: 2 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bodyText: { fontSize: 14, lineHeight: 20 },
  inlineActionBtn: { paddingVertical: 4 },
  inlineActionText: { color: "#00E599", fontWeight: "600" },
  inlineInputRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  datePickerButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    marginBottom: 8,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  chipWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 8,
  },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  chipText: { fontSize: 13 },
  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowWrapGap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  itemTitle: { fontSize: 15, fontWeight: "600" },
  deleteText: { color: "#EF4444", fontSize: 13 },
  emptyText: { color: "#9CA3AF", fontSize: 13, fontStyle: "italic" },
  rowGap: { flexDirection: "row", gap: 8, marginTop: 12 },
  primaryBtn: {
    backgroundColor: "#00E599",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtnText: { color: "#0A0F1D", fontWeight: "700" },
  secondaryBtn: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryBtnDark: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  secondaryBtnText: { color: "#374151", fontWeight: "600" },
  secondaryBtnTextDark: { color: "#F8FAFC", fontWeight: "600" },
  dangerBtn: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dangerBtnDark: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dangerBtnText: { color: "#EF4444", fontWeight: "600" },
  outlineBtn: {
    borderWidth: 1,
    borderColor: "#00E599",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  outlineBtnText: { color: "#00E599", fontWeight: "600" },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
  },
  errorText: { marginBottom: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { borderRadius: 20, padding: 20, maxHeight: "80%" },
  tabRow: {
    flexDirection: "row",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  darkTabRow: {
    borderColor: "#1F2937",
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center" },
  activeTab: { borderBottomWidth: 2, borderColor: "#00E599" },
  tabText: { color: "#9CA3AF", fontSize: 14 },
  activeTabText: { color: "#00E599", fontWeight: "bold" },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 8,
    marginBottom: 4,
  },
  darkLabel: {
    color: "#9CA3AF",
  },
});
