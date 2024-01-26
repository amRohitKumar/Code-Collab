const languages = [
  { name: "WEB", value: "WEB" },
  { name: "C", value: "C", editorLang: "c", color: "#555555" },
  { name: "C++17", value: "CPP17", editorLang: "cpp", color: "#00599C" },
  { name: "Java 14", value: "JAVA14", editorLang: "java", color: "#FF0000" },
  {
    name: "JavaScript",
    value: "JAVASCRIPT_NODE",
    editorLang: "javascript",
    color: "#F7DF1E",
  },
  {
    name: "HTML",
    value: "HTML",
    editorLang: "html",
    color: "#E34F26",
  },
  {
    name: "CSS",
    value: "CSS",
    editorLang: "css",
    color: "#264DE4",
  },
  { name: "Kotlin", value: "KOTLIN", editorLang: "kotlin" },
  { name: "R", value: "R", editorLang: "r" },
  { name: "Ruby", value: "RUBY", editorLang: "ruby", color: "#CC342D" },
  { name: "Rust", value: "RUST", editorLang: "rust" },
  { name: "TypeScript", value: "TYPESCRIPT", editorLang: "typescript" },
];

const getMonacoLanguageId = (language: string | undefined) => {
  if (!language) return "plaintext";

  const lang = languages.find((lang) => lang.name === language);
  if (lang) return lang.editorLang;
  return "plaintext";
};

const getHackerRankLanguage = (language: string | undefined) => {
  if (!language) return "C";

  const lang = languages.find((lang) => lang.name === language);
  if (lang) return lang.value;
  return "C";
};

const getLanguageColor = (language: string) => {
  const foundColor = languages.find((obj) => obj.name === language);
  return foundColor ? foundColor.color : "#fff";
};

export { languages, getMonacoLanguageId, getLanguageColor, getHackerRankLanguage };
