import { Pressable, Text, View } from "react-native";

import { availableThemes, useTheme, useTokens } from "../theme/ThemeProvider";
import type { ThemeName } from "../theme/tokens";

const labels: Record<ThemeName, string> = {
  casinoNight: "Casino Night",
  neonTech: "Neon Tech"
};

export const ThemeToggle = () => {
  const { name, setTheme } = useTheme();
  const { color, space, radius } = useTokens();
  const lastIndex = availableThemes.length - 1;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: color.surface,
        padding: space.xs,
        borderRadius: radius.md
      }}
    >
      {availableThemes.map((theme, index) => {
        const isActive = name === theme;
        return (
          <Pressable
            key={theme}
            accessibilityRole="button"
            accessibilityLabel={`Switch to ${labels[theme]} theme`}
            onPress={() => setTheme(theme)}
            style={({ pressed }) => ({
              paddingVertical: space.xs,
              paddingHorizontal: space.sm,
              borderRadius: radius.sm,
              backgroundColor: isActive ? color.accent : "transparent",
              marginRight: index === lastIndex ? 0 : space.xs,
              opacity: pressed ? 0.8 : 1
            })}
          >
            <Text
              style={{
                color: isActive ? color.background : color.textSecondary,
                fontWeight: "600"
              }}
            >
              {labels[theme]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
