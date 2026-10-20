import { View } from "react-native";

const bars = [
  18, 28, 39, 25, 48, 64, 43, 30, 56, 72, 44, 31, 60, 78, 52, 35, 68, 46, 30,
  57, 74, 48, 34, 62, 42, 27, 54, 70, 47, 32, 58, 40, 25, 49, 64, 37,
];

export function Waveform({
  compact = false,
  progress = 0.58,
}: {
  compact?: boolean;
  progress?: number;
}) {
  return (
    <View
      className={`h-16 flex-row items-center justify-between ${compact ? "h-10" : ""}`}
    >
      {bars.map((height, index) => (
        <View
          key={index}
          className={`w-1 rounded-full ${index / bars.length < progress ? "bg-blue-600" : "bg-blue-200"}`}
          style={{ height: compact ? Math.max(8, height * 0.46) : height }}
        />
      ))}
    </View>
  );
}
