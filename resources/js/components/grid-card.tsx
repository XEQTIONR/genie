import { useState } from "react";
import { PlaceholderPattern } from "./ui/placeholder-pattern";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
export default function GridCard()  {

    const [hovered, setHovered] = useState(false)
    
    return (
        <div
            onMouseLeave={() => setHovered(false)} 
            onMouseEnter={() => setHovered(true)} 
            className="relative aspect-grid overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border"
        >
            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            <div className={
                cn("w-full h-1/4 flex gap-2 justify-between items-center px-5 absolute bottom-0 bg-neutral-900/30 transition-opacity duration-300",
                hovered ? "opacity-100" : "opacity-0")
            }>
                <div className="text-lg font-semibold text-ellipsis text-nowrap grow-0 overflow-hidden text-white">
                    Something that keeps on going on and on and on and on
                </div>
                <div className="flex shrink-0 justify-end">
                    <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-full cursor-pointer">
                        <Heart size={20} className="stroke-neutral-600 dark:stroke-neutral-50" />
                    </div>
                </div>
            </div>
        </div>
    )
}