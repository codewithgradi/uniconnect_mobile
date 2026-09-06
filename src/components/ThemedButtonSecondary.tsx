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

export const ThemedButtonSecondary: React.FC<ThemedButtonProps> = ({
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
      <Text
        style={[
          styles.text,
          isDark ? styles.darkText : styles.lightText,
          textStyle,
        ]}
      >
        {title}
      </Text>
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
    borderWidth: 2,
    marginVertical: 8,
  },
  lightButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#006837",
  },
  darkButton: {
    backgroundColor: "#111827",
    borderColor: "#008748",
  },
  lightText: {
    color: "#006837",
  },
  darkText: {
    color: "#008748",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
