import { useCallback, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import type { Card } from "@game-core";
import { createDeck, createRng, shuffle } from "@game-core";

import { useTokens } from "../theme/ThemeProvider";
import { ChipMovement } from "./ChipMovement";
import type { ChipTarget } from "./ChipMovement.types";
import {
  DealAnimation,
  DEAL_STAGGER,
  type DealAnimationProps,
} from "./DealAnimation";
import { Pot } from "./Pot";
import { Seat } from "./Seat";
import { TableLayout } from "./TableLayout";

type SeatAlignment = "left" | "center" | "right";
type SeatVariant = "top" | "bottom";

type SeatLayout = {
  offset: { x: number; y: number };
  alignment: SeatAlignment;
  variant: SeatVariant;
  cardOffsets: {
    x: number;
    y: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
  }[];
};

const seatLayouts: SeatLayout[] = [
  // Seat 1: Top Left
  {
    offset: { x: -280, y: -190 },
    alignment: "left",
    variant: "top",
    cardOffsets: [
      { x: -70, y: -60, rotateX: 15, rotateY: 9, rotateZ: 328 },
      { x: -20, y: -60, rotateX: -15, rotateY: -9, rotateZ: 30 },
    ],
  },
  // Seat 2: Top Center
  {
    offset: { x: 0, y: -190 },
    alignment: "center",
    variant: "top",
    cardOffsets: [
      { x: -25, y: -60, rotateX: 15, rotateY: 9, rotateZ: 328 },
      { x: 30, y: -60, rotateX: -15, rotateY: -9, rotateZ: 30 },
    ],
  },
  // Seat 3: Top Right
  {
    offset: { x: 275, y: -190 },
    alignment: "right",
    variant: "top",
    cardOffsets: [
      { x: 10, y: -60, rotateX: 15, rotateY: 9, rotateZ: 328 },
      { x: 60, y: -60, rotateX: -15, rotateY: -9, rotateZ: 30 },
    ],
  },
  // Seat 4: Bottom Left
  {
    offset: { x: -280, y: 180 },
    alignment: "left",
    variant: "bottom",
    cardOffsets: [
      { x: -70, y: 60, rotateX: 15, rotateY: 9, rotateZ: 328 },
      { x: -20, y: 60, rotateX: -15, rotateY: -9, rotateZ: 30 },
    ],
  },
  // Seat 5: Bottom Center
  {
    offset: { x: 0, y: 180 },
    alignment: "center",
    variant: "bottom",
    cardOffsets: [
      { x: -25, y: 60, rotateX: 15, rotateY: 9, rotateZ: 328 },
      { x: 30, y: 60, rotateX: -15, rotateY: -9, rotateZ: 30 },
    ],
  },
  // Seat 6: Bottom Right
  {
    offset: { x: 275, y: 180 },
    alignment: "right",
    variant: "bottom",
    cardOffsets: [
      { x: 10, y: 60, rotateX: 15, rotateY: 9, rotateZ: 328 },
      { x: 60, y: 60, rotateX: -15, rotateY: -9, rotateZ: 30 },
    ],
  },
];

const INITIAL_STACK = 200;
const BET_SIZE = 25;

const amountToChipCount = (amount: number) =>
  Math.min(6, Math.max(2, Math.ceil(amount / 20)));

type SeatConfig = {
  label: string;
  cards: [Card, Card];
} & SeatLayout;

type SeatState = SeatConfig & {
  stack: number;
  bet: number;
};

const buildSeatConfig = (seed: number): SeatConfig[] => {
  const deck = createDeck();
  const rng = createRng(seed);
  const shuffled = shuffle(deck, rng);

  return seatLayouts.map((layout, index) => {
    const first = shuffled[index * 2];
    const second = shuffled[index * 2 + 1];
    return {
      label: `Seat ${index + 1}`,
      cards: [first, second],
      ...layout,
    };
  });
};

const toDealTargets = (
  seats: SeatConfig[],
  trigger: number
): DealAnimationProps["targets"] =>
  Array.from({ length: 2 }).flatMap((_, cardIndex) =>
    seats.map((seat, seatIndex) => {
      const card = seat.cards[cardIndex];
      const cardOffset = seat.cardOffsets[cardIndex];
      const finalX = seat.offset.x + cardOffset.x;
      const finalY = seat.offset.y + cardOffset.y;
      return {
        id: `${seat.label}-${trigger}-card${cardIndex}-${card.rank}${card.suit}`,
        offset: {
          x: finalX,
          y: finalY,
          rotateX: cardOffset.rotateX,
          rotateY: cardOffset.rotateY,
          rotateZ: cardOffset.rotateZ,
        },
        card,
        order: cardIndex * seats.length + seatIndex,
      };
    })
  );

const getNextSeed = (current: number) => (current + 137) % 1000;

export const Table = () => {
  const { color, space, radius, font } = useTokens();
  const [seed, setSeed] = useState(42);
  const [chipTrigger, setChipTrigger] = useState(0);
  const [dealTrigger, setDealTrigger] = useState(-1); // Start at -1 so cards don't deal on mount
  const [stacks, setStacks] = useState(() =>
    seatLayouts.map(() => INITIAL_STACK)
  );
  const [bets, setBets] = useState(() => seatLayouts.map(() => 0));
  const [pot, setPot] = useState(0);
  const [chipTargets, setChipTargets] = useState<ChipTarget[]>([]);

  const seatConfigs = useMemo(() => buildSeatConfig(seed), [seed]);

  const seatStates: SeatState[] = useMemo(
    () =>
      seatConfigs.map((seat, index) => ({
        ...seat,
        stack: stacks[index],
        bet: bets[index],
      })),
    [seatConfigs, stacks, bets]
  );

  const dealTargets = useMemo(
    () => toDealTargets(seatConfigs, dealTrigger),
    [seatConfigs, dealTrigger]
  );

  const handlePlayPoker = useCallback(() => {
    if (dealTrigger === -1) {
      // First deal - just trigger the animation
      setDealTrigger(0);
    } else {
      // Subsequent deals - change seed and increment trigger
      setSeed((prev) => getNextSeed(prev));
      setDealTrigger((prev) => prev + 1);
    }
  }, [dealTrigger]);

  const handleBet = useCallback(
    (index: number) => {
      if (stacks[index] < BET_SIZE) {
        return;
      }

      setStacks((prev) => {
        const next = [...prev];
        next[index] -= BET_SIZE;
        return next;
      });

      setBets((prev) => {
        const next = [...prev];
        next[index] += BET_SIZE;
        return next;
      });

      setPot((prev) => prev + BET_SIZE);

      const nextId = `bet-${index}-${Date.now()}`;
      setChipTargets([
        {
          id: nextId,
          offset: seatLayouts[index].offset,
          chipCount: amountToChipCount(BET_SIZE),
        },
      ]);
      setChipTrigger((prev) => prev + 1);
    },
    [stacks]
  );

  const handleChipsDemo = useCallback(() => {
    const timestamp = Date.now();
    const targets = seatStates.map((seat, seatIndex) => ({
      id: `demo-${seat.label}-${timestamp}-${seatIndex}`,
      offset: seat.offset,
      chipCount: amountToChipCount(Math.max(seat.bet, BET_SIZE)),
    }));
    setChipTargets(targets);
    setChipTrigger((prev) => prev + 1);
  }, [seatStates]);

  return (
    <View style={{ width: "100%", gap: space.md, marginTop: 35 }}>
      <TableLayout>
        <View
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 999,
            backgroundColor: color.background,
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Pot amount={pot} />
          {dealTrigger >= 0 && (
            <DealAnimation
              targets={dealTargets}
              trigger={dealTrigger}
              duration={DEAL_STAGGER * 3}
              delayBetween={DEAL_STAGGER}
            />
          )}
          <ChipMovement targets={chipTargets} trigger={chipTrigger} />
          {seatStates.map((seat) => (
            <Seat
              key={seat.label}
              label={seat.label}
              offset={seat.offset}
              stack={seat.stack}
              bet={seat.bet}
              alignment={seat.alignment}
              variant={seat.variant}
            />
          ))}
        </View>
      </TableLayout>

      <View
        style={{
          alignSelf: "stretch",
          flexDirection: "column",
          gap: space.sm,
          marginTop: 35,
        }}
      >
        {/* Main Action Buttons */}
        <View style={{ flexDirection: "row", gap: space.sm }}>
          <Pressable
            onPress={handlePlayPoker}
            style={{
              flex: 1,
              paddingVertical: space.md,
              paddingHorizontal: space.md,
              borderRadius: radius.md,
              backgroundColor: color.accent,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: space.xs,
              shadowColor: color.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 6,
            }}
            accessibilityRole="button"
            accessibilityLabel={dealTrigger === -1 ? "Deal" : "Redeal cards"}
          >
            <Text style={{ fontSize: 18 }}>🃏</Text>
            <Text
              style={{
                color: color.background,
                fontFamily: font.heading,
                fontWeight: "700",
                fontSize: 16,
                letterSpacing: 1,
              }}
            >
              {dealTrigger === -1 ? "DEAL" : "REDEAL"}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleChipsDemo}
            style={{
              flex: 1,
              paddingVertical: space.md,
              paddingHorizontal: space.md,
              borderRadius: radius.md,
              backgroundColor: color.surface,
              borderWidth: 2,
              borderColor: color.accent,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: space.xs,
            }}
            accessibilityRole="button"
            accessibilityLabel="Demo chip movement"
          >
            <Text style={{ fontSize: 18 }}>🪙</Text>
            <Text
              style={{
                color: color.accent,
                fontFamily: font.heading,
                fontWeight: "700",
                fontSize: 16,
                letterSpacing: 1,
              }}
            >
              MOVE CHIPS
            </Text>
          </Pressable>
        </View>

        {/* Bet Buttons */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: space.xs,
          }}
        >
          {seatStates.map((seat, index) => (
            <Pressable
              key={`bet-${seat.label}`}
              onPress={() => handleBet(index)}
              style={{
                paddingVertical: space.xs + 2,
                paddingHorizontal: space.sm,
                borderRadius: radius.sm,
                backgroundColor: color.background,
                borderWidth: 1.5,
                borderColor: color.chip,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
              accessibilityRole="button"
              accessibilityLabel={`Seat ${index + 1} bet`}
            >
              <Text style={{ fontSize: 11 }}>💰</Text>
              <Text
                style={{
                  color: color.chip,
                  fontFamily: font.body,
                  fontSize: 12,
                  fontWeight: "600",
                  letterSpacing: 0.3,
                }}
              >
                {seat.label}{" "}
                <Text
                  style={{
                    fontFamily: font.mono,
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  ${BET_SIZE}
                </Text>
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};
