"use client";

import React, { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Key,
  Code2,
  Check,
  RotateCcw,
  Save,
  Loader2,
} from "lucide-react";
import { loadSettings, saveSettings } from "@/lib/storage";
import { UserSettings, DEFAULT_USER_SETTINGS } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReset = () => {
    if (confirm("Reset settings to default?")) {
      setSettings(DEFAULT_USER_SETTINGS);
      saveSettings(DEFAULT_USER_SETTINGS);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "explain",
          code: "const ready = true;",
          language: "javascript",
          provider: settings.provider,
          apiKey: settings.customGeminiKey || settings.customGroqKey,
        }),
      });

      if (res.ok) {
        setTestResult("Connection Successful • AI Engine Ready");
      } else {
        const err = await res.json().catch(() => ({}));
        setTestResult(`Notice: ${err.error || "Connection could not be verified"}`);
      }
    } catch (e: any) {
      setTestResult(`Notice: ${e.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[#211426] text-[#FDF8F8] p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#3D2545]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2D1B33] border border-[#4A2F54] flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 text-[#C99591]" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-[#FDF8F8]">Settings</h1>
              <p className="text-xs text-[#D6BFD9] mt-0.5">Preferences and credentials</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-[#D6BFD9] hover:text-[#FDF8F8] px-3 py-1.5 rounded-md border border-[#3D2545] bg-[#27172E] transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#211426] px-4 py-1.5 rounded-md bg-[#C99591] hover:bg-[#D8A7A3] transition shadow-sm"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#211426]" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section 1: API Configuration */}
        <div className="bg-[#27172E] border border-[#3D2545] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-[#C99591]" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#FDF8F8]">
                API Configuration
              </h2>
            </div>
            <button
              onClick={testConnection}
              disabled={isTesting}
              className="text-xs text-[#C99591] hover:text-[#E8CDCB] flex items-center gap-1 font-medium disabled:opacity-50"
            >
              {isTesting && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>Test Connection</span>
            </button>
          </div>

          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs text-[#D6BFD9]">Primary API Key</label>
              <input
                type="password"
                placeholder="Configured via .env.local (or enter override)"
                value={settings.customGeminiKey}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, customGeminiKey: e.target.value }))
                }
                className="w-full bg-[#1C1021] border border-[#3D2545] rounded-lg px-3 py-1.5 text-xs text-[#FDF8F8] placeholder-[#7F6485] focus:outline-none focus:border-[#C99591] font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#D6BFD9]">Secondary API Key</label>
              <input
                type="password"
                placeholder="Configured via .env.local (or enter override)"
                value={settings.customGroqKey}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, customGroqKey: e.target.value }))
                }
                className="w-full bg-[#1C1021] border border-[#3D2545] rounded-lg px-3 py-1.5 text-xs text-[#FDF8F8] placeholder-[#7F6485] focus:outline-none focus:border-[#C99591] font-mono"
              />
            </div>

            {testResult && (
              <p
                className={`text-xs font-mono pt-1 ${
                  testResult.includes("Successful") ? "text-[#C99591]" : "text-[#D88D88]"
                }`}
              >
                {testResult}
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Editor Preferences */}
        <div className="bg-[#27172E] border border-[#3D2545] rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#C99591]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#FDF8F8]">
              Editor Preferences
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs text-[#D6BFD9]">Font Size</label>
              <select
                value={settings.fontSize}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, fontSize: Number(e.target.value) }))
                }
                className="w-full bg-[#1C1021] border border-[#3D2545] rounded-lg px-3 py-1.5 text-xs text-[#FDF8F8] focus:outline-none focus:border-[#C99591]"
              >
                <option value={12}>12px</option>
                <option value={14}>14px (Standard)</option>
                <option value={16}>16px</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#D6BFD9]">Word Wrap</label>
              <select
                value={settings.wordWrap ? "true" : "false"}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, wordWrap: e.target.value === "true" }))
                }
                className="w-full bg-[#1C1021] border border-[#3D2545] rounded-lg px-3 py-1.5 text-xs text-[#FDF8F8] focus:outline-none focus:border-[#C99591]"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#D6BFD9]">Minimap</label>
              <select
                value={settings.minimap ? "true" : "false"}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, minimap: e.target.value === "true" }))
                }
                className="w-full bg-[#1C1021] border border-[#3D2545] rounded-lg px-3 py-1.5 text-xs text-[#FDF8F8] focus:outline-none focus:border-[#C99591]"
              >
                <option value="false">Hidden</option>
                <option value="true">Visible</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#D6BFD9]">Tab Size</label>
              <select
                value={settings.tabSize}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, tabSize: Number(e.target.value) }))
                }
                className="w-full bg-[#1C1021] border border-[#3D2545] rounded-lg px-3 py-1.5 text-xs text-[#FDF8F8] focus:outline-none focus:border-[#C99591]"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}