import AppLayout from "@/layouts/app-layout";
import { Activity, BreadcrumbItem, Like, Project, SharedData } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Bookmark, BriefcaseBusiness, ChartNoAxesColumnIncreasing, Lightbulb, Menu, MessageCircle, Pencil, PencilRuler, Share2, Sparkles, UserPlus, X } from "lucide-react";
import { Facebook,Twitch,Twitter, Youtube } from "@/components/icons/svgs";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import Autoplay from "embla-carousel-autoplay"
import Fade from 'embla-carousel-fade'
import '/resources/css/projects.css'
import ThreeColLayout from "./components/three-col-layout"
import { Separator } from "@/components/ui/separator"
import { TEAMMODEL } from "@/types/values"
import axios from 'axios'
import { usePage } from '@inertiajs/react'
import { store, destroy } from '@/routes/api/likes'
import { Badge } from "@/components/ui/badge"
import { Toggle } from "@/components/ui/toggle"
import { edit, show } from "@/routes/projects"
import { index as postsIndex } from "@/routes/projects/posts"
import { show as showPost } from "@/routes/posts"
import { index as activitiesIndex } from "@/routes/projects/activites"
import { store as storeView } from '@/routes/api/views'
import GridCard from "@/components/grid-card"
import NoPosts from "@/components/no-posts"
import Step from "@/components/step";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { usePanelRef } from "react-resizable-panels";
import CommentForm from "@/components/comment-form";
import CommentItem from "@/components/comment-item";

