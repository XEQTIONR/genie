import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/app-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import axios from 'axios'
import { Badge } from '@/components/ui/badge'
import { show } from '@/routes/teams'
import { show as showJobPosting } from "@/routes/opportunities"
import { show as showUser } from '@/routes/users'
import { show as showProject } from '@/routes/projects'
import { index as membersIndex } from '@/routes/teams/users'
import { index as projectsIndex } from '@/routes/teams/projects'
import { index as jobsIndex } from '@/routes/teams/opportunities'
import { Opportunity, NavItem, Project, ProjectMember, Team, type BreadcrumbItem } from '@/types'
import { Head, Link } from '@inertiajs/react'
import { Camera, Eraser, Globe, MapPin, Pencil, PencilRuler, Instagram, Mail } from 'lucide-react'
import { Discord, Facebook, LinkedIn, Twitter, Twitch, Youtube } from '@/components/icons/svgs'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { TabbedSectionHeaders } from '@/components/ui/tabbed-sections'
import { type SharedData } from '@/types'
import { useForm, usePage } from '@inertiajs/react'
import { useInitials } from '@/hooks/use-initials';
import { Spinner } from '@/components/ui/spinner'
import { useState } from 'react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import ProjectCard from '@/components/project-card'
import NoProjects from '@/components/no-projects'
import { getCroppedImage } from '@/hooks/use-crop'
import { store as storeImage } from '@/routes/api/uploads'
import { useEffect } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import { Input } from "@/components/ui/input"
import { Slider } from '@/components/ui/slider'
import { update } from '@/routes/teams'
import { useDebouncedCallback } from 'use-debounce'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import roles from '@/data/roles'
import OpportunityList from '@/components/opportunity-list'
import Step from '@/components/step'

type ProfileTab = NavItem & {key: string, className?: string}


