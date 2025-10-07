import { Text, View } from "react-native";

import { useTokens } from "../theme/ThemeProvider";

export type SeatProps = {
  label: string;
  offset: { x: number; y: number };
  stack?: number;
  bet?: number;
};

const SEAT_WIDTH = 140;
const SEAT_HEIGHT = 86;

export const Seat = ({ label, offset, stack = 0, bet = 0 }: SeatProps) => {
  const { color, radius, space } = useTokens();

  return (
    <View
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [
          { translateX: offset.x - SEAT_WIDTH / 2 },
          { translateY: offset.y - SEAT_HEIGHT / 2 }
        ],
        padding: space.xs
      }}
      pointerEvents="none"
    >
      <View
        style={{
          width: SEAT_WIDTH,
          height: SEAT_HEIGHT,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: color.textSecondary,
          backgroundColor: color.surface,
          alignItems: "center",
          justifyContent: "center",
          gap: space.xs
        }}
      >
        <Text style={{ color: color.textSecondary, fontWeight: "600" }}>{label}</Text>
        <Text style={{ color: color.textSecondary, fontSize: 12 }}>Stack: ${stack}</Text>
        <Text style={{ color: color.textSecondary, fontSize: 12 }}>Bet: ${bet}</Text>
      </View>
    </View>
  );
};
