import { Like, Project, SharedData } from "@/types"
import { Link, router, usePage } from "@inertiajs/react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useInitials } from '@/hooks/use-initials'
import { show } from '@/routes/projects'
import { show as showUser } from '@/routes/users'
import { show as showTeam } from '@/routes/teams'
import { Bookmark, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRef, useState } from "react"
import axios from 'axios'
import { store, destroy } from '@/routes/api/likes'

export default function ProjectGridCard({project} : {project: Project}) {
    const getInitials = useInitials()
    const [numLikes, setNumLikes] = useState(project.likes_count ?? 0)
    const [likes, setILike] = useState<Like[]>(project.likes ?? [])
    const [likeClasses, setLikeClasses] = useState('')
    const [hovering, setHovering] = useState(false)
    const { apiToken, auth } = usePage<SharedData>().props

    const video = useRef<HTMLVideoElement>(null)

    return (
        <div className="flex gap-6 border rounded-xl">
            <div 
                className="w-full h-full flex flex-col justify-start overflow-clip"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
            >
                <Link href={show({project: project.slug})} className="w-full aspect-grid">
                    {
                        project.cover_media[0].mime.split("/")[0] == 'video'
                        ? (
                            <video
                                ref={video} 
                                className="aspect-grid object-cover rounded-t-xl border-b"
                                onMouseEnter={() => video.current?.play()}
                                onMouseLeave={() => video.current?.pause()}
                                muted playsInline loop 
                            >
                                <source className="" src={project.cover_media[0].url} type={project.cover_media[0].mime} />
                            </video>
                        ) : (
                            <img className="w-full aspect-grid object-cover rounded-t-xl border-b" src={project.cover_media[0].url} />
                        )
                    }
                </Link>
                <div onClick={() => router.visit(show({project: project.slug}))} className="w-full flex justify-between py-4 px-4 cursor-pointer">
                    <div className="flex flex-col gap-2 min-w-0 flex-auto">
                        <div className="flex gap-1 justify-between items-start">
                            
                            <span className={cn(
                                "w-full line-clamp-2 font-bold text-lg/5.5 overflow-clip overflow-ellipsis",
                                hovering && "opacity-50"
                            )}>{project.title}</span>

                            <div className="flex items-center gap-3">
                                <div className='flex gap-1 items-center'>
                                    <Bookmark
                                        onMouseEnter={() => setHovering(false)}
                                        onMouseLeave={() => setHovering(true)}
                                        strokeWidth={2.5} 
                                        className={cn(
                                            "size-4 cursor-pointer",
                                            (likes.length > 0) ? "fill-yellow-400 stroke-yellow-400 " : "hover:fill-yellow-400 hover:stroke-yellow-400",
                                            likeClasses
                                        )}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (auth.user) {
                                                if (likes.length === 0) {
                                                    axios.post(store().url, {
                                                        likeable_id: project.id,
                                                        likeable_type: 'project'
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
                                                            setLikeClasses("animate-wave fill-yellow-400 stroke-yellow-400 ")
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
                                    <span className="font-semibold text-sm min-w-4">{numLikes}</span>
                                </div>
                                <div className='flex gap-1 items-center'><Eye className="size-4" strokeWidth={2.5} /> <span className="font-bold text-sm">{project.views_count}</span></div>
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <Link
                                onMouseEnter={() => setHovering(false)}
                                onMouseLeave={() => setHovering(true)}
                                onClick={(e) => e.stopPropagation()} 
                                className='flex items-center gap-2'
                                href={project.owner_type == 'App\\Models\\Team' ? showTeam({ slug: project.owner?.slug }).url : showUser({username: project.owner?.username}).url}
                            >
                                <Avatar variant={project.owner_type == 'App\\Models\\Team' ? "square" : "rounded"} className="size-5 text-xs">
                                    <AvatarImage src={project.owner?.avatar} />
                                    <AvatarFallback className="text-xxs" variant={project.owner_type == 'App\\Models\\Team' ? "square" : "rounded"}>{getInitials(project.owner?.name ?? "")}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{project.owner?.name}</span>
                            </Link>
                            
                        </div>
                    </div>
                </div>
                {
                    project.excerpt && (
                        <Link href={show({project: project.slug})}>
                            <p className="pb-4 px-4 text-dim text-sm">{project.excerpt}</p>
                        </Link>
                    )
                }
            </div>
        </div>
    )
}