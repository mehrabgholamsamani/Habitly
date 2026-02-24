import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

type Option<T extends string> = { label: string; value: T };

export function PillTabs<T extends string>({
  value,
  onChange,
  options,
  light = false,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  light?: boolean;
}) {
  const { colors, spacing, typography } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 6,
        borderRadius: 22,
        backgroundColor: light ? "rgba(255,255,255,0.14)" : "rgba(16,34,36,0.06)",
        borderWidth: 1,
        borderColor: light ? "rgba(255,255,255,0.10)" : colors.border,
      }}
    >
      {options.map((o) => {
        const active = o.value === value;
        const bg = light ? (active ? "rgba(255,255,255,0.20)" : "transparent") : active ? colors.primarySoft : "transparent";
        const fg = light ? (active ? "#fff" : "rgba(255,255,255,0.40)") : active ? colors.primaryDark : "rgba(16,34,36,0.40)";
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: bg,
            }}
          >
            <Text style={[typography.body, { color: fg, fontWeight: "800" }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
