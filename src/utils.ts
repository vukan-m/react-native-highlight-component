import { HighlightStorage } from "./storage";
import { HighlightComponentSettings } from "./types";

const applyDefaultsToSettings = (settings: HighlightComponentSettings) => {
  settings.displayCountPeriod = 0;
  settings.displayPeriod = 0;
  settings.displayUntilComplete = true;
  settings.isShown = false;
  settings.shownCount = 0;
  settings.lastShownDate = 0;
  settings.isCompleted = false;
};

const shouldDisplayHighlight = (settings: HighlightComponentSettings) => {
  if (settings.displayUntilComplete && !settings.isCompleted) {
    return true;
  }

  if (settings.displayCountPeriod > 0 && settings.shownCount < settings.displayCountPeriod) {
    return true;
  }

  if (settings.displayPeriod > 0) {
    const lastShownDate = settings?.lastShownDate || 0;
    const now = new Date().getTime();
    const daysSinceLastShown = (now - lastShownDate) / (1000 * 60 * 60 * 24);

    if (daysSinceLastShown >= settings.displayPeriod) {
      return true;
    }
  }

  if (!settings.isShown) {
    return true;
  }

  return false;
};

const highlightState = new Map<string, boolean>();
const setHighlightShownState = (id: string, value: boolean) => {
  highlightState.set(id, value);
};
const getHighlightShownState = (id: string) => {
  return highlightState.get(id);
};

const resetHighlights = () => {
  HighlightStorage.clearAll();
  highlightState.clear();
};

export {
  applyDefaultsToSettings,
  getHighlightShownState,
  resetHighlights,
  setHighlightShownState,
  shouldDisplayHighlight,
};
