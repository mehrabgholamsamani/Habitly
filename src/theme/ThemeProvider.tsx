import React, { createContext, useContext, useMemo } from "react";
import { colors } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";

type Theme = {
  colors: typeof colors;
  spacing: typeof spacing;
  typography: typeof typography;
};

const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo(() => ({ colors, spacing, typography }), []);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("ThemeProvider missing");
  return ctx;
};
