import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

export function SunIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="4" fill="rgba(201,168,76,0.85)" />
      <Path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.4 4.4l2.1 2.1M17.5 17.5l2.1 2.1M19.6 4.4l-2.1 2.1M6.5 17.5l-2.1 2.1" stroke="rgba(201,168,76,0.70)" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function FlameIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2c2 4-1 5 1 8 1.2 1.8 4 2.2 4 6.1A5 5 0 1 1 7 16c0-2.6 2-4 3-5.4C11 9 10.8 6 12 2Z" fill="rgba(201,168,76,0.78)" />
    </Svg>
  );
}

export function CheckCircle({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="9" fill="rgba(45,110,110,0.12)" stroke="rgba(45,110,110,0.55)" strokeWidth="2" />
      <Path d="M8 12.2l2.4 2.4L16.4 9" stroke="rgba(45,110,110,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SparkleGold({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2l1.3 6.1L19 9.4l-5.7 1.3L12 16.8l-1.3-6.1L5 9.4l5.7-1.3L12 2Z" fill="rgba(201,168,76,0.85)" />
      <Circle cx="19" cy="5" r="1.6" fill="rgba(201,168,76,0.55)" />
      <Circle cx="5" cy="18.5" r="1.2" fill="rgba(201,168,76,0.40)" />
    </Svg>
  );
}
