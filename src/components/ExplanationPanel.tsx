"use client";

import React, { useState, useEffect } from "react";
import {
  Square,
  RefreshCcw,
  Copy,
  Check,
  Download,
  AlertCircle,
  Clock,
  Code2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ExplanationPanelProps {
  content: string;
  isLoading: boolean;
  error: string | null;
  task: string;
  onStop: () => void;
  onRetry: () => void;
  onApplyCode?: (code: string) => void;
  onSelectTask?: (task: any) => void;
  onRun?: () => void;
}

export default function ExplanationPanel({
  content,
  isLoading,
  error,
  task,
  onStop,
  onRetry,
  onApplyCode,
  onSelectTask,
  onRun,
}: ExplanationPanelProps) {
  const [copied, setCopied] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setElapsedSeconds(0);
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `codelens-analysis-${task}-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const taskTitles: Record<string, string> = {
    explain: "Code Explanation",
    debug: "Bug Audit & Fixes",
    complexity: "Complexity Analysis",
    improve: "Performance & Structure",
    learn: "Concept Guide",
  };

  return (
    <div className="h-full flex flex-col bg-[#FAF2E8] text-[#2D1C13] overflow-hidden select-text">
      {/* Panel Header in Soft Cream Latte with Mocha Accents */}
      <div className="h-12 border-b border-[#E0D0BE] px-4 flex items-center justify-between bg-[#EFE3D5] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#6F4E37]" />
          <h2 className="text-xs font-semibold tracking-wide text-[#2D1C13] flex items-center gap-2">
            <span>{taskTitles[task] || "Analysis"}</span>
            {isLoading && (
              <span className="flex items-center gap-1 text-[11px] text-[#6F4E37] font-mono">
                <Clock className="w-3 h-3 animate-spin" />
                {elapsedSeconds}s
              </span>
            )}
          </h2>
        </div>

        {/* Minimalist actions */}
        <div className="flex items-center gap-1.5">
          {isLoading && (
            <button
              onClick={onStop}
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-[#F5D5CE] text-[#7A2416] border border-[#E3B0A5] rounded-md hover:bg-[#ECC5BC] transition-colors"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop</span>
            </button>
          )}

          {content && !isLoading && (
            <>
              <button
                onClick={handleCopy}
                title="Copy analysis"
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#4E3425] hover:text-[#2D1C13] bg-[#E5D7C7] hover:bg-[#DBCABA] border border-[#D5C2AF] rounded-md transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#6F4E37]" />
                    <span className="text-[#6F4E37] font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                title="Download report"
                className="p-1.5 text-[#4E3425] hover:text-[#2D1C13] bg-[#E5D7C7] hover:bg-[#DBCABA] border border-[#D5C2AF] rounded-md transition-colors"
              >
                <Download className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Area in Cream Latte */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Error Callout */}
        {error && (
          <div className="p-4 bg-[#FBECE8] border border-[#EAC2B7] text-[#632014] rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#A83D2B] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-xs text-[#632014]">Analysis Notice</p>
                <p className="text-xs text-[#7A2416] mt-1 leading-relaxed">{error}</p>
              </div>
            </div>
            <button
              onClick={onRetry}
              className="mt-2 flex items-center gap-1 text-xs bg-[#7A2416] hover:bg-[#912D1C] text-[#FAF2E8] px-2.5 py-1 rounded transition"
            >
              <RefreshCcw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* Minimalist Empty State */}
        {!content && !isLoading && !error && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 py-14">
            <div className="w-10 h-10 rounded-xl bg-[#EFE4D6] border border-[#DFCEBC] flex items-center justify-center mb-3">
              <span className="w-3 h-3 rounded-full bg-[#6F4E37]" />
            </div>
            <h3 className="text-sm font-semibold text-[#2D1C13] mb-1">Ready for Analysis</h3>
            <p className="text-xs text-[#6B4F3B] max-w-xs leading-relaxed mb-6">
              Select a task and click Run Analysis or press Ctrl + Enter.
            </p>

            <div className="grid grid-cols-2 gap-2 w-full max-w-xs text-left">
              {[
                { id: "explain", title: "Explain Code", desc: "Logic walkthrough" },
                { id: "debug", title: "Debug & Fix", desc: "Identify issues" },
                { id: "complexity", title: "Complexity", desc: "Time & space bounds" },
                { id: "improve", title: "Improve Code", desc: "Clean & optimize" },
              ].map((card) => (
                <button
                  key={card.id}
                  onClick={() => {
                    if (onSelectTask) onSelectTask(card.id);
                    if (onRun) onRun();
                  }}
                  className="p-2.5 rounded-lg bg-[#F3E9DF] hover:bg-[#EAE0D3] border border-[#DFCEBC] hover:border-[#BFA892] transition text-left group"
                >
                  <span className="text-xs font-semibold text-[#2D1C13] group-hover:text-[#6F4E37] block transition">
                    {card.title}
                  </span>
                  <span className="text-[10px] text-[#7D604C] block mt-0.5">
                    {card.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Minimalist Loading State */}
        {isLoading && !content && (
          <div className="h-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#6F4E37] border-t-transparent animate-spin mb-4" />
            <p className="text-xs font-semibold text-[#2D1C13]">Analyzing Code</p>
            <p className="text-[11px] text-[#7D604C] mt-1">Inspecting structure and logic...</p>
          </div>
        )}

        {/* Rendered Markdown Output */}
        {content && (
          <div className="bg-[#FFFDF9] border border-[#DFCEBC] rounded-xl p-5 shadow-sm">
            <div className="markdown-content text-xs leading-relaxed text-[#2D1C13]">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeString = String(children).replace(/\n$/, "");

                    if (!inline && match) {
                      return (
                        <div className="my-3 rounded-lg overflow-hidden border border-[#442B1E] bg-[#24160E] shadow-sm">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-[#2D1C13] border-b border-[#442B1E] text-[11px] text-[#E0D0C0] font-mono">
                            <span>{match[1]}</span>
                            <div className="flex items-center gap-2">
                              {onApplyCode && (
                                <button
                                  onClick={() => onApplyCode(codeString)}
                                  className="flex items-center gap-1 text-[10px] text-[#FAF2E8] hover:text-[#FFFFFF] px-2 py-0.5 rounded bg-[#452B1E] hover:bg-[#5C3A29] border border-[#613D2B] transition"
                                  title="Apply to editor"
                                >
                                  <Code2 className="w-3 h-3" />
                                  <span>Apply to Editor</span>
                                </button>
                              )}
                              <button
                                onClick={() => navigator.clipboard.writeText(codeString)}
                                className="flex items-center gap-1 text-[10px] text-[#E0D0C0] hover:text-[#FAF2E8] px-1.5 py-0.5 rounded hover:bg-[#3E261A] transition"
                                title="Copy snippet"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </button>
                            </div>
                          </div>
                          <pre className="p-3 overflow-x-auto text-xs text-[#FAF2E8] font-mono leading-relaxed bg-[#24160E]">
                            <code>{children}</code>
                          </pre>
                        </div>
                      );
                    }

                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
