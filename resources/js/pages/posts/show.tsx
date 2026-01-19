import AppLayout from '@/layouts/app-layout'
import { Post, BreadcrumbItem, SharedData } from '@/types'
import { useEffect, useState } from 'react'
import { store as storeView } from '@/routes/api/views'
import { store as storeLike, destroy } from '@/routes/api/likes'
import axios from 'axios'
import { router, usePage } from '@inertiajs/react'
import '/resources/css/projects.css'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useInitials } from '@/hooks/use-initials'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Pencil, Share, Smile, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { edit } from '@/routes/posts'
import { ResizablePanelGroup } from "@/components/ui/resizable"

import { usePanelRef } from "react-resizable-panels"
import CommentItem from '@/components/comment-item'
import CommentForm from '@/components/comment-form'
import { Badge } from '@/components/ui/badge'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Show Post',
        href: '/posts/',
    },
];

function replaceNbsps(str: string) {
  const re = new RegExp(String.fromCharCode(160), "g");
  return str.replace(re, " ");
}

export default function ShowPost({post, owns} : {post: Post, owns: boolean}) {

    const variant = post.owner?.username ? 'rounded' : (post.owner?.name ? 'square' : undefined)
    const getInitials = useInitials()

    const [numLikes, setNumLikes] = useState(post.likes_count ?? 0)
    const [likes, setLikes] = useState(post.likes ?? [])
    const [likeClasses, setLikeClasses] = useState("")
    const [likeButtonDisabled, setLikeButtonDisabled] = useState(false)
    const [o, setO] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [comments, setComments] = useState(post?.comments ?? [])
    
    const { apiToken, auth } = usePage<SharedData>().props

    const pref = usePanelRef()

    const like = () => {
        if (auth.user) {
            if (numLikes === 0) {
                setLikeButtonDisabled(true)
                axios.post(storeLike().url, {
                    likeable_id: post.id,
                    likeable_type: 'post'
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: 'Bearer ' + apiToken
                    }
                }).then(res => {
                    setLikeButtonDisabled(false)
                    setNumLikes(l => l+1)
                    setLikes(l => {
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
                    setLikeButtonDisabled(false)
                    console.log('like error:', e)
                })
            } else {
                setLikeButtonDisabled(true)
                axios.delete(destroy({ like: likes[0].id }).url, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: 'Bearer ' + apiToken
                    }
                }).then(() => {
                    setLikeButtonDisabled(false)
                    setNumLikes(l => l - 1)
                    setLikes([])
                    setLikeClasses("")
                    setTimeout(() => {
                        setLikeClasses("animate-wave")
                    }, 100)
                }).catch((e) => {
                    setLikeButtonDisabled(false)
                    console.log('unlike error:', e)
                })
            }
        }
        
    }

    useEffect(() => {
        axios.post(storeView().url, {
            viewable_type: 'post',
            viewable_id: post.id
        }, {
            headers: {
                Authorization: 'Bearer ' + apiToken
            }
        })
            .then(res => console.log('storeView response:', res))
            .catch(e => console.log('error:', e))
    }, [])
    return (
    <AppLayout customMargin='-mb-20' maxWidth='w-screen' breadcrumbs={breadcrumbs}>
        <ResizablePanelGroup>
            <div className='w-full h-screen overflow-y-scroll px-5'>
                <div className="size-10 sticky top-1/2 left-full -translate-x-2 z-100 flex flex-col gap-1">
                {
                    !o && (
                        <div className='relative hidden lg:flex flex-col gap-2'>
                            <Button className="rounded-full" variant="outline" onClick={() => setO(!o)} size="icon">
                                <MessageCircle />
                            </Button>
                            {
                                (post.comments_count && post.comments_count > 0) ? (
                                    <Badge variant="destructive" className='absolute -right-1.5 -top-1 px-1 rounded-full font-semibold cursor-pointer min-w-5.5'>{post.comments_count}</Badge>
                                ) : null
                            }
                            <Button onClick={async () => {
                                console.log('share')
                                await navigator.share({
                                    title: "MDN",
                                    text: post.title,
                                    url: "https://developer.mozilla.org",
                                })
                            }} type="button" className="rounded-full" variant="outline" size="icon"><Share /></Button>
                        </div>
                    )
                }
                {
                    !drawerOpen && (
                        <div className='flex flex-col gap-2 relative lg:hidden'>
                            <Button className="rounded-full" variant="outline" onClick={() => {
                                console.log('setDraweropen:', !drawerOpen)
                                setDrawerOpen(!drawerOpen)
                            }} size="icon">
                                <MessageCircle />
                            </Button>
                            {
                                (post.comments_count && post.comments_count > 0) ? (
                                    <Badge variant="destructive" className='absolute -right-1.5 -top-1 px-1 rounded-full font-semibold cursor-pointer min-w-5.5'>{post.comments_count}</Badge>
                                ) : null
                            }
                            <Button onClick={async() => {
                                await navigator.share({
                                    title: "MDN",
                                    text: post.title,
                                    url: "https://developer.mozilla.org",
                                })
                            }} className="rounded-full" variant="outline" size="icon"><Share /></Button>
                        </div>
                    )
                }
                    
                    
                </div>
                <div className="w-full flex flex-col mx-auto max-w-5xl gap-6">
                    <div className={cn("flex gap-5 items-center mt-16")}>
                        <h1 className='text-2xl font-semibold'>{post.title}</h1>
                        {
                            owns && (
                                <Button 
                                    onClick={() => router.visit(edit(post))}
                                    className="rounded-full cursor-pointer"
                                    variant="outline"
                                    size="icon-lg"
                                >
                                    <Pencil />
                                </Button>
                            )
                        }
                        
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2.5 items-center">
                            <Avatar className='size-12'>
                                <AvatarImage src={post.owner?.avatar ?? ''} />
                                <AvatarFallback>{getInitials(post.owner?.name ?? post.owner?.title ?? "")}</AvatarFallback>
                            </Avatar>
                            <div>
                                <span className="font-semibold tracking-wide text-sm">{post.owner?.name ?? post.owner?.title}</span>

                                <Button className='text-xs' variant="link">Follow</Button>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Button disabled={likeButtonDisabled} className="rounded-full cursor-pointer" variant="outline" size="icon-lg"
                                onClick={() => like()}
                            >
                                <Heart 
                                    strokeWidth={2.5} 
                                    className={cn(
                                        "size-4 cursor-cell",
                                        ((numLikes ?? 0 > 0) ? "fill-pink-600 stroke-pink-600 guile" : "hover:fill-pink-600 hover:stroke-pink-600"),
                                        likeClasses
                                    )} 
                                        
                                />
                            </Button>
                            <Button className="rounded-full py-5 px-5 font-semibold cursor-pointer">Send Inquiry</Button>
                        </div>
                    </div>
                    <Separator />
                    
                    {
                        post.cover_type.split('/')[0] == 'video' &&
                        <video className="rounded-lg" autoPlay loop controls preload="true">
                            <source src={post.cover} type={post.cover_type} />
                        </video>
                    }
                    {
                        post.cover_type.split('/')[0] == 'image' &&
                        <img src={post.cover} className="w-full object-contain rounded-lg" />
                    }
                    {
                        post.body.map((block) => {

                            if (block.type == "text") {
                                return <div className="max-w-full wrap-anywhere description" dangerouslySetInnerHTML={{__html: replaceNbsps(block.html)}}>
                                    
                                    </div>
                            }

                            if (block.type == "image") {
                                return <img src={block.url} className="w-full" />
                            }

                            if (block.type == "video") {
                                return <video autoPlay loop controls preload="true">
                                    <source src={block.url} type={block.mime} />
                                </video>
                            }
                        })
                    }
                    <div className="flex flex-col w-full gap-5 mt-30">
                        <div className='w-full flex items-center gap-5'>
                            <div className='w-full'>
                                <Separator />
                            </div>
                            <Avatar className='size-15'>
                                <AvatarImage src={post.owner?.avatar ?? ''} />
                                <AvatarFallback>{getInitials(post.owner?.name ?? post.owner?.title ?? "")}</AvatarFallback>
                            </Avatar>
                            <div className='w-full'>
                                <Separator />
                            </div>
                        </div>
                        <h2 className="text-center text-xl font-semibold tracking-wide">{post.owner?.name ?? post.owner?.title}</h2>
                        <div className='w-full flex justify-center'>
                            <Button className="rounded-full py-5 px-5 mb-10 font-semibold">Send Inquiry</Button>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className={ cn(
                "transition-all duration-300 overflow-clip mt-16",
                o ? "w-0 lg:w-md" : "w-0"
            )}>
                <div className="w-md h-full">
                    <div className='w-full h-full flex'>
                        <div className="h-full w-5 border-r flex flex-col items-center">
                        </div>
                        <Button onClick={() => setO(!o)} variant="secondary" size="icon-sm" className="sticky top-28 -translate-x-4 -mr-2 scrollbar-hide rounded-full">
                            <X />
                        </Button>
                        <div className="w-full flex flex-col gap-3 h-[90vh] overflow-y-scroll overflow-x-hidden pr-12 top-0">
                            <div className='flex gap-3 pb-2 w-full justify-between items-center sticky top-4 pt-7 bg-background z-40'>
                                <h1 className='text-xl font-bold'>Comments</h1>
                                <div className='flex gap-3'>
                                <Button
                                    onClick={() => like()}
                                    className="cursor-pointer rounded-full"
                                    variant="outline" 
                                    size="icon"
                                >
                                    <Heart className={cn(
                                        (numLikes ?? 0 > 0) ? "fill-pink-600 stroke-pink-600 " : "hover:fill-pink-600 hover:stroke-pink-600",
                                        likeClasses
                                    )} />
                                </Button>
                                <Button className="rounded-full" variant="outline" size="icon"><Share /></Button>
                                </div>
                            </div>
                            
                            
                            {
                                comments.length > 0
                                    ? comments.map(comment => <CommentItem className='relative -left-4 -mr-4' comment={comment} />)
                                    : "No comments"
                            }
                            {
                                auth.user && <CommentForm 
                                    className='sticky bottom-0 -mr-8 bg-background pl-0' 
                                    commentableId={post.id}
                                    commentableType='post'
                                    user={auth.user}
                                    onSuccess={(newComment) => setComments(c => [newComment, ...c,])}
                                    onError={(e) => console.log('error:', e)}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </ResizablePanelGroup>
        <Drawer open={drawerOpen} onOpenChange={(open) => { setDrawerOpen(open) }}>
            <DrawerContent className='lg:hidden'>
                <ScrollArea className='mt-5 w-full max-w-lg flex flex-col mx-auto px-4 h-full overflow-y-scroll'>
                    <div className='w-full sticky top-0 bg-background z-50'>
                        <h1 className='text-xl font-bold pb-2'>Comments</h1>
                    </div>
                    
                    { comments.map(comment => <CommentItem className='relative -left-4' comment={comment} />) }
                    {
                        auth.user && <CommentForm 
                            className='pl-0 pr-0.5 sticky bottom-0 bg-background' 
                            commentableId={post.id}
                            commentableType='post'
                            user={auth.user}
                            onSuccess={(newComment) => setComments(c => [newComment, ...c,])}
                            onError={(e) => console.log('error:', e)}
                        />
                    }
                </ScrollArea>
            </DrawerContent>
        </Drawer>
        
    </AppLayout>)
}