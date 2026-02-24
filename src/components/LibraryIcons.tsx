import React from "react";
import Svg, { Path, Circle } from "react-native-svg";
import { useTheme } from "../theme/ThemeProvider";

export function Sparkle({ size = 18 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2l1.3 5.1L18 8.4l-4.7 1.3L12 15l-1.3-5.3L6 8.4l4.7-1.3L12 2z" fill={colors.accent} opacity="0.95" />
      <Path d="M19.5 13l.6 2.4 2.4.6-2.4.6-.6 2.4-.6-2.4-2.4-.6 2.4-.6.6-2.4z" fill={colors.accent} opacity="0.7" />
    </Svg>
  );
}

export function InfoDot({ size = 18 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" fill="rgba(201,168,76,0.16)" />
      <Path d="M12 10.3c.6 0 1 .4 1 1v5.4h-2v-5.4c0-.6.4-1 1-1Zm0-3c.7 0 1.2.5 1.2 1.2S12.7 9.7 12 9.7s-1.2-.5-1.2-1.2S11.3 7.3 12 7.3Z" fill={colors.accent} />
    </Svg>
  );
}

export function CheckBadge({ size = 18 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" fill="rgba(45,110,110,0.14)" />
      <Path d="M7.8 12.2l2.4 2.5 6.1-6.2" fill="none" stroke={colors.teal} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BookIcon({ size = 24, focused = false }: { size?: number; focused?: boolean }) {
  const { colors } = useTheme();
  const c = focused ? colors.teal : colors.tabIcon;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4.5 4.5h10.6c1.2 0 2.2 1 2.2 2.2V20H6.7c-1.2 0-2.2-1-2.2-2.2V4.5Z" fill="none" stroke={c} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M17.3 20V6.7c0-1.2 1-2.2 2.2-2.2h0.9v13.3c0 1.2-1 2.2-2.2 2.2h-0.9Z" fill="none" stroke={c} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M7.4 8h7.1M7.4 11h7.1M7.4 14h5.4" stroke={c} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function BookmarkIcon({ size = 18, active = false }: { size?: number; active?: boolean }) {
  const { colors } = useTheme();
  const fill = active ? colors.accent : "rgba(255,255,255,0.0)";
  const stroke = active ? colors.accent : "rgba(255,255,255,0.75)";
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M7 4h10a1 1 0 0 1 1 1v16l-6-3-6 3V5a1 1 0 0 1 1-1Z" fill={fill} stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronLeft({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M15 18 9 12l6-6" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
