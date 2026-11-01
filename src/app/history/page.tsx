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
    <div className="h-full overflow-y-auto bg-[#211426] text-[#FDF8F8] p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#3D2545]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2D1B33] border border-[#4A2F54] flex items-center justify-center">
              <HistoryIcon className="w-4 h-4 text-[#C99591]" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-[#FDF8F8]">History</h1>
              <p className="text-xs text-[#D6BFD9] mt-0.5">
                Past analysis sessions
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 text-xs text-[#E8CDCB] hover:text-[#FFFFFF] px-3 py-1 rounded-md border border-[#54335E] bg-[#311D38] hover:bg-[#42274A] transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9E88A3] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code or results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#27172E] border border-[#3D2545] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#FDF8F8] placeholder-[#9E88A3] focus:outline-none focus:border-[#C99591]"
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
                    ? "bg-[#C99591] text-[#211426] font-semibold"
                    : "bg-[#27172E] text-[#D6BFD9] hover:text-[#FDF8F8] border border-[#3D2545]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center rounded-xl border border-dashed border-[#3D2545] bg-[#27172E]/40 p-8">
            <p className="text-xs text-[#D6BFD9] mb-4">No analysis history found.</p>
            <button
              onClick={() => router.push("/workspace")}
              className="text-xs font-semibold px-3.5 py-1.5 bg-[#C99591] hover:bg-[#D8A7A3] text-[#211426] rounded-md transition"
            >
              Open Workspace
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-[#27172E] border border-[#3D2545] rounded-lg p-4 hover:border-[#633A6E] transition group"
              >
                <div className="flex items-start justify-between gap-4 mb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-[#381F3E] text-[#C99591] border border-[#522E5C]">
                      {item.task}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono text-[#D6BFD9] bg-[#1E1224] rounded border border-[#381E42]">
                      {item.language}
                    </span>
                    <span className="text-[11px] text-[#9E88A3] flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenInWorkspace(item)}
                      title="Load into Editor"
                      className="flex items-center gap-1 text-xs text-[#C99591] hover:text-[#FFFFFF] bg-[#381F3E] px-2 py-0.5 rounded border border-[#522E5C] transition"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleCopy(item.id, item.code)}
                      title="Copy Code"
                      className="p-1 text-[#D6BFD9] hover:text-[#FDF8F8] bg-[#1E1224] rounded border border-[#381E42] transition"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-[#C99591]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete record"
                      className="p-1 text-[#D6BFD9] hover:text-[#E8CDCB] bg-[#1E1224] rounded border border-[#381E42] transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Code snippet */}
                <pre className="bg-[#190E1C] border border-[#331B3A] rounded p-2.5 text-xs font-mono text-[#F2D7E0] overflow-x-auto max-h-28 line-clamp-3">
                  {item.code.slice(0, 260)}
                </pre>

                {/* Result snippet */}
                <div className="mt-2 text-xs text-[#D6BFD9] line-clamp-2 leading-relaxed">
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