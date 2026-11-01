"use client";

import React, { useRef, useImperativeHandle, forwardRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";

export interface CodeEditorHandle {
  formatCode: () => void;
  insertSnippet: (snippet: string) => void;
  getCode: () => string;
}

interface CodeEditorProps {
  value: string;
  language: string;
  onChange?: (value: string | undefined) => void;
  onRun?: () => void;
  fontSize?: number;
  minimap?: boolean;
  wordWrap?: boolean;
  tabSize?: number;
}

const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(function CodeEditor(
  {
    value,
    language,
    onChange,
    onRun,
    fontSize = 14,
    minimap = false,
    wordWrap = true,
    tabSize = 2,
  },
  ref
) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  useImperativeHandle(ref, () => ({
    formatCode: () => {
      if (editorRef.current) {
        editorRef.current.getAction("editor.action.formatDocument")?.run();
      }
    },
    insertSnippet: (snippet: string) => {
      if (editorRef.current) {
        editorRef.current.setValue(snippet);
      }
    },
    getCode: () => {
      return editorRef.current ? editorRef.current.getValue() : value;
    },
  }));

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Cream Latte Editor Theme with Mocha Brown syntax for crystal clear contrast
    monaco.editor.defineTheme("cream-latte-theme", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "8E7564", fontStyle: "italic" },
        { token: "keyword", foreground: "5C2E14", fontStyle: "bold" },
        { token: "string", foreground: "753818" },
        { token: "number", foreground: "6E3310" },
        { token: "identifier", foreground: "2D1C13" },
        { token: "type", foreground: "4D230E", fontStyle: "bold" },
        { token: "delimiter", foreground: "7D6556" },
      ],
      colors: {
        "editor.background": "#FAF2E8",
        "editor.foreground": "#2D1C13",
        "editorCursor.foreground": "#2D1C13",
        "editor.lineHighlightBackground": "#EFE1D1",
        "editorLineNumber.foreground": "#9C8372",
        "editorLineNumber.activeForeground": "#2D1C13",
        "editor.selectionBackground": "#DEC9B2",
        "editor.inactiveSelectionBackground": "#E8D8C5",
        "scrollbarSlider.background": "#CCAFA060",
        "scrollbarSlider.hoverBackground": "#B89988",
      },
    });

    monaco.editor.setTheme("cream-latte-theme");

    // Bind Ctrl+Enter to Run Analysis
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRun) onRun();
    });
  };

  return (
    <div className="w-full h-full min-h-[300px] relative bg-[#FAF2E8] overflow-hidden">
      <Editor
        height="100%"
        width="100%"
        language={language}
        defaultLanguage={language}
        value={value}
        defaultValue={value}
        theme="cream-latte-theme"
        onChange={onChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="h-full w-full flex flex-col items-center justify-center bg-[#FAF2E8] text-[#2D1C13] gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[#5C2E14]" />
            <span className="text-xs font-mono font-medium text-[#5C2E14]">Loading Editor...</span>
          </div>
        }
        options={{
          minimap: { enabled: minimap },
          fontSize: fontSize,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          fontLigatures: true,
          wordWrap: wordWrap ? "on" : "off",
          tabSize: tabSize,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          padding: { top: 12, bottom: 12 },
          lineNumbersMinChars: 3,
          renderLineHighlight: "all",
        }}
      />
    </div>
  );
});

export default CodeEditor;