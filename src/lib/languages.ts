export interface LanguageOption {
  id: string;
  name: string;
  ext: string;
  monacoLang: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { id: "typescript", name: "TypeScript", ext: "ts", monacoLang: "typescript" },
  { id: "javascript", name: "JavaScript", ext: "js", monacoLang: "javascript" },
  { id: "python", name: "Python", ext: "py", monacoLang: "python" },
  { id: "cpp", name: "C++", ext: "cpp", monacoLang: "cpp" },
  { id: "rust", name: "Rust", ext: "rs", monacoLang: "rust" },
  { id: "go", name: "Go", ext: "go", monacoLang: "go" },
  { id: "java", name: "Java", ext: "java", monacoLang: "java" },
  { id: "sql", name: "SQL", ext: "sql", monacoLang: "sql" },
];

export const getLanguageId = (ext: string): string => {
  const match = SUPPORTED_LANGUAGES.find((lang) => lang.ext === ext);
  return match ? match.id : "typescript";
};