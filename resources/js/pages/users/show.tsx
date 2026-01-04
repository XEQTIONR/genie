import AppLayout from '@/layouts/app-layout'
import { ArrowUpRightIcon, BriefcaseBusiness, Eraser, LayoutGrid, Lightbulb, Sparkle, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, EllipsisVertical, Pencil, PencilRuler, Rocket, Users } from 'lucide-react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Combobox, GroupedOptions, Option } from '@/components/ui/combobox'
import { cn } from '@/lib/utils'
import { create as createTeam } from '@/routes/teams'
import Cropper, { Area, Point } from 'react-easy-crop'
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useForm, usePage } from '@inertiajs/react'
import { Head, Link, router } from '@inertiajs/react'
import { index as showTeams } from '@/routes/users/teams'
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Activity, NavItem, Project, Team, User, type BreadcrumbItem } from '@/types'
import NoProjects from '@/components/no-projects'
import { Separator } from '@/components/ui/separator'
import { type SharedData } from '@/types'
import { show, about } from '@/routes/users'
import { index as indexPost, create as createPost, show as showPost } from '@/routes/posts'
import { show as showTeam } from '@/routes/teams'
import { show as showProject } from '@/routes/projects'
import { index as indexActivity } from '@/routes/users/activites'
import { Spinner } from '@/components/ui/spinner'
import { store as storeImage } from '@/routes/api/uploads'
import { update as updateUser } from '@/actions/App/Http/Controllers/UserProfileController'
import { TabbedSectionHeaders } from '@/components/ui/tabbed-sections'
import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Slider } from '@/components/ui/slider'
import { getCroppedImage } from '@/hooks/use-crop'
import { Discord, Facebook, LinkedIn, Twitter, Twitch, Youtube } from '@/components/icons/svgs'
import GridCard from '@/components/grid-card'
import { store as storeLike, destroy as destroyLike } from '@/routes/api/likes'
import { index as indexProject } from '@/routes/users/projects'
import ProjectGridCard from '@/components/project-grid-card'
import Step from '@/components/step'

type ProfileTab = NavItem & {key: string, className?: string}

function RenderMultilineText({ text } : { text: string }) {
    const paragraphs = text.split('\n');

    return <>
    {
        paragraphs.map((para) => <p className="mb-2">{para}</p>)        
    }
    </>
}

function EditLocation({ defaultValue } : { defaultValue?: string}) {

    const [options, setOptions] = useState<Option[]|GroupedOptions>([])

    useEffect(() => {        
        axios.get('https://restcountries.com/v3.1/all?fields=name,flag,region')
            .then(({data}) => {
                const opts = data.map(({name, flag, region} : { name: { common: string }, flag: string, region: string}) => {
                    return { name: name.common, flag, region }
                }).sort((a: {name: string}, b: {name: string}) => a.name.localeCompare(b.name))
                .filter(({name} : {name: string}) => name !== 'Israel')
                .map(({ name, flag, region } : { name: string, flag: string, region: string }) => {
                    return { label: flag + ' ' + name, value: name, region }
                })

                const grouped = Object.groupBy(opts, (opt : {region: string}) => opt.region)

                setOptions({
                    None: [{label: "Not selected", value: ""}],
                    ...grouped
                })
            })
    }, [])
    return <Combobox placeholder="Not selected" defaultValue={defaultValue ?? ""} name="country" items={options} containerClassName="w-64" />
}

function NoTeams() {
    return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Users />
                    </EmptyMedia>
                    <EmptyTitle>Not on any team</EmptyTitle>
                    <EmptyDescription>
                        You&apos;re not a part any team. <br /> Create your first team or ask to join a team.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <div className="flex gap-2"> 
                        <Button 
                            onClick={() => {
                                router.visit(createTeam())
                            }} 
                            className="cursor-pointer"
                        >
                            Create a new team
                        </Button>
                        <Button className="cursor-pointer" variant="outline">Join existing team</Button>
                    </div>
                </EmptyContent>
                <Button
                    variant="link"
                    asChild
                    className="text-muted-foreground"
                    size="sm"
                >
                    <a href="#">
                    Learn More <ArrowUpRightIcon />
                    </a>
                </Button>
            </Empty>
    )
}

function NoReleases() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Rocket />
                </EmptyMedia>
                <EmptyTitle>No releases</EmptyTitle>
                <EmptyDescription>
                    You don&apos;t have not recorded any game releases.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2"> 
                    <Button className="cursor-pointer">Add a new release</Button>
                    {/* <Button className="cursor-pointer" variant="outline">Join existing team</Button> */}
                </div>
            </EmptyContent>
            <Button
                variant="link"
                asChild
                className="text-muted-foreground"
                size="sm"
            >
                <a href="#">
                Learn More <ArrowUpRightIcon />
                </a>
            </Button>
        </Empty>
    )
}

