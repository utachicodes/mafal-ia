"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/src/lib/i18n";

const languages = [
    { code: 'en' as const, name: 'English', native: 'English' },
    { code: 'fr' as const, name: 'French', native: 'Français' },
    { code: 'ar' as const, name: 'Arabic', native: 'العربية' },
];

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    const currentLang = languages.find(l => l.code === language) || languages[1];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="hidden md:inline">{currentLang.native}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={language === lang.code ? "bg-muted" : ""}
                    >
                        <span className="font-medium">{lang.native}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
