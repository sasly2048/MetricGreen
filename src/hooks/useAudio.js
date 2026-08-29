"use client";

import { useEffect, useState, useCallback } from "react";
import { sfx, getAudioSettings, setAudioEnabled, setAudioVolume } from "@/lib/sfx";

export function useAudio() {
  const [settings, setSettings] = useState(getAudioSettings());

  useEffect(() => {
    const onStorage = () => setSettings(getAudioSettings());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback(() => {
    setAudioEnabled(!settings.enabled);
    setSettings({ ...settings, enabled: !settings.enabled });
    if (!settings.enabled) sfx.click();
  }, [settings]);

  const setVolume = useCallback((v) => {
    setAudioVolume(v);
    setSettings({ ...settings, volume: v });
  }, [settings]);

  return { settings, toggle, setVolume, sfx };
}
