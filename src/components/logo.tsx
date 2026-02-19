import { cn } from "@/lib/utils"
import Image from "next/image"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 font-bold", className)}>
      <div className="relative h-10 w-14 group-hover:scale-110 transition-transform duration-500">
        <Image
          src="/mafalia-logo-svg.svg"
          alt="Mafalia logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <span className="text-xl font-black text-gradient tracking-tighter">MAFAL.IA</span>
    </div>
  )
}
