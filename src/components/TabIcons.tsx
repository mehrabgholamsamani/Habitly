import React from "react";
import Svg, { Path, Circle } from "react-native-svg";
import { useTheme } from "../theme/ThemeProvider";

type Props = { focused: boolean; size?: number };

export const HomeIcon: React.FC<Props> = ({ focused, size = 24 }) => {
  const { colors } = useTheme();
  const c = focused ? colors.primary : colors.tabIcon;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5Z" fill="none" stroke={c} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
};

export const SearchIcon: React.FC<Props> = ({ focused, size = 24 }) => {
  const { colors } = useTheme();
  const c = focused ? colors.primary : colors.tabIcon;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="11" cy="11" r="6.5" stroke={c} strokeWidth={2} fill="none" />
      <Path d="M16.2 16.2 21 21" stroke={c} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
};

export const PlayIcon: React.FC<Props> = ({ focused, size = 24 }) => {
  const { colors } = useTheme();
  const c = focused ? colors.primary : colors.tabIcon;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="9" stroke={c} strokeWidth={2} fill="none" />
      <Path d="M11 9.5 16 12l-5 2.5V9.5Z" fill={c} />
    </Svg>
  );
};

export const UserIcon: React.FC<Props> = ({ focused, size = 24 }) => {
  const { colors } = useTheme();
  const c = focused ? colors.primary : colors.tabIcon;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="8" r="3.5" stroke={c} strokeWidth={2} fill="none" />
      <Path d="M5 21c1.6-4 12.4-4 14 0" stroke={c} strokeWidth={2} strokeLinecap="round" fill="none" />
    </Svg>
  );
};
