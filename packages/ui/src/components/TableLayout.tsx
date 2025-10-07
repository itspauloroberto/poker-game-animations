import { View } from "react-native";

import { useTokens } from "../theme/ThemeProvider";

export type TableLayoutProps = {
  children?: React.ReactNode;
};

export const TableLayout = ({ children }: TableLayoutProps) => {
  const { color, radius, space } = useTokens();
  return (
    <View
      style={{
        backgroundColor: color.surface,
        borderRadius: radius.lg,
        padding: space.lg,
        borderWidth: 2,
        borderColor: color.accent,
        width: "100%",
        maxWidth: 1020,
        minHeight: 520,
        aspectRatio: 16 / 9,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </View>
  );
};
