import { useEffect, useRef } from "react";
import { Animated } from "react-native";

import type { Card } from "@game-core";

import { CARD_SIZES } from "./CardFace";
import { HoverableCard } from "./HoverableCard";

export const DEAL_DURATION = 250;
export const DEAL_STAGGER = 140;

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

const baseStyle = {
  position: "absolute" as const,
  left: "50%" as const,
  top: "50%" as const,
  marginLeft: -CARD_SIZES.width / 2,
  marginTop: -CARD_SIZES.height / 2,
  pointerEvents: "auto" as const,
  zIndex: 10 as const,
};

type WebCardProps = {
  target: DealTarget;
  index: number;
  trigger: number;
  duration: number;
  delayBetween: number;
};

const AnimatedCard = ({
  target,
  index,
  trigger,
  duration,
  delayBetween,
}: WebCardProps) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration,
      delay: index * delayBetween,
      useNativeDriver: true,
    }).start();
  }, [
    delayBetween,
    duration,
    index,
    progress,
    target.offset.x,
    target.offset.y,
    trigger,
  ]);

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
                outputRange: [0, target.offset.x],
              }),
            },
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, target.offset.y],
              }),
            },
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 1],
              }),
            },
            {
              rotateX: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", `${target.offset.rotateX}deg`],
              }),
            },
            {
              rotateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", `${target.offset.rotateY}deg`],
              }),
            },
            {
              rotateZ: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", `${target.offset.rotateZ}deg`],
              }),
            },
          ],
        },
      ]}
    >
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
