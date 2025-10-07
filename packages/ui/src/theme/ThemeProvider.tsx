import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { getTokens, themes, type ThemeName, type ThemeTokens } from "./tokens";

type ThemeContextValue = {
  name: ThemeName;
  tokens: ThemeTokens;
  setTheme: (name: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export type ThemeProviderProps = {
  initialTheme?: ThemeName;
  children: ReactNode;
};

export const ThemeProvider = ({ initialTheme = "casinoNight", children }: ThemeProviderProps) => {
  const [name, setName] = useState<ThemeName>(initialTheme);

  const value = useMemo<ThemeContextValue>(
    () => ({
      name,
      tokens: getTokens(name),
      setTheme: setName
    }),
    [name]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useTokens = () => useTheme().tokens;

export const availableThemes = Object.keys(themes) as ThemeName[];
