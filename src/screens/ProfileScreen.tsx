import React from "react";
import { Alert, Image, Platform, Pressable, ScrollView, Share, Switch, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../theme/ThemeProvider";
import { Card } from "../components/Card";
import { CalmHeader } from "../components/CalmHeader";
import { SparkleGold } from "../components/HomeIcons";
import { DefaultAvatar } from "../components/DefaultAvatar";
import { ChevronRight, DownloadIcon, Gear, Moon, Shield, TrashIcon } from "../components/SettingsIcons";
import { getProfile, setProfile, getPrefs, setPrefs, resetAllData, listSessions, listBookmarks } from "../storage/store";
import { getWebAvatar, setWebAvatar } from "../storage/webAvatar";

function Row({
  icon,
  title,
  subtitle,
  right,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}) {
  const { colors, typography } = useTheme();
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 }}>
      <View style={{ width: 38, height: 38, borderRadius: 14, backgroundColor: "rgba(14,43,43,0.06)", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[typography.body, { fontWeight: "900" }]}>{title}</Text>
        {subtitle ? <Text style={[typography.sub, { marginTop: 4 }]}>{subtitle}</Text> : null}
      </View>
      {right ? right : onPress ? <ChevronRight /> : null}
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }: any) {
  const { colors, spacing, typography } = useTheme();
  const [name, setName] = React.useState("User");
  const [avatarUri, setAvatarUri] = React.useState("");
  const [prefs, setPrefsState] = React.useState({ defaultMinutes: 10, breathingCues: true, weeklyRhythm: true, compactCards: false });
  const [saving, setSaving] = React.useState(false);
  const [stats, setStats] = React.useState({ sessions: 0, saved: 0 });

  const load = React.useCallback(async () => {
    const [p, pr, s, b] = await Promise.all([getProfile(), getPrefs(), listSessions(), listBookmarks()]);
    setName(p?.name || "User");
    setAvatarUri(p?.avatarUri || "");
    if (Platform.OS === "web" && p?.avatarRef?.key) {
      const blob = await getWebAvatar();
      if (blob) {
        const url = URL.createObjectURL(blob);
        setAvatarUri(url);
      }
    }
    setPrefsState(pr);
    setStats({ sessions: s.length, saved: b.length });
  }, []);

  React.useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    load();
    return unsub;
  }, [navigation, load]);

  const pickAvatar = async () => {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    Alert.alert("Permission needed", "Please allow photo access to choose a profile picture.");
    return;
  }
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.9,
  });
  if (res.canceled) return;
  const uri = res.assets?.[0]?.uri;
  if (!uri) return;
  if (Platform.OS === "web") {
    const r = await fetch(uri);
    const blob = await r.blob();
    await setWebAvatar(blob);
    const url = URL.createObjectURL(blob);
    setAvatarUri(url);
    return;
  }
  setAvatarUri(uri);
};

  const save = async () => {
    if (saving) return;
    setSaving(true);
    if (Platform.OS === "web") {
      await setProfile({ name: name.trim() || "User", avatarUri: "", avatarRef: { kind: "idb", key: "avatar_v1" } });
    } else {
      await setProfile({ name: name.trim() || "User", avatarUri });
    }
    await setPrefs(prefs);
    setSaving(false);
    await load();
    Alert.alert("Saved", "Your settings are updated.");
  };

  const setDefaultMinutes = (m: number) => {
    setPrefsState((p) => ({ ...p, defaultMinutes: m }));
  };

  const exportData = async () => {
  const payload = {
    app: "Habitly",
    exportedAt: new Date().toISOString(),
    profile: await getProfile(),
    prefs: await getPrefs(),
    sessions: await listSessions(),
    savedChallengeIds: await listBookmarks(),
  };
  const json = JSON.stringify(payload, null, 2);
  if (Platform.OS === "web") {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "habitly-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    Alert.alert("Exported", "Downloaded habitly-backup.json");
    return;
  }
  try {
    await Share.share({ message: json });
  } catch {
    Alert.alert("Export", "Could not open share sheet on this device.");
  }
};

  const reset = async () => {
    Alert.alert("Reset all data?", "This will clear sessions, saved challenges, and your profile on this device.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: async () => {
          await resetAllData();
          await load();
          Alert.alert("Reset", "All local data has been cleared.");
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.tabBarGutter }}>
        <CalmHeader
          title="Profile"
          subtitle="Make the app feel like yours — small tweaks, big comfort."
          name={name}
          avatarUri={avatarUri}
          rightBadge={<SparkleGold size={18} />}
          onPressRight={save}
        />

        <View style={{ paddingHorizontal: spacing.md, marginTop: -26, gap: spacing.md }}>
          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View>
                <Text style={typography.title}>Account</Text>
                <Text style={[typography.sub, { marginTop: 6 }]}>Local-only profile</Text>
              </View>
              <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: "rgba(201,168,76,0.12)", borderWidth: 1, borderColor: "rgba(201,168,76,0.20)" }}>
                <Text style={[typography.sub, { color: colors.accent }]}>{stats.sessions} sessions · {stats.saved} saved</Text>
              </View>
            </View>

            <Pressable onPress={pickAvatar} style={{ alignItems: "center", marginTop: 16 }}>
              <View style={{ width: 92, height: 92, borderRadius: 46, overflow: "hidden", backgroundColor: "rgba(14,43,43,0.06)", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
                {avatarUri ? <Image source={{ uri: avatarUri }} style={{ width: 92, height: 92 }} /> : <DefaultAvatar size={92} />}
              </View>
              <Text style={[typography.sub, { marginTop: 10 }]}>Tap to change photo</Text>
</Pressable>

            <View style={{ marginTop: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: "rgba(14,43,43,0.04)", paddingHorizontal: 14, paddingVertical: 10 }}>
              <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor="rgba(14,43,43,0.35)" style={[typography.body, { fontWeight: "900" }]} />
            </View>

            <Pressable onPress={save} style={{ marginTop: 14, height: 46, borderRadius: 18, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", opacity: saving ? 0.7 : 1 }}>
              <Text style={[typography.body, { color: "#fff", fontWeight: "900" }]}>{saving ? "Saving..." : "Save"}</Text>
            </Pressable>
          </Card>

          <Card>
            <Text style={typography.title}>Preferences</Text>
            <Text style={[typography.sub, { marginTop: 6 }]}>Tune the experience to your style.</Text>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
              {[5, 10, 15, 20].map((m) => (
                <Pressable
                  key={m}
                  onPress={() => setDefaultMinutes(m)}
                  style={{
                    flex: 1,
                    height: 40,
                    borderRadius: 18,
                    backgroundColor: prefs.defaultMinutes === m ? "rgba(201,168,76,0.14)" : "rgba(14,43,43,0.04)",
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={[typography.body, { fontWeight: "900" }]}>{m}m</Text>
                </Pressable>
              ))}
            </View>
            <Text style={[typography.sub, { marginTop: 8 }]}>Default quick-start duration</Text>

            <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: colors.border }} />

            <Row
              icon={<Gear />}
              title="Breathing cues in timer"
              subtitle="Inhale / hold / exhale prompts during sessions"
              right={
                <Switch
                  value={prefs.breathingCues}
                  onValueChange={(v) => setPrefsState((p) => ({ ...p, breathingCues: v }))}
                  trackColor={{ false: "rgba(14,43,43,0.14)", true: "rgba(201,168,76,0.55)" }}
                  thumbColor="#fff"
                />
              }
            />

            <View style={{ borderTopWidth: 1, borderTopColor: colors.border }} />

            <Row
              icon={<Moon />}
              title="Weekly rhythm on Home"
              subtitle="Show your last 7 days as a calm chart"
              right={
                <Switch
                  value={prefs.weeklyRhythm}
                  onValueChange={(v) => setPrefsState((p) => ({ ...p, weeklyRhythm: v }))}
                  trackColor={{ false: "rgba(14,43,43,0.14)", true: "rgba(201,168,76,0.55)" }}
                  thumbColor="#fff"
                />
              }
            />

            <View style={{ borderTopWidth: 1, borderTopColor: colors.border }} />

            <Row
              icon={<Shield />}
              title="Compact cards"
              subtitle="Denser layout for faster browsing"
              right={
                <Switch
                  value={prefs.compactCards}
                  onValueChange={(v) => setPrefsState((p) => ({ ...p, compactCards: v }))}
                  trackColor={{ false: "rgba(14,43,43,0.14)", true: "rgba(201,168,76,0.55)" }}
                  thumbColor="#fff"
                />
              }
            />
          </Card>

          <Card>
            <Text style={typography.title}>Data</Text>
            <Text style={[typography.sub, { marginTop: 6 }]}>Keep control of what’s stored on this device.</Text>

            <View style={{ marginTop: 10, borderTopWidth: 1, borderTopColor: colors.border }} />

            <Row icon={<DownloadIcon />} title="Export (demo)" subtitle="In production: export a JSON backup file" onPress={exportData} />

            <View style={{ borderTopWidth: 1, borderTopColor: colors.border }} />

            <Row icon={<TrashIcon />} title="Reset all local data" subtitle="Clear sessions, saved challenges, and profile" onPress={reset} />
          </Card>
          <Card>
            <Text style={typography.title}>Shortcuts</Text>
            <Text style={[typography.sub, { marginTop: 6 }]}>Jump to the parts you use most.</Text>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
              <Pressable
                onPress={() => navigation.navigate("Play", { presetMinutes: prefs.defaultMinutes })}
                style={{ flex: 1, height: 46, borderRadius: 18, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" }}
              >
                <Text style={[typography.body, { color: "#fff", fontWeight: "900" }]}>Start {prefs.defaultMinutes}m</Text>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate("Search")}
                style={{ flex: 1, height: 46, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.70)", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}
              >
                <Text style={[typography.body, { color: colors.text, fontWeight: "900" }]}>Open Library</Text>
              </Pressable>
            </View>

            <View style={{ marginTop: 10, padding: 12, borderRadius: 16, backgroundColor: "rgba(201,168,76,0.10)", borderWidth: 1, borderColor: "rgba(201,168,76,0.18)" }}>
              <Text style={[typography.body, { fontWeight: "900" }]}>Tip</Text>
              <Text style={[typography.sub, { marginTop: 8 }]}>Pick one challenge and repeat it for a week. Depth beats variety.</Text>
            </View>
          </Card>

          <View style={{ height: 2 }} />
        </View>
      </ScrollView>
    </View>
  );
}
