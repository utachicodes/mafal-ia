import { cn } from "@/lib/utils"
import Image from "next/image"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-bold text-lg", className)}>
      <div className="relative h-10 w-14">
        <Image
          src="/mafalia-logo-svg.svg"
          alt="Mafalia logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  )
}
