import type { ReactNode } from "react";
import { Text } from "react-native";

import { useTokens } from "../theme/ThemeProvider";

type H1Props = {
  children: ReactNode;
};

export const H1 = ({ children }: H1Props) => {
  const { color, space } = useTokens();
  return (
    <Text
      style={{
        color: color.textPrimary,
        fontSize: 24,
        fontWeight: "700",
        marginBottom: space.sm
      }}
    >
      {children}
    </Text>
  );
};
