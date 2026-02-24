import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { Card } from "../components/Card";
import { CalmHeader } from "../components/CalmHeader";
import { SparkleGold } from "../components/HomeIcons";
import { MeditationTimer } from "../components/MeditationTimer";
import { addSession, listSessions, getPrefs } from "../storage/store";
import { useProfile } from "../hooks/useProfile";
import { todayISO } from "../utils/date";

const INTENTIONS = [
  { key: "Calm", hint: "Soften the edges." },
  { key: "Focus", hint: "One thing at a time." },
  { key: "Sleep", hint: "Unwind your system." },
  { key: "Gratitude", hint: "Notice what’s good." },
  { key: "Clarity", hint: "Make space for insight." },
];

const MICRO_GUIDES = [
  { title: "Body scan (60s)", text: "Start at the forehead. Relax the jaw. Drop the shoulders. Let the belly be soft." },
  { title: "Name the feeling", text: "Quietly label what’s here: anxious, tired, calm, neutral. No fixing needed." },
  { title: "Anchor choice", text: "Pick one anchor: breath, sounds, or body. When you drift, return gently." },
];

export default function MeditationScreen({ navigation, route }: any) {
  const { colors, spacing, typography } = useTheme();
  const presetFromRoute = route?.params?.presetMinutes;
  const [minutes, setMinutes] = React.useState<number>(typeof presetFromRoute === "number" ? presetFromRoute : 10);
  const [breathingCues, setBreathingCues] = React.useState(true);
  const [defaultMinutes, setDefaultMinutes] = React.useState(10);
  const [note, setNote] = React.useState("");
  const [items, setItems] = React.useState<any[]>([]);
  const { name, avatarUri, refresh: refreshProfile } = useProfile();
  const [intention, setIntention] = React.useState(INTENTIONS[0].key);

  const load = React.useCallback(async () => {
    const [s, pr] = await Promise.all([listSessions(), getPrefs()]);
    await refreshProfile();
    setItems(s);

    setBreathingCues(pr?.breathingCues !== false);
    setDefaultMinutes(typeof pr?.defaultMinutes === "number" ? pr.defaultMinutes : 10);
  }, []);

  React.useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    load();
    return unsub;
  }, [navigation, load]);

  React.useEffect(() => {
    if (typeof presetFromRoute === "number") setMinutes(presetFromRoute);
    else setMinutes((m) => (m ? m : defaultMinutes));
  }, [presetFromRoute, defaultMinutes]);

  const today = todayISO();
  const todaySessions = items.filter((s) => s.date === today);
  const todayTotal = todaySessions.reduce((a, s) => a + (s.minutes || 0), 0);

  const selectedHint = INTENTIONS.find((i) => i.key === intention)?.hint || "";

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.tabBarGutter }}>
        <CalmHeader
          title="Meditation"
          subtitle="A quiet room for your mind. Start small — consistency wins."
          name={name}
          avatarUri={avatarUri}
          rightBadge={<SparkleGold size={18} />}
          onPressRight={() => navigation.navigate("Search")}
        />

        <View style={{ paddingHorizontal: spacing.md, marginTop: -26, gap: spacing.md }}>
          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={typography.title}>Session</Text>
              <Text style={[typography.sub, { color: colors.accent }]}>{todayTotal} min today</Text>
            </View>

            <Text style={[typography.sub, { marginTop: 6 }]}>{today} · timer + gentle guidance</Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
              {INTENTIONS.map((i) => (
                <Pressable
                  key={i.key}
                  onPress={() => setIntention(i.key)}
                  style={{
                    paddingHorizontal: 14,
                    height: 34,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: intention === i.key ? "rgba(201,168,76,0.12)" : "rgba(14,43,43,0.04)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={[typography.body, { fontWeight: "900" }]}>{i.key}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={[typography.sub, { marginTop: 10 }]}>{selectedHint}</Text>

            <MeditationTimer
              presets={[5, 10, 15, 20, 30]}
              showCues={breathingCues}
              initialSelected={minutes}
              onSelect={(m) => setMinutes(m)}
              onComplete={async (m) => {
                setMinutes(m);
                await addSession(m, `${intention}${note.trim() ? ` · ${note.trim()}` : ""}`, todayISO());
                setNote("");
                await load();
              }}
            />

            <View style={{ marginTop: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: "rgba(255,255,255,0.70)", paddingHorizontal: 14, paddingVertical: 10 }}>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Notes (optional) — e.g., restless, steady, sleepy"
                placeholderTextColor="rgba(14,43,43,0.40)"
                multiline
                style={[typography.body, { minHeight: 64 }]}
              />
            </View>

            <Pressable
              onPress={async () => {
                await addSession(minutes, `${intention}${note.trim() ? ` · ${note.trim()}` : ""}`, todayISO());
                setNote("");
                await load();
              }}
              style={{ marginTop: 14, height: 46, borderRadius: 18, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={[typography.body, { color: "#fff", fontWeight: "900" }]}>Log Session</Text>
            </Pressable>
          </Card>

          <Card>
            <Text style={typography.title}>Micro-guides</Text>
            <Text style={[typography.sub, { marginTop: 6 }]}>Short prompts you can use during the session.</Text>

            <View style={{ marginTop: 12, gap: 10 }}>
              {MICRO_GUIDES.map((g) => (
                <View key={g.title} style={{ padding: 12, borderRadius: 16, backgroundColor: "rgba(14,43,43,0.04)", borderWidth: 1, borderColor: colors.border }}>
                  <Text style={[typography.points, { fontWeight: "900" }]}>{g.title}</Text>
                  <Text style={[typography.sub, { marginTop: 8 }]}>{g.text}</Text>
                </View>
              ))}
            </View>

            <View style={{ marginTop: 12, padding: 12, borderRadius: 16, backgroundColor: "rgba(201,168,76,0.10)", borderWidth: 1, borderColor: "rgba(201,168,76,0.18)" }}>
              <Text style={[typography.body, { fontWeight: "900" }]}>Tiny rule</Text>
              <Text style={[typography.sub, { marginTop: 8 }]}>If your mind wanders 100 times, you practiced returning 100 times.</Text>
            </View>
          </Card>

          <Card>
            <Text style={typography.title}>Recent sessions</Text>
            {items.length === 0 ? (
              <Text style={[typography.sub, { marginTop: 8 }]}>No sessions yet.</Text>
            ) : (
              <View style={{ marginTop: 10, gap: 10 }}>
                {items.slice(0, 10).map((s) => (
                  <View key={s.id} style={{ padding: 12, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.70)", borderWidth: 1, borderColor: colors.border }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={typography.points}>{s.minutes} min</Text>
                      <Text style={[typography.sub, { color: colors.subtext }]}>{s.date}</Text>
                    </View>
                    {s.note ? <Text style={[typography.body, { marginTop: 10 }]}>{s.note}</Text> : null}
                  </View>
                ))}
              </View>
            )}
          </Card>

          <View style={{ height: 2 }} />
        </View>
      </ScrollView>
    </View>
  );
}
