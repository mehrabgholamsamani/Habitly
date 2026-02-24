import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { getProfile } from "../storage/store";
import { getWebAvatar } from "../storage/webAvatar";

export function useProfile() {
  const [name, setName] = useState("User");
  const [avatarUri, setAvatarUri] = useState("");
  const lastObjectUrl = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    const p = await getProfile();
    setName((p?.name || "User").trim() || "User");

    if (Platform.OS !== "web") {
      setAvatarUri(p?.avatarUri || "");
      return;
    }

    if (p?.avatarUri) {
      setAvatarUri(p.avatarUri);
      return;
    }

    const blob = await getWebAvatar();
    if (!blob) {
      setAvatarUri("");
      return;
    }

    if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current);
    const url = URL.createObjectURL(blob);
    lastObjectUrl.current = url;
    setAvatarUri(url);
  }, []);

  useEffect(() => {
    refresh();
    return () => {
      if (Platform.OS === "web" && lastObjectUrl.current) {
        URL.revokeObjectURL(lastObjectUrl.current);
      }
    };
  }, [refresh]);

  return { name, avatarUri, refresh };
}
