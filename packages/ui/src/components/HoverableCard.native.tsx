import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  cancelAnimation,
  interpolate,
} from "react-native-reanimated";

import type { Card } from "@game-core";

import { CardFace } from "./CardFace";
import { useTokens } from "../theme/ThemeProvider";

type HoverableCardProps = {
  card: Card;
  style?: any;
};

export const HoverableCard = ({ card, style }: HoverableCardProps) => {
  const { color } = useTokens();
  const isHovered = useSharedValue(0);
  const spinValue = useSharedValue(0);
  const floatValue = useSharedValue(0);
  const glowValue = useSharedValue(0);

  const handlePressIn = () => {
    isHovered.value = 1;

    // Start infinite linear spin
    spinValue.value = withRepeat(
      withTiming(360, { duration: 3000, easing: (t) => t }), // Linear easing
      -1, // infinite
      false
    );

    // Float up
    floatValue.value = withSpring(1, {
      damping: 10,
      stiffness: 80,
    });

    // Glow effect
    glowValue.value = withSpring(1, {
      damping: 10,
      stiffness: 80,
    });
  };

  const handlePressOut = () => {
    isHovered.value = 0;

    // Cancel spin animation and smoothly return to 0
    cancelAnimation(spinValue);
    spinValue.value = withSpring(0, {
      damping: 10,
      stiffness: 80,
    });

    // Float back down
    floatValue.value = withSpring(0, {
      damping: 10,
      stiffness: 80,
    });

    // Remove glow
    glowValue.value = withSpring(0, {
      damping: 10,
      stiffness: 80,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = floatValue.value * -20;
    const scale = 1 + floatValue.value * 0.15;
    const shadowOpacity = interpolate(glowValue.value, [0, 1], [0, 0.8]);
    const shadowRadius = interpolate(glowValue.value, [0, 1], [0, 20]);
    const elevation = interpolate(glowValue.value, [0, 1], [0, 20]);

    return {
      transform: [
        ...(style?.transform || []),
        { translateY },
        { scale },
        { rotateY: `${spinValue.value}deg` },
      ],
      shadowColor: color.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity,
      shadowRadius,
      elevation,
    };
  });

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[style, animatedStyle]}>
        <CardFace card={card} />
      </Animated.View>
    </Pressable>
  );
};
