import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  useColorScheme,
  ActivityIndicator,
  View,
} from "react-native";

interface ThemedButtonProps extends TouchableOpacityProps {
  title: string;
  style?: object;
  textStyle?: object;
  loading?: boolean;
}

export const ThemedButtonPrimary: React.FC<ThemedButtonProps> = ({
  title,
  style,
  textStyle,
  disabled,
  loading,
  ...props
}) => {
  const isDark = useColorScheme() === "dark";
  const isInactive = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isInactive}
      style={[
        styles.button,
        isDark ? styles.darkButton : styles.lightButton,
        isInactive && styles.disabledButton,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  lightButton: {
    backgroundColor: "#006837",
  },
  darkButton: {
    backgroundColor: "#008748",
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
