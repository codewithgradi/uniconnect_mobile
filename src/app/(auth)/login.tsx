import { useLogin } from "@/api/hooks/useAuth";
import { ThemedButtonPrimary } from "@/components/ThemedButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ThemedInput } from "../../components/ThemedInput";

interface CustomJwtPayload {
  user_type?: string;
  verification_status?: string;
  is_active?: string;
  role?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

export default function LoginScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  // Params are optional (only populated if redirected right after registration)
  const params = useLocalSearchParams<{
    email?: string;
    userType?: string;
    role?: string;
  }>();

  const [email, setEmail] = useState(params.email || "");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending, error } = useLogin();

  const routeByUserRole = (role?: string) => {
    const normalizedRole = role?.toLowerCase().trim();

    switch (normalizedRole) {
      case "student":
      case "alumni":
        router.replace("/student/(tabs)/home");
        break;
      case "business":
      case "company":
        router.replace("/business/home");
        break;
      case "admin":
        router.replace("/admin/(tabs)/dashboard");
        break;
      default:
        console.warn("⚠️ Unrecognized or missing user role:", role);
        Alert.alert(
          "Login Error",
          "Unable to determine account type. Please contact support.",
        );
        break;
    }
  };

  const handleLogin = () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      Alert.alert("Validation Error", "Please enter both email and password.");
      return;
    }

    login(
      { email: cleanEmail, password },
      {
        onSuccess: (data: any) => {
          // 1. Locate the access token string in the response
          const token =
            data?.accessToken ||
            data?.token ||
            data?.jwt ||
            data?.data?.accessToken;

          let extractedRole: string | undefined = undefined;

          // 2. Decode the JWT to read user_type added by CustomClaimsPrincipalFactory
          if (
            token &&
            typeof token === "string" &&
            token.split(".").length === 3
          ) {
            try {
              const decoded = jwtDecode<CustomJwtPayload>(token);
              extractedRole =
                decoded.user_type ||
                decoded.role ||
                decoded[
                  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ];
            } catch (err) {
              console.error("Failed to decode JWT token:", err);
            }
          }

          // 3. Fallbacks if role wasn't in JWT (direct response props or route params)
          if (!extractedRole) {
            extractedRole =
              data?.userType ||
              data?.user_type ||
              data?.role ||
              data?.user?.userType ||
              params.userType ||
              params.role;
          }

          routeByUserRole(extractedRole);
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.detail ||
            err?.response?.data?.message ||
            "Invalid email or password. Please try again.";
          Alert.alert("Login Failed", message);
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
          Welcome Back
        </Text>
        <Text style={styles.subtitle}>
          Sign in to access your UniConnect portal
        </Text>
      </View>

      <View style={styles.form}>
        <ThemedInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <ThemedInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          textContentType="password"
        />

        {error && (
          <Text style={styles.errorText}>
            {(error as any)?.response?.data?.title ||
              (error as any)?.response?.data?.detail ||
              "Invalid login credentials."}
          </Text>
        )}

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <ThemedButtonPrimary
          title={isPending ? "Signing In..." : "Sign In"}
          onPress={handleLogin}
          disabled={isPending}
          style={{ marginTop: 24 }}
        />
      </View>

      <TouchableOpacity
        style={styles.footerLink}
        onPress={() => router.push("/(auth)/role")}
      >
        <Text style={styles.footerText}>
          Don't have an account? <Text style={styles.linkText}>Register</Text>
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
  subtitle: { fontSize: 15, color: "#6B7280", marginTop: 8 },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
  form: { flex: 1, justifyContent: "center" },
  forgotBtn: { alignSelf: "flex-end", marginTop: 8 },
  forgotText: { color: "#006837", fontSize: 14, fontWeight: "500" },
  footerLink: { alignItems: "center" },
  footerText: { color: "#6B7280", fontSize: 14 },
  linkText: { color: "#006837", fontWeight: "600" },
  errorText: { color: "#EF4444", marginTop: 8, fontSize: 14 },
});
