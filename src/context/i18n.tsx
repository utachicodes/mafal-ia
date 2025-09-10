"use client"

import React, { createContext, useContext, ReactNode, useMemo } from "react"
import { useLanguage } from "@/src/context/language-context"
import en from "@/src/locales/en.json"
import fr from "@/src/locales/fr.json"

const dicts = { en, fr } as const

type Dict = typeof en

function get(obj: any, path: string): string {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj) ?? path
}

interface I18nContextType {
  t: (key: keyof Dict | string, params?: Record<string, string | number>) => string
  lang: keyof typeof dicts
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage()
  const lang = (language === "fr" ? "fr" : "en") as keyof typeof dicts
  const value = useMemo(() => {
    const t = (key: string, params?: Record<string, string | number>) => {
      const raw = get(dicts[lang], key)
      if (!params) return raw
      return Object.keys(params).reduce((acc, k) => acc.replaceAll(`{{${k}}}`, String(params[k]!)), raw)
    }
    return { t, lang }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}