function AvatarDialog({ aspect = 1, image, imageHeight, imageWidth, open, onOpenChange, close } : { 
    aspect?: number
    image: string
    imageHeight: number
    imageWidth: number
    open: boolean
    onOpenChange: (o: boolean) => void
    close: () => void 
}) {
    
    const { auth, apiToken } = usePage<SharedData>().props;

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
            patch(updateUser({ user: auth?.user.id }).url)
        }
    }, [data.avatar, auth.user, patch, image])

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
                            cropShape="round" 
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

function BannerDialog({ aspect = 5, image, imageHeight, imageWidth, open, onOpenChange, close } : { 
    aspect?: number
    image: string
    imageHeight: number
    imageWidth: number
    open: boolean
    onOpenChange: (o: boolean) => void
    close: () => void 
}) {

    const { auth, apiToken } = usePage<SharedData>().props;

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
            patch(updateUser({ user: auth?.user.id }).url)
        }
    }, [data.banner, auth.user, patch, image])

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

export default function Profile({
    activities,
    user, 
    tab = 'showcase', 
    teams, projects 
} : {
    activities: Activity[]
    user: User, 
    tab: string, 
    teams?: Team[], 
    projects?: Project[] 
}) {

    const [showAvatarDialog, setShowAvatarDialog] = useState(false)

    const [showBannerDialog, setShowBannerDialog] = useState(false)

    const [loading, setLoading] = useState(false)

    const [editing, setEditing] = useState<string|false>(false)

    const [favGames, setFavGames] = useState(user.meta?.fav_games ?? [])

    const [currentSection, setCurrentSection] = useState('overview')

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const rz = useDebouncedCallback(() => {setWindowWidth(window.innerWidth)}, 100)

    const [likes, setLikes] = useState(user.likes ?? [])

    const [likeDisabled, setLikeDisabled] = useState(false)

    const [followButtonText, setFollowButtonText] = useState(() => {
        if (likes.length == 0) {
            return "Follow"
        }

        return "Following"
    })

    useEffect(() => {
        window.addEventListener("resize", rz)
        return () => window.removeEventListener("resize", rz)
    }, [rz])

    const { auth, apiToken } = usePage<SharedData>().props

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Profile',
            href: show({ user: user.username }).url,
        },
    ]

    const tabs: ProfileTab[] = [
        { title: "Showcase", href: show({ user: user.username }), key: "showcase"},
        { title: "Activities", href: indexActivity(user), key: "activities"},
        { title: "Projects", href: indexProject(user), key: "projects"},
        { title: "About", href: about({ user: user.username }), key: "about" },
        { title: "Teams / Studios", href: showTeams({ user: user.username }).url, key: "teams"},
    ]

    // if ( auth.user?.id === user.id ) {
    //     tabs.push({ title: "Invite", href: "/", key: "invite", icon: Mail, className: "ml-2 border" })
    // } else {
    //     tabs.push({ title: "Add to team", href: "/", key: "invite", icon: UserPlus, className: "ml-2 border" })
    // }

    const isPro = true

    const skillForm = useForm<{skills: string[], field: string}>({
        field: 'skills',
        skills: user.meta?.skills ?? []
    })
    
    function EditButton({ 
        disabled = false, 
        what,
        onClick 
    } : { 
        disabled?: boolean 
        what: string
        onClick?: () => void 
    }) {
        return auth.user?.id === user.id && editing !== what 
            ? <Button
                onClick={() => {
                    if (onClick) {
                        onClick()
                    }
                    setEditing(what)
                }} 
                disabled={disabled} 
                className="cursor-pointer" 
                size="icon" variant="ghost"
                >
                    <Pencil />
                </Button>
            : <div className="size-8"></div>
    }

    function showTab(tab: string) {
        switch (tab) {
            case 'teams':
                return (teams.length == 0 
                    ? <NoTeams />
                    : <div className="flex size-full flex-col gap-6 mx-2 md:mx-4">
                        <ItemGroup className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-5">
                            {teams.map((team) => (
                            <Item key={team.id} variant="outline" asChild role="listitem">
                                <Link href={showTeam({
                                    team: team.slug
                                })}>
                                    <ItemMedia variant="image">
                                        <Avatar variant="square" className="size-10">
                                            <AvatarImage src={team.avatar} />
                                            <AvatarFallback className="text-3xl">{team.name.split(' ').map(word => word.charAt(0)).join("")}</AvatarFallback>
                                        </Avatar>
                                    </ItemMedia>
                                    <ItemContent className="h-full">
                                        <ItemTitle className="line-clamp-1 font-medium">
                                            {team.name}
                                        </ItemTitle>
                                        <ItemDescription className="text-ellipsis">{team.description ?? "-"}</ItemDescription>
                                    </ItemContent>
                                    <ItemContent>
                                        <ItemDescription className="flex gap-3">
                                            <div className="flex items-center gap-1"><Users size={12} />{team.users_count}</div>
                                            <div className="flex items-center gap-1"><PencilRuler size={12} />{team.projects_count}</div>
                                        </ItemDescription>
                                    </ItemContent>
                                </Link>
                            </Item>
                            ))}
                        </ItemGroup>
                        <div className="w-full flex justify-end">
                            <Button className="cursor-pointer" onClick={() => router.visit(createTeam())}>Create a new team</Button>
                        </div>
                    </div>
                )
            case 'about':
                return (
                    <div className="w-full max-w-3xl mx-auto mt-20 flex flex-col gap-8">
                        <div className="flex flex-col md:flex-row gap-3 md:gap-0 px-5">
                            <div className="w-full md:w-1/5 text-sm font-semibold">Status</div>
                            <div className="w-full md:w-3/5 text-sm">{user.status}</div>
                        </div>
                        <Separator />
                        <div className="flex flex-col md:flex-row gap-3 md:gap-0 px-5">
                            <div className="w-full md:w-1/5 text-sm font-semibold">Biography</div>
                            <div className="w-full md:w-3/5 text-sm">{user.bio}</div>
                        </div>
                        <Separator />
                        <div className="flex flex-col md:flex-row gap-3 md:gap-0 px-5">
                            <div className="w-full md:w-1/5 text-sm font-semibold">Websites</div>
                            <div className="w-full md:w-3/5 text-sm">
                                <ul>
                                    <li className="mb-0.5">ishteharhussain.com</li>
                                    <li className="mb-0.5">dglcore.com</li>
                                </ul>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex flex-col md:flex-row gap-3 md:gap-0 px-5">
                            <div className="w-full md:w-1/5 text-sm font-semibold">Skills</div>
                            <div className="w-full md:w-3/5 flex flex-wrap gap-2 relative md:-top-1">
                            {
                                user.meta?.skills &&
                                user.meta?.skills.map((skill) => (
                                    <span className="text-xs px-2.5 py-2 rounded-lg bg-foreground/5">{skill}</span>
                                ))
                            }
                            </div>
                        </div>
                        <Separator />
                        <div className="flex flex-col md:flex-row gap-3 md:gap-0 px-5">
                            <div className="w-full md:w-1/5 text-sm font-semibold">Tools</div>
                            <div className="w-full md:w-3/5 flex flex-wrap gap-2 relative md:-top-1">
                            {
                                user.meta?.skills &&
                                user.meta?.skills.map((skill) => (
                                    <span className="text-xs px-2.5 py-2 rounded-lg bg-foreground/5">{skill}</span>
                                ))
                            }
                            </div>
                        </div>
                        <Separator />
                        <div className="flex flex-col md:flex-row gap-3 md:gap-0 px-5">
                            <div className="w-full md:w-1/5 text-sm font-semibold">Favorite Games</div>
                            <div className="w-full md:w-3/5 text-sm flex gap-2 relative -top-1">
                                {
                                    user.meta?.fav_games &&
                                    user.meta?.fav_games.map((game) => (
                                        <span className="text-xs px-2.5 py-2 rounded-lg bg-foreground/5">{game}</span>
                                    ))
                                }
                            </div>
                        </div>
                        <Separator />
                        <div className="flex flex-col md:flex-row gap-3 md:gap-0 px-5 mb-32">
                            <div className="w-full md:w-1/5 text-sm font-semibold">Socials</div>
                            <div className="w-full md:w-3/5 text-sm">
                                <ul>
                                    <li className="mb-3 flex items-center gap-1">
                                        <Facebook className="size-5" />
                                        <a href="https://linkedin.com/XEQTIONR">XEQTIONR</a>
                                        
                                    </li>
                                    <li className="mb-3 flex items-center gap-1">
                                        <LinkedIn className="size-5" />
                                        <a href="https://linkedin.com/in/ishteharhussain">/in/ishteharhussain</a>
                                        
                                    </li>
                                    <li className="mb-3 ml-0.5 flex items-center gap-1">
                                        <Twitter className="size-4" />
                                        <a href="https://x.com/@XEQTIONR">@XEQTIONR</a>
                                    </li>
                                    <li className="mb-3 flex items-center gap-1">
                                        <Twitch className="size-5" />
                                        <a href="">https://www.twitch.tv/curry</a>
                                        curry
                                    </li>
                                    <li className="mb-3 ml-0.5 flex items-center gap-1">
                                        <Youtube className="size-4" />
                                        <a href="https://www.youtube/@XEQTIONR">@XEQTIONR</a>
                                    </li>
                                    <li className="mb-3 flex items-center gap-1">
                                        <Discord className="size-5" />
                                        XEQTIONR#1534
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            case "showcase":
                return (
                    <div className={cn(
                        "w-full p-5 max-w-9xl mx-auto",
                        
                        (user.posts && (user.posts.length > 0)) 
                            ? "grid grid-cols-1 md:grid-cols-3 gap-5"
                            : "flex justify-center"
                    )}>
                    {
                        (user.posts && (user.posts.length > 0)) ?
                        user.posts?.map((post) => (
                            <div className="flex flex-col gap-3">
                                <GridCard
                                    showAuthor={false}
                                    onClick={() => router.visit(showPost({ post: post.id }))} 
                                    className="cursor-pointer" post={post} 
                                />
                            </div>
                        )) : (
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                    <LayoutGrid />
                                    </EmptyMedia>
                                    <EmptyTitle>No Posts Yet</EmptyTitle>
                                    <EmptyDescription>
                                        You haven&apos;t created any posts yet. Get started by creating
                                        your first post.
                                    </EmptyDescription>
                                </EmptyHeader>
                                <EmptyContent>
                                    <div className="flex gap-2">
                                    <Button className="cursor-pointer" onClick={() => router.visit(createPost())}>Create a post</Button>
                                    <Button className="cursor-pointer" onClick={() => router.visit(indexPost())} variant="outline">Browse posts</Button>
                                    </div>
                                </EmptyContent>
                                <Button
                                    variant="link"
                                    asChild
                                    className="text-muted-foreground"
                                    size="sm"
                                >
                                    <a href="#">
                                    Learn More <ArrowUpRightIcon />
                                    </a>
                                </Button>
                            </Empty>
                        )
                    }
                    </div>
                )
            case "projects":
                return (
                    projects?.length ?? 0 > 0
                                            ? (
                                                <div className="flex flex-col mx-auto max-w-8xl px-4">
                                                    <h3 className="text-xl font-semibold my-6">Projects</h3>
                                                    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full h-full items-start">
                                                    { 
                                                        projects?.map((project) => <ProjectGridCard project={project} />) 
                                                    }
                                                    </div>
                                                </div>
                                            )
                                            : <NoProjects />
                )
            case 'activities':
                return (
                    <div className="flex flex-col mx-auto w-full max-w-3xl px-4">
                        <h3 className="text-xl font-semibold my-6">Activity Log</h3>
                        {
                            activities.map(({type, created_at, user, subject, content}) => {

                                switch (type) {
                                    case "create-project":
                                        return (
                                            <Step bg="bg-transparent" step={<PencilRuler className='stroke-dim dark:stroke-foreground' strokeWidth={2} size={18} />}>
                                                <div className='flex items-center h-4 gap-2 mt-1'>
                                                    <div className='text-sm'>Created a new project - <Link href={showProject({ project: subject?.slug })} className="font-semibold hover:underline">{subject?.title}</Link></div>
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
                                                <GridCard className="mb-7 mt-1" showAuthor={false} post={subject} />
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
            default: 
                return null
        }
    }

    function renderLocation(location: { 
        city?: string
        country: string 
    } | null) {
        if (location) {
            if (location.city) {
                return `${location.city}, ${location.country}`
            }

            return location.country
        }
        return null
    }
    
    return (
        <AppLayout maxWidth='md:max-w-11xl' maxHeaderWidth='md:max-w-10xl' breadcrumbs={breadcrumbs}>
            <Head title="Profile" />
            <AvatarDialog 
                image={user.avatar ?? ""}
                imageHeight={200}
                imageWidth={200} 
                open={showAvatarDialog} 
                onOpenChange={setShowAvatarDialog}
                close={() => setShowAvatarDialog(false)} 
            />

            <BannerDialog
                image={user.banner ?? ""}
                imageHeight={350}
                imageWidth={1728}
                open={showBannerDialog}
                onOpenChange={setShowBannerDialog}
                close={() => setShowBannerDialog(false)}
            />
            <div className="flex h-full flex-col">
                <div
                    style={user.banner ? { backgroundImage: `url("${user.banner}")` } : {
                        backgroundImage: `url("/pattern_10.jpg")`,
                        backgroundSize: '247.8px 193.8px'
                    }}
                    className="h-88 flex gap-4 justify-between border-sidebar-border/70 dark:border-sidebar-border"
                >
                    <div className="w-full h-full relative flex justify-end items-start md:items-end px-4 py-5">
                    
                    {
                        user.id === auth.user?.id ?
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
                        </Button> :
                        <div className="flex flex-row gap-2 items-center shrink-0">
                                <span className="hidden lg:inline mr-3 text-sm text-white">Let's build something together</span>
                                <Button className="cursor-pointer">Get in touch</Button>
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
                    }
                    </div>
                </div>
                <div className="relative -top-68 -mb-56 flex flex-col items-center gap-3 w-full">
                    <Avatar className="size-24 ring-background">
                        {
                            auth.user && auth.user.id === user.id &&
                            <div onClick={() => setShowAvatarDialog(true)} className="cursor-pointer size-full flex items-center justify-center absolute bg-neutral-950/50 z-50 opacity-0 hover:opacity-100">
                                <Camera className="opacity-90 stroke-white" size={25} />
                            </div>
                        }
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-3xl">{user.name.split(' ').map(word => word.charAt(0)).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="text-2xl font-semibold flex items-center gap-4 text-white">
                        {user.name}
                        {/* {isPro && <span className="text-xs bg-primary text-background px-2 py-0.5 rounded">PRO</span>} */}
                    </div>
                    <div className='flex gap-1.5 text-sm text-white'>
                        <span>Backed 10 projects</span>
                        <span>&bull;</span>
                        {
                            user.location &&
                            <>
                                <span>{user.location.city ? `${user.location.city},` : null} {user.location.country}</span>
                                <span>&bull;</span>
                            </>
                        }
                        <span>Joined {
                            (new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: 'short',
                            
                            })).format(new Date(user.created_at))
                        }
                        </span>
                    </div>
                    {
                        auth.user && auth.user.id !== user.id &&
                        <Button
                            disabled={likeDisabled}
                            type="button" 
                            variant="secondary"
                            onClick={() => {
                                if (likes.length == 0) {
                                    setLikeDisabled(true)
                                    axios.post(storeLike().url, {
                                        likeable_id: user.id,
                                        likeable_type: 'user'
                                    }, {
                                        headers: {
                                            Authorization: 'Bearer ' + apiToken
                                        }
                                    }).then(res => {
                                        setLikes(l => {
                                            if (l) {
                                                return [...l, res.data]
                                            }
                                            return [res.data]
                                        })
                                        setLikeDisabled(false)    
                                    }).catch(() => {
                                        setLikeDisabled(false)       
                                    })
                                } else {
                                    setLikeDisabled(true)
                                    axios.delete(destroyLike(likes[0]).url, {
                                        headers: {
                                            Authorization: 'Bearer ' + apiToken
                                        }
                                    }).then(() => {
                                        setLikes([])
                                        setLikeDisabled(false)
                                    }).catch(() => {
                                        setLikeDisabled(false)
                                    })
                                }
                            }}
                            onMouseEnter={() => {
                                if (followButtonText == "Following") {
                                    setFollowButtonText("Unfollow")
                                }
                            }}
                            onMouseLeave={() => {
                                if (likes.length == 0) {
                                    setFollowButtonText("Follow")
                                } else {
                                    setFollowButtonText("Following")
                                }

                            }}
                        >
                            {followButtonText}
                        </Button>

                    }
                    
                </div>
                <div className="w-full flex flex-col mx-auto gap-0 items-center z-50 sticky top-0 bg-foreground dark:bg-background border-b shadow-lg dark:shadow-neutral-900/80">
                    <TabbedSectionHeaders
                        className="w-full px-1"
                        current={tab}
                        headers={tabs}
                        onTabChange={() => {
                            setLoading(true)
                        }}
                    />
                </div>
                
                <div className="w-full h-full md:min-h-[50vh] mx-auto relative flex overflow-hidden border-sidebar-border/70 dark:border-sidebar-border">
                {
                    loading 
                        ? <Spinner className="block m-auto size-6" />
                        : showTab(tab)
                }
                </div>
            </div>
        </AppLayout>
    )
}
