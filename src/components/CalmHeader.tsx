import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import { useTheme } from "../theme/ThemeProvider";
import { DefaultAvatar } from "./DefaultAvatar";
import { Sparkle } from "./LibraryIcons";

function Waves({ gid }: { gid: string }) {
  const { colors } = useTheme();
  return (
    <Svg width="100%" height="100%" viewBox="0 0 390 170" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={colors.teal} stopOpacity="1" />
          <Stop offset="1" stopColor={colors.teal} stopOpacity="0.86" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="390" height="170" fill={`url(#${gid})`} />
      <Circle cx="320" cy="46" r="24" fill="rgba(201,168,76,0.14)" />
      <Circle cx="342" cy="58" r="10" fill="rgba(255,255,255,0.10)" />
      <Circle cx="286" cy="70" r="8" fill="rgba(255,255,255,0.08)" />
      <Path d="M0 110c40-18 76-18 116 0s76 18 116 0 76-18 116 0 76 18 116 0v60H0v-60Z" fill="rgba(255,255,255,0.06)" />
      <Path d="M0 128c46-16 86-16 132 0s86 16 132 0 86-16 132 0 86 16 132 0v42H0v-42Z" fill="rgba(255,255,255,0.04)" />
    </Svg>
  );
}

export function CalmHeader({
  title,
  subtitle,
  name,
  avatarUri,
  rightBadge,
  onPressRight,
}: {
  title: string;
  subtitle: string;
  name?: string;
  avatarUri?: string;
  rightBadge?: React.ReactNode;
  onPressRight?: () => void;
}) {
  const { spacing, typography } = useTheme();
  const gid = React.useMemo(() => `hbg_${Math.random().toString(16).slice(2)}`, []);

  return (
    <View style={{ height: 190, width: "100%" }}>
      <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
        <Waves gid={gid} />
      </View>

      <SafeAreaView style={{ flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.sm }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.12)", overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
              {avatarUri ? <Image source={{ uri: avatarUri }} style={{ width: 44, height: 44 }} /> : <DefaultAvatar size={44} />}
            </View>

            <View>
              <Text style={[typography.sub, { color: "rgba(255,255,255,0.78)" }]}>Welcome back</Text>
              <Text style={[typography.body, { color: "#fff", fontWeight: "900", marginTop: 2 }]} numberOfLines={1}>{name || "User"}</Text>
            </View>
          </View>

          <Pressable
            onPress={onPressRight}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" }}
          >
            {rightBadge ? rightBadge : <Sparkle size={18} />}
          </Pressable>
        </View>

        <View style={{ marginTop: 18 }}>
          <Text style={[typography.title, { color: "#fff", fontSize: 26, lineHeight: 32 }]}>{title}</Text>
          <Text style={[typography.sub, { color: "rgba(255,255,255,0.78)", marginTop: 6 }]}>{subtitle}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
