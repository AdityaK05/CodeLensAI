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
    <div className="h-full flex flex-col bg-[#211426] text-[#FDF8F8] overflow-hidden select-text">
      {/* Panel Header */}
      <div className="h-12 border-b border-[#3D2545] px-4 flex items-center justify-between bg-[#27172E] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C99591]" />
          <h2 className="text-xs font-semibold tracking-wide text-[#FDF8F8] flex items-center gap-2">
            <span>{taskTitles[task] || "Analysis"}</span>
            {isLoading && (
              <span className="flex items-center gap-1 text-[11px] text-[#C99591] font-mono">
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
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-[#401F29] text-[#F2D2CF] border border-[#6B3744] rounded-md hover:bg-[#522835] transition-colors"
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
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#D6BFD9] hover:text-[#FDF8F8] bg-[#311D38] hover:bg-[#3D2547] border border-[#4D2F57] rounded-md transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#C99591]" />
                    <span className="text-[#C99591]">Copied</span>
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
                className="p-1.5 text-[#D6BFD9] hover:text-[#FDF8F8] bg-[#311D38] hover:bg-[#3D2547] border border-[#4D2F57] rounded-md transition-colors"
              >
                <Download className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Error Callout */}
        {error && (
          <div className="p-4 bg-[#3B1924] border border-[#6B2E3F] text-[#FBEAEC] rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#C99591] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-xs text-[#FDF8F8]">Analysis Notice</p>
                <p className="text-xs text-[#F2D2CF] mt-1 leading-relaxed">{error}</p>
              </div>
            </div>
            <button
              onClick={onRetry}
              className="mt-2 flex items-center gap-1 text-xs bg-[#522332] hover:bg-[#662B3E] text-[#FDF8F8] px-2.5 py-1 rounded transition"
            >
              <RefreshCcw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* Minimalist Empty State */}
        {!content && !isLoading && !error && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 py-14">
            <div className="w-10 h-10 rounded-xl bg-[#2D1B33] border border-[#4A2F54] flex items-center justify-center mb-3">
              <span className="w-3 h-3 rounded-full bg-[#C99591]" />
            </div>
            <h3 className="text-sm font-semibold text-[#FDF8F8] mb-1">Ready for Analysis</h3>
            <p className="text-xs text-[#D6BFD9] max-w-xs leading-relaxed mb-6">
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
                  className="p-2.5 rounded-lg bg-[#281830] hover:bg-[#34203D] border border-[#42274A] hover:border-[#633A6E] transition text-left group"
                >
                  <span className="text-xs font-medium text-[#FDF8F8] group-hover:text-[#C99591] block transition">
                    {card.title}
                  </span>
                  <span className="text-[10px] text-[#A68EA9] block mt-0.5">
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
            <div className="w-8 h-8 rounded-full border-2 border-[#C99591] border-t-transparent animate-spin mb-4" />
            <p className="text-xs font-medium text-[#FDF8F8]">Analyzing Code</p>
            <p className="text-[11px] text-[#A68EA9] mt-1">Inspecting structure and logic...</p>
          </div>
        )}

        {/* Rendered Markdown Output */}
        {content && (
          <div className="bg-[#27172E] border border-[#3D2545] rounded-xl p-5 shadow-lg shadow-black/30">
            <div className="markdown-content text-xs leading-relaxed text-[#FDF8F8]">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeString = String(children).replace(/\n$/, "");

                    if (!inline && match) {
                      return (
                        <div className="my-3 rounded-lg overflow-hidden border border-[#4D2F57] bg-[#190F1D]">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-[#231529] border-b border-[#3D2545] text-[11px] text-[#D6BFD9] font-mono">
                            <span>{match[1]}</span>
                            <div className="flex items-center gap-2">
                              {onApplyCode && (
                                <button
                                  onClick={() => onApplyCode(codeString)}
                                  className="flex items-center gap-1 text-[10px] text-[#C99591] hover:text-[#FFFFFF] px-2 py-0.5 rounded bg-[#381F3E] hover:bg-[#4D2B57] transition"
                                  title="Apply to editor"
                                >
                                  <Code2 className="w-3 h-3" />
                                  <span>Apply to Editor</span>
                                </button>
                              )}
                              <button
                                onClick={() => navigator.clipboard.writeText(codeString)}
                                className="flex items-center gap-1 text-[10px] text-[#D6BFD9] hover:text-[#FDF8F8] px-1.5 py-0.5 rounded hover:bg-[#311D38] transition"
                                title="Copy snippet"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </button>
                            </div>
                          </div>
                          <pre className="p-3 overflow-x-auto text-xs text-[#FDF8F8] font-mono leading-relaxed bg-[#190F1D]">
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
