import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Platform, Easing } from "react-native";

import type { Card } from "@game-core";

import { CardFace } from "./CardFace";
import { useTokens } from "../theme/ThemeProvider";

type HoverableCardProps = {
  card: Card;
  style?: any;
};

export const HoverableCard = ({ card, style }: HoverableCardProps) => {
  const { color } = useTokens();
  const [isHovered, setIsHovered] = useState(false);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const spinLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isHovered) {
      // Start infinite linear spin
      spinLoopRef.current = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: false, // Use false on web for shadow animations
        })
      );
      spinLoopRef.current.start();

      // Float up
      Animated.spring(floatAnim, {
        toValue: 1,
        useNativeDriver: false,
        tension: 80,
        friction: 10,
      }).start();

      // Glow effect
      Animated.spring(glowAnim, {
        toValue: 1,
        useNativeDriver: false,
        tension: 80,
        friction: 10,
      }).start();
    } else {
      // Stop the loop animation
      if (spinLoopRef.current) {
        spinLoopRef.current.stop();
        spinLoopRef.current = null;
      }

      // Smoothly return spin to 0
      Animated.spring(spinAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 80,
        friction: 10,
      }).start();

      // Float back down
      Animated.spring(floatAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 80,
        friction: 10,
      }).start();

      // Remove glow
      Animated.spring(glowAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 80,
        friction: 10,
      }).start();
    }

    return () => {
      if (spinLoopRef.current) {
        spinLoopRef.current.stop();
      }
    };
  }, [isHovered, floatAnim, spinAnim, glowAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const scale = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.8],
  });

  const shadowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const cardContent = <CardFace card={card} />;

  // Web-specific hover handling
  if (Platform.OS === "web") {
    return (
      <Animated.View
        style={[
          style,
          {
            transform: [
              ...(style?.transform || []),
              { translateY },
              { scale },
              { rotateY: spin },
            ],
          },
        ]}
        // @ts-expect-error - web-specific props
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Animated.View
          style={
            {
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1],
              }),
            } as any
          }
        >
          <div
            style={{
              filter: isHovered
                ? `drop-shadow(0 0 20px ${color.accent})`
                : "drop-shadow(0 0 0px transparent)",
              transition: "filter 0.3s ease",
            }}
          >
            {cardContent}
          </div>
        </Animated.View>
      </Animated.View>
    );
  }

  // Native fallback - uses Pressable for touch feedback
  return (
    <Pressable
      onPressIn={() => setIsHovered(true)}
      onPressOut={() => setIsHovered(false)}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [
              ...(style?.transform || []),
              { translateY },
              { scale },
              { rotateY: spin },
            ],
            shadowColor: color.accent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity,
            shadowRadius,
            elevation: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 20],
            }),
          },
        ]}
      >
        {cardContent}
      </Animated.View>
    </Pressable>
  );
};
