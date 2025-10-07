import { useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from "react-native-reanimated";

import type { Card } from "@game-core";

import { CARD_SIZES, CardFace } from "./CardFace";

export const DEAL_DURATION = 250;
export const DEAL_STAGGER = 50;

export type DealTarget = {
  id: string;
  offset: { x: number; y: number };
  card: Card;
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
  pointerEvents: "none" as const,
  zIndex: 10 as const
};

type DealtCardProps = {
  target: DealTarget;
  index: number;
  trigger: number;
  duration: number;
  delayBetween: number;
};

const DealtCard = ({ target, index, trigger, duration, delayBetween }: DealtCardProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withDelay(index * delayBetween, withTiming(1, { duration }));
  }, [delayBetween, duration, index, progress, target.offset.x, target.offset.y, trigger]);

  const animatedStyle = useAnimatedStyle(() => {
    const value = progress.value;
    return {
      opacity: value,
      transform: [
        { translateX: interpolate(value, [0, 1], [0, target.offset.x]) },
        { translateY: interpolate(value, [0, 1], [0, target.offset.y]) },
        { scale: interpolate(value, [0, 1], [0.6, 1]) }
      ]
    };
  });

  return (
    <Animated.View style={[cardBaseStyle, animatedStyle]}>
      <CardFace card={target.card} />
    </Animated.View>
  );
};

export const DealAnimation = ({
  targets,
  trigger = 0,
  duration = DEAL_DURATION,
  delayBetween = DEAL_STAGGER
}: DealAnimationProps) => {
  if (!targets.length) return null;

  return (
    <>
      {targets.map((target, index) => (
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
