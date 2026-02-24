import React from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../theme/ThemeProvider";

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function phaseText(total: number, left: number) {
  const elapsed = total - left;
  const cycle = 12;
  const p = elapsed % cycle;
  if (p < 4) return "Inhale";
  if (p < 6) return "Hold";
  if (p < 10) return "Exhale";
  return "Hold";
}

export function MeditationTimer({
  presets = [5, 10, 15, 20, 30],
  initialSelected,
  onSelect,
  showCues,
  onComplete,
}: {
  presets?: number[];
  initialSelected?: number;
  onSelect?: (minutes: number) => void;
  showCues?: boolean;
  onComplete?: (minutes: number) => void;
}) {
  const { colors, typography } = useTheme();
  const cues = showCues !== false;
  const defaultSelected = initialSelected && presets.includes(initialSelected) ? initialSelected : (presets[1] ?? 10);
  const [selected, setSelected] = React.useState(defaultSelected);
  const [secondsLeft, setSecondsLeft] = React.useState(selected * 60);
  const [running, setRunning] = React.useState(false);

  React.useEffect(() => {
    if (typeof initialSelected === "number" && presets.includes(initialSelected)) {
      setRunning(false);
      setSelected(initialSelected);
      setSecondsLeft(initialSelected * 60);
    }
  }, [initialSelected, presets]);

  React.useEffect(() => {
    if (running) return;
    setSecondsLeft(selected * 60);
  }, [selected, running]);

  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setRunning(false);
          onComplete?.(selected);
          return selected * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, selected, onComplete]);

  const total = selected * 60;
  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;

  const size = 190;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const progress = Math.max(0, Math.min(1, 1 - secondsLeft / total));
  const dash = c * progress;

  return (
    <View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
        {presets.map((m) => (
          <Pressable
            key={m}
            onPress={() => {
              if (running) return;
              setSelected(m);
              onSelect?.(m);
            }}
            style={{
              paddingHorizontal: 14,
              height: 36,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: selected === m ? "rgba(201,168,76,0.12)" : "rgba(14,43,43,0.04)",
              alignItems: "center",
              justifyContent: "center",
              opacity: running ? 0.7 : 1,
            }}
          >
            <Text style={[typography.body, { color: colors.text, fontWeight: selected === m ? "900" : "700" }]}>{m} min</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: "rgba(14,43,43,0.04)", padding: 16 }}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
            <Svg width={size} height={size} style={{ position: "absolute" }}>
              <Circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(14,43,43,0.10)" strokeWidth={stroke} fill="none" />
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke="rgba(201,168,76,0.85)"
                strokeWidth={stroke}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${dash} ${c - dash}`}
                rotation="-90"
                origin={`${size / 2}, ${size / 2}`}
              />
            </Svg>

            <Text style={[typography.title, { fontSize: 34, lineHeight: 38 }]}>{pad(mm)}:{pad(ss)}</Text>
            <Text style={[typography.sub, { marginTop: 8, color: colors.subtext }]}>{running ? (cues ? phaseText(total, secondsLeft) : "Timer running") : "Ready when you are"}</Text>

            <View style={{ marginTop: 14, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.55)", borderWidth: 1, borderColor: "rgba(255,255,255,0.40)" }}>
              <Text style={[typography.sub, { color: colors.text }]}>{selected} min · gentle pace</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 16, width: "100%" }}>
            <Pressable
              onPress={() => setRunning((v) => !v)}
              style={{ flex: 1, height: 46, borderRadius: 18, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={[typography.body, { color: "#fff", fontWeight: "900" }]}>{running ? "Pause" : "Start"}</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setRunning(false);
                setSecondsLeft(selected * 60);
              }}
              style={{ flex: 1, height: 46, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.70)", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={[typography.body, { color: colors.text, fontWeight: "900" }]}>Reset</Text>
            </Pressable>
          </View>

          <Text style={[typography.sub, { marginTop: 12, textAlign: "center" }]}>Try breathing with the prompt. If it distracts you, just return to the timer.</Text>
        </View>
      </View>
    </View>
  );
}
