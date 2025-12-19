import { Like, Project, SharedData } from "@/types"
import { Link, usePage } from "@inertiajs/react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useInitials } from '@/hooks/use-initials'
import { show } from '@/routes/projects'
import { show as showUser } from '@/routes/users'
import { show as showTeam } from '@/routes/teams'
import { Bookmark, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import axios from 'axios'
import { store, destroy } from '@/routes/api/likes'

export default function ProjectGridCard({project} : {project: Project}) {
    const getInitials = useInitials()
    const [numLikes, setNumLikes] = useState(project.likes_count ?? 0)
    const [likes, setILike] = useState<Like[]>(project.likes ?? [])
    const [likeClasses, setLikeClasses] = useState('')

    const { apiToken, auth } = usePage<SharedData>().props

    return (
        <div className="flex gap-6">
            <div className="w-full h-full border flex flex-col justify-start overflow-clip  rounded-xl dark:shadow-neutral-900 hover:shadow-lg duration-300">
                <Link href={show({project: project.slug})} className="w-full aspect-grid">
                    {
                        project.cover_media[0].mime.split("/")[0] == 'video'
                        ? (
                            <video className="aspect-grid object-cover">
                                <source className="" src={project.cover_media[0].url} type={project.cover_media[0].mime} />
                            </video>
                        ) : (
                            <img className="w-full aspect-grid object-cover" src={project.cover_media[0].url} />
                        )
                    }
                </Link>
                <div className="w-full flex justify-between px-4 py-4 border-t">
                        <div className="flex flex-col gap-1 min-w-0 flex-auto">
                            <span className="w-full line-clamp-2 font-bold text-xl overflow-clip overflow-ellipsis">{project.title}</span>
                            <div className='flex justify-between'>
                                <Link 
                                    className='flex items-center gap-2'
                                    href={project.owner_type == 'App\\Models\\Team' ? showTeam({ slug: project.owner?.slug }).url : showUser({username: project.owner?.username}).url}
                                >
                                    <Avatar variant={project.owner_type == 'App\\Models\\Team' ? "square" : "rounded"} className="size-8 text-xs">
                                        <AvatarImage src={project.owner?.avatar} />
                                        <AvatarFallback variant="square">{getInitials(project.owner?.name ?? "")}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs font-medium">{project.owner?.name}</span>
                                </Link>
                                <div className="flex items-center gap-4">
                                    {/* <div className="flex items-center gap-1">
                                        <Users strokeWidth={2.5} size={16} />
                                        <span className="text-sm font-semibold">35</span>
                                    </div> */}
                                    {/* <Button onClick={(e) => e.stopPropagation()} className="rounded-full cursor-pointer" variant="outline" size="icon-sm"><Bookmark /></Button> */}
                                    <div className='flex gap-1 items-center'>
                                        <Bookmark
                                            strokeWidth={2.5} 
                                            className={cn(
                                                "size-4 cursor-pointer",
                                                (likes.length > 0) ? "fill-yellow-400 stroke-yellow-400 " : "hover:fill-yellow-400 hover:stroke-yellow-400",
                                                likeClasses
                                            )}
                                            onClick={() => {
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
                                    {/* <Button size="icon-sm" variant="outline" className="rounded-full"><Bookmark /></Button> */}
                                    {/* <Button size="icon-sm" variant="outline" className="rounded-full"><Heart /></Button> */}
                                </div>
                            </div>
                            
                        </div>
                </div>
                <Link href={show({project: project.slug})}>
                    <p className="px-4 pb-4 text-dim text-sm">{project.excerpt}</p>
                </Link>
            </div>
        </div>
    )
}