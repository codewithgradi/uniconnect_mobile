// src/app/(auth)/certificate-scanner.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { useCertVerification, DocumentFile } from "@/api/hooks/useCertVerify";

export default function CertificateScannerScreen() {
  const router = useRouter();
  const { email, password } = useLocalSearchParams<{
    email?: string;
    password?: string;
  }>();

  const [selectedFile, setSelectedFile] = useState<DocumentFile | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>(
    "Upload your graduation certificate PDF to verify your alumni status.",
  );
  const [verificationResult, setVerificationResult] = useState<{
    credibilityScore: number;
    documentStatus: string;
    time: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const verificationMutation = useCertVerification();

  // Scanning beam animation
  const beamAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (verificationMutation.isPending) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(beamAnim, {
            toValue: 150,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(beamAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      beamAnim.setValue(0);
    }
  }, [verificationMutation.isPending, beamAnim]);

  const handlePickDocument = async () => {
    try {
      setErrorMessage(null);
      setVerificationResult(null);
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      const docFile: DocumentFile = {
        uri: asset.uri,
        name: asset.name || "certificate.pdf",
        type: asset.mimeType || "application/pdf",
        file: (asset as any).file, // Web file support
      };

      setSelectedFile(docFile);
      setStatusMessage(
        "Certificate selected. Click verify to run AI analysis.",
      );
    } catch (err: any) {
      const message = err?.message || "Failed to select document.";
      setErrorMessage(
        typeof message === "string" ? message : "Failed to select document.",
      );
    }
  };

  const extractErrorMessage = (err: any): string => {
    const rawData = err?.response?.data;

    // If response data is already a string
    if (typeof rawData === "string") {
      try {
        const parsed = JSON.parse(rawData);
        if (parsed?.message) return parsed.message;
      } catch {
        return rawData;
      }
    }

    // If response data is an object containing a message property
    if (rawData && typeof rawData === "object") {
      if (typeof rawData.message === "string") return rawData.message;
      if (typeof rawData.title === "string") return rawData.title;
    }

    // Fallback to error message or general string
    if (typeof err?.message === "string") {
      // Check if err.message contains stringified JSON like '{"message":"..."}'
      try {
        const parsed = JSON.parse(err.message);
        if (parsed?.message) return parsed.message;
      } catch {}
      return err.message;
    }

    return "An error occurred during verification.";
  };

  const handleVerify = async () => {
    if (!selectedFile) return;

    try {
      setErrorMessage(null);
      setStatusMessage("Analyzing certificate via AI verification engine...");
      const response = await verificationMutation.mutateAsync(selectedFile);

      setVerificationResult(response);

      if (response.credibilityScore >= 7) {
        setStatusMessage("Certificate verified successfully! Redirecting...");
        const timer = setTimeout(() => {
          router.push({
            pathname: "/(auth)/login",
            params: { email: email ?? "", password: password ?? "" },
          });
        }, 1500);
        return () => clearTimeout(timer);
      } else {
        setStatusMessage(
          `Verification failed. Credibility score too low (${response.credibilityScore}/10).`,
        );
        Alert.alert(
          "Verification Failed",
          `The certificate could not be verified (Score: ${response.credibilityScore}/10). Please upload a valid graduation document and retry.`,
          [
            {
              text: "Retry",
              onPress: () => {
                setSelectedFile(null);
                setVerificationResult(null);
              },
            },
          ],
        );
      }
    } catch (err: any) {
      const cleanMessage = extractErrorMessage(err);

      setErrorMessage(cleanMessage);
      setStatusMessage("Verification failed.");
      Alert.alert("Error", cleanMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Alumni Verification</Text>
        <Text style={styles.subtitle}>{statusMessage}</Text>

        <TouchableOpacity
          style={styles.dropZone}
          onPress={handlePickDocument}
          activeOpacity={0.8}
        >
          {selectedFile ? (
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{selectedFile.name}</Text>
              <Text style={styles.fileSub}>Tap to change document</Text>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.dropText}>Select PDF Certificate</Text>
              <Text style={styles.dropSub}>Browse files from your device</Text>
            </View>
          )}
        </TouchableOpacity>

        {verificationMutation.isPending && (
          <View style={styles.scannerBox}>
            <Animated.View
              style={[
                styles.scannerBeam,
                { transform: [{ translateY: beamAnim }] },
              ]}
            />
            <Text style={styles.scanningText}>
              Scanning document with AI...
            </Text>
          </View>
        )}

        {errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {verificationResult && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Verification Results</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Credibility Score:</Text>
              <Text style={styles.resultValue}>
                {verificationResult.credibilityScore}/10
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Status:</Text>
              <Text style={styles.resultValue}>
                {verificationResult.documentStatus}
              </Text>
            </View>
            {verificationResult.credibilityScore >= 7 && (
              <Text style={styles.successRedirectText}>
                Redirecting to login...
              </Text>
            )}
          </View>
        )}

        {selectedFile &&
          (!verificationResult || verificationResult.credibilityScore < 7) && (
            <TouchableOpacity
              style={[
                styles.button,
                verificationMutation.isPending && { opacity: 0.6 },
              ]}
              onPress={
                verificationResult
                  ? () => {
                      setSelectedFile(null);
                      setVerificationResult(null);
                    }
                  : handleVerify
              }
              disabled={verificationMutation.isPending}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {verificationMutation.isPending
                  ? "Verifying..."
                  : verificationResult &&
                      verificationResult.credibilityScore < 7
                    ? "Try Another Document"
                    : "Verify Certificate"}
              </Text>
            </TouchableOpacity>
          )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#1e293b",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    padding: 24,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#34d399",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 24,
    marginTop: 4,
  },
  dropZone: {
    borderWidth: 2,
    borderColor: "rgba(16, 185, 129, 0.4)",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 24,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderContainer: {
    alignItems: "center",
  },
  dropText: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "600",
  },
  dropSub: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 4,
  },
  fileInfo: {
    alignItems: "center",
  },
  fileName: {
    color: "#34d399",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  fileSub: {
    color: "#64748b",
    fontSize: 11,
    marginTop: 4,
  },
  scannerBox: {
    height: 100,
    marginTop: 20,
    backgroundColor: "rgba(6, 78, 59, 0.2)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  scannerBeam: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#34d399",
    shadowColor: "#10b981",
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 5,
  },
  scanningText: {
    color: "#34d399",
    fontSize: 13,
    marginTop: 12,
    fontWeight: "500",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#059669",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(127, 29, 29, 0.4)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  errorText: {
    color: "#fca5a5",
    fontSize: 13,
    textAlign: "center",
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: "#0f172a",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#34d399",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(52, 211, 153, 0.2)",
    paddingBottom: 6,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  resultLabel: {
    color: "#94a3b8",
    fontSize: 13,
  },
  resultValue: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "600",
  },
  successRedirectText: {
    marginTop: 12,
    color: "#34d399",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },
});
