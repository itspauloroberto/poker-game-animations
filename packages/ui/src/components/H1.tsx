import type { ReactNode } from "react";
import { Text } from "react-native";

import { useTokens } from "../theme/ThemeProvider";

type H1Props = {
  children: ReactNode;
};

export const H1 = ({ children }: H1Props) => {
  const { color, space, font } = useTokens();
  return (
    <Text
      style={{
        color: color.textPrimary,
        fontFamily: font.heading,
        fontSize: 32,
        fontWeight: "700",
        letterSpacing: 1.5,
        marginBottom: space.sm,
      }}
    >
      {children}
    </Text>
  );
};
