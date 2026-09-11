import { useAddSkill } from "@/api/hooks/useProfile";
import { useSkills } from "@/api/hooks/useSkills";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface SkillsManagerProps {
  onSkillAdded?: () => void;
}

export function SkillsManager({ onSkillAdded }: SkillsManagerProps) {
  const isDark = useColorScheme() === "dark";
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const { data: availableSkills, isLoading: isLoadingAvailableSkills } =
    useSkills();
  const addSkillMutation = useAddSkill();

  const handleSelectSkill = async (skillId: string) => {
    try {
      // Passing the skill ID as requested by the API payload requirement
      await addSkillMutation.mutateAsync(skillId as any);
      setIsAddingSkill(false);
      if (onSkillAdded) {
        onSkillAdded();
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to add skill.");
    }
  };

  const currentTheme = {
    cardBg: isDark ? "#1E1E1E" : "#FFFFFF",
    textPrimary: isDark ? "#FFFFFF" : "#111827",
    textMuted: "#9CA3AF",
    chipBg: isDark ? "#2A2A2A" : "#F3F4F6",
    primary: "#006837",
  };

  return (
    <View style={localStyles.container}>
      <View style={localStyles.sectionHeaderRow}>
        <Text
          style={[
            localStyles.sectionTitle,
            { color: currentTheme.textPrimary },
          ]}
        >
          Skills
        </Text>
        <TouchableOpacity
          onPress={() => setIsAddingSkill(!isAddingSkill)}
          style={localStyles.inlineActionBtn}
        >
          <Text
            style={[
              localStyles.inlineActionText,
              { color: currentTheme.primary },
            ]}
          >
            {isAddingSkill ? "Cancel" : "+ Add Skill"}
          </Text>
        </TouchableOpacity>
      </View>

      {isAddingSkill && (
        <View
          style={[
            localStyles.card,
            { backgroundColor: currentTheme.cardBg },
            localStyles.shadowBox,
          ]}
        >
          <Text
            style={[localStyles.cardTitle, { color: currentTheme.textPrimary }]}
          >
            Select a Skill to Add:
          </Text>
          {isLoadingAvailableSkills ? (
            <ActivityIndicator
              size="small"
              color={currentTheme.primary}
              style={{ marginVertical: 10 }}
            />
          ) : !availableSkills || availableSkills.length === 0 ? (
            <Text
              style={[localStyles.emptyText, { color: currentTheme.textMuted }]}
            >
              No available skills found.
            </Text>
          ) : (
            <View style={localStyles.chipWrapper}>
              {availableSkills.map((skill) => (
                <TouchableOpacity
                  key={skill.id}
                  style={[
                    localStyles.selectableChip,
                    {
                      backgroundColor: currentTheme.chipBg,
                      borderColor: currentTheme.primary,
                    },
                  ]}
                  onPress={() => handleSelectSkill(skill.id)}
                  disabled={addSkillMutation.isPending}
                >
                  <Text
                    style={[
                      localStyles.chipText,
                      { color: currentTheme.textPrimary },
                    ]}
                  >
                    + {skill.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    width: "100%",
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  shadowBox: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inlineActionBtn: {
    paddingVertical: 4,
  },
  inlineActionText: {
    fontWeight: "600",
  },
  chipWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 8,
  },
  selectableChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
  },
  emptyText: {
    fontSize: 13,
    fontStyle: "italic",
  },
});
