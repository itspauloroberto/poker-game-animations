import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export type WelcomeOverlayProps = {
  onFinish: () => void;
};
import { useTokens } from "../theme/ThemeProvider";

const prefix = "Welcome to the ";
const poker = "Poker";
const suffix = "Game.";

const PREFIX_LENGTH = prefix.length;
const POKER_LENGTH = poker.length;
const SUFFIX_LENGTH = suffix.length;

const totalLength = PREFIX_LENGTH + POKER_LENGTH + SUFFIX_LENGTH;
const typingDuration = 2000;
const pokerDelay = 1000;
const pokerDuration = 600;
const collapseDelay = 500;
const collapseDuration = 400;

const CURSOR_OFFSET = 6;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedText = Animated.createAnimatedComponent(Text);

export const WelcomeOverlay = ({ onFinish }: WelcomeOverlayProps) => {
  const { color } = useTokens();
  const [cycle, setCycle] = useState(0);
  const [prefixDisplay, setPrefixDisplay] = useState("");
  const [pokerDisplay, setPokerDisplay] = useState("");
  const [suffixDisplay, setSuffixDisplay] = useState("");

  const typeProgress = useSharedValue(0);
  const cursorOpacity = useSharedValue(1);
  const pokerProgress = useSharedValue(0);
  const buttonGlow = useSharedValue(0);
  const collapseProgress = useSharedValue(0);

  const prefixCount = useSharedValue(0);
  const pokerCount = useSharedValue(0);
  const suffixCount = useSharedValue(0);

  const prefixWidth = useSharedValue(0);
  const pokerWidth = useSharedValue(0);
  const suffixWidth = useSharedValue(0);
  const cursorTranslate = useSharedValue(0);
  const totalWidth = useSharedValue(0);

  useEffect(() => {
    setPrefixDisplay("");
    setPokerDisplay("");
    setSuffixDisplay("");

    typeProgress.value = 0;
    pokerProgress.value = 0;
    buttonGlow.value = 0;
    collapseProgress.value = 0;
    prefixCount.value = 0;
    pokerCount.value = 0;
    suffixCount.value = 0;
    cursorTranslate.value = 0;

    cursorOpacity.value = 1;
    cursorOpacity.value = withRepeat(
      withTiming(0, { duration: 450 }),
      -1,
      true
    );

    typeProgress.value = withTiming(1, {
      duration: typingDuration,
      easing: Easing.linear,
    });

    return () => {
      cursorOpacity.value = 1;
    };
  }, [
    cycle,
    buttonGlow,
    collapseProgress,
    cursorOpacity,
    cursorTranslate,
    pokerProgress,
    prefixCount,
    suffixCount,
    typeProgress,
  ]);

  useAnimatedReaction(
    () => typeProgress.value,
    (value) => {
      const chars = Math.round(value * totalLength);
      const prefixChars = Math.min(chars, prefix.length);
      const remainAfterPrefix = chars - prefixChars;
      const pokerChars = Math.max(Math.min(remainAfterPrefix, poker.length), 0);
      const remainAfterPoker = remainAfterPrefix - pokerChars;
      const suffixChars = Math.max(
        Math.min(remainAfterPoker, suffix.length),
        0
      );

      prefixCount.value = prefixChars;
      pokerCount.value = pokerChars;
      suffixCount.value = suffixChars;

      runOnJS(setPrefixDisplay)(prefix.slice(0, prefixChars));
      runOnJS(setPokerDisplay)(poker.slice(0, pokerChars));
      runOnJS(setSuffixDisplay)(suffix.slice(0, suffixChars));
    }
  );

  useAnimatedReaction(
    () => typeProgress.value,
    (value, previous) => {
      if (value >= 1 && (previous ?? 0) < 1) {
        pokerProgress.value = 0;
        buttonGlow.value = 0;
        collapseProgress.value = 0;
        pokerProgress.value = withDelay(
          pokerDelay,
          withTiming(1, {
            duration: pokerDuration,
            easing: Easing.out(Easing.cubic),
          })
        );
        buttonGlow.value = withDelay(
          pokerDelay,
          withTiming(1, {
            duration: pokerDuration,
            easing: Easing.out(Easing.cubic),
          })
        );
        collapseProgress.value = withDelay(
          pokerDelay + collapseDelay,
          withTiming(1, {
            duration: collapseDuration,
            easing: Easing.out(Easing.cubic),
          })
        );
      }
    }
  );

  useAnimatedReaction(
    () => ({
      prefix: prefixCount.value,
      poker: pokerCount.value,
      suffix: suffixCount.value,
      collapse: collapseProgress.value,
    }),
    ({ prefix, poker: pokerC, suffix: suffixC, collapse }) => {
      const currentPrefix = PREFIX_LENGTH
        ? (prefixWidth.value * prefix) / PREFIX_LENGTH
        : 0;
      const currentPoker = POKER_LENGTH
        ? (pokerWidth.value * pokerC * (1 - collapse)) / POKER_LENGTH
        : 0;
      const currentSuffix = SUFFIX_LENGTH
        ? (suffixWidth.value * suffixC) / SUFFIX_LENGTH
        : 0;

      const computed =
        currentPrefix + currentPoker + currentSuffix + CURSOR_OFFSET;
      const clampTarget = totalWidth.value
        ? Math.min(totalWidth.value, 370)
        : 370;
      // cursorTranslate.value = Math.min(computed, clampTarget);
      if (computed < 400) {
        cursorTranslate.value = Math.min(computed, clampTarget);
      } else {
        setTimeout(() => {
          "worklet";
          cursorTranslate.value = withTiming(290, { duration: 400 });
        }, 2000);
      }
      // cursorTranslate.value = computed;
      console.log("🚀 ~ WelcomeOverlay ~ computed:", computed);
    }
  );

  const maskStyle = useAnimatedStyle(() => ({
    width: cursorTranslate.value,
    height: 28,
  }));

  const cursorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cursorTranslate.value }],
    opacity: cursorOpacity.value,
  }));

  const pokerInlineStyle = useAnimatedStyle(() => ({
    opacity: 1 - pokerProgress.value,
    // maxWidth: pokerWidth.value * (1 - collapseProgress.value),
  }));

  const fallingPokerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: prefixWidth.value },
      { translateY: interpolate(pokerProgress.value, [0, 1], [-8, 110]) },
      { scale: interpolate(pokerProgress.value, [0, 1], [1, 0.9]) },
    ],
    opacity: interpolate(pokerProgress.value, [0, 0.1, 1], [0, 1, 0]),
  }));

  const afterWordStyle = useAnimatedStyle(() => ({
    marginLeft: interpolate(
      collapseProgress.value,
      [0, 1],
      [8, -72],
      Extrapolation.CLAMP
    ),
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      buttonGlow.value,
      [0, 1],
      ["rgba(0,0,0,0.2)", "rgba(30,20,0,0.35)"]
    ),
    borderColor: interpolateColor(
      buttonGlow.value,
      [0, 1],
      ["rgba(255,255,255,0.6)", "#f8d766"]
    ),
    paddingHorizontal: interpolate(buttonGlow.value, [0, 1], [20, 28]),
    shadowColor: "#f8d766",
    shadowOpacity: interpolate(buttonGlow.value, [0, 1], [0, 0.6]),
    shadowRadius: interpolate(buttonGlow.value, [0, 1], [0, 18]),
    shadowOffset: { width: 0, height: 6 },
    elevation: interpolate(buttonGlow.value, [0, 1], [0, 10]),
  }));

  const labelBaseStyle = useAnimatedStyle(() => ({
    color: interpolateColor(buttonGlow.value, [0, 1], ["#f5f5f5", "#f8d766"]),
  }));

  const labelExtraStyle = useAnimatedStyle(() => ({
    opacity: buttonGlow.value,
    maxWidth: interpolate(buttonGlow.value, [0, 1], [0, suffixWidth.value]),
    transform: [{ translateY: interpolate(buttonGlow.value, [0, 1], [-6, 0]) }],
    color: "#f8d766",
  }));

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.overlay,
        { backgroundColor: color.background },
      ]}
      pointerEvents="auto"
    >
      <View
        style={styles.measureRow}
        pointerEvents="none"
        onLayout={() => {
          totalWidth.value =
            prefixWidth.value + suffixWidth.value + CURSOR_OFFSET + 8;
        }}
      >
        <Text
          style={styles.measureText}
          onLayout={(event) => {
            prefixWidth.value = event.nativeEvent.layout.width;
          }}
        >
          {prefix}
        </Text>
        <Text
          style={[styles.measureText, styles.goldenColor]}
          onLayout={(event) => {
            pokerWidth.value = event.nativeEvent.layout.width;
          }}
        >
          {poker}
        </Text>
        <Text
          style={styles.measureText}
          onLayout={(event) => {
            suffixWidth.value = event.nativeEvent.layout.width;
          }}
        >
          {suffix}
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.textWrapper}>
          <Animated.View style={[styles.textMask, maskStyle]}>
            <View style={styles.textRow}>
              <Text style={styles.text}>{prefixDisplay}</Text>
              <AnimatedText
                style={[styles.text, pokerInlineStyle, styles.goldenColor]}
              >
                {pokerDisplay}
              </AnimatedText>
              <AnimatedText style={[styles.text, afterWordStyle]}>
                {suffixDisplay}
              </AnimatedText>
            </View>
          </Animated.View>
          <AnimatedText style={[styles.cursor, cursorStyle]}>|</AnimatedText>
          <AnimatedText style={[styles.fallingPoker, fallingPokerStyle]}>
            {poker}
          </AnimatedText>
        </View>
        <View style={styles.buttonsRow}>
          <AnimatedPressable
            style={[styles.button, buttonStyle]}
            onPress={onFinish}
          >
            <AnimatedText style={[styles.primaryLabel, labelBaseStyle]}>
              Play
            </AnimatedText>
            <AnimatedText style={[styles.primaryLabel, labelExtraStyle]}>
              {" "}
              Poker
            </AnimatedText>
          </AnimatedPressable>
          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={() => setCycle((prev) => prev + 1)}
          >
            <Text style={styles.secondaryLabel}>↻ Replay</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 32,
  },
  measureRow: {
    position: "absolute",
    opacity: 0,
  },
  measureText: {
    fontFamily: "Menlo",
    fontSize: 24,
  },
  textWrapper: {
    position: "relative",
    overflow: "hidden",
    paddingRight: 12,
    minWidth: 260,
    height: 28,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  textMask: {
    overflow: "hidden",
    height: 28,
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
  },
  text: {
    fontFamily: "Menlo",
    fontSize: 24,
    color: "#f5f5f5",
  },
  cursor: {
    position: "absolute",
    top: 0,
    left: 0,
    fontFamily: "Menlo",
    fontSize: 24,
    color: "#f5f5f5",
  },
  fallingPoker: {
    position: "absolute",
    top: 0,
    fontFamily: "Menlo",
    fontSize: 24,
    color: "#f8d766",
  },
  buttonsRow: {
    flexDirection: "column",
    gap: 12,
    width: "100%",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    paddingVertical: 0,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
  },
  primaryLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f5f5f5",
    overflow: "hidden",
  },
  goldenColor: {
    color: "#f8d766",
  },
  secondaryButton: {
    borderColor: "#f8d766",
    alignSelf: "center",
  },
  secondaryLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f8d766",
  },
});
