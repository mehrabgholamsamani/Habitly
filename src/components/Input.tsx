import React from "react";
import { TextInput, View, Text, Pressable } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export const Input: React.FC<{
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  right?: React.ReactNode;
}> = ({ label, value, onChangeText, placeholder, right }) => {
  const { colors, spacing, typography } = useTheme();
  return (
    <View style={{ gap: spacing.xs }}>
      {!!label && <Text style={[typography.small, { color: colors.subtext }]}>{label}</Text>}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: spacing.radius,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.subtext}
          style={{ flex: 1, fontSize: 16, color: colors.text, fontWeight: "700" }}
        />
        {right}
      </View>
    </View>
  );
};

export const TinyButton: React.FC<{ text: string; onPress: () => void }> = ({ text, onPress }) => {
  const { colors, spacing, typography } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 999,
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text style={[typography.small, { color: colors.primaryDark }]}>{text}</Text>
    </Pressable>
  );
};
