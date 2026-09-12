// hooks/useCertVerification.ts
import { useMutation } from "@tanstack/react-query";
import { readAsStringAsync, EncodingType } from "expo-file-system/legacy";
import { Platform } from "react-native";
import { BASE_URL } from "../client";

export interface CertificateVerificationResponse {
  credibilityScore: number;
  documentStatus: string;
  time: string;
}

export interface DocumentFile {
  uri: string;
  name: string;
  type: string;
  file?: File; // Native web File object support
}

export function useCertVerification() {
  return useMutation<CertificateVerificationResponse, Error, DocumentFile>({
    mutationFn: async (file: DocumentFile) => {
      let base64File = "";

      if (Platform.OS === "web") {
        // On web, read the underlying File object directly via FileReader
        const webFile =
          file.file || ((await fetch(file.uri).then((r) => r.blob())) as any);
        base64File = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Strip out the Data-URL prefix (e.g. "data:application/pdf;base64,")
            const base64String = result.includes(",")
              ? result.split(",")[1]
              : result;
            resolve(base64String);
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(webFile);
        });
      } else {
        // On native (iOS/Android), use the file-system legacy module
        base64File = await readAsStringAsync(file.uri, {
          encoding: EncodingType.Base64,
        });
      }

      const response = await fetch(`${BASE_URL}certificates/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          base64File: base64File,
          fileName: file.name || "certificate.pdf",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to verify certificate.");
      }

      return response.json();
    },
  });
}
