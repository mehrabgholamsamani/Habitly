import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { Card } from "../components/Card";
import { CalmHeader } from "../components/CalmHeader";
import { listChallenges, Challenge, listBookmarks, toggleBookmark } from "../storage/store";
import { useProfile } from "../hooks/useProfile";
import { BookmarkIcon } from "../components/LibraryIcons";
import { ChallengeArt } from "../components/ChallengeArt";

const chips = ["Calming", "Focus", "Sleep", "Relaxing", "Productivity", "Energy", "Confidence", "Gratitude", "Clarity", "Stress"];

function SectionTitle({ title, right }: { title: string; right?: React.ReactNode }) {
  const { typography, colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 2 }}>
      <Text style={[typography.label, { color: colors.subtext }]}>{title}</Text>
      {right ? right : null}
    </View>
  );
}

export default function SearchScreen({ navigation }: any) {
  const { colors, spacing, typography } = useTheme();
  const [q, setQ] = React.useState("");
  const [items, setItems] = React.useState<Challenge[]>([]);
  const [filter, setFilter] = React.useState<string>("");
  const [bookmarks, setBookmarks] = React.useState<string[]>([]);
  const { name: profileName, avatarUri, refresh } = useProfile();

  const load = React.useCallback(async () => {
    const [c, b] = await Promise.all([listChallenges(), listBookmarks()]);
    await refresh();
    setItems(c);
    setBookmarks(b);
  }, []);

  React.useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    load();
    return unsub;
  }, [navigation, load]);

  const filtered = items.filter((c) => {
    const hit =
      c.title.toLowerCase().includes(q.toLowerCase()) ||
      (c.shortDescription || "").toLowerCase().includes(q.toLowerCase()) ||
      c.description.toLowerCase().includes(q.toLowerCase());
    const f = filter ? (c.label === filter || (c.tags || []).includes(filter)) : true;
    return hit && f;
  });

  const featured = items[0];
  const saved = items.filter((x) => bookmarks.includes(x.id));
  const rest = filtered;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.tabBarGutter }}>
        <CalmHeader
          title="Library"
          subtitle="Browse calming paths, save favorites, and start when it feels right."
          name={profileName}
          avatarUri={avatarUri}
        />

        <View style={{ paddingHorizontal: spacing.md, marginTop: -26, gap: spacing.md }}>
          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={typography.title}>Find your next practice</Text>
              <Text style={[typography.sub, { color: colors.accent }]}>{bookmarks.length} saved</Text>
            </View>
            <Text style={[typography.sub, { marginTop: 6 }]}>Search by mood, goal, or time. Small steps, real change.</Text>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              <View style={{ paddingHorizontal: 12, height: 34, borderRadius: 999, backgroundColor: "rgba(201,168,76,0.12)", borderWidth: 1, borderColor: "rgba(201,168,76,0.22)", alignItems: "center", justifyContent: "center" }}>
                <Text style={[typography.sub, { color: colors.text }]}>{items.length} challenges</Text>
              </View>
              <View style={{ paddingHorizontal: 12, height: 34, borderRadius: 999, backgroundColor: "rgba(14,43,43,0.04)", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
                <Text style={[typography.sub, { color: colors.text }]}>{filter ? filter : "All moods"}</Text>
              </View>
              <View style={{ paddingHorizontal: 12, height: 34, borderRadius: 999, backgroundColor: "rgba(14,43,43,0.04)", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
                <Text style={[typography.sub, { color: colors.text }]}>{q ? "Searching" : "Browse"}</Text>
              </View>
            </View>

            <View style={{ marginTop: 12, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: "rgba(14,43,43,0.04)", paddingHorizontal: 14 }}>
              <TextInput value={q} onChangeText={setQ} placeholder="Search by title or keywords" placeholderTextColor="rgba(14,43,43,0.40)" style={[typography.body, { height: 44 }]} />
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
              {chips.map((c) => {
                const active = filter === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setFilter((p) => (p === c ? "" : c))}
                    style={{
                      paddingHorizontal: 12,
                      height: 34,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: active ? "rgba(201,168,76,0.35)" : colors.border,
                      backgroundColor: active ? "rgba(201,168,76,0.12)" : "rgba(14,43,43,0.04)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={[typography.sub, { color: colors.text }]}>{c}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          {featured ? (
            <View style={{ gap: 10 }}>
              <SectionTitle title="Featured today" right={<Text style={[typography.sub, { color: colors.accent }]}>Gold pick</Text>} />
              <Pressable onPress={() => navigation.navigate("ChallengeDetail", { id: featured.id })}>
                <View style={{ borderRadius: 16, padding: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOpacity: 0.10, shadowRadius: 20, shadowOffset: { width: 0, height: 12 }, elevation: 6 }}>
                  <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
                    <View style={{ width: 74, height: 74, borderRadius: 18, overflow: "hidden" }}>
                      <ChallengeArt id={featured.id} size={74} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={typography.title} numberOfLines={2}>{featured.title}</Text>
                      <Text style={[typography.sub, { marginTop: 6 }]} numberOfLines={2}>{featured.shortDescription || featured.description}</Text>
                      <View style={{ flexDirection: "row", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                        <View style={{ paddingHorizontal: 10, height: 30, borderRadius: 999, backgroundColor: "rgba(201,168,76,0.12)", borderWidth: 1, borderColor: "rgba(201,168,76,0.22)", alignItems: "center", justifyContent: "center" }}>
                          <Text style={[typography.sub, { color: colors.text }]}>{featured.label}</Text>
                        </View>
                        <View style={{ paddingHorizontal: 10, height: 30, borderRadius: 999, backgroundColor: "rgba(14,43,43,0.04)", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
                          <Text style={[typography.sub, { color: colors.text }]}>{featured.durationDays} days</Text>
                        </View>
                        <View style={{ paddingHorizontal: 10, height: 30, borderRadius: 999, backgroundColor: "rgba(14,43,43,0.04)", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
                          <Text style={[typography.sub, { color: colors.text }]}>{featured.dailyMinutes} min/day</Text>
                        </View>
                      </View>
                    </View>

                    <Pressable
                      onPress={async () => {
                        const next = await toggleBookmark(featured.id);
                        setBookmarks(next);
                      }}
                      style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(14,43,43,0.05)", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}
                    >
                      <BookmarkIcon active={bookmarks.includes(featured.id)} />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </View>
          ) : null}

          {saved.length ? (
            <View style={{ gap: 10 }}>
              <SectionTitle title="Saved" right={<Text style={[typography.sub, { color: colors.subtext }]}>{saved.length}</Text>} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {saved.map((c) => (
                  <Pressable key={c.id} onPress={() => navigation.navigate("ChallengeDetail", { id: c.id })}>
                    <View style={{ width: 220, borderRadius: 16, padding: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 4 }}>
                      <View style={{ width: 64, height: 64, borderRadius: 18, overflow: "hidden" }}>
                        <ChallengeArt id={c.id} size={64} />
                      </View>
                      <Text style={[typography.points, { marginTop: 10 }]} numberOfLines={2}>{c.title}</Text>
                      <Text style={[typography.sub, { marginTop: 6 }]} numberOfLines={2}>{c.shortDescription || c.description}</Text>
                      <Text style={[typography.sub, { marginTop: 10 }]}>{c.label} · {c.durationDays}d</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}

          <SectionTitle title={filter || q ? "Results" : "All challenges"} />

          {rest.map((c) => (
            <Pressable key={c.id} onPress={() => navigation.navigate("ChallengeDetail", { id: c.id })}>
              <View style={{ borderRadius: 16, padding: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 4 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={typography.title} numberOfLines={2}>{c.title}</Text>
                    <Text style={[typography.sub, { marginTop: 6 }]} numberOfLines={2}>{c.shortDescription || c.description}</Text>
                    <Text style={[typography.sub, { marginTop: 10 }]}>{c.label} · {c.durationDays} days · {c.dailyMinutes} min/day</Text>
                  </View>
                  <View style={{ width: 70, height: 70, borderRadius: 18, overflow: "hidden" }}>
                    <ChallengeArt id={c.id} size={70} />
                  </View>
                </View>

                <Pressable
                  onPress={async () => {
                    const next = await toggleBookmark(c.id);
                    setBookmarks(next);
                  }}
                  style={{ position: "absolute", right: 14, top: 14, width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.74)", borderWidth: 1, borderColor: "rgba(14,43,43,0.08)", alignItems: "center", justifyContent: "center" }}
                >
                  <BookmarkIcon active={bookmarks.includes(c.id)} />
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
