import React from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../theme/ThemeProvider";
import { Habit } from "../models/types";

export const HabitRow: React.FC<{
  habit: Habit;
  done: boolean;
  streak: number;
  onToggle: () => void;
  onLongPress?: () => void;
}> = ({ habit, done, streak, onToggle, onLongPress }) => {
  const { colors, spacing, typography } = useTheme();
  return (
    <Pressable
      onPress={async () => {
        await Haptics.selectionAsync();
        onToggle();
      }}
      onLongPress={onLongPress}
      style={{
        backgroundColor: habit.color,
        borderRadius: spacing.radiusLg,
        padding: spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.35)",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.35)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ width: 16, height: 16, borderRadius: 6, backgroundColor: "rgba(16,34,36,0.20)" }} />
</View>
        <View style={{ flex: 1 }}>
          <Text style={[typography.h3, { color: colors.text }]} numberOfLines={1}>
            {habit.name}
          </Text>
          <Text style={[typography.small, { color: colors.subtext, marginTop: 2 }]}>
            🔥 {streak} streak · grace {habit.graceDays}d
          </Text>
        </View>
      </View>

      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          backgroundColor: done ? colors.success : "rgba(255,255,255,0.35)",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.05)",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>{done ? "✓" : ""}</Text>
      </View>
    </Pressable>
  );
};
