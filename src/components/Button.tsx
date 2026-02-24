import React from "react";
import { Pressable, Text, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
};

export const Button: React.FC<Props> = ({ title, onPress, variant = "primary", style }) => {
  const { colors, typography } = useTheme();
  const bg = variant === "primary" ? colors.primary : "rgba(16,34,36,0.06)";
  const fg = variant === "primary" ? "#fff" : colors.text;
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          height: 46,
          paddingHorizontal: 18,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bg,
        },
        style,
      ]}
    >
      <Text style={[typography.body, { color: fg, fontWeight: "800" }]}>{title}</Text>
    </Pressable>
  );
};
