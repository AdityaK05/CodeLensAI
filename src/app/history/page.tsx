"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  History as HistoryIcon,
  Search,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Clock,
} from "lucide-react";
import { loadHistory, deleteHistoryItem, clearHistory, saveWorkspaceState } from "@/lib/storage";
import { HistoryItem } from "@/lib/types";

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(loadHistory());

    const handleUpdate = () => setHistory(loadHistory());
    window.addEventListener("codelens_history_updated", handleUpdate);
    return () => window.removeEventListener("codelens_history_updated", handleUpdate);
  }, []);

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    if (confirm("Clear all analysis history?")) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleOpenInWorkspace = (item: HistoryItem) => {
    saveWorkspaceState({
      code: item.code,
      language: item.language,
      task: item.task,
    });
    router.push("/workspace");
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore
    }
  };

  const filtered = history.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.result.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.language.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTask = selectedTask === "all" || item.task === selectedTask;

    return matchesSearch && matchesTask;
  });

  return (
    <div className="h-full overflow-y-auto bg-[#2D1C13] text-[#FAF2E8] p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#442B1E]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3A2419] border border-[#4E3224] flex items-center justify-center">
              <HistoryIcon className="w-4 h-4 text-[#C89868]" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-[#FAF2E8]">History</h1>
              <p className="text-xs text-[#D8C7B8] mt-0.5">
                Past analysis sessions
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 text-xs text-[#E8C4B8] hover:text-[#FFFFFF] px-3 py-1 rounded-md border border-[#5C3224] bg-[#452619] hover:bg-[#5C3224] transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A89080] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code or results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#342016] border border-[#442B1E] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#FAF2E8] placeholder-[#A89080] focus:outline-none focus:border-[#C89868]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {["all", "explain", "debug", "complexity", "improve", "learn"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTask(t)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium capitalize transition whitespace-nowrap ${
                  selectedTask === t
                    ? "bg-[#FAF2E8] text-[#2D1C13] font-semibold"
                    : "bg-[#342016] text-[#D8C7B8] hover:text-[#FAF2E8] border border-[#442B1E]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center rounded-xl border border-dashed border-[#442B1E] bg-[#342016]/40 p-8">
            <p className="text-xs text-[#D8C7B8] mb-4">No analysis history found.</p>
            <button
              onClick={() => router.push("/workspace")}
              className="text-xs font-semibold px-3.5 py-1.5 bg-[#C89868] hover:bg-[#D5A779] text-[#21140E] rounded-md transition"
            >
              Open Workspace
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-[#342016] border border-[#442B1E] rounded-lg p-4 hover:border-[#6B4430] transition group"
              >
                <div className="flex items-start justify-between gap-4 mb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-[#452B1E] text-[#FAF2E8] border border-[#5C3A29]">
                      {item.task}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono text-[#E0D0C0] bg-[#24160E] rounded border border-[#3E261A]">
                      {item.language}
                    </span>
                    <span className="text-[11px] text-[#A89080] flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenInWorkspace(item)}
                      title="Load into Editor"
                      className="flex items-center gap-1 text-xs text-[#FAF2E8] hover:text-[#FFFFFF] bg-[#452B1E] px-2 py-0.5 rounded border border-[#5C3A29] transition"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleCopy(item.id, item.code)}
                      title="Copy Code"
                      className="p-1 text-[#D8C7B8] hover:text-[#FAF2E8] bg-[#24160E] rounded border border-[#3E261A] transition"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-[#C89868]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete record"
                      className="p-1 text-[#D8C7B8] hover:text-[#FAF2E8] bg-[#24160E] rounded border border-[#3E261A] transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Code snippet */}
                <pre className="bg-[#24160E] border border-[#3E261A] rounded p-2.5 text-xs font-mono text-[#FAF2E8] overflow-x-auto max-h-28 line-clamp-3">
                  {item.code.slice(0, 260)}
                </pre>

                {/* Result snippet */}
                <div className="mt-2 text-xs text-[#D8C7B8] line-clamp-2 leading-relaxed">
                  {item.result.replace(/[#*`_]/g, "").slice(0, 180)}...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}