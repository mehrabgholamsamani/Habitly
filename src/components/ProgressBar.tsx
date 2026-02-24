import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export function ProgressBar({ value }: { value: number }) {
  const { colors } = useTheme();
  const v = Math.max(0, Math.min(1, value));
  return (
    <View style={{ height: 8, borderRadius: 999, backgroundColor: "rgba(14,43,43,0.10)", overflow: "hidden" }}>
      <View style={{ width: `${v * 100}%`, height: 8, borderRadius: 999, backgroundColor: colors.accent }} />
    </View>
  );
}
