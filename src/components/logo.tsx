import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Image
        src="/mafalia-logo.png"
        alt="Mafalia"
        width={120}
        height={40}
        className="h-full w-auto object-contain"
        priority
      />
    </div>
  )
}
