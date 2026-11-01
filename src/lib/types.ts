export type Theme = "light" | "dark";

export type AnalysisTaskType = "explain" | "debug" | "complexity" | "improve" | "learn";

export interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
}

export interface Explanation {
  id: string;
  summary: string;
  details: string[];
  complexity: string;
}

export interface EditorSettings {
  language: string;
  theme: "vs-dark" | "vs-light";
  fontSize: number;
  minimap: boolean;
  wordWrap: boolean;
  tabSize: number;
}

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: number;
  language: string;
  task: AnalysisTaskType;
  code: string;
  result: string;
  provider: string;
  durationMs?: number;
}

export interface UserSettings {
  provider: "auto" | "google" | "groq";
  customGeminiKey: string;
  customGroqKey: string;
  editorTheme: "vs-dark" | "vs-light";
  fontSize: number;
  minimap: boolean;
  wordWrap: boolean;
  tabSize: number;
  autoSaveHistory: boolean;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  provider: "auto",
  customGeminiKey: "",
  customGroqKey: "",
  editorTheme: "vs-dark",
  fontSize: 14,
  minimap: false,
  wordWrap: true,
  tabSize: 2,
  autoSaveHistory: true,
};