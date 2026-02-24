import React from "react";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { useTheme } from "../theme/ThemeProvider";

type Props = { size?: number; focused?: boolean };

export function BellIcon({ size = 22 }: Props) {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 22a2.2 2.2 0 0 0 2.1-1.6H9.9A2.2 2.2 0 0 0 12 22Z" fill={colors.card} />
      <Path d="M18 9a6 6 0 0 0-12 0c0 6-2 7-2 7h16s-2-1-2-7Z" fill="none" stroke={colors.card} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

export function ShapeDots({ size = 64 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Circle cx="18" cy="18" r="6" fill="rgba(255,255,255,0.10)" />
      <Circle cx="38" cy="22" r="4" fill="rgba(255,255,255,0.12)" />
      <Rect x="18" y="36" width="10" height="10" rx="3" fill="rgba(255,255,255,0.10)" />
      <Rect x="36" y="34" width="14" height="14" rx="4" fill="rgba(255,255,255,0.08)" />
    </Svg>
  );
}

export function HomeIcon({ size = 24, focused = false }: Props) {
  const { colors } = useTheme();
  const c = focused ? colors.teal : colors.tabIcon;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5Z" fill="none" stroke={c} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

export function SearchIcon({ size = 24, focused = false }: Props) {
  const { colors } = useTheme();
  const c = focused ? colors.teal : colors.tabIcon;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="11" cy="11" r="6.5" stroke={c} strokeWidth={2} fill="none" />
      <Path d="M16.2 16.2 21 21" stroke={c} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function PlayIcon({ size = 24, focused = false }: Props) {
  const { colors } = useTheme();
  const c = focused ? colors.teal : colors.tabIcon;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="9" stroke={c} strokeWidth={2} fill="none" />
      <Path d="M11 9.5 16 12l-5 2.5V9.5Z" fill={c} />
    </Svg>
  );
}

export function ProfileIcon({ size = 24, focused = false }: Props) {
  const { colors } = useTheme();
  const c = focused ? colors.teal : colors.tabIcon;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="8" r="3.5" stroke={c} strokeWidth={2} fill="none" />
      <Path d="M5 21c1.6-4 12.4-4 14 0" stroke={c} strokeWidth={2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function BookIcon({ size = 24, focused = false }: Props) {
  const { colors } = useTheme();
  const c = focused ? colors.teal : colors.tabIcon;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4Z" fill="none" stroke={c} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M5 18h11" stroke={c} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 7h7" stroke={c} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 10h7" stroke={c} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Alias for older imports (used by the bottom tab bar).
// We conceptually treat "Library" as a book icon.
export const LibraryIcon = BookIcon;

export function BackIcon({ size = 22, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const c = color ?? "#fff";
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M15 5 8 12l7 7" fill="none" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

