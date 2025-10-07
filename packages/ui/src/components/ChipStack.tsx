import { View } from "react-native";

import { useTokens } from "../theme/ThemeProvider";

type ChipStackProps = {
  count?: number;
};

const CHIP_SIZE = 24;
const CHIP_OFFSET = 4;

export const ChipStack = ({ count = 4 }: ChipStackProps) => {
  const { color } = useTokens();

  return (
    <View style={{ width: CHIP_SIZE, height: CHIP_SIZE + CHIP_OFFSET * (count - 1) }}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={{
            position: "absolute",
            bottom: index * CHIP_OFFSET,
            left: 0,
            width: CHIP_SIZE,
            height: CHIP_SIZE,
            borderRadius: CHIP_SIZE / 2,
            backgroundColor: color.chip,
            borderWidth: 2,
            borderColor: color.background
          }}
        />
      ))}
    </View>
  );
};
