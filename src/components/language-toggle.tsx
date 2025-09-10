"use client"

import { useLanguage } from "@/src/context/language-context"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const setLang = (lang: "en" | "fr") => {
    setLanguage(lang)
    try {
      document.cookie = `lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`
    } catch {}
  }

  return (
    <div className="inline-flex items-center gap-2 text-sm">
      <button
        onClick={() => setLang("en")}
        className={`px-2 py-1 rounded ${language === "en" ? "bg-primary text-white" : "bg-muted text-foreground"}`}
        aria-pressed={language === "en"}
      >
        EN
      </button>
      <button
        onClick={() => setLang("fr")}
        className={`px-2 py-1 rounded ${language === "fr" ? "bg-primary text-white" : "bg-muted text-foreground"}`}
        aria-pressed={language === "fr"}
      >
        FR
      </button>
    </div>
  )
}

