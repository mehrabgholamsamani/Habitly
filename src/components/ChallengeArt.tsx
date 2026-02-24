import React from "react";
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop } from "react-native-svg";
import { useTheme } from "../theme/ThemeProvider";

export function ChallengeArt({ id, size = 70 }: { id: string; size?: number }) {
  const { colors } = useTheme();
  const uid = React.useMemo(() => Math.random().toString(16).slice(2), []);
  const common = { width: size, height: size, viewBox: "0 0 70 70" as const };
  const bg = colors.tealMuted;
  const gold = colors.accent;

  if (id === "c1") {
    return (
      <Svg {...common}>
        <Defs>
          <LinearGradient id={`g1_${uid}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={bg} stopOpacity="0.95" />
            <Stop offset="1" stopColor={colors.teal} stopOpacity="0.25" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="70" height="70" rx="18" fill={`url(#g1_${uid})`} />
        <Circle cx="52" cy="18" r="7" fill="rgba(201,168,76,0.22)" />
        <Path d="M20 44c5-12 25-12 30 0" fill="rgba(255,255,255,0.18)" />
        <Path d="M35 20c7 0 12 5 12 11 0 8-7 15-12 19-5-4-12-11-12-19 0-6 5-11 12-11Z" fill="rgba(255,255,255,0.26)" />
        <Path d="M35 24c4 0 7 3 7 7 0 5-4 10-7 12-3-2-7-7-7-12 0-4 3-7 7-7Z" fill="rgba(201,168,76,0.22)" />
      </Svg>
    );
  }

  if (id === "c2") {
    return (
      <Svg {...common}>
        <Rect x="0" y="0" width="70" height="70" rx="18" fill={bg} opacity="0.95" />
        <Circle cx="22" cy="26" r="12" fill="rgba(255,255,255,0.18)" />
        <Circle cx="48" cy="36" r="14" fill="rgba(255,255,255,0.12)" />
        <Path d="M12 44c9-10 20-10 30 0s21 10 28 2" fill="none" stroke="rgba(201,168,76,0.70)" strokeWidth="3.4" strokeLinecap="round" />
        <Path d="M12 52c9-8 20-8 30 0s21 8 28 2" fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth="3.2" strokeLinecap="round" />
      </Svg>
    );
  }

  if (id === "c3") {
    return (
      <Svg {...common}>
        <Rect x="0" y="0" width="70" height="70" rx="18" fill={bg} opacity="0.95" />
        <Circle cx="46" cy="24" r="10" fill="rgba(255,255,255,0.22)" />
        <Circle cx="49" cy="22" r="9" fill={bg} />
        <Circle cx="22" cy="24" r="5" fill="rgba(201,168,76,0.45)" />
        <Path d="M16 44c6 8 14 12 19 12 9 0 15-7 19-12" fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="3.2" strokeLinecap="round" />
        <Path d="M22 40c3 2 6 3 8 3s5-1 8-3" fill="none" stroke="rgba(201,168,76,0.70)" strokeWidth="3.2" strokeLinecap="round" />
      </Svg>
    );
  }

  if (id === "c4") {
    return (
      <Svg {...common}>
        <Rect x="0" y="0" width="70" height="70" rx="18" fill={bg} opacity="0.95" />
        <Circle cx="35" cy="30" r="16" fill="rgba(255,255,255,0.18)" />
        <Path d="M35 16c6 4 10 10 10 17 0 10-9 19-10 20-1-1-10-10-10-20 0-7 4-13 10-17Z" fill="rgba(255,255,255,0.16)" />
        <Path d="M27 32c3 3 5 6 8 10 3-4 5-7 8-10" fill="none" stroke="rgba(201,168,76,0.75)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }


if (id === "c6") {
  return (
    <Svg {...common}>
      <Rect x="0" y="0" width="70" height="70" rx="18" fill={bg} opacity="0.95" />
      <Circle cx="50" cy="20" r="10" fill="rgba(201,168,76,0.26)" />
      <Path d="M14 46c10-18 32-18 42 0" fill="rgba(255,255,255,0.16)" />
      <Path d="M22 44c4-10 9-16 13-16s9 6 13 16" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="3.2" strokeLinecap="round" />
      <Path d="M28 26l7 7 7-7" fill="none" stroke="rgba(201,168,76,0.78)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

if (id === "c7") {
  return (
    <Svg {...common}>
      <Rect x="0" y="0" width="70" height="70" rx="18" fill={bg} opacity="0.95" />
      <Circle cx="35" cy="26" r="14" fill="rgba(255,255,255,0.18)" />
      <Path d="M35 14l4.2 8.6 9.5 1.4-6.9 6.7 1.7 9.5L35 36.8l-8.5 4.5 1.7-9.5-6.9-6.7 9.5-1.4L35 14Z" fill="rgba(201,168,76,0.60)" opacity="0.55" />
      <Path d="M20 54h30" stroke="rgba(255,255,255,0.22)" strokeWidth="3.2" strokeLinecap="round" />
    </Svg>
  );
}

if (id === "c8") {
  return (
    <Svg {...common}>
      <Rect x="0" y="0" width="70" height="70" rx="18" fill={bg} opacity="0.95" />
      <Circle cx="24" cy="28" r="10" fill="rgba(255,255,255,0.18)" />
      <Circle cx="46" cy="28" r="10" fill="rgba(255,255,255,0.14)" />
      <Path d="M35 52c-10-6-18-14-18-22 0-6 5-10 11-9 3 .5 5 2 7 4 2-2 4-3.5 7-4 6-1 11 3 11 9 0 8-8 16-18 22Z" fill="rgba(201,168,76,0.55)" opacity="0.55" />
    </Svg>
  );
}

if (id === "c9") {
  return (
    <Svg {...common}>
      <Rect x="0" y="0" width="70" height="70" rx="18" fill={bg} opacity="0.95" />
      <Rect x="16" y="18" width="38" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
      <Rect x="12" y="34" width="46" height="10" rx="5" fill="rgba(255,255,255,0.14)" />
      <Rect x="20" y="50" width="30" height="8" rx="4" fill="rgba(201,168,76,0.35)" />
      <Path d="M18 23h34" stroke="rgba(201,168,76,0.70)" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

if (id === "c10") {
  return (
    <Svg {...common}>
      <Rect x="0" y="0" width="70" height="70" rx="18" fill={bg} opacity="0.95" />
      <Circle cx="35" cy="30" r="16" fill="rgba(255,255,255,0.16)" />
      <Path d="M26 30c4 4 14 4 18 0" fill="none" stroke="rgba(201,168,76,0.78)" strokeWidth="3.2" strokeLinecap="round" />
      <Path d="M22 48c6 6 13 9 13 9s7-3 13-9" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="3.2" strokeLinecap="round" />
      <Path d="M24 24c0 6 22 6 22 0" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="3.2" strokeLinecap="round" />
    </Svg>
  );
}

  return (
    <Svg {...common}>
      <Rect x="0" y="0" width="70" height="70" rx="18" fill={bg} opacity="0.95" />
      <Circle cx="35" cy="26" r="13" fill="rgba(255,255,255,0.18)" />
      <Path d="M18 50h34" stroke="rgba(255,255,255,0.22)" strokeWidth="3.2" strokeLinecap="round" />
      <Path d="M24 50c2-10 6-18 11-18s9 8 11 18" fill="none" stroke="rgba(201,168,76,0.75)" strokeWidth="3.2" strokeLinecap="round" />
    </Svg>
  );
}
