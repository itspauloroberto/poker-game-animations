import { Text, View } from "react-native";

import { useTokens } from "../theme/ThemeProvider";

export type SeatProps = {
  label: string;
  offset: { x: number; y: number };
  stack?: number;
  bet?: number;
  alignment?: "left" | "center" | "right";
  variant?: "top" | "bottom";
};

const SEAT_WIDTH = 160;
const SEAT_HEIGHT = 132;

export const Seat = ({
  label,
  offset,
  stack = 0,
  bet = 0,
  alignment = "center",
  variant = "top",
}: SeatProps) => {
  const { color, radius, space, font } = useTokens();

  const alignItems =
    alignment === "left"
      ? "flex-start"
      : alignment === "right"
        ? "flex-end"
        : "center";
  const textAlign =
    alignment === "left" ? "left" : alignment === "right" ? "right" : "center";
  const justifyContent = variant === "top" ? "flex-end" : "flex-start";

  return (
    <View
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [
          { translateX: offset.x - SEAT_WIDTH / 2 },
          { translateY: offset.y - SEAT_HEIGHT / 2 },
        ],
        padding: space.xs,
      }}
      pointerEvents="none"
    >
      <View
        style={{
          width: SEAT_WIDTH,
          height: SEAT_HEIGHT,
          borderRadius: radius.md,
          borderWidth: 2,
          borderColor: color.accent,
          backgroundColor: color.surface,
          alignItems,
          justifyContent,
          gap: space.xs,
          paddingHorizontal: space.sm,
          paddingTop: variant === "bottom" ? space.sm : space.lg,
          paddingBottom: variant === "top" ? space.sm : space.lg,
          shadowColor: color.accent,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        {/* Player Name */}
        <Text
          style={{
            color: color.accent,
            fontFamily: font.body,
            fontWeight: "700",
            fontSize: 14,
            textAlign,
            width: "100%",
            letterSpacing: 0.8,
          }}
        >
          {label}
        </Text>

        {/* Stack Info */}
        <View
          style={{
            flexDirection: alignment === "right" ? "row-reverse" : "row",
            alignItems: "center",
            gap: 6,
            width: "100%",
            justifyContent:
              alignment === "center"
                ? "center"
                : alignment === "left"
                  ? "flex-start"
                  : "flex-end",
          }}
        >
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: color.chip,
              borderWidth: 2,
              borderColor: color.background,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: color.background,
              }}
            />
          </View>
          {alignment === "center" ? (
            <Text
              style={{
                color: color.textPrimary,
                fontFamily: font.mono,
                fontSize: 13,
                fontWeight: "600",
                fontVariant: ["tabular-nums"],
              }}
            >
              ${stack}
            </Text>
          ) : (
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: color.textPrimary,
                  fontFamily: font.mono,
                  fontSize: 13,
                  fontWeight: "600",
                  fontVariant: ["tabular-nums"],
                  textAlign: alignment === "left" ? "left" : "right",
                }}
              >
                ${stack}
              </Text>
            </View>
          )}
        </View>

        {/* Bet Info */}
        {bet > 0 && (
          <View
            style={{
              flexDirection: alignment === "right" ? "row-reverse" : "row",
              alignItems: "center",
              gap: 6,
              width: "100%",
              justifyContent:
                alignment === "center"
                  ? "center"
                  : alignment === "left"
                    ? "flex-start"
                    : "flex-end",
              backgroundColor: color.background,
              paddingVertical: 3,
              paddingHorizontal: 6,
              borderRadius: radius.sm,
              borderWidth: 1,
              borderColor: color.accent,
            }}
          >
            <Text style={{ fontSize: 12 }}>🎲</Text>
            {alignment === "center" ? (
              <Text
                style={{
                  color: color.accent,
                  fontFamily: font.mono,
                  fontSize: 12,
                  fontWeight: "700",
                  fontVariant: ["tabular-nums"],
                }}
              >
                ${bet}
              </Text>
            ) : (
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: color.accent,
                    fontFamily: font.mono,
                    fontSize: 12,
                    fontWeight: "700",
                    fontVariant: ["tabular-nums"],
                    textAlign: alignment === "left" ? "left" : "right",
                  }}
                >
                  ${bet}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};
