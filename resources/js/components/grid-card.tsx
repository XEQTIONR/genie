import { useRef, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Post } from "@/types";
export default function GridCard({
    className = "", 
    post,
    onClick,
} : {
    className?: string, 
    post: Post,
    onClick?: () => void
})  {

    const [hovered, setHovered] = useState(false)
    
    const video = useRef<HTMLVideoElement>(null)
    return (
        <div
            onClick={() => {
                if (onClick) {
                    onClick()
                }
            }}
            onMouseLeave={() => setHovered(false)} 
            onMouseEnter={() => setHovered(true)} 
            className={cn(
                "relative aspect-grid overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border",
                className
            )}
        >
            {
                post.cover_type.split("/")[0] == "video" && (
                    <video ref={video} muted playsInline loop className="w-full"
                        onMouseEnter={(e) => {
                            console.log('enter')
                            video.current?.play()
                        }}
                        onMouseLeave={(e) => video.current?.pause()}
                    >
                        <source src={post.cover} type={post.cover_type} />
                    </video>
                )
            }
            {
                post.cover_type.split("/")[0] == "image" && (
                    <img className="w-full" src={post.cover} />
                )
            }
            <div
                onClick={(e) => e.stopPropagation()} 
                className={
                    cn("w-full h-1/4 flex gap-2 justify-between items-center px-5 absolute bottom-0 bg-neutral-900/30 transition-opacity duration-300",
                    hovered ? "opacity-100" : "opacity-0")
                }
            >
                <div className="text-lg font-semibold text-ellipsis text-nowrap grow-0 overflow-hidden text-white">
                    { post.title }
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