function AvatarDialog({ aspect = 1, image, imageHeight, imageWidth, open, onOpenChange, close, team } : { 
    aspect?: number
    image: string
    imageHeight: number
    imageWidth: number
    open: boolean
    onOpenChange: (o: boolean) => void
    close: () => void 
    team: Team
}) {
    const { apiToken } = usePage<SharedData>().props;

    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area|undefined>(undefined)
    const [fileUrl, setFileUrl] = useState<string|undefined>(image)

    const {data, setData, patch} = useForm({
        field: "avatar",
        avatar: image
    })

    useEffect(() => {
        setFileUrl(image)
        setZoom(1)
    }, [image])

    useEffect(() => {
        if (data.avatar !== image) {
            patch(update({ team: team.id }).url)
        }
    }, [data.avatar, team, patch, image])

    return (
        <Dialog open={open} onOpenChange={(o) => {
            if (!o) {
                setFileUrl(image)
            }
            onOpenChange(o)
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Profile photo</DialogTitle>
                </DialogHeader>
                {
                    fileUrl
                        ? <div className='h-[50vh] relative'>
                            <Cropper
                                aspect={aspect} 
                                crop={crop} 
                                cropShape="rect" 
                                image={fileUrl} 
                                onCropChange={setCrop}
                                onCropComplete={(_, croppedAreaPixels) => {
                                    setCroppedAreaPixels(croppedAreaPixels)
                                }} 
                                showGrid={false}
                                zoom={zoom} 
                            />
                        </div>
                        : <Input 
                            onChange={async (e) => {
                                const url = await URL.createObjectURL(e.target.files[0])
                                setFileUrl(url)
                            }} 
                            className="my-5" 
                            type="file"
                        />
                }
                <DialogFooter>
                    <div className="w-full flex flex-col">
                        {   fileUrl &&
                            <div className="w-full my-10 flex justify-center">
                                <Slider min={1} max={2} step={0.01} onValueChange={(e) => setZoom(e[0])} />
                            </div>
                        }
                        <div className="flex flex-col md:flex-row gap-10 justify-between">
                            {
                                fileUrl &&
                                <Button variant="outline" onClick={() => setFileUrl(undefined)}>Clear Image</Button>
                            }
                            <div className="flex flex-col md:flex-row justify-end gap-3 grow">
                                <DialogClose asChild>
                                    <Button 
                                        className="cursor-pointer" 
                                        variant="outline"
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button 
                                    onClick={async () => {
                                        if (fileUrl) {
                                            const x: Blob|null = await getCroppedImage(fileUrl, croppedAreaPixels, imageWidth, imageHeight)
                                            const formData = new FormData()
                                            formData.append('file', x)
                                            formData.append('mime', 'image/jpeg')
                                            axios.post(storeImage().url, formData, {
                                                headers: {
                                                    Authorization: 'Bearer ' + apiToken
                                                }
                                            }).then((res) => {
                                                const link = res.data.upload
                                                setData('avatar', link)
                                                close()
                                            }).catch((err) => {
                                                console.log('File upload error:', err)
                                            })
                                        } else { // fileurl == undefined
                                            setData("avatar", "")
                                            close()
                                        }
                                        
                                    }} 
                                    className="cursor-pointer" 
                                    type="button"
                                >
                                    Save changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function BannerDialog({ aspect = 5, image, imageHeight, imageWidth, open, onOpenChange, close, team } : { 
    aspect?: number
    image: string
    imageHeight: number
    imageWidth: number
    open: boolean
    onOpenChange: (o: boolean) => void
    close: () => void
    team: Team 
}) {

    const { apiToken } = usePage<SharedData>().props;

    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area|undefined>(undefined)
    const [fileUrl, setFileUrl] = useState<string|undefined>(image)

    const {data, setData, patch} = useForm({
        field: 'banner',
        banner: image
    })

    useEffect(() => {
        setFileUrl(image)
        setZoom(1)
    }, [image])

    useEffect(() => {
        if (data.banner !== image) {
            patch(update({ team: team.id }).url)
        }
    }, [data.banner, team, patch, image])

    return (
        <Dialog open={open} onOpenChange={(o) => {
            if (!o) {
                setFileUrl(image)
            }
            onOpenChange(o)
        }}>
            <DialogContent className={cn(fileUrl && "md:max-w-[90vw]")}>
                <DialogHeader>
                    <DialogTitle>Banner image</DialogTitle>
                </DialogHeader>
                {
                    fileUrl
                    ? <div className='h-[50vh] relative'>
                        <Cropper
                            aspect={aspect} 
                            crop={crop} 
                            cropShape="rect" 
                            image={fileUrl} 
                            onCropChange={setCrop}
                            onCropComplete={(_, croppedAreaPixels) => {
                                setCroppedAreaPixels(croppedAreaPixels)
                            }} 
                            showGrid={false}
                            zoom={zoom} 
                        />
                    </div>
                    : <Input 
                        onChange={async (e) => {
                            const fyl = e.target.files[0]
                            const url = await URL.createObjectURL(fyl)
                            setFileUrl(url)
                        }} 
                        className="my-5" 
                        type="file"
                    />
                }
                <DialogFooter>
                    <div className="w-full flex flex-col">
                    {   fileUrl &&
                        <div className="w-full my-10 flex justify-center">
                            <Slider min={1} max={2} step={0.01} onValueChange={(e) => setZoom(e[0])} />
                        </div>
                    }
                        <div className="flex flex-col md:flex-row gap-10 justify-between">
                        {
                            fileUrl &&
                            <Button variant="outline" onClick={() => setFileUrl(undefined)}>
                                <Eraser />
                                Clear Image
                            </Button>
                        }
                            <div className="flex flex-col md:flex-row justify-end gap-3 grow">
                                <DialogClose asChild>
                                    <Button 
                                        className="cursor-pointer" 
                                        variant="outline"
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button 
                                    onClick={async () => {
                                        if (fileUrl) {
                                            const x: Blob|null = await getCroppedImage(fileUrl, croppedAreaPixels, imageWidth, imageHeight)
                                            const formData = new FormData()
                                            formData.append('file', x)
                                            formData.append('mime', 'image/jpeg')
                                            
                                            axios.post(storeImage().url, formData, {
                                                headers: {
                                                    Authorization: 'Bearer ' + apiToken
                                                }
                                            }).then((res) => {
                                                const link = res.data.upload
                                                setData('banner', link)
                                                close()
                                            }).catch((err) => {
                                                console.log('File upload error:', err)
                                            })
                                        } else { // fileurl == undefined
                                            setData("banner", "")
                                            close()
                                        }
                                        
                                    }} 
                                    className="cursor-pointer" 
                                    type="button"
                                >
                                    Save changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function TeamProfile({ 
    team, 
    tab = 'activity', 
    user_count, 
    users = [],
    projects = [],
    opportunities 

} : { 
    team: Team 
    tab: string
    user_count: number
    users?: ProjectMember[]
    projects?: Project[]
    opportunities?: {
        data: Opportunity[]
    }
}) {

    const [showAvatarDialog, setShowAvatarDialog] = useState(false)

    const [showBannerDialog, setShowBannerDialog] = useState(false)

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const rz = useDebouncedCallback(() => {setWindowWidth(window.innerWidth)}, 500)

    useEffect(() => {
        window.addEventListener("resize", rz)
        return () => window.removeEventListener("resize", rz)
    }, [rz])

    const [loading, setLoading] = useState(false)

    const { auth } = usePage<SharedData>().props

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Profile',
            href: '/',
        },
    ];

    const initialize = useInitials();

    const tabs: ProfileTab[] = [
        // { title: "Showcase", href: show({ user: user.username }), key: "showcase"},
        { title: "Activity", href: show({ team: team.slug }), key: "activity"},
        { title: "Projects", href: projectsIndex({ team: team.slug }), key: "projects" },
        { title: "Releases", href: "/", key: "releases" },
        { title: "Members", href: membersIndex({ team: team.slug }), key: "members" },
        { title: "Openings", href: jobsIndex({ team: team.slug }), key: "jobs" },
    ]

    function showTab(tab: string) {
        switch(tab) {
            case 'members':
                return (
                    <div className="flex w-full h-full flex-col gap-6">
                        <h3 className="text-xl font-semibold mt-6">Members</h3>
                        <ItemGroup className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {users.map((member) => (
                            <Item key={member.id} variant="outline" asChild role="listitem">
                                <Link href={showUser({ user: member.username })}>
                                    <ItemMedia variant="image">
                                        <Avatar className="size-10 overflow-hidden rounded-full">
                                            <AvatarImage
                                                src={member.avatar}
                                                alt={member.name}
                                            />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {initialize(member.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </ItemMedia>
                                    <ItemContent className="h-full">
                                        <ItemTitle className="line-clamp-1">
                                            {member.name}
                                        </ItemTitle>
                                        <ItemDescription className="text-ellipsis">
                                        {
                                            member.pivot.roles.length > 0
                                                ? member.pivot.roles.join(", ")
                                                : "-"
                                        }</ItemDescription>
                                    </ItemContent>
                                </Link>
                            </Item>
                            ))}
                        </ItemGroup>
                    </div>
                )

            case 'projects':
                return projects.length > 0
                    ? (<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full h-full">
                        { projects.map((project) => (
                            <ProjectCard
                                excerpt={project.excerpt} 
                                href={showProject(project.slug).url} 
                                icon={PencilRuler} 
                                title={project.title} 
                                platforms={project.platforms} 
                            />
                            )) 
                        }
                    </div>)
                    : <NoProjects />

            case 'jobs':
                return (<div className="w-full h-full mt-4 flex flex-col gap-3">
                    {/* <h2 className="text-xl font-bold">Openings</h2> */}
                    <section className="w-full h-full flex flex-col">
                        <h3 className="text-xl font-semibold mt-6">Current Openings</h3>
                        {
                            <OpportunityList opportunities={opportunities?.data ?? []} />
                        }


                    </section>
                </div>)

            case 'activity':
                return (
                    <div className="flex flex-col mx-auto w-full max-w-3xl">
                        <h3 className="text-xl font-semibold mt-6">Activity Log</h3>
                        <Step bg="bg-blue-800" step={<Mail strokeWidth={2.5} size={14} />} heading={"Some heading"}>
                            Something
                        </Step>
                        <Step step={1}>
                            <div className='w-full h-32'>
                                SSADSADA
                            </div>
                        </Step>
                    </div>
                )
        }
    }

    // if ( auth.user?.id === team.owner_id ) {
    //     tabs.push({ title: "Add to team", href: "/", key: "invite", icon: UserPlus, className: "ml-2 border" })
    // }

    const isPro = true
    
    return (
        <AppLayout maxWidth='md:max-w-11xl' maxHeaderWidth='md:max-w-10xl' breadcrumbs={breadcrumbs}>
            <Head title="Profile" />
            <AvatarDialog 
                image={team.avatar ?? ""}
                imageHeight={480}
                imageWidth={480}
                open={showAvatarDialog}
                onOpenChange={setShowAvatarDialog}
                close={() => setShowAvatarDialog(false)}
                team={team}
            />

            <BannerDialog
                team={team}
                image={team.banner ?? ""}
                imageHeight={350}
                imageWidth={1728}
                open={showBannerDialog}
                onOpenChange={setShowBannerDialog}
                close={() => setShowBannerDialog(false)}
            />
            <div className="flex h-full flex-col overflow-x-auto">
                <div
                    style={team.banner ? { backgroundImage: `url("${team.banner}")` } : {
                        backgroundImage: `url("/pattern_10.jpg")`, //TODO: Fix hardcoded image
                        backgroundSize: '247.8px 193.8px'
                    }}
                    className="h-88 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% bg-cover bg-center flex gap-4 justify-between border-sidebar-border/70 dark:border-sidebar-border"
                >
                    <div className="w-full h-full  relative overflow-hidden flex justify-end items-start md:items-end bg-red-950">
                        <div className='absolute top-1/2 left-1/2 -translate-1/2 flex flex-col gap-3 w-full max-w-3xl px-4 bg-pink-700'>
                            <div className="flex gap-5">
                                <Avatar variant="square" className="size-20">
                                {
                                    auth.user && auth.user.id === team.owner_id &&
                                    <div onClick={() => setShowAvatarDialog(true)} className="cursor-pointer size-full flex items-center justify-center absolute bg-neutral-950/50 z-50 opacity-0 hover:opacity-100">
                                        <Camera className="opacity-90 stroke-white" size={25} />
                                    </div>
                                }
                                    <AvatarImage src={team.avatar} />
                                    <AvatarFallback variant="square" className="text-3xl">{team.name.split(' ').map(word => word.charAt(0)).join("")}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col justify-center">
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold text-white">{team.name}</h1> <span className="px-1 py-0.5 text-xs font-bold rounded bg-foreground text-background">STUDIO</span>
                                    </div>
                                    <div className="flex gap-1 items-center text-sm text-white"><MapPin size={16} /> Toronto, ON</div>
                                </div>
                            </div>
                            <p className="text-sm text-white">{team.description}</p>
                            <div className='flex items-center gap-3.5 text-white'>
                                <Facebook className="size-4.5" />
                                <Twitter className="size-4.5" />
                                <Instagram size={16} />
                                <Youtube className="size-4.5" />
                                <Twitch className="size-4.5" />
                                <Globe className="size-4.5" />
                            </div>
                        </div>
                    {
                        team.owner_id === auth.user?.id &&
                        <Button
                            variant="outline"
                            type="button" 
                            className="cursor-pointer" 
                            size="icon-lg"
                            onClick={() => {
                                setShowBannerDialog(true)
                            }}
                        >
                            <Pencil />
                        </Button>
                    }
                    </div>
                </div>
                <div className="w-full block mx-auto">
                    <TabbedSectionHeaders
                        className="px-1 bg-foreground/5 dark:bg-red-500/2"
                        current={tab}
                        headers={tabs}
                        onTabChange={() => {
                            setLoading(true)
                        }}
                    />
                </div>
                
                <div className="w-full h-full md:min-h-[50vh] mx-auto flex overflow-hidden">
                    {
                        loading 
                            ? <Spinner className="block m-auto size-6" />
                            : showTab(tab)
                    }
                </div>
            </div>
        </AppLayout>
    );
}
