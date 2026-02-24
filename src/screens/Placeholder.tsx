import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { Card } from "../components/Card";

export default function Placeholder({ title, subtitle }: { title: string; subtitle?: string }) {
  const { colors, spacing, typography } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.xl }}>
      <Card>
        <Text style={[typography.h2, { color: colors.text }]}>{title}</Text>
        {!!subtitle && <Text style={[typography.body, { color: colors.subtext, marginTop: 8 }]}>{subtitle}</Text>}
      </Card>
    </View>
  );
}
