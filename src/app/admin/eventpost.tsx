import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useInstitutionalEvents } from "@/api/hooks/useEvent";

export default function EventPostScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const { createEvent, isCreatingEvent } = useInstitutionalEvents();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // DateTime Picker State
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showMode = (currentMode: "date" | "time") => {
    setShowPicker(true);
    setMode(currentMode);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert(
        "Missing Fields",
        "Please fill in all required fields (Title, Description).",
      );
      return;
    }

    try {
      // Backend expects eventDate in UTC ISO format
      const eventDate = date.toISOString();

      await createEvent({
        title: title.trim(),
        description: description.trim(),
        eventDate,
      } as any);

      Alert.alert("Success", "Institutional event published successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Submission Failed",
        error?.response?.data?.message ||
          "Could not publish event. Please try again.",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
    >
      {/* Top Header */}
      <View
        style={[styles.header, isDark ? styles.darkHeader : styles.lightHeader]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={isDark ? "#F8FAFC" : "#0F172A"}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Post Institutional Event
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formInfoContainer}>
          <View style={styles.infoIconBadge}>
            <Ionicons name="megaphone-outline" size={18} color="#10B981" />
          </View>
          <View style={styles.infoTextWrapper}>
            <Text
              style={[
                styles.infoTitle,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              Broadcast New Event
            </Text>
            <Text style={styles.infoSubtitle}>
              Select the exact calendar date and time. Formatted securely for
              UTC synchronization.
            </Text>
          </View>
        </View>

        {/* Form Inputs */}
        <View style={styles.inputGroup}>
          <Text
            style={[
              styles.inputLabel,
              isDark ? styles.darkLabel : styles.lightLabel,
            ]}
          >
            EVENT TITLE *
          </Text>
          <TextInput
            style={[
              styles.textInput,
              isDark ? styles.darkInput : styles.lightInput,
              isDark ? styles.darkText : styles.lightText,
            ]}
            placeholder="e.g., Annual Tech Symposium 2026"
            placeholderTextColor="#64748B"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Date & Time Pickers */}
        <View style={styles.inputGroup}>
          <Text
            style={[
              styles.inputLabel,
              isDark ? styles.darkLabel : styles.lightLabel,
            ]}
          >
            EVENT DATE & TIME (UTC) *
          </Text>
          <View style={styles.pickerRow}>
            <TouchableOpacity
              style={[
                styles.pickerButton,
                isDark ? styles.darkInput : styles.lightInput,
              ]}
              onPress={() => showMode("date")}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar-outline" size={18} color="#10B981" />
              <Text
                style={[
                  styles.pickerButtonText,
                  isDark ? styles.darkText : styles.lightText,
                ]}
              >
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pickerButton,
                isDark ? styles.darkInput : styles.lightInput,
              ]}
              onPress={() => showMode("time")}
              activeOpacity={0.8}
            >
              <Ionicons name="time-outline" size={18} color="#10B981" />
              <Text
                style={[
                  styles.pickerButtonText,
                  isDark ? styles.darkText : styles.lightText,
                ]}
              >
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          </View>

          {showPicker && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={date}
                mode={mode}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeDate}
                themeVariant={isDark ? "dark" : "light"}
              />
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  style={styles.donePickerBtn}
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={styles.donePickerText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text
            style={[
              styles.inputLabel,
              isDark ? styles.darkLabel : styles.lightLabel,
            ]}
          >
            DESCRIPTION *
          </Text>
          <TextInput
            style={[
              styles.textAreaInput,
              isDark ? styles.darkInput : styles.lightInput,
              isDark ? styles.darkText : styles.lightText,
            ]}
            placeholder="Provide complete details regarding the event agenda, attendees, or requirements..."
            placeholderTextColor="#64748B"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isCreatingEvent && styles.submitButtonDisabled,
          ]}
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={isCreatingEvent}
        >
          {isCreatingEvent ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={18} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Publish Event</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  lightBg: { backgroundColor: "#F8FAFC" },
  darkBg: { backgroundColor: "#0B0F17" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  lightHeader: { borderBottomColor: "#E2E8F0", backgroundColor: "#FFFFFF" },
  darkHeader: { borderBottomColor: "#1F2937", backgroundColor: "#111827" },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  formInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
    marginBottom: 24,
    gap: 12,
  },
  infoIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  infoSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },

  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  lightLabel: { color: "#64748B" },
  darkLabel: { color: "#94A3B8" },

  pickerRow: {
    flexDirection: "row",
    gap: 12,
  },
  pickerButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },
  pickerButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
  pickerContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(16, 185, 129, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.15)",
    alignItems: "center",
  },
  donePickerBtn: {
    marginTop: 8,
    backgroundColor: "#10B981",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 8,
  },
  donePickerText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },

  textInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: "600",
  },
  textAreaInput: {
    height: 120,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  lightInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
  },
  darkInput: {
    backgroundColor: "#111827",
    borderColor: "#1F2937",
  },

  lightText: { color: "#0F172A" },
  darkText: { color: "#F8FAFC" },

  submitButton: {
    flexDirection: "row",
    height: 52,
    backgroundColor: "#10B981",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
