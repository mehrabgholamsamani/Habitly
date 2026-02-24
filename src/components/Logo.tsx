import React from "react";
import Svg, { Path, Rect } from "react-native-svg";
import { useTheme } from "../theme/ThemeProvider";

export const Logo: React.FC<{ size?: number }> = ({ size = 28 }) => {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Rect x="8" y="8" width="48" height="48" rx="16" fill={colors.primarySoft} />
      <Path d="M22 34c0-9 6-16 16-16 1 0 2 0 3 .2" stroke={colors.primary} strokeWidth={5} strokeLinecap="round" fill="none" />
      <Path d="M42 30c0 9-6 16-16 16-1 0-2 0-3-.2" stroke={colors.primaryDark} strokeWidth={5} strokeLinecap="round" fill="none" />
      <Path d="M26 40h12" stroke={colors.secondary} strokeWidth={5} strokeLinecap="round" />
    </Svg>
  );
};
