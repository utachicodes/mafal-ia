import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-bold text-lg", className)}>
      <svg viewBox="0 0 100 20" className="w-28 h-6" fill="currentColor" aria-label="Mafal-IA logo" role="img">
        <path d="M12.6,3.2c-2.4-4.3-8.3-4.3-10.7,0L0,6.2l2.3,4.1l1.9-3.4c1.1-2,3.9-2,5,0l4.2,7.4l2.3-4.1L12.6,3.2z"/>
        <path d="M29.5,3.2c-2.4-4.3-8.3-4.3-10.7,0l-1.9,3.1l2.3,4.1l1.9-3.4c1.1-2,3.9-2,5,0l4.2,7.4l2.3-4.1L29.5,3.2z"/>
        <text x="36" y="15" fontSize="14" fontWeight="bold" fill="currentColor">Mafal-IA</text>
      </svg>
    </div>
  )
}
