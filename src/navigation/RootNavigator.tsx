import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RootTabs from "./RootTabs";
import ChallengeDetailScreen from "../screens/ChallengeDetailScreen";
import { useTheme } from "../theme/ThemeProvider";

export type RootStackParamList = {
  Tabs: undefined;
  ChallengeDetail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={RootTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="ChallengeDetail"
        component={ChallengeDetailScreen}
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
    </Stack.Navigator>
  );
}
