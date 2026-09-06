import React from "react";
import { TextInput, TextInputProps, StyleSheet, useColorScheme } from "react-native";

interface ThemedInputProps extends TextInputProps {
  style?: object;
}

export const ThemedInput: React.FC<ThemedInputProps> = ({
  style,
  placeholderTextColor,
  ...props
}) => {
  const isDark = useColorScheme() === "dark";

  return (
    <TextInput
      placeholderTextColor={
        placeholderTextColor ?? (isDark ? "#9CA3AF" : "#6B7280")
      }
      style={[
        styles.input,
        isDark ? styles.darkInput : styles.lightInput,
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 52,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    borderWidth: 1.5,
    marginVertical: 8,
  },
  lightInput: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    color: "#111827",
  },
  darkInput: {
    backgroundColor: "#1F2937",
    borderColor: "#374151",
    color: "#F9FAFB",
  },
});
