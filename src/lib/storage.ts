import { DEFAULT_USER_SETTINGS, HistoryItem, UserSettings } from "./types";

const SETTINGS_KEY = "codelens_settings_v1";
const HISTORY_KEY = "codelens_history_v1";
const WORKSPACE_KEY = "codelens_workspace_state_v1";

export function loadSettings(): UserSettings {
  if (typeof window === "undefined") return DEFAULT_USER_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_USER_SETTINGS;
    return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error("Failed to load settings:", e);
    return DEFAULT_USER_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event("codelens_settings_updated"));
  } catch (e) {
    console.error("Failed to save settings:", e);
  }
}

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load history:", e);
    return [];
  }
}

export function saveHistoryItem(item: Omit<HistoryItem, "id" | "timestamp">): HistoryItem {
  const newItem: HistoryItem = {
    ...item,
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
  };

  if (typeof window === "undefined") return newItem;

  try {
    const history = loadHistory();
    // Cap at 100 items
    const updated = [newItem, ...history].slice(0, 100);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("codelens_history_updated"));
  } catch (e) {
    console.error("Failed to save history item:", e);
  }

  return newItem;
}

export function deleteHistoryItem(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const history = loadHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("codelens_history_updated"));
  } catch (e) {
    console.error("Failed to delete history item:", e);
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new Event("codelens_history_updated"));
  } catch (e) {
    console.error("Failed to clear history:", e);
  }
}

export interface WorkspaceState {
  code: string;
  language: string;
  task: string;
}

export function loadWorkspaceState(): WorkspaceState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(WORKSPACE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveWorkspaceState(state: WorkspaceState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save workspace state:", e);
  }
}
