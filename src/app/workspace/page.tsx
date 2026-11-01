"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { CodeEditorHandle } from "@/components/CodeEditor";
import ExplanationPanel from "@/components/ExplanationPanel";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#1D1122] text-[#D6BFD9] gap-3">
      <span className="text-xs font-mono">Loading Editor...</span>
    </div>
  ),
});

import {
  Play,
  FileCode2,
  Copy,
  Check,
  Upload,
  Download,
  Trash2,
  Wand2,
  Layers,
  Loader2,
} from "lucide-react";
import { SUPPORTED_LANGUAGES, getLanguageId } from "@/lib/languages";
import { CODE_PRESETS, CodePreset } from "@/lib/demo-fixtures";
import {
  loadSettings,
  saveHistoryItem,
  loadWorkspaceState,
  saveWorkspaceState,
} from "@/lib/storage";
import { AnalysisTaskType, UserSettings, DEFAULT_USER_SETTINGS } from "@/lib/types";

export default function WorkspacePage() {
  const editorRef = useRef<CodeEditorHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [code, setCode] = useState<string>(CODE_PRESETS[0].code);
  const [language, setLanguage] = useState<string>(CODE_PRESETS[0].language);
  const [task, setTask] = useState<AnalysisTaskType>("explain");

  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);

  useEffect(() => {
    const savedSettings = loadSettings();
    setUserSettings(savedSettings);

    const savedState = loadWorkspaceState();
    if (savedState && savedState.code && savedState.code.trim().length > 0) {
      setCode(savedState.code);
      if (savedState.language) setLanguage(savedState.language);
      if (savedState.task) setTask(savedState.task as AnalysisTaskType);
    } else {
      setCode(CODE_PRESETS[0].code);
      setLanguage(CODE_PRESETS[0].language);
      setTask(CODE_PRESETS[0].task);
    }
  }, []);

  useEffect(() => {
    saveWorkspaceState({ code, language, task });
  }, [code, language, task]);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError("Please enter or load some code to analyze.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setContent("");

    const controller = new AbortController();
    setAbortController(controller);
    const startTime = Date.now();

    let fullResult = "";

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          task,
          language,
          provider: userSettings.provider,
          apiKey:
            userSettings.provider === "google"
              ? userSettings.customGeminiKey
              : userSettings.provider === "groq"
              ? userSettings.customGroqKey
              : undefined,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body received.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullResult += chunk;
        setContent((prev) => prev + chunk);
      }

      if (userSettings.autoSaveHistory && fullResult.length > 0) {
        saveHistoryItem({
          title: `${task.toUpperCase()} • ${language.toUpperCase()}`,
          language,
          task,
          code,
          result: fullResult,
          provider: "ai",
          durationMs: Date.now() - startTime,
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("Analysis stopped by user.");
      } else {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleLoadPreset = (preset: CodePreset) => {
    setCode(preset.code);
    setLanguage(preset.language);
    setTask(preset.task);
    setContent("");
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop() || "";
    const matchedLang = getLanguageId(ext);
    if (matchedLang) {
      setLanguage(matchedLang);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCode(text);
        setContent("");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadCode = () => {
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.id === language);
    const ext = langObj ? langObj.ext : "txt";
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `codelens-snippet.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.formatCode();
    }
  };

  const handleApplyCode = (newCode: string) => {
    setCode(newCode);
    if (editorRef.current) {
      editorRef.current.insertSnippet(newCode);
    }
  };

  const lineCount = code.split("\n").length;
  const charCount = code.length;

  return (
    <div className="w-full h-full flex flex-col bg-[#2D1C13] text-[#FAF2E8] overflow-hidden">
      {/* Top Action Toolbar in Mocha Brown */}
      <div className="h-12 border-b border-[#442B1E] px-4 flex items-center justify-between bg-[#342016] shrink-0 gap-3">
        {/* Left Toolbar: Language & Presets */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-[#2D1C13] border border-[#4E3224] rounded-md px-2.5 py-1 text-xs text-[#E0D0C0]">
            <FileCode2 className="w-3.5 h-3.5 text-[#C89868] shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs text-[#FAF2E8] focus:outline-none cursor-pointer pr-1"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-[#2D1C13] text-[#FAF2E8]">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-1.5 bg-[#2D1C13] border border-[#4E3224] rounded-md px-2.5 py-1 text-xs text-[#E0D0C0]">
            <Layers className="w-3.5 h-3.5 text-[#C89868] shrink-0" />
            <select
              defaultValue=""
              onChange={(e) => {
                const found = CODE_PRESETS.find((p) => p.id === e.target.value);
                if (found) handleLoadPreset(found);
                e.target.value = "";
              }}
              className="bg-transparent text-xs text-[#FAF2E8] focus:outline-none cursor-pointer pr-1"
            >
              <option value="" disabled className="bg-[#2D1C13] text-[#A68875]">
                Load Example...
              </option>
              {CODE_PRESETS.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#2D1C13] text-[#FAF2E8]">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Editor Action Tools */}
          <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-[#4E3224]">
            <button
              onClick={handleFormatCode}
              title="Format Code"
              className="p-1.5 rounded-md text-[#D8C7B8] hover:text-[#FAF2E8] hover:bg-[#442B1E] transition"
            >
              <Wand2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCopyCode}
              title="Copy Code"
              className="p-1.5 rounded-md text-[#D8C7B8] hover:text-[#FAF2E8] hover:bg-[#442B1E] transition"
            >
              {copiedCode ? (
                <Check className="w-3.5 h-3.5 text-[#C89868]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload File"
              className="p-1.5 rounded-md text-[#D8C7B8] hover:text-[#FAF2E8] hover:bg-[#442B1E] transition"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".ts,.tsx,.js,.jsx,.py,.cpp,.c,.rs,.go,.java,.sql,.json,.txt"
            />
            <button
              onClick={handleDownloadCode}
              title="Download Code"
              className="p-1.5 rounded-md text-[#D8C7B8] hover:text-[#FAF2E8] hover:bg-[#442B1E] transition"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setCode("");
                setContent("");
                setError(null);
              }}
              title="Clear Editor"
              className="p-1.5 rounded-md text-[#D8C7B8] hover:text-[#FAF2E8] hover:bg-[#442B1E] transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Toolbar: Task Selection & Run */}
        <div className="flex items-center gap-2.5">
          {/* Task Pills */}
          <div className="flex items-center gap-0.5 bg-[#2D1C13] p-0.5 rounded-md border border-[#4E3224]">
            {(
              [
                { id: "explain", label: "Explain" },
                { id: "debug", label: "Debug" },
                { id: "complexity", label: "Complexity" },
                { id: "improve", label: "Improve" },
                { id: "learn", label: "Learn" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTask(t.id)}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                  task === t.id
                    ? "bg-[#FAF2E8] text-[#2D1C13] font-semibold"
                    : "text-[#D8C7B8] hover:text-[#FAF2E8]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Minimalist Run Button in Warm Caramel / Latte Accent */}
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C89868] hover:bg-[#D5A779] disabled:opacity-50 text-[#21140E] rounded-md text-xs font-semibold shadow-sm transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Run Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden relative w-full h-full">
        {/* Editor Area (Cream Latte #FAF2E8) */}
        <div className="flex-1 min-h-0 h-full relative overflow-hidden flex flex-col bg-[#FAF2E8]">
          <div className="flex-1 min-h-0 relative w-full h-full bg-[#FAF2E8]">
            <CodeEditor
              ref={editorRef}
              value={code}
              language={language}
              onChange={(val) => setCode(val || "")}
              onRun={handleAnalyze}
              fontSize={userSettings.fontSize}
              minimap={userSettings.minimap}
              wordWrap={userSettings.wordWrap}
              tabSize={userSettings.tabSize}
            />
          </div>

          {/* Minimalist Bottom Status Bar in Cream Latte Tone */}
          <div className="h-6 border-t border-[#E0D0BE] bg-[#EFE3D5] px-4 flex items-center justify-between text-[11px] text-[#4A3222] select-none shrink-0 font-mono font-medium">
            <div className="flex items-center gap-3">
              <span>{language.toUpperCase()}</span>
              <span>•</span>
              <span>{lineCount} lines</span>
              <span>•</span>
              <span>{charCount} chars</span>
            </div>
            <div className="flex items-center gap-3">
              <span>UTF-8</span>
              <span>•</span>
              <span>Tab: {userSettings.tabSize}</span>
            </div>
          </div>
        </div>

        {/* AI Explanation Panel */}
        <div className="w-full md:w-[480px] lg:w-[540px] xl:w-[600px] h-full shrink-0 flex flex-col min-h-0 border-l border-[#DFCEBC]">
          <ExplanationPanel
            content={content}
            isLoading={isLoading}
            error={error}
            task={task}
            onStop={handleStop}
            onRetry={handleAnalyze}
            onApplyCode={handleApplyCode}
            onSelectTask={(t) => setTask(t)}
            onRun={handleAnalyze}
          />
        </div>
      </div>
    </div>
  );
}
