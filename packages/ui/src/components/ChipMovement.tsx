import { useEffect, useRef } from "react";
import { Animated } from "react-native";

import { ChipStack } from "./ChipStack";
import type { ChipMovementProps, ChipTarget } from "./ChipMovement.types";

const BASE_STYLE = {
  position: "absolute" as const,
  left: "50%" as const,
  top: "50%" as const,
  marginLeft: -12,
  marginTop: -12,
  zIndex: 20,
  pointerEvents: "none" as const
};

const AnimatedCard = ({
  target,
  index,
  trigger,
  duration,
  delayBetween
}: {
  target: ChipTarget;
  index: number;
  trigger: number;
  duration: number;
  delayBetween: number;
}) => {
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
      style={{
        ...BASE_STYLE,
        transform: [
          {
            translateX: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [target.offset.x, 0]
            })
          },
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [target.offset.y, 0]
            })
          }
        ],
        opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.2] })
      }}
    >
      <ChipStack count={target.chipCount} />
    </Animated.View>
  );
};

export const ChipMovement = ({
  targets,
  trigger,
  duration = 350,
  delayBetween = 80
}: ChipMovementProps) => {
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
