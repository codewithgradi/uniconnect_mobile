import { useSendOtp, useVerifyOtp } from "@/api/hooks/useAuth";
import { ThemedButtonPrimary } from "@/components/ThemedButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ThemedButtonSecondary } from "../../components/ThemedButtonSecondary";
import { ThemedInput } from "../../components/ThemedInput";

export default function EmailVerificationScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email || "student@richfield.ac.za";
  const [otp, setotp] = useState("");

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  const { mutate: sendOtp, isPending: isResending } = useSendOtp();

  const showAlert = (title: string, message: string, onPress?: () => void) => {
    if (Platform.OS === "web") {
      window.alert(`${title}: ${message}`);
      if (onPress) onPress();
    } else {
      Alert.alert(title, message, [
        {
          text: "OK",
          onPress: () => onPress?.(),
        },
      ]);
    }
  };

  const handleVerify = () => {
    const cleanOtp = otp.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanOtp || cleanOtp.length < 6) {
      showAlert(
        "Invalid OTP",
        "Please enter a valid 6-digit verification code.",
      );
      return;
    }

    verifyOtp(
      { email: cleanEmail, otp: cleanOtp },
      {
        onSuccess: () => {
          showAlert(
            "Success",
            "Email verified successfully! Please log in.",
            () => {
              // Navigation triggers ONLY after user dismisses the dialog
              router.replace({
                pathname: "/(auth)/login",
                params: { email: cleanEmail },
              });
            },
          );
        },
        onError: (err: any) => {
          console.error(
            "❌ OTP Verification Error:",
            err?.response?.data || err,
          );
          const errorData = err?.response?.data;
          const message =
            errorData?.detail ||
            errorData?.title ||
            "Invalid or expired code. Try again.";
          showAlert("Verification Failed", message);
        },
      },
    );
  };

  const handleResend = () => {
    sendOtp(
      { email: email.trim().toLowerCase() },
      {
        onSuccess: () => {
          showAlert("Code Resent", `A new OTP code was sent to ${email}`);
        },
        onError: () => {
          showAlert("Error", "Could not resend OTP. Please try again.");
        },
      },
    );
  };

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <View style={styles.header}>
        <Text
          style={[styles.title, isDark ? styles.darkText : styles.lightText]}
        >
          Verify Email
        </Text>
        <Text style={styles.subtitle}>
          We sent a verification code to{" "}
          <Text style={styles.emailHighlight}>{email}</Text>
        </Text>
      </View>

      <View style={styles.form}>
        <ThemedInput
          placeholder="6-Digit Verification Code"
          value={otp}
          onChangeText={setotp}
          keyboardType="number-pad"
          maxLength={6}
          style={{ textAlign: "center", letterSpacing: 8, fontSize: 20 }}
        />

        <ThemedButtonPrimary
          title={isVerifying ? "Verifying..." : "Verify Code"}
          onPress={handleVerify}
          disabled={isVerifying}
          style={{ marginTop: 20 }}
        />
        <ThemedButtonSecondary
          title={isResending ? "Sending..." : "Resend Email"}
          onPress={handleResend}
          disabled={isResending}
        />
      </View>

      <TouchableOpacity style={styles.helpText}>
        <Text style={styles.subtleText}>
          Need help with student verification?
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 48,
  },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  header: { marginTop: 24 },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 15, color: "#6B7280", marginTop: 8, lineHeight: 22 },
  emailHighlight: { color: "#006837", fontWeight: "600" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
  form: { flex: 1, justifyContent: "center" },
  helpText: { alignItems: "center" },
  subtleText: { color: "#9CA3AF", fontSize: 13 },
});
