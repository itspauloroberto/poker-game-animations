import { useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from "react-native-reanimated";

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

const ChipMover = ({
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
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withDelay(index * delayBetween, withTiming(1, { duration }));
  }, [delayBetween, duration, index, progress, target.offset.x, target.offset.y, trigger]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [target.offset.x, 0])
      },
      {
        translateY: interpolate(progress.value, [0, 1], [target.offset.y, 0])
      }
    ],
    opacity: interpolate(progress.value, [0, 1], [1, 0.2])
  }));

  return (
    <Animated.View style={[BASE_STYLE, animatedStyle]}>
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
        <ChipMover
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
