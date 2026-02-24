import React from "react";
import { Pressable, Text, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export const Fab: React.FC<{ label?: string; onPress: () => void; style?: ViewStyle }> = ({ label = "+", onPress, style }) => {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          position: "absolute",
          right: 18,
          bottom: 18,
          width: 60,
          height: 60,
          borderRadius: 999,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
        },
        style,
      ]}
    >
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "900" }}>{label}</Text>
    </Pressable>
  );
};
