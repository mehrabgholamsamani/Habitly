import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

export function Gear({ size = 18, color = "rgba(14,43,43,0.85)" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" fill={color} opacity="0.18" />
      <Path
        d="M19.4 12a7.8 7.8 0 0 0-.1-1l2-1.5-2-3.4-2.4.8a8 8 0 0 0-1.7-1L14.9 3H9.1L8.8 5.9a8 8 0 0 0-1.7 1l-2.4-.8-2 3.4 2 1.5a7.8 7.8 0 0 0 0 2l-2 1.5 2 3.4 2.4-.8a8 8 0 0 0 1.7 1l.3 2.9h5.8l.3-2.9a8 8 0 0 0 1.7-1l2.4.8 2-3.4-2-1.5c.1-.3.1-.7.1-1Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        opacity="0.9"
        fill="none"
      />
      <Path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" stroke={color} strokeWidth="1.8" opacity="0.9" fill="none" />
    </Svg>
  );
}

export function Shield({ size = 18, color = "rgba(14,43,43,0.85)" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2 20 6v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4Z" fill={color} opacity="0.10" />
      <Path d="M12 2 20 6v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" opacity="0.9" fill="none" />
      <Path d="M9.2 12.2 11 14l3.8-4" stroke="rgba(201,168,76,0.90)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Moon({ size = 18, color = "rgba(14,43,43,0.85)" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M21 14.2A8.2 8.2 0 0 1 9.8 3a7 7 0 1 0 11.2 11.2Z" fill={color} opacity="0.12" />
      <Path d="M21 14.2A8.2 8.2 0 0 1 9.8 3a7 7 0 1 0 11.2 11.2Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" opacity="0.9" fill="none" />
    </Svg>
  );
}

export function DownloadIcon({ size = 18, color = "rgba(14,43,43,0.85)" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 3v10" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M8 11l4 4 4-4" stroke="rgba(201,168,76,0.9)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5 19h14" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
    </Svg>
  );
}

export function TrashIcon({ size = 18, color = "rgba(14,43,43,0.85)" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M7 7h10l-1 14H8L7 7Z" fill={color} opacity="0.10" />
      <Path d="M9 7V5h6v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M7 7h10l-1 14H8L7 7Z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none" />
      <Path d="M10 11v6M14 11v6" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
    </Svg>
  );
}

export function ChevronRight({ size = 18, color = "rgba(14,43,43,0.55)" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="m10 7 5 5-5 5" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
