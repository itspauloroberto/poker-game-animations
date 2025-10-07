import { Text, View } from "react-native";

import type { Card } from "@game-core";
import { useTokens } from "../theme/ThemeProvider";

type CardFaceProps = {
  card: Card;
  faceDown?: boolean;
};

const suitSymbol: Record<Card["suit"], string> = {
  clubs: "♣",
  diamonds: "♦",
  hearts: "♥",
  spades: "♠",
};

const suitColor: Record<Card["suit"], string> = {
  clubs: "#eee",
  spades: "#eee",
  diamonds: "#ef4444",
  hearts: "#ef4444",
};

const CARD_WIDTH = 72;
const CARD_HEIGHT = 104;

export const CardFace = ({ card, faceDown = false }: CardFaceProps) => {
  const { radius, color, space } = useTokens();

  if (faceDown) {
    return (
      <View
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: radius.md,
          backgroundColor: color.accent,
          borderWidth: 2,
          borderColor: color.background,
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: color.textSecondary,
        backgroundColor: color.surface,
        padding: space.sm,
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{ color: suitColor[card.suit], fontWeight: "700", fontSize: 18 }}
      >
        {card.rank}
      </Text>
      <Text
        style={{
          color: suitColor[card.suit],
          fontSize: 20,
          textAlign: "center",
        }}
      >
        {suitSymbol[card.suit]}
      </Text>
      <Text
        style={{
          color: suitColor[card.suit],
          fontWeight: "700",
          fontSize: 18,
          textAlign: "right",
        }}
      >
        {card.rank}
      </Text>
    </View>
  );
};

export const CARD_SIZES = { width: CARD_WIDTH, height: CARD_HEIGHT } as const;
