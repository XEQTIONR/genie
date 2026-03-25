import axios from 'axios'
import { useRef, useState } from "react"
import { Eye, Heart, PencilRuler } from "lucide-react"
import { cn } from "@/lib/utils"
import { Post, SharedData } from "@/types"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useInitials } from "@/hooks/use-initials"
import { usePage } from "@inertiajs/react"
import { store, destroy } from '@/routes/api/likes'

export default function GridCard({
    className = "", 
    post,
    onClick,
    showAuthor = true
} : {
    className?: string
    post: Post
    onClick?: () => void
    showAuthor?: boolean
})  {

    const { apiToken, auth } = usePage<SharedData>().props

    const [hovered, setHovered] = useState(false)
    const [numLikes, setNumLikes] = useState(post.likes_count ?? post.num_likes ?? 0)
    const [likes, setILike] = useState(post.likes ?? [])
    const [likeClasses, setLikeClasses] = useState('')

    const getInitials = useInitials()

    const variant = post.owner?.username ? 'rounded' : (post.owner?.name ? 'square' : undefined)
    
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
                    "relative aspect-grid overflow-hidden rounded-md border border-sidebar-border/70 dark:border-sidebar-border",
                    className
                )}
            >
                {
                    post.cover_type.split("/")[0] == "video" && (
                        <video ref={video} muted playsInline loop className="min-h-full min-w-full object-cover"
                            onMouseEnter={() => video.current?.play()}
                            onMouseLeave={() => video.current?.pause()}
                        >
                            <source src={post.cover} type={post.cover_type} />
                        </video>
                    )
                }
                {
                    post.cover_type.split("/")[0] == "image" && (
                        // <img className="w-full h-full" src={post.cover} />
                        <div className='size-full bg-gradient-to-t from-neutral-900/15 via-95% to-transparent'>
                        <div 
                            className="size-full bg-cover bg-top"
                            style={{ backgroundImage: `url('${post.cover}')`}}
                            ></div>
                        </div>
                    )
                }
                <div
                    className={
                        cn("w-full h-14 flex gap-2 justify-between items-center px-5 absolute bottom-0 bg-gradient-to-t from-black/90  to-black/5 transition-opacity duration-300",
                        hovered ? "opacity-100" : "opacity-0")
                    }
                >
                    <div className="text-lg font-semibold text-ellipsis text-nowrap grow-0 overflow-hidden text-white">
                        { post.title }
                    </div>
                </div>
            </div>
            {
                showAuthor &&
                <div className="flex items-center gap-2.5">
                    {
                        variant ? (
                            <Avatar className='size-8' variant={variant}>
                                <AvatarImage className='size-8' src={post.owner?.avatar} />
                                <AvatarFallback variant={variant} className="text-xs font-medium">{getInitials(post.owner?.name ?? "")}</AvatarFallback>
                            </Avatar>
                        ) : (
                            <PencilRuler className='size-5' />
                        )
                    }
                    
                    <div className="w-full flex justify-between">
                        <span className="font-semibold text-sm">{post.owner?.name ?? post.owner?.title}</span>
                        <div className="flex gap-5">
                            <div className="flex items-center gap-1.5">
                                <Heart 
                                    strokeWidth={2.5} 
                                    className={cn(
                                        "size-4 cursor-pointer",
                                        (likes.length > 0) ? "fill-pink-600 stroke-pink-600 " : "hover:fill-pink-600 hover:stroke-pink-600",
                                        likeClasses
                                    )} 
                                    onClick={() => {
                                        
                                        if (auth.user) {
                                            if (likes.length === 0) {
                                                axios.post(store().url, {
                                                    likeable_id: post.id,
                                                    likeable_type: 'post'
                                                }, {
                                                    headers: {
                                                        'Content-Type': 'multipart/form-data',
                                                        Authorization: 'Bearer ' + apiToken
                                                    }
                                                }).then(res => {
                                                    setNumLikes(l => l+1)
                                                    setILike(l => {
                                                        if (l) {
                                                            return [...l, res.data]
                                                        }
                                                        return [res.data]
                                                    })
                                                    setLikeClasses("")
                                                    setTimeout(() => {
                                                        setLikeClasses("animate-wave fill-pink-600 stroke-pink-600 ")
                                                    }, 100)
                                                }).catch(e => {
                                                    console.log('like error:', e)
                                                })
                                            } else {
                                                axios.delete(destroy({ like: likes[0].id }).url, {
                                                    headers: {
                                                        'Content-Type': 'multipart/form-data',
                                                        Authorization: 'Bearer ' + apiToken
                                                    }
                                                }).then(() => {
                                                    setNumLikes(l => l - 1)
                                                    setILike([])
                                                    setLikeClasses("")
                                                    setTimeout(() => {
                                                        setLikeClasses("animate-wave")
                                                    }, 100)
                                                }).catch((e) => {
                                                    console.log('unlike error:', e)
                                                })
                                            }
                                        }
                                        
                                    }}
                                />
                                <span className="text-xs font-semibold">{numLikes}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Eye strokeWidth={2.5} className="size-4" />
                                <span className="text-xs font-semibold">{post.views_count}</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
            
        </div>
    )
}