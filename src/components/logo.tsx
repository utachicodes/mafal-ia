import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-bold text-lg", className)}>
      <picture>
        {/* If you add public/mafalia-logo-svg-dark.svg it will be used in dark mode */}
        <source srcSet="/mafalia-logo-svg-dark.svg" media="(prefers-color-scheme: dark)" />
        <img src="/mafalia-logo-svg.svg" alt="Mafal-IA logo" className="h-10 w-auto" />
      </picture>
    </div>
  )
}
