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
import { Chip } from "@/components/ui/chip"
import { Separator } from "./ui/separator"
import { AddUser, Group } from "./icons/svgs"
import { Button } from "@/components/ui/button"

export default function ProjectGridCard({project} : {project: Project}) {
    const getInitials = useInitials()
    const [numLikes, setNumLikes] = useState(project.likes_count ?? 0)
    const [likes, setILike] = useState<Like[]>(project.likes ?? [])
    const [likeClasses, setLikeClasses] = useState('')
    const [hovering, setHovering] = useState(false)
    const { apiToken, auth } = usePage<SharedData>().props

    const video = useRef<HTMLVideoElement>(null)

    return (
        <div className={cn(
            "flex gap-6 border dark:border-neutral-900 cursor-pointer",
            hovering && "border-theme-300 dark:border-theme-500"
        )}>
            <div 
                className="w-full h-full flex flex-col justify-start overflow-clip"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
            >
                <Link href={show({project: project.slug})} className="w-full aspect-grid z-40">
                    {
                        project.cover_media[0].mime.split("/")[0] == 'video'
                        ? (
                            <video
                                ref={video} 
                                className="aspect-grid object-cover"
                                onMouseEnter={() => video.current?.play()}
                                onMouseLeave={() => video.current?.pause()}
                                muted playsInline loop 
                            >
                                <source className="" src={project.cover_media[0].url} type={project.cover_media[0].mime} />
                            </video>
                        ) : (
                            <img className="w-full aspect-grid object-cover" src={project.cover_media[0].url} />
                        )
                    }
                </Link>
                <div className="w-full h-40 bg-gradient-to-t from-white via-white dark:from-theme-950 dark:via-theme-950 from-0% via-70%  relative -top-20 -mb-20 z-50">
                </div>
                <div 
                    onClick={() => router.visit(show({project: project.slug}))} 
                    className="w-full flex justify-between pb-4 px-4 cursor-pointer z-50 relative dark:bg-theme-950 -top-25 -mb-25"
                >
                    <div className="flex flex-col gap-2 min-w-0 flex-auto relative ">
                        <div className="flex gap-1 justify-between items-center">
                            <span className={cn(
                                "w-full line-clamp-2 font-bold text-2xl tracking-wide overflow-clip overflow-ellipsis",
                                hovering && "dark:text-theme-200 text-theme-300"
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
                        {/* <div className='flex justify-between'>
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
                            
                        </div> */}
                    </div>
                </div>
                <div className="w-full dark:bg-theme-950 z-50">
                {
                    project.excerpt && (
                        <Link className="z-50" href={show({project: project.slug})}>
                            <p className="pb-4 px-4 text-sm text-dim">{project.excerpt}</p>
                        </Link>
                    )
                }
                </div>
                <div className="flex gap-1 dark:bg-theme-950 px-4 z-50">
                    {project.platforms.map(p => <Chip variant="default" textSize="text-xs">{p}</Chip>)}
                </div>
                <div className="flex flex-col dark:bg-theme-950 pt-6 pb-4 px-4">
                    <Separator />
                </div>
                <div className="px-4 pb-4 dark:bg-theme-950 flex w-full justify-between items-center">
                    {
                        Date.now()%2 == 0
                        ? (
                            <div className="flex gap-2.5 items-center">
                                <Group className="text-xl fill-theme-200" />
                                <span className="text-sm text-dim">4 / 6 members</span>
                            </div>
                        ) : (
                            <div className="flex gap-2 items-center">
                                <AddUser className="text-xl fill-red-400" />
                                <span className="text-xs text-red-400 font-semibold">HIRING: AI Engineer</span>
                            </div>
                        )
                    }
                    
                    <Link className="uppercase tracking-widest text-xs font-bold text-theme-100">Join Team</Link>
                </div>
            </div>
        </div>
    )
}