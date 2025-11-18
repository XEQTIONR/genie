import { Button } from '@/components/ui/button'
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern'
import AppLayout from '@/layouts/app-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import axios from 'axios'
import { show } from '@/routes/teams'
import { show as showUser } from '@/routes/users'
import { show as showProject } from '@/routes/projects'
import { index as membersIndex } from '@/routes/teams/users'
import { index as projectsIndex } from '@/routes/teams/projects'
import { NavItem, Project, ProjectMember, Team, type BreadcrumbItem } from '@/types'
import { Head, Link } from '@inertiajs/react'
import { Camera, EllipsisVertical, PencilRuler, Rocket, UserPlus, Users } from 'lucide-react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
                                            formData.append('image', x)
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

export default function TeamProfile({ 
    team, 
    tab = 'activity', 
    user_count, 
    users = [],
    projects = [] 

} : { 
    team: Team 
    tab: string
    user_count: number
    users?: ProjectMember[]
    projects?: Project[] 
}) {

    const [showAvatarDialog, setShowAvatarDialog] = useState(false)

    const [showBannerDialog, setShowBannerDialog] = useState(false)

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
        { title: "Openings", href: "/", key: "openings" },
    ]

    function showTab(tab: string) {
        switch(tab) {
            case 'members':
                return (
                    <div className="flex w-full h-full flex-col gap-6 mx-2 md:mx-8">
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
                    ? (<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full h-full mx-2 md:mx-8">
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
        }
    }

    // if ( auth.user?.id === team.owner_id ) {
    //     tabs.push({ title: "Add to team", href: "/", key: "invite", icon: UserPlus, className: "ml-2 border" })
    // }

    const isPro = true
    
    return (
        <AppLayout maxWidth='md:max-w-7xl' breadcrumbs={breadcrumbs}>
            <Head title="Profile" />
            <AvatarDialog 
                image={team.avatar ?? ""}
                imageHeight={200}
                imageWidth={200}
                open={showAvatarDialog}
                onOpenChange={setShowAvatarDialog}
                close={() => setShowAvatarDialog(false)}
                team={team}
            />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="h-full md:h-[400px] flex gap-4 justify-between rounded-xl border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="w-full relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                </div>
                <div className="w-full relative -top-22 md:-top-28 -mb-22 md:-mb-28 flex flex-col gap-8">
                    <Avatar variant="square" className="size-36 sm:size-44 md:size-48 ml-[50%] -translate-x-1/2 md:translate-x-0 md:ml-12">
                        {
                            auth.user && auth.user.id === team.owner_id &&
                            <div onClick={() => setShowAvatarDialog(true)} className="cursor-pointer size-full flex items-center justify-center absolute bg-neutral-950/50 z-50 opacity-0 hover:opacity-100">
                                <Camera className="opacity-90 stroke-white" size={25} />
                            </div>
                        }
                        <AvatarImage src={team.avatar} />
                        <AvatarFallback variant="square" className="text-3xl">{team.name.split(' ').map(word => word.charAt(0)).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="md:mx-8">
                        <div className="w-full flex justify-between items-center">
                            <div className="text-2xl sm:text-5xl font-bold flex items-center gap-4 max-w-4/5">
                                {team.name}
                                {isPro && <span className="text-sm bg-primary text-background px-2 py-0.5 rounded">PRO</span>}
                            </div>
                            <div className="flex gap-2 items-center">
                                {/* <span className="hidden lg:inline mr-3 text-sm">Let's build something together</span> */}
                                <Button className="hidden lg:inline cursor-pointer">Get in touch</Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="cursor-pointer" variant="outline" size="icon"><EllipsisVertical /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent sideOffset={10} className="dark:bg-neutral-900" align="end">
                                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer">Contact</DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">Add to team</DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">Block</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 mt-2 text-neutral-400 font-medium">
                            <Link preserveScroll href={membersIndex({ team: team.slug })} className="flex items-center gap-2 hover:underline"> <Users size={16} /> {user_count} </Link>
                            <Link preserveScroll className="flex items-center gap-2 hover:underline"> <PencilRuler size={16} /> {user_count} </Link>
                            <Link preserveScroll className="flex items-center gap-2 hover:underline"> <Rocket size={16} /> {user_count} </Link>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4">
                        {/* {
                            titles.map((title) => (
                                <span className="bg-neutral-100 dark:bg-neutral-900 text-neutral-500 px-4 py-2 rounded-full font-semibold">{title}</span>
                            ))
                        } */}
                        </div>
                        <div className="w-full mt-8">
                            <h2 className="font-semibold text-2xl">About</h2>
                            <p className="mt-4 text-lg">
                                {team.description}
                            </p>
                        </div>
                    </div>
                    <TabbedSectionHeaders
                        current={tab}
                        headers={tabs}
                        onTabChange={() => {
                            setLoading(true)
                        }}
                    />
                </div>
                <div className="w-full h-full md:min-h-[50vh] flex overflow-hidden">
                    {
                        loading 
                            ? <Spinner className="block mx-auto size-6" />
                            : showTab(tab)
                    }
                </div>
            </div>
        </AppLayout>
    );
}
