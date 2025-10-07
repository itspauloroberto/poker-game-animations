import { Text, View } from "react-native";

import { useTokens } from "../theme/ThemeProvider";
import { ChipStack } from "./ChipStack";

export type PotProps = {
  amount: number;
};

const formatCurrency = (value: number) => `$${value.toFixed(0)}`;

export const Pot = ({ amount }: PotProps) => {
  const { color, radius, space } = useTokens();
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: space.xs
      }}
      pointerEvents="none"
    >
      <ChipStack count={Math.min(6, Math.max(2, Math.round(amount / 25) || 2))} />
      <View
        style={{
          paddingVertical: space.xs,
          paddingHorizontal: space.md,
          borderRadius: radius.sm,
          backgroundColor: color.accent
        }}
      >
        <Text style={{ color: color.background, fontWeight: "700" }}>Pot: {formatCurrency(amount)}</Text>
      </View>
    </View>
  );
};
