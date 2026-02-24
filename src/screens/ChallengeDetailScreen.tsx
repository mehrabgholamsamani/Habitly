import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { getChallenge, listBookmarks, toggleBookmark, listChallenges } from "../storage/store";
import { ShapeDots } from "../components/Icons";
import { BookmarkIcon, ChevronLeft, InfoDot, CheckBadge, Sparkle } from "../components/LibraryIcons";
import { ProgressBar } from "../components/ProgressBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChallengeDetailScreen({ route, navigation }: any) {
  const { colors, spacing, typography } = useTheme();
  const id = route.params?.id as string;
  const [c, setC] = React.useState<any>(null);
  const [saved, setSaved] = React.useState(false);

  const load = React.useCallback(async () => {
    const ch = await getChallenge(id);
    setC(ch);
    const b = await listBookmarks();
    setSaved(b.includes(id));
  }, [id]);

  React.useEffect(() => { load(); }, [load]);

  if (!c) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  const benefits: string[] = c.benefits?.length ? c.benefits : ["Feel calmer", "Build consistency", "Reset your day"];
  const steps: any[] = c.steps?.length ? c.steps : [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.teal, paddingTop: spacing.xl, paddingHorizontal: spacing.md, paddingBottom: spacing.lg }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Pressable onPress={() => navigation.goBack()} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={20} />
          </Pressable>

          <Pressable
            onPress={async () => {
              const next = await toggleBookmark(id);
              setSaved(next.includes(id));
            }}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" }}
          >
            <BookmarkIcon active={saved} />
          </Pressable>
        </View>

        <View style={{ marginTop: spacing.lg, paddingRight: 100 }}>
          <Text style={[typography.title, { color: "#fff", fontSize: 24, lineHeight: 30 }]} numberOfLines={2}>{c.title}</Text>
          <Text style={[typography.sub, { color: "rgba(255,255,255,0.78)", marginTop: 8 }]}>{c.label} · {c.durationDays} days · {c.dailyMinutes} min/day</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginTop: spacing.md, flexWrap: "wrap" }}>
          {(c.tags || []).slice(0, 4).map((t: string) => (
            <View key={t} style={{ paddingHorizontal: 12, height: 34, borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.35)", alignItems: "center", justifyContent: "center" }}>
              <Text style={[typography.sub, { color: "#fff" }]}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={{ position: "absolute", right: 16, top: 64, opacity: 0.85 }}>
          <ShapeDots size={78} />
        </View>

        <View style={{ position: "absolute", right: 22, bottom: 18, opacity: 0.95 }}>
          <Sparkle size={22} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 162, gap: spacing.md }}>
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={typography.title}>Overview</Text>
            <InfoDot />
          </View>
          <Text style={[typography.body, { marginTop: 10 }]}>{c.description}</Text>

          <View style={{ marginTop: 14, padding: 12, borderRadius: 16, backgroundColor: "rgba(201,168,76,0.10)", borderWidth: 1, borderColor: "rgba(201,168,76,0.20)" }}>
            <Text style={[typography.points, { color: colors.text }]}>{c.points} points</Text>
            <Text style={[typography.sub, { marginTop: 6 }]}>Earn points by completing daily sessions. Consistency beats intensity.</Text>
          </View>
        </View>

        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 4 }}>
          <Text style={typography.title}>Benefits</Text>
          <View style={{ marginTop: 12, gap: 10 }}>
            {benefits.map((b: string) => (
              <View key={b} style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 16, backgroundColor: "rgba(14,43,43,0.04)", borderWidth: 1, borderColor: colors.border }}>
                <CheckBadge />
                <Text style={[typography.body, { flex: 1 }]}>{b}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 4 }}>
          <Text style={typography.title}>Daily plan</Text>
          <Text style={[typography.sub, { marginTop: 6 }]}>A simple structure that stays doable on busy days.</Text>
          <View style={{ marginTop: 12, gap: 10 }}>
            {steps.length ? steps.map((s: any) => (
              <View key={s.title} style={{ padding: 12, borderRadius: 16, backgroundColor: "rgba(14,43,43,0.04)", borderWidth: 1, borderColor: colors.border }}>
                <Text style={typography.points}>{s.title}</Text>
                <Text style={[typography.sub, { marginTop: 6 }]}>{s.detail}</Text>
              </View>
            )) : (
              <View style={{ padding: 12, borderRadius: 16, backgroundColor: "rgba(14,43,43,0.04)", borderWidth: 1, borderColor: colors.border }}>
                <Text style={typography.sub}>This challenge uses short, repeatable sessions. Start today and keep it light.</Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 4 }}>
          <Text style={typography.title}>Progress</Text>
          <Text style={[typography.sub, { marginTop: 6 }]}>Your progress updates when you complete sessions.</Text>
          <View style={{ marginTop: 12 }}>
            <ProgressBar value={c.yourProgress || 0} />
          </View>
        </View>

        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 4 }}>
          <Text style={typography.label}>Organized by</Text>
          <Text style={[typography.body, { marginTop: 6 }]}>{c.organizer}</Text>
          <Text style={[typography.sub, { marginTop: 10 }]}>{c.participants} participants</Text>
        </View>
      </ScrollView>

      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: spacing.md, backgroundColor: "rgba(245,245,245,0.92)" }}>
        <Pressable
          onPress={() => navigation.navigate("Play")}
          style={{ height: 54, borderRadius: 18, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={[typography.body, { color: "#fff", fontWeight: "900" }]}>Start Session</Text>
        </Pressable>
        <Pressable
          onPress={async () => {
            const all = await listChallenges();
            const next = all.map((x: any) => (x.id === c.id ? { ...x, yourProgress: Math.min(1, (x.yourProgress || 0) + 0.1) } : x));
            await AsyncStorage.setItem("app_challenges_v1", JSON.stringify(next));
            await load();
          }}
          style={{ marginTop: 10, height: 46, borderRadius: 18, backgroundColor: "rgba(201,168,76,0.16)", borderWidth: 1, borderColor: "rgba(201,168,76,0.28)", alignItems: "center", justifyContent: "center" }}
        >
          <Text style={[typography.body, { color: colors.text, fontWeight: "900" }]}>Mark today complete</Text>
        </Pressable>
      </View>
    </View>
  );
}
