import { Text, View } from "react-native";

import { useTokens } from "../theme/ThemeProvider";
import { ChipStack } from "./ChipStack";

export type PotProps = {
  amount: number;
};

const formatCurrency = (value: number) => `$${value.toFixed(0)}`;

export const Pot = ({ amount }: PotProps) => {
  const { color, radius, space, font } = useTokens();
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: space.xs,
        pointerEvents: "none",
      }}
    >
      <ChipStack
        count={Math.min(6, Math.max(2, Math.round(amount / 25) || 2))}
      />
      <View
        style={{
          paddingVertical: space.xs,
          paddingHorizontal: space.md,
          borderRadius: radius.sm,
          backgroundColor: color.accent,
        }}
      >
        <Text
          style={{
            color: color.background,
            fontFamily: font.body,
            fontWeight: "700",
            letterSpacing: 0.5,
          }}
        >
          POT:{" "}
          <Text
            style={{ fontFamily: font.mono, fontVariant: ["tabular-nums"] }}
          >
            {formatCurrency(amount)}
          </Text>
        </Text>
      </View>
    </View>
  );
};
