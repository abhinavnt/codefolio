import type * as React from "react"
import { cn } from "@/lib/utils"

interface DotLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
}

export function DotLoading({ text, className, ...props }: DotLoadingProps) {
  return (
    <div 
      className={cn(
        "fixed inset-0 flex flex-col items-center justify-center gap-3",
        className
      )} 
      {...props}
    >
      <div className="flex space-x-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-4 w-4 rounded-full bg-emerald-500 animate-bounce"
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
      {text && <p className="text-base text-muted-foreground">{text}</p>}
    </div>
  )
}
