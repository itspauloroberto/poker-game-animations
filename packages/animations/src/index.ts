import { useSharedValue, withTiming } from "react-native-reanimated";

export const useFadeIn = () => {
  const opacity = useSharedValue(0);
  const fadeIn = () => {
    opacity.value = withTiming(1, { duration: 200 });
  };
  return { opacity, fadeIn };
};
