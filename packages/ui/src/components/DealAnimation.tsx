import { useEffect, useRef } from "react";
import { Animated } from "react-native";

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

const baseStyle = {
  position: "absolute" as const,
  left: "50%" as const,
  top: "50%" as const,
  marginLeft: -CARD_SIZES.width / 2,
  marginTop: -CARD_SIZES.height / 2,
  pointerEvents: "none" as const,
  zIndex: 10 as const
};

type WebCardProps = {
  target: DealTarget;
  index: number;
  trigger: number;
  duration: number;
  delayBetween: number;
};

const AnimatedCard = ({ target, index, trigger, duration, delayBetween }: WebCardProps) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration,
      delay: index * delayBetween,
      useNativeDriver: true
    }).start();
  }, [delayBetween, duration, index, progress, target.offset.x, target.offset.y, trigger]);

  return (
    <Animated.View
      style={[
        baseStyle,
        {
          opacity: progress,
          transform: [
            {
              translateX: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, target.offset.x]
              })
            },
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, target.offset.y]
              })
            },
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 1]
              })
            }
          ]
        }
      ]}
    >
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
        <AnimatedCard
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
