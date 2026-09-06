import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  useColorScheme,
} from "react-native";

interface ThemedButtonProps extends TouchableOpacityProps {
  title: string;
  style?: object;
  textStyle?: object;
}

export const ThemedButtonPrimary: React.FC<ThemedButtonProps> = ({
  title,
  style,
  textStyle,
  ...props
}) => {
  const isDark = useColorScheme() === "dark";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        isDark ? styles.darkButton : styles.lightButton,
        style,
      ]}
      {...props}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
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
    backgroundColor: "#006837", // Richfield Green
  },
  darkButton: {
    backgroundColor: "#008748", // Brightened green contrast for dark mode
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
