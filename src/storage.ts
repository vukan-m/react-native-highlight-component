import { MMKV } from "react-native-mmkv";
import { HighlightComponentSettings } from "./types";
import { applyDefaultsToSettings } from "./utils";

export const HighlightStorage = new MMKV();
export const HighlightStorageMMKVKeys = {
  highlightSettings: (componentId: string) => `highlight_settings_${componentId}`,
};

export const getStorageSettings: (componentId: string) => HighlightComponentSettings = componentId => {
  const key = HighlightStorageMMKVKeys.highlightSettings(componentId);
  const settingsString = HighlightStorage.getString(key);
  if (settingsString) {
    return JSON.parse(settingsString);
  }
  const initSettings = {};
  applyDefaultsToSettings(initSettings as HighlightComponentSettings);
  HighlightStorage.set(key, JSON.stringify(initSettings));

  return initSettings;
};

export const setStorageSettings = (componentId: string, newSettings: Partial<HighlightComponentSettings>) => {
  const currentSettings = getStorageSettings(componentId);
  const settingsToWrite = { ...currentSettings, ...newSettings };
  HighlightStorage.set(HighlightStorageMMKVKeys.highlightSettings(componentId), JSON.stringify(settingsToWrite));
};
