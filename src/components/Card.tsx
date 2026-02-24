import React from "react";
import { View, ViewStyle, Platform } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

type Props = { children: React.ReactNode; style?: ViewStyle };

export const Card: React.FC<Props> = ({ children, style }) => {
  const { colors } = useTheme();
  const webShadow = Platform.OS === "web" ? ({ boxShadow: "0px 12px 26px rgba(0,0,0,0.08)" } as any) : {};
  const nativeShadow =
    Platform.OS === "web"
      ? {}
      : {
          shadowColor: colors.shadow,
          shadowOpacity: 0.1,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 6,
        };

  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.border,
          ...(webShadow as any),
          ...(nativeShadow as any),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
