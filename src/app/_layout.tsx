import { AppStateProvider } from "@/context/AppState";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#FFFFFF" },
          }}
        />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
