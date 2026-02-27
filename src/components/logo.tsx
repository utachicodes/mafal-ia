import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  /** Renders the logo in white — use when placed on colored/dark backgrounds */
  white?: boolean
}

export function Logo({ className, white }: LogoProps) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Image
        src="/mafalia-logo.png"
        alt="Mafalia"
        width={120}
        height={40}
        className={cn("h-full w-auto object-contain", white && "brightness-0 invert")}
        priority
      />
    </div>
  )
}
