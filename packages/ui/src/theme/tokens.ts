export type ThemeName = "casinoNight" | "neonTech";

type Radii = "sm" | "md" | "lg";
type Spaces = "xs" | "sm" | "md" | "lg";

type ThemeColors = {
  background: string;
  surface: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  chip: string;
};

export type ThemeTokens = {
  radius: Record<Radii, number>;
  space: Record<Spaces, number>;
  color: ThemeColors;
};

const baseRadii: ThemeTokens["radius"] = {
  sm: 6,
  md: 12,
  lg: 20
};

const baseSpace: ThemeTokens["space"] = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16
};

export const themes: Record<ThemeName, ThemeTokens> = {
  casinoNight: {
    radius: baseRadii,
    space: baseSpace,
    color: {
      background: "#0a0f14",
      surface: "#111b24",
      accent: "#ffd166",
      textPrimary: "#f6f6f6",
      textSecondary: "#a0b2c1",
      chip: "#ffd166"
    }
  },
  neonTech: {
    radius: baseRadii,
    space: baseSpace,
    color: {
      background: "#010306",
      surface: "#08111c",
      accent: "#00ffd1",
      textPrimary: "#e6f7ff",
      textSecondary: "#6bc1ff",
      chip: "#60f9a6"
    }
  }
};

export const getTokens = (theme: ThemeName): ThemeTokens => themes[theme];
