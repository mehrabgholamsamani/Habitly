import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";
import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";
import { useFonts, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { View, ActivityIndicator } from "react-native";
import { seedIfNeeded } from "./src/storage/store";

function Boot() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}

export default function App() {
  const [loaded] = useFonts({ Inter_600SemiBold, Inter_700Bold });
  const [seeded, setSeeded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        await seedIfNeeded();
      } finally {
        setSeeded(true);
      }
    })();
  }, []);

  if (!loaded || !seeded) {
    return (
      <ThemeProvider>
        <Boot />
      </ThemeProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
