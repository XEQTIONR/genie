import AppLayout from '@/layouts/app-layout'
import { ArrowUpRightIcon, Eraser, Eye, Heart, Image, ImageIcon, LayoutGrid } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AtSign, Camera, EllipsisVertical, Gamepad2, Globe, Hammer, Lightbulb, LinkIcon, Mail, MapPin, Pencil, PencilRuler, Plus, Rocket, Trash, UserPlus, Users, X, } from 'lucide-react'
import axios from 'axios'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
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
import { FieldDescription } from "@/components/ui/field"
import { Form, useForm, usePage } from '@inertiajs/react'
import { Godot, Unity, Unreal } from '@/components/icons/create'
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
import { Label } from '@/components/ui/label'
import { NavItem, Team, User, type BreadcrumbItem } from '@/types'
import NoProjects from '@/components/no-projects'
import ProjectCard from '@/components/project-card'
import roles from '@/data/roles'
import SearchBar from '@/components/ui/search-bar'
import { Separator } from '@/components/ui/separator'
import { type SharedData } from '@/types'
import { show, about } from '@/routes/users'
import { show as showPost } from '@/routes/posts'
import { show as showTeam } from '@/routes/teams'
import { Spinner } from '@/components/ui/spinner'
import { store as storeImage } from '@/routes/api/uploads'
import { update as updateUser } from '@/actions/App/Http/Controllers/UserProfileController'
import { TabbedSectionHeaders } from '@/components/ui/tabbed-sections'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Slider } from '@/components/ui/slider'
import { getCroppedImage } from '@/hooks/use-crop'
import { Discord, Facebook, LinkedIn, Twitter, Twitch, Youtube } from '@/components/icons/svgs'
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern'
import GridCard from '@/components/grid-card'

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

export default function Profile({ user, tab = 'showcase', teams } : { user: User, tab: string, teams: Team[] }) {

    const [showAvatarDialog, setShowAvatarDialog] = useState(false)

    const [showBannerDialog, setShowBannerDialog] = useState(false)

    const [loading, setLoading] = useState(false)

    const [editing, setEditing] = useState<string|false>(false)

    const [favGames, setFavGames] = useState(user.meta?.fav_games ?? [])

    const [currentSection, setCurrentSection] = useState('overview')

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const rz = useDebouncedCallback(() => {setWindowWidth(window.innerWidth)}, 100)

    useEffect(() => {
        window.addEventListener("resize", rz)
        return () => window.removeEventListener("resize", rz)
    }, [rz])

    const sectionLabels = [
        {label: 'Overview', name: 'overview'},
        {label: 'Skills & tools', name: 'skills'},
        {label: 'Projects & releases', name: 'projects'},
        {label: 'Contact & socials', name: 'contact'},
    ]

    const { auth } = usePage<SharedData>().props

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Profile',
            href: show({ user: user.username }).url,
        },
    ]

    const tabs: ProfileTab[] = [
        { title: "Showcase", href: show({ user: user.username }), key: "showcase"},
        // { title: "Activity", href: "/", key: "activity"},
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
                        "grid grid-cols-1 md:grid-cols-3 gap-5"
                    )}>
                    {
                        (user.posts && (user.posts.length > 0)) ?
                        user.posts?.map((post) => (
                            <div className="flex flex-col gap-3">
                                <GridCard
                                    onClick={() => router.visit(showPost({ post: post.id }))} 
                                    className="cursor-pointer" post={post} 
                                />
                            </div>
                        )) : (
                            <Empty className="">
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
                                    <Button>Create a post</Button>
                                    <Button variant="outline">Browse posts</Button>
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
            <div className="flex h-full flex-col overflow-x-auto">
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
                <div className="relative -top-60 -mb-44 flex flex-col items-center gap-3 w-full">
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
                </div>
                <div className="w-full flex flex-col mx-auto gap-0 items-center">
                    {/* <div className="flex flex-col md:flex-row md:gap-4 relative -top-11 -mb-11 w-full md:max-w-10xl px-4 md:mx-0">
                        
                        <div className="relative md:top-12 md:mb-12 flex flex-col md:flex-row gap-4 grow items-start justify-between mt-4">
                            <div className="flex flex-col gap-2">
                                <div className="text-4xl font-semibold flex items-center gap-4">
                                    {user.name}
                                    {isPro && <span className="text-xs bg-primary text-background px-2 py-0.5 rounded">PRO</span>}
                                </div>
                                <span>{user.status}</span>
                            </div>
                            <div className="flex flex-row-reverse md:flex-row gap-2 items-center shrink-0">
                                <span className="hidden lg:inline mr-3 text-sm">Let's build something together</span>
                                <Button className="cursor-pointer">Get in touch</Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="cursor-pointer" variant="outline" size="icon"><EllipsisVertical /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent sideOffset={10} className="dark:bg-neutral-900" align={windowWidth >= 768 ? "end" : "start"}>
                                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer">Contact</DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">Add to team</DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">Block</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div> */}
                    
                    {/* <div className="md:ml-8">
                        <div className="w-full flex justify-between items-center mb-2">
                            
                            
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-5 text-xs md:text-base">
                            {
                                user.location &&
                                <div className="flex items-center gap-2 text-neutral-400 font-medium"><MapPin size={16} /> {renderLocation(user.location)}</div>
                            }
                            {
                                user.status &&
                                <div className="flex text-neutral-400 font-medium"><span className="font-bold text-nowrap mr-1">Status :</span> {user.status}</div>
                            }
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4">
                        {
                            user.meta?.skills?.map((title) => (
                                <span className="bg-neutral-100 dark:bg-neutral-900 text-neutral-500 px-4 py-2 rounded-full font-semibold">{title}</span>
                            ))
                        }
                        </div>
                    </div> */}
                    
                    <TabbedSectionHeaders
                        className="w-full px-1 bg-foreground/5 dark:bg-foreground/2"
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