export default function ShowProject({ project, h, owns, tab = 'kontent', activities } : { 
    project: Project 
    h: { 
        hash: string 
        tag: string 
        text: string
    }[]
    owns: boolean
    tab?: string
    activities?: {
        data: Activity[]
    }
}) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Show Project',
            href: '/'
        },
    ]

    const [currentTab, setCurrentTab] = useState(tab)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const sectionNav = useRef(null)

    const [numLikes, setNumLikes] = useState(project.likes_count ?? 0)
    const [likes, setILike] = useState<Like[]>(project.likes ?? [])
    const [likeClasses, setLikeClasses] = useState('')

    const { apiToken, auth } = usePage<SharedData>().props

    const pref = usePanelRef();
    const [comments, setComments] = useState(project?.comments ?? [])

    useEffect(() => {
        axios.post(storeView().url, {
            viewable_type: 'project',
            viewable_id: project.id
        }, {
            headers: {
                Authorization: 'Bearer ' + apiToken
            }
        })
            .then(res => console.log('storeView response:', res))
            .catch(e => console.log('error:', e))
    }, [])
    
    useEffect(() => {
        document.documentElement.style.scrollBehavior = "smooth"
        return () => { document.documentElement.style.scrollBehavior = "auto" }
    }, [])

    const PlatformBadge = ({platform} : {platform: string}) => {

        const label = (platform: string) => {
            switch(platform) {
                case "android":
                    return "Android"
                case "ios":
                    return "iOS"
                case "mac":
                    return "Mac"
                case "pc":
                    return "PC"
                case "ps":
                    return "PlayStation"
                case "switch":
                    return "Switch"
                case "xbox":
                default:
                    return "XBox"
            }
        }

        const badgeClassNames = (platform: string) => {
            switch(platform) {
                case "android":
                    return "border-green-500  text-green-500"
                case "ios":
                    return "border-foreground dark:border-neutral-100  dark:text-neutral-100"
                case "mac":
                    return "border-foreground dark:border-neutral-100 dark:text-neutral-100"
                case "pc":
                    return "border-sky-500 text-sky-500"
                case "ps":
                    return "border-blue-700 text-blue-700"
                case "switch":
                    return "border-red-600 text-red-600"
                case "xbox":
                default:
                    return "border-green-700 text-green-700"
            }
        }

        return <Badge className={cn(badgeClassNames(platform), 'font-semibold rounded-full')} variant="outline">{
            label(platform)
            }
        </Badge>
    }

    const [o, setO] = useState(false)
    
    return (
        <AppLayout maxBodyWidth="w-full" breadcrumbs={breadcrumbs}>
            <Head title="Show Project" />
            {
                !o && (
                    <div className="size-10 sticky top-1/2 left-full -translate-x-2 z-100 flex flex-col gap-1 -mt-10">
                        <Button variant="outline" onClick={() => setO(!o)} size="icon"><MessageCircle /></Button>
                    </div>
                )
            }
            <ResizablePanelGroup>
                <div className="w-full">
                    <div className="w-full md:min-h-[50vh] bg-secondary dark:bg-neutral-900">
                        <div className="flex items-center gap-4 justify-center pt-5 md:pt-10">
                            <span className={cn(
                                "text-center text-2xl font-semibold",
                                "ml-10"
                            )}>{project.title}</span>
                            {
                                owns &&
                                (
                                    <Button 
                                        onClick={() => router.visit(edit(project))} 
                                        className="rounded-full cursor-pointer" 
                                        variant="outline" 
                                        size="icon-lg"
                                    >
                                        <Pencil />
                                    </Button>
                                )
                            }
                        </div>
                        <h2 className="w-full md:w-1/3 text-center mx-auto mt-1 mb-3">{project.excerpt}</h2>
                        <div className="flex flex-col md:gap-7 md:flex-row mx-auto w-full md:max-w-7xl items-stretch">
                            <Carousel 
                                className="block w-full px-2 md:px-0 md:w-2/3 md:my-5"
                                opts={{ loop: true,
                                    duration: 60
                                    }}
                                plugins={[
                                    Autoplay({ delay: 8000 }),
                                    Fade()
                                ]}
                            >
                                <CarouselContent>
                                    {
                                        project.cover_media.map(({url, mime}) => {
                                            return <CarouselItem>
                                                {
                                                    mime.split("/")[0] == 'video'
                                                        ? (
                                                            <video controls className="aspect-grid object-cover rounded-lg">
                                                                <source className="" src={url} type={mime} />
                                                            </video>
                                                        ) : (
                                                            <img className="w-full aspect-grid object-cover rounded-lg" src={url} />
                                                        )
                                                }
                                                
                                            </CarouselItem>
                                        })
                                    }
                                </CarouselContent>
                                <CarouselPrevious className="hidden md:flex z-60" />
                                <CarouselNext className="hidden md:flex z-60" />
                            </Carousel>
                            <div className="md:w-1/3 my-5 mb-18 p-5 hidden md:flex flex-col bg-background rounded justify-between">
                                <div>
                                    <div className="flex justify-between items-center mt-3">
                                        <h1 className="text-2xl font-semibold">{project.title}</h1>
                                        <Button className="cursor-pointer" variant="outline" size="icon">
                                            <Share2 />
                                        </Button>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <h2 className="mb-3">{project.excerpt}</h2>
                                    </div>
                                    <div className="flex gap-3 items-center mt-1">
                                        <Facebook className="size-4.5" />
                                        <Twitter className="size-4.5" />
                                        <Youtube className="size-4.5" />
                                        <Twitch className="size-4.5" />
                                        {/* <Mail />
                                        <CodeXml /> */}
                                    </div>
                                    
                                    
                                    <Separator className="my-3" />
                                    <div className="flex flex-col gap-7">
                                        <div className="flex flex-col gap-1">
                                            <span className="uppercase text-xs">Created By</span>
                                            <div className="flex items-center gap-2">
                                                <Avatar variant={project.owner_type === TEAMMODEL ? "square" : "rounded"} className="size-7">
                                                    <AvatarImage src={project.owner?.avatar} />
                                                    <AvatarFallback className="text-xs" variant={project.owner_type === TEAMMODEL ? "square" : "rounded"}>{project.owner?.name.split(' ').map(word => word.charAt(0)).join("")}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{project.owner?.name}</span>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="flex flex-col gap-1 w-2/5">
                                                <span className="uppercase text-xs">Age</span>
                                                <div className="flex items-center gap-2">
                                                    10+
                                                    {/* <ul>
                                                        <li>PlayStation</li>
                                                        <li>Xbox</li>
                                                        <li>PC</li>
                                                    </ul> */}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1 w-3/5">
                                                <span className="uppercase text-xs">Genre</span>
                                                <div className="flex items-center gap-2">
                                                    First-person shooter
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                                <span className="uppercase text-xs">Platforms</span>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    
                                                        {
                                                            project.platforms 
                                                                ? project.platforms.map(platform => <PlatformBadge platform={platform} />)
                                                                : <span className="italic">Not specified</span>
                                                        }
                                                    
                                                </div>
                                        </div>
                                    </div>
                                    
                                    
                                    {/* <h2 className="mt-3">{project.excerpt}</h2> */}
                                    {/* {
                                        project.owner &&
                                        <div className="w-full block text-sm mt-1">
                                            by <Link 
                                                href={project.owner_type == ProjectOwnerTypeTeam ? showTeam(project.owner) : showUser(project.owner)} 
                                                className="font-semibold hover:underline"
                                            >
                                                {project.owner?.name}
                                            </Link>
                                            
                                        </div>
                                    } */}
                                </div>
                                
                                <div className="flex flex-col gap-3">
                                    {/* <div className="w-full flex gap-5 items-center">
                                        <span className="rounded-sm">Share this</span>
                                        <div className="flex gap-5">
                                            <Facebook className="size-6" />
                                            <Twitter className="size-6" />
                                            <Mail />
                                            <CodeXml />
                                        </div>
                                        
                                    </div> */}
                                    <Toggle
                                        pressed={likes.length > 0} 
                                        className="w-full cursor-pointer data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
                                        onPressedChange={() => {
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
                                        variant="outline"
                                        >
                                        <Bookmark className={likeClasses} />
                                        {likes.length > 0 ? "Following" : "Follow"}
                                    </Toggle>
                                </div>
                            </div>
                        </div>
                    </div>
                
                    <div className={cn(
                        "z-50 sticky top-0 w-full h-18 border-b dark:shadow-neutral-900/80 flex md:justify-center items-center bg-background",
                        !sidebarOpen && "shadow-xl"
                    )}>
                        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                            <ul ref={sectionNav} className="flex h-full gap-4 text-sm">
                                <li className={cn(
                                    "flex items-center px-5 border-b-4 gap-3",
                                    currentTab == 'kontent' ? 'border-foreground font-semibold' : 'border-transparent'
                                )}>
                                    {
                                        currentTab == 'kontent' && (
                                            <SheetTrigger className="md:hidden" asChild>
                                            {
                                                sidebarOpen ? <Menu size={16} /> : <ChartNoAxesColumnIncreasing onClick={(e) => e.stopPropagation()} size={16} className="rotate-90" />
                                            }
                                            </SheetTrigger>
                                        )
                                    }
                                    <Link
                                        preserveScroll
                                        href={show(project)} 
                                        className="flex gap-4"
                                    >
                                        Project
                                    </Link>
                                </li>
                                <li className={cn(
                                    "flex items-center px-5 border-b-4 gap-3",
                                    currentTab == 'posts' ? 'border-foreground font-semibold' : 'border-transparent'
                                )}>
                                    {
                                        currentTab == 'posts' && (
                                            <SheetTrigger className="md:hidden" asChild>
                                            {
                                                sidebarOpen ? <Menu size={16} /> : <ChartNoAxesColumnIncreasing onClick={(e) => e.stopPropagation()} size={16} className="rotate-90" />
                                            }
                                            </SheetTrigger>
                                        )
                                    }
                                    <Link
                                        preserveScroll
                                        href={postsIndex(project)} 
                                        className="flex gap-4"
                                    >
                                        Showcase
                                    </Link>
                                </li>
                                
                                <li className={cn(
                                    "flex items-center px-5 border-b-4",
                                    currentTab == 'second' ? 'border-foreground font-semibold' : 'border-transparent'
                                )}>
                                    <a 
                                        href="#second"
                                        onClick={() => {
                                            setCurrentTab('second')
                                        }}
                                    >
                                        Creator
                                    </a>
                                </li>
                                <li className={cn(
                                    "flex items-center px-5 border-b-4",
                                    currentTab == 'settings' ? 'border-foreground font-semibold' : 'border-transparent'
                                )}>
                                    <Link 
                                        href={edit(project)}
                                    >
                                        Settings
                                    </Link>
                                </li>
                                <li className={cn(
                                    "flex items-center px-5 border-b-4",
                                    currentTab == 'activities' ? 'border-foreground font-semibold' : 'border-transparent'
                                )}>
                                    <Link
                                        preserveScroll 
                                        href={activitiesIndex(project)}
                                    >
                                        Activities
                                    </Link>
                                </li>
                            </ul>
                            <SheetContent side="left">
                                {
                                    currentTab == 'kontent' && (
                                        <>
                                            <SheetHeader>
                                    <SheetTitle>Contents</SheetTitle>
                                </SheetHeader>
                                <ul className="px-4">
                                {
                                    h.map(({hash, tag, text}) => (
                                        <li 
                                        onClick={() => {
                                            setSidebarOpen(false)
                                            setTimeout(() => {
                                            if (sectionNav.current) {
                                                window.scrollBy(0, -100)
                                            }
                                        }, 1000)}} 
                                        className="mb-3">
                                            <div className="flex">
                                                { tag == 'h2' && <div className="mr-1 mt-0.5 inline rotate-180">&not;</div>}
                                                <a className="hover:underline" href={'#' + hash}>
                                                    {text}
                                                </a>
                                            </div>
                                            
                                        </li>
                                    ))    
                                }
                                </ul>
                                        </>
                                    )
                                }
                                
                            </SheetContent>
                        </Sheet>
                    </div>
                    {
                        currentTab == 'kontent' && (
                            <ThreeColLayout 
                                id="kontent"
                                leftChildren={
                                    <div className="w-96 block mr-0 ml-auto pl-4 mt-3">
                                        <h4 className="mb-10 font-semibold">Contents</h4>
                                        <ul>
                                        {
                                            h.map(({hash, tag, text}) => (
                                                <li 
                                                // onClick={() => setTimeout(() => {
                                                //     if (sectionNav.current) {
                                                //         window.scrollBy(0, -100)
                                                //     }
                                                // }, 1000)} 
                                                className="mb-3">
                                                    <div className="flex">
                                                        { tag == 'h2' && <div className="mr-1 mt-0.5 inline rotate-180">&not;</div>}
                                                        <a className="hover:underline" href={'#' + hash}>
                                                            {text}
                                                        </a>
                                                    </div>
                                                    
                                                </li>
                                            ))    
                                        }
                                        </ul>
                                    </div>
                                }
                                rightChildren={
                                    <div className="border w-96 p-6 mt-6 mr-4">
                                        <Avatar variant={project.owner_type === TEAMMODEL ? "square" : "rounded"} className="relative size-18 overflow-hidden -top-14 -mb-8">
                                            <AvatarImage src={project.owner?.avatar} />
                                            <AvatarFallback variant={project.owner_type === TEAMMODEL ? "square" : "rounded"}>{project.owner?.name.split(' ').map(word => word.charAt(0)).join("")}</AvatarFallback>
                                        </Avatar>
                                        <h3 className="font-bold text-lg">{project.owner?.name}</h3>
                                        <p className="mt-5">{project.creator?.bio}</p>
                                    </div>
                                }
                            >
                                <h1 className="text-2xl font-semibold">Story</h1>
                                <div
                                    id="description" 
                                    className="w-full mt-10"
                                    dangerouslySetInnerHTML={{__html: project.description}} 
                                />
                            </ThreeColLayout>
                        )
                    }
                    {
                        currentTab == 'second' && (
                            <div id="second" className="w-full flex flex-col md:flex-row gap-5 xl:gap-10 px-4 justify-center">
                                <div className="w-full md:w-3/5 xl:w-2/4">
                                    <h1 className="text-2xl mt-10 mb-6 font-semibold">About the creator</h1>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Avatar variant={project.owner_type === TEAMMODEL ? "square" : "rounded"} className="size-20">
                                            <AvatarImage src={project.owner?.avatar} />
                                            <AvatarFallback variant={project.owner_type === TEAMMODEL ? "square" : "rounded"}>{project.owner?.name.split(' ').map(word => word.charAt(0)).join("")}</AvatarFallback>
                                        </Avatar>
                                        <h3 className="font-semibold">{project.owner?.name}</h3>
                                    </div>
                                    <div className="w-full flex gap-10">
                                        <div>
                                            <h4 className="text-lg font-semibold">Nov 5 2024</h4>
                                            <span className="text-sm">last login</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold">Jun 28 2010</h4>
                                            <span className="text-sm">account created</span>
                                        </div>
                                    </div>
                                    <Separator className="my-5" />
                                    <h1 className="text-xl mt-10 mb-6 font-semibold">Contributors</h1>
                                    <div className="w-full grid gap-2.5 grid-cols-2 mb-4">
                                        {
                                            project.members?.map(({avatar, name, pivot}) => (
                                                <Item variant="muted">
                                                    <ItemMedia>
                                                        <Avatar className="size-10">
                                                            <AvatarImage src={avatar} />
                                                            <AvatarFallback>{name.split(' ').map(word => word.charAt(0)).join("")}</AvatarFallback>
                                                        </Avatar>
                                                    </ItemMedia>
                                                    <ItemContent>
                                                        <ItemTitle>{name}</ItemTitle>
                                                        <ItemDescription>{pivot.roles.join(", ")}</ItemDescription>
                                                    </ItemContent>
                                                </Item>
                                            ))
                                        }
                                        
                                    </div>
                                </div>
                                <div className="w-full md:w-2/5 xl:w-1/4">
                                    <h2 className="text-lg mt-4 md:mt-10 mb-4 font-semibold">Other Projects</h2>
                                    <div className="w-full flex gap-2.5 flex-col mb-4">
                                        {/* {
                                            collaborators.map(({name, initials}) => (
                                                <Item variant="muted">
                                                    <ItemMedia>
                                                        <Avatar className="size-10">
                                                            <AvatarImage src="" />
                                                            <AvatarFallback>{initials}</AvatarFallback>
                                                        </Avatar>
                                                    </ItemMedia>
                                                    <ItemContent>
                                                        <ItemTitle>{name}</ItemTitle>
                                                        <ItemDescription>-</ItemDescription>
                                                    </ItemContent>
                                                </Item>
                                            ))
                                        } */}
                                        
                                    </div>
                                    
                                </div>
                            </div>
                            // <ThreeColLayout
                            //     id="second"
                            //     leftChildren={<></>}
                            //     rightChildren={<></>}
                            // >
                            //     <h1 className="text-2xl ">About the creator</h1>
                            //     <div className="flex items-center gap-3 mt-4">
                            //         <div className="relative size-18 rounded-full border overflow-hidden">
                            //             <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            //         </div>
                            //         <h3 className="font-bold text-lg">{project.creator?.name}</h3>
                            //     </div>
                            //     <p className="mt-5">{project.creator?.bio}</p>
                            // </ThreeColLayout>
                        )
                    }
                    {
                        currentTab == 'posts' && (
                            <section id="posts" className="w-full flex flex-col min-h-[50vh]">
                            {
                                project.posts?.length ?? 0 > 0 ?    
                                <div className="grid auto-rows-min gap-5 md:grid-cols-3 max-w-9xl mx-auto pt-5 px-4">
                                    {
                                        project.posts?.map((post) => (
                                            <div className="relative overflow-hidden">
                                                <GridCard showAuthor={false} className="cursor-pointer" onClick={() => router.visit(showPost(post))} post={post} />
                                            </div>
                                        ))
                                    }
                                </div> :
                                <NoPosts />
                            }
                            </section>
                        )
                    }
                    {
                        currentTab == 'activities' && (
                            <div className="flex flex-col mx-auto w-full max-w-3xl px-4">
                                <h3 className="text-xl font-semibold my-6">Activity Log</h3>
                                {
                                    activities?.data.map(({type, created_at, user, subject, content}) => {

                                        switch (type) {
                                            case "team-created":
                                                return (
                                                    <Step bg="bg-transparent" step={<Sparkles className='stroke-dim dark:stroke-foreground' strokeWidth={2} size={19} />} >
                                                        <div className='flex items-center h-4 gap-2 mt-1'>
                                                            <div className='text-sm'>New team created - <span className="font-semibold">{team.name}</span></div>
                                                            <Separator orientation="vertical" className='border-dim w-full bg-dim' />
                                                            <span className="text-dim text-xs font-semibold">{(new Date(created_at)).toDateString()}</span>
                                                        </div>
                                                    </Step>
                                                )
                                            case "user-added":
                                                return (
                                                    <Step bg="bg-transparent" step={<UserPlus className='stroke-dim dark:stroke-foreground' strokeWidth={2} size={19} />} >
                                                        <div className='flex items-center h-4 gap-2 mt-1'>
                                                            <div className='text-sm'>Added new member to team - <Link href={showUser({user: user?.username ?? ""})} className="font-semibold hover:underline">{user?.name}</Link></div>
                                                            <Separator orientation="vertical" className='border-dim w-full bg-dim' />
                                                            <span className="text-dim text-xs font-semibold">{(new Date(created_at)).toDateString()}</span>
                                                        </div>
                                                    </Step>
                                                )
                                            
                                            case "create-project":
                                                return (
                                                    <Step bg="bg-transparent" step={<PencilRuler className='stroke-dim dark:stroke-foreground' strokeWidth={2} size={18} />}>
                                                        <div className='flex items-center h-4 gap-2 mt-1'>
                                                            <div className='text-sm'>Created a new project - <Link href="#" className="font-semibold hover:underline">{subject?.title}</Link></div>
                                                            <Separator orientation="vertical" className='border-dim w-full bg-dim' />
                                                            <span className="text-dim text-xs font-semibold">{(new Date(created_at)).toDateString()}</span>
                                                        </div>
                                                    </Step>
                                                )

                                            case "create-post":
                                                return (
                                                    <Step bg="bg-transparent"   
                                                        step={<Lightbulb className='stroke-dim dark:stroke-foreground' strokeWidth={2} size={19} />} 
                                                        heading={
                                                            <div className='flex items-center h-4 gap-2'>
                                                                <div className='text-sm font-medium'>New idea posted - <Link href={showPost({ post: subject?.id ?? 0})} className="font-semibold hover:underline">{subject?.title}</Link></div>
                                                                <Separator orientation="vertical" className='border-dim w-full bg-dim' />
                                                                <span className="text-dim text-xs font-semibold">{(new Date(created_at)).toDateString()}</span>
                                                            </div>
                                                        }
                                                    >
                                                        Grid card here
                                                        {/* <GridCard className="mb-7 mt-1" showAuthor={false} post={subject} /> */}
                                                    </Step>
                                                )

                                            case "create-job":
                                                return (
                                                    <Step bg="bg-transparent"   
                                                        step={<BriefcaseBusiness className='stroke-dim dark:stroke-foreground' strokeWidth={2} size={19} />} 
                                                    
                                                    >
                                                        <div className='flex items-center h-4 gap-2 mt-1'>
                                                            <div className='text-sm font-medium'>New opportunity posted - <Link href={"#"} className="font-semibold hover:underline">{content.title}</Link></div>
                                                            <Separator orientation="vertical" className='border-dim w-full bg-dim' />
                                                            <span className="text-dim text-xs font-semibold">{(new Date(created_at)).toDateString()}</span>
                                                        </div>
                                                    </Step>
                                                )
                                            
                                        }
                                    })
                                }
                                {/* <Step bg="bg-transparent" step={<Send size={16} />} heading={"Some heading"}>
                                    Something
                                </Step>
                                <Step step={1}>
                                    <div className='w-full h-32'>
                                        SSADSADA
                                    </div>
                                </Step> */}
                            </div>
                        )
                    }
                </div>
                <div className={ cn(
                    "sticky top-0",
                    "transition-all duration-300",
                    o ? "w-md" : "w-0"
                )}>
                    <div className="w-md h-full flex border-l">
                        {
                            o && (
                                <Button onClick={() => setO(!o)} variant="secondary" size="icon-sm" className="sticky top-32 -translate-x-4 scrollbar-hide rounded-full">
                                    <X />
                                </Button>
                            )
                        }
                        
                        <div className="w-md h-full flex">
                            {/* <div className="h-full w-5 border-r flex flex-col items-center ">
                            </div>
                            <Button onClick={() => setO(!o)} variant="outline" size="icon-sm" className="sticky top-32 -translate-x-4 scrollbar-hide rounded-full">
                                <X />
                            </Button> */}
                            <div className="w-full flex flex-col gap-3 h-[90vh] overflow-y-scroll sticky top-19">
                                <h1 className='text-xl font-bold'>Comments</h1>
                                {
                                    auth.user && <CommentForm 
                                        className='relative -left-4' 
                                        commentableId={project.id}
                                        commentableType='project'
                                        user={auth.user}
                                        onSuccess={(newComment) => setComments(c => [newComment, ...c,])}
                                        onError={(e) => console.log('error:', e)}
                                    />
                                }
                                {
                                    comments.map(comment => <CommentItem className='relative -left-4' comment={comment} />)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </ResizablePanelGroup>
        </AppLayout>
    )
}