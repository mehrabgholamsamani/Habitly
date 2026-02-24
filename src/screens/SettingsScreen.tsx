import React from "react";
import { Alert, Pressable, ScrollView, Text, View, Platform } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { Card } from "../components/Card";
import { Logo } from "../components/Logo";
import * as SQLite from "expo-sqlite";
import { resetFallbackDb } from "../db/database";

export default function SettingsScreen() {
  const { colors, spacing, typography } = useTheme();

  const resetDb = async () => {
    Alert.alert("Reset data?", "This will wipe habits + workouts locally.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: async () => {
          try {
            if (Platform.OS === "web") {
              await resetFallbackDb();
              Alert.alert("Done", "Web storage cleared. Refresh the page.");
              return;
            }
            const db = (SQLite as any).openDatabase("habitly.db");
            // @ts-ignore
            db.exec(
              [
                {
                  sql: `
DROP TABLE IF EXISTS workout_sets;
DROP TABLE IF EXISTS workout_exercises;
DROP TABLE IF EXISTS workouts;
DROP TABLE IF EXISTS habit_logs;
DROP TABLE IF EXISTS habits;
                  `,
                  args: [],
                },
              ],
              false,
              () => {}
            );
            Alert.alert("Done", "Restart the app to recreate tables.");
          } catch (e) {
            Alert.alert("Error", String(e));
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.tabBarGutter, gap: spacing.lg }}>
        <Card style={{ backgroundColor: colors.primary, borderColor: "transparent" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Logo size={34} />
            <View>
              <Text style={[typography.h2, { color: "#fff" }]}>Habitly Tracker</Text>
              <Text style={[typography.small, { color: "rgba(255,255,255,0.85)", marginTop: 2 }]}>
                Offline-first · clean UI
              </Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={[typography.h2, { color: colors.text }]}>About</Text>
          <Text style={[typography.body, { color: colors.subtext, marginTop: 8 }]}>
            Built with React Native + Expo. SQLite on native, AsyncStorage fallback on web.
          </Text>
        </Card>

        <Card>
          <Text style={[typography.h2, { color: colors.text }]}>Data</Text>
          <Text style={[typography.body, { color: colors.subtext, marginTop: 8 }]}>
            Your data lives locally. No accounts. No cloud. Just you and your streaks.
          </Text>
          <Pressable
            onPress={resetDb}
            style={{
              marginTop: spacing.lg,
              backgroundColor: "#FFE8E8",
              paddingVertical: 12,
              borderRadius: 18,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.danger, fontWeight: "900" }}>Reset local data</Text>
          </Pressable>
        </Card>
      </ScrollView>
    </View>
  );
}
