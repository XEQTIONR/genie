import { cn } from "@/lib/utils"
import { ReactNode } from 'react'

export function Chip({ variant="theme", textSize="text-sm", children,  } : { variant?: "theme"|"default"|"theme-simple", textSize?: "text-sm"|"text-xs", children: ReactNode }) {
    
    let cN = cn(
        textSize,
        "text-theme-800 bg-theme-200/50 border-theme-800",
        "dark:text-theme-200 dark:bg-theme-200/15 dark:border-theme-200",
    )

    if (variant == "theme-simple") {
        cN = cn(
            textSize,
            "text-theme-800 border-theme-800",
            "dark:text-theme-200/80 dark:border-theme-200/80",
        )
    }
    

    if (variant == "default") {
        cN = cn(
            textSize,
            "text-neutral-800 bg-neutral-200/50 border-neutral-800",
            "dark:text-neutral-200 dark:bg-neutral-200/15 dark:border-neutral-200",
        )
    }

    if (textSize == "text-sm") {
        cN = cn(
            cN,
            "py-1 px-3"
        )
    } else {
        cN = cn(
            cN,
            "py-0.5 px-2"
        )
    }

    cN = cn(
        cN,
        "font-mono font-medium",
        "whitespace-nowrap uppercase border"
    )
    
    return <span className={cN}>{children}</span>
}