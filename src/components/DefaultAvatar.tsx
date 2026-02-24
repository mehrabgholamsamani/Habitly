import React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { useTheme } from "../theme/ThemeProvider";

export function DefaultAvatar({ size = 42 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="24" fill="rgba(255,255,255,0.18)" />
      <Circle cx="24" cy="18.5" r="7" fill="rgba(255,255,255,0.60)" />
      <Path d="M10 40c3.2-8 24.8-8 28 0" fill="rgba(255,255,255,0.60)" />
      <Circle cx="24" cy="24" r="23" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
    </Svg>
  );
}
