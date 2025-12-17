import { useRef, useState } from "react";
import { Eye, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Post } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useInitials } from "@/hooks/use-initials";
export default function GridCard({
    className = "", 
    post,
    onClick,
    showAuthor = true
} : {
    className?: string, 
    post: Post,
    onClick?: () => void
    showAuthor?: boolean
})  {

    const [hovered, setHovered] = useState(false)

    const getInitials = useInitials()
    
    const video = useRef<HTMLVideoElement>(null)
    return (
        <div className="flex flex-col gap-3">
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
                        <video ref={video} muted playsInline loop className="min-h-full min-w-full object-cover"
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
            {
                showAuthor &&
                <div className="flex items-center gap-1.5">
                    <Avatar>
                        <AvatarImage src={post.owner?.avatar} />
                        <AvatarFallback className="text-xs">{getInitials(post.owner?.name ?? "")}</AvatarFallback>
                    </Avatar>
                    <div className="w-full flex justify-between">
                        <span className="font-semibold text-sm">{post.owner?.name}</span>
                        <div className="flex gap-5">
                            <div className="flex items-center gap-1">
                                <Heart strokeWidth={2.5} className="size-4" />
                                <span className="text-sm font-semibold">45</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Eye strokeWidth={2.5} className="size-4 " />
                                <span className="text-sm font-semibold">500</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
            
        </div>
    )
}