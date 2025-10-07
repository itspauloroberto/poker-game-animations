import { useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import type { Card } from "@game-core";

import { CARD_SIZES } from "./CardFace";
import { HoverableCard } from "./HoverableCard";

export const DEAL_DURATION = 250;
export const DEAL_STAGGER = 50;

export type DealTarget = {
  id: string;
  offset: {
    x: number;
    y: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
  };
  card: Card;
  order?: number;
};

export type DealAnimationProps = {
  targets: DealTarget[];
  trigger?: number;
  duration?: number;
  delayBetween?: number;
};

const cardBaseStyle = {
  position: "absolute" as const,
  left: "50%" as const,
  top: "50%" as const,
  marginLeft: -CARD_SIZES.width / 2,
  marginTop: -CARD_SIZES.height / 2,
  pointerEvents: "auto" as const,
  zIndex: 10 as const,
};

type DealtCardProps = {
  target: DealTarget;
  index: number;
  trigger: number;
  duration: number;
  delayBetween: number;
};

const DealtCard = ({
  target,
  index,
  trigger,
  duration,
  delayBetween,
}: DealtCardProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withDelay(
      index * delayBetween,
      withTiming(1, { duration })
    );
  }, [
    delayBetween,
    duration,
    index,
    progress,
    target.offset.x,
    target.offset.y,
    target.offset.rotateX,
    target.offset.rotateY,
    target.offset.rotateZ,
    trigger,
  ]);

  const animatedStyle = useAnimatedStyle(() => {
    const value = progress.value;
    return {
      opacity: value,
      transform: [
        { translateX: interpolate(value, [0, 1], [0, target.offset.x]) },
        { translateY: interpolate(value, [0, 1], [0, target.offset.y]) },
        { scale: interpolate(value, [0, 1], [0.6, 1]) },
        {
          rotateX: `${interpolate(value, [0, 1], [0, target.offset.rotateX])}deg`,
        },
        {
          rotateY: `${interpolate(value, [0, 1], [0, target.offset.rotateY])}deg`,
        },
        {
          rotateZ: `${interpolate(value, [0, 1], [0, target.offset.rotateZ])}deg`,
        },
      ],
    };
  });

  return (
    <Animated.View style={[cardBaseStyle, animatedStyle]}>
      <HoverableCard card={target.card} />
    </Animated.View>
  );
};

export const DealAnimation = ({
  targets,
  trigger = 0,
  duration = DEAL_DURATION,
  delayBetween = DEAL_STAGGER,
}: DealAnimationProps) => {
  if (!targets.length) return null;

  const ordered = [...targets].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      {ordered.map((target, index) => (
        <DealtCard
          key={target.id}
          target={target}
          index={index}
          trigger={trigger}
          duration={duration}
          delayBetween={delayBetween}
        />
      ))}
    </>
  );
};
