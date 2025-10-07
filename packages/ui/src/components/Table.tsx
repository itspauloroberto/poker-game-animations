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

const seatOffsets = [
  { x: 0, y: -200 },
  { x: 200, y: -120 },
  { x: 220, y: 60 },
  { x: 0, y: 200 },
  { x: -220, y: 60 },
  { x: -200, y: -120 },
];

const INITIAL_STACK = 200;
const BET_SIZE = 25;

const amountToChipCount = (amount: number) =>
  Math.min(6, Math.max(2, Math.ceil(amount / 20)));

type SeatConfig = {
  label: string;
  offset: { x: number; y: number };
  card: Card;
};

type SeatState = SeatConfig & {
  stack: number;
  bet: number;
};

const buildSeatConfig = (seed: number): SeatConfig[] => {
  const deck = createDeck();
  const rng = createRng(seed);
  const shuffled = shuffle(deck, rng);

  return seatOffsets.map((offset, index) => ({
    label: `Seat ${index + 1}`,
    offset,
    card: shuffled[index],
  }));
};

const toDealTargets = (
  seats: SeatConfig[],
  trigger: number
): DealAnimationProps["targets"] =>
  seats.map((seat) => ({
    id: `${seat.label}-${trigger}-${seat.card.rank}${seat.card.suit}`,
    offset: seat.offset,
    card: seat.card,
  }));

const getNextSeed = (current: number) => (current + 137) % 1000;

export const Table = () => {
  const { color, space, radius } = useTokens();
  const [seed, setSeed] = useState(42);
  const [chipTrigger, setChipTrigger] = useState(0);
  const [dealTrigger, setDealTrigger] = useState(0);
  const [stacks, setStacks] = useState(() =>
    seatOffsets.map(() => INITIAL_STACK)
  );
  const [bets, setBets] = useState(() => seatOffsets.map(() => 0));
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

  const handleRedeal = useCallback(() => {
    setSeed((prev) => getNextSeed(prev));
    setDealTrigger((prev) => prev + 1);
  }, []);

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
          offset: seatOffsets[index],
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
          <DealAnimation
            targets={dealTargets}
            trigger={dealTrigger}
            duration={DEAL_STAGGER * 3}
            delayBetween={DEAL_STAGGER}
          />
          <ChipMovement targets={chipTargets} trigger={chipTrigger} />
          {seatStates.map((seat) => (
            <Seat
              key={seat.label}
              label={seat.label}
              offset={seat.offset}
              stack={seat.stack}
              bet={seat.bet}
            />
          ))}
        </View>
      </TableLayout>

      <View
        style={{
          alignSelf: "stretch",
          flexDirection: "column",
          gap: space.xs,
          marginTop: 35,
        }}
      >
        <View style={{ flexDirection: "row", gap: space.xs }}>
          <Pressable
            onPress={handleRedeal}
            style={{
              flex: 1,
              paddingVertical: space.xs,
              paddingHorizontal: space.sm,
              borderRadius: radius.sm,
              backgroundColor: color.accent,
              alignItems: "center",
            }}
            accessibilityRole="button"
            accessibilityLabel="Redeal cards"
          >
            <Text style={{ color: color.background, fontWeight: "600" }}>
              Redeal
            </Text>
          </Pressable>
          <Pressable
            onPress={handleChipsDemo}
            style={{
              flex: 1,
              paddingVertical: space.xs,
              paddingHorizontal: space.sm,
              borderRadius: radius.sm,
              backgroundColor: color.surface,
              borderWidth: 1,
              borderColor: color.accent,
              alignItems: "center",
            }}
            accessibilityRole="button"
            accessibilityLabel="Demo chip movement"
          >
            <Text style={{ color: color.accent, fontWeight: "600" }}>
              Move Chips
            </Text>
          </Pressable>
        </View>

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
                paddingVertical: space.xs,
                paddingHorizontal: space.sm,
                borderRadius: radius.sm,
                backgroundColor: color.surface,
                borderWidth: 1,
                borderColor: color.textSecondary,
              }}
              accessibilityRole="button"
              accessibilityLabel={`Seat ${index + 1} bet`}
            >
              <Text style={{ color: color.textSecondary, fontSize: 12 }}>
                {seat.label} Bet ${BET_SIZE}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};
