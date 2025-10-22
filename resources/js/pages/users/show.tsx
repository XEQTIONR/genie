import { Button } from '@/components/ui/button'
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern'
import AppLayout from '@/layouts/app-layout'
import { show, about } from '@/routes/users'
import { show as showTeam } from '@/routes/teams'
import { store } from '@/actions/App/Http/Controllers/TeamController'
import { update as updateUser } from '@/actions/App/Http/Controllers/UserProfileController'
import { index as showTeams } from '@/routes/users/teams'
import { NavItem, Team, User, type BreadcrumbItem } from '@/types'
import { Head, Link } from '@inertiajs/react'
import { AtSign, Dribbble, EllipsisVertical, Facebook, Figma, Gamepad2, Github, Gitlab, Globe, Hammer, Instagram, Lightbulb, Linkedin, Mail, MapPin, Pencil, PencilRuler, Plus, Rocket, Slack, Trash, Twitch, Twitter, UserPlus, Users, X, Youtube } from 'lucide-react'
import { Godot, Unity, Unreal } from '@/components/icons/create'
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
import { usePage } from '@inertiajs/react'
import { Form } from '@inertiajs/react'
import { ArrowUpRightIcon } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from '@/components/ui/spinner'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import SearchBar from '@/components/ui/search-bar'
import { Combobox, Option } from '@/components/ui/combobox'
import { Label } from '@/components/ui/label'
import axios from 'axios'

type ProfileTab = NavItem & {key: string, className?: string}

function RenderMultilineText({ text } : { text: string}) {
    const paragraphs = text.split('\n');

    return <>
    {
        paragraphs.map((para) => <p className="mb-2">{para}</p>)        
    }
    </>
}

function EditLocation({ defaultValue } : { defaultValue?: string}) {

    const [options, setOptions] = useState<Option[]>([])

    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all?fields=name,flag')
            .then(({data}) => {
                const opts = data.map(({name, flag} : { name: { common: string }, flag: string}) => {
                    return { name: name.common, flag }
                }).sort((a: {name: string}, b: {name: string}) => a.name.localeCompare(b.name))
                .filter(({name} : {name: string}) => name !== 'Israel') // filter out fake countries
                .map(({ name, flag } : { name: string, flag: string }) => {
                    return { label: flag + ' ' + name, value: name }
                })
                setOptions([{label: "Not selected", value: ""}, ...opts])
            })
    }, [])
    return <Combobox placeholder="Not selected" defaultValue={defaultValue ?? ""} name="country" items={options} containerClassName="w-64" contentClassName="w-64" />
}

function CreateTeamForm () {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">Create a new team</Button>
            </DialogTrigger>
            
                <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Team</DialogTitle>
                            <DialogDescription>
                                Add a name a description for your team. 
                                You can add more details after creation.
                            </DialogDescription>
                        </DialogHeader>
                        <Form 
                            className="grid gap-4"
                            errorBag="newTeam"
                            action={store()}
                            options={{
                                preserveScroll: true,
                            }}
                        >
                            {({ errors }) => (
                                <>
                                    <div className="grid gap-4">
                                        <Field>
                                            <FieldLabel htmlFor="name">Team Name</FieldLabel>
                                            <Input tabIndex={1} name="name" id="name" autoComplete="off" />
                                            { <FieldDescription className="text-destructive-foreground">{errors?.name}</FieldDescription> }
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="description">Team Description</FieldLabel>
                                            <Textarea tabIndex={2} name="description" className="h-28 min-h-28 max-h-28" id="description" placeholder="" />
                                            { <FieldDescription className="text-destructive-foreground">{errors?.description}</FieldDescription> }
                                        </Field>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button className="cursor-pointer" tabIndex={3} variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button onClick={() => console.log('something')} className="cursor-pointer" tabIndex={4} type="submit">Save changes</Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                </DialogContent>
            
        </Dialog>
    )
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
                        <CreateTeamForm />
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

function NoProjects() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <PencilRuler />
                </EmptyMedia>
                <EmptyTitle>No projects</EmptyTitle>
                <EmptyDescription>
                    You don&apos;t have any projects. You are free to create one.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2"> 
                    <Button className="cursor-pointer">Create a new project</Button>
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

export default function Profile({ user, tab = 'showcase', teams } : { user: User, tab: string, teams: Team[] }) {

    const [loading, setLoading] = useState(false)

    const [editing, setEditing] = useState<string|false>(false)

    const [favGames, setFavGames] = useState(user.meta?.fav_games ?? [])

    const [currentSection, setCurrentSection] = useState('overview')

    const sectionLabels = [
        {label: 'Overview', name: 'overview'},
        {label: 'Skills & tools', name: 'skills'},
        {label: 'Personal & releases', name: 'projects'},
        {label: 'Contact & socials', name: 'contact'},
    ]

    const { auth } = usePage<SharedData>().props

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Profile',
            href: show({ user: user.username }).url,
        },
    ];

    const titles = [
        'Software Engineer',
        'Full Stack Developer',
        'Backend Developer'
    ]

    const tabs: ProfileTab[] = [
        { title: "Showcase", href: show({ user: user.username }), key: "showcase"},
        // { title: "Activity", href: "/", key: "activity"},
        { title: "About", href: about({ user: user.username }), key: "about" },
        { title: "Teams / Studios", href: showTeams({ user: user.username }).url, key: "teams"},
    ]

    if ( auth.user?.id === user.id ) {
        tabs.push({ title: "Invite", href: "/", key: "invite", icon: Mail, className: "ml-2 border" })
    } else {
        tabs.push({ title: "Add to team", href: "/", key: "invite", icon: UserPlus, className: "ml-2 border" })
    }

    const isPro = true
    
    function EditButton({ disabled = false, what } : { disabled?: boolean, what: string }) {
        return auth.user?.id === user.id && editing !== what 
            ? <Button
                onClick={() => {
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
                    : <div className="flex size-full flex-col gap-6 mx-2 md:mx-8">
                        <ItemGroup className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {teams.map((team) => (
                            <Item key={team.id} variant="outline" asChild role="listitem">
                                <Link href={showTeam({
                                    team: team.slug
                                })}>
                                    <ItemMedia variant="image">
                                        <div className="w-16 h-16 relative">
                                            <PlaceholderPattern className="absolute rounded-full inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                        </div>
                                    </ItemMedia>
                                    <ItemContent className="h-full">
                                        <ItemTitle className="line-clamp-1">
                                            {team.name}
                                        {/* <span className="text-muted-foreground">STH</span> */}
                                        </ItemTitle>
                                        <ItemDescription className="text-ellipsis">{team.description ?? "-"}</ItemDescription>
                                    </ItemContent>
                                    <ItemContent className="flex-none text-center">
                                        <ItemDescription>
                                            {team.users_count} 
                                            <span className="ml-1.5">{team.users_count > 1 ? "members" : "member"}</span>
                                        </ItemDescription>
                                    </ItemContent>
                                </Link>
                            </Item>
                            ))}
                        </ItemGroup>
                        {/* The teams.length key removes the CreateTeamForm when it changes */}
                        <div key={teams.length} className="flex justify-end">
                            <CreateTeamForm />
                        </div>
                    </div>
                )
            case 'about':
                return (
                    <div className="w-full flex border bg-neutral-50 dark:bg-neutral-900 mx-8 rounded-lg">
            <div className="w-1/4 flex flex-col p-2 gap-2">
                <h2 className="text-xl font-bold mx-2 mt-2 mb-6">About</h2>
                
                {
                    sectionLabels.map(({label, name}) => <div 
                        key={name}
                        onClick={() => setCurrentSection(name)} 
                        className={cn(
                            "font-medium py-1 px-2 rounded",
                            (name == currentSection) ? "bg-accent font-bold" : "cursor-pointer hover:bg-accent" 
                        )}
                    >
                        {label}
                    </div>)
                }
            </div>
            <Separator orientation="vertical"  />
            <div className="w-3/4 p-4 flex flex-col gap-8">
            {
                currentSection == 'overview' && (
                    <>
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-2 w-full">
                                <h3 className="font-bold">Status</h3>
                                { editing === 'status' 
                                    ? <Form
                                        errorBag="userInfo"
                                        action={updateUser({ user: user.id })}
                                        options={{ 
                                            preserveScroll: true,
                                            onSuccess: () => setEditing(false)
                                        }} 
                                        className="flex grow flex-col gap-2"
                                    >
                                    {
                                        ({ errors }) => (
                                            <>
                                                <Input type="hidden" name="field" value="status" />
                                                <Input autoFocus defaultValue={user.status ?? ""} name="status" maxLength={50} className="dark:bg-background bg-white relative -left-0.5" />
                                                <FieldDescription className="text-destructive-foreground">{errors?.status}</FieldDescription>

                                                <div className="flex gap-2">
                                                    <Button
                                                        type="submit" 
                                                        className="cursor-pointer text-neutral-900 bg-neutral-200 hover:bg-[#e1e1e1] dark:hover:bg-neutral-100" 
                                                        size="sm"
                                                    >
                                                        Submit
                                                    </Button>
                                                    <Button className="cursor-pointer" onClick={() => setEditing(false)} variant="destructive" size="sm">Cancel</Button>
                                                </div>
                                            </>
                                        )
                                    }
                                    </Form>
                                    : <div>{user.status ?? "--"}</div>
                                }
                            </div>
                            <EditButton what="status" />
                        </div>
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-2 w-full">
                                <h3 className="font-bold">Bio</h3>
                                { editing === 'bio' 
                                    ? <Form
                                        errorBag="userInfo"
                                        action={updateUser({ user: user.id })}
                                        options={{ 
                                            preserveScroll: true,
                                            onSuccess: () => setEditing(false)
                                        }} 
                                        className="flex grow flex-col gap-2"
                                    >
                                    {
                                        ({ errors }) => (
                                            <>
                                                <Input type="hidden" name="field" value="bio" />
                                                <Textarea autoFocus defaultValue={user.bio ?? ""} name="bio" maxLength={500} className="dark:bg-background bg-white relative -left-0.5 min-h-30" />
                                                {/* <Input autoFocus defaultValue={user.bio ?? ""} name="bio" maxLength={50} className="dark:bg-background bg-white relative -left-0.5" /> */}
                                                <FieldDescription className="text-destructive-foreground">{errors?.bio}</FieldDescription>

                                                <div className="flex gap-2">
                                                    <Button
                                                        type="submit" 
                                                        className="cursor-pointer text-neutral-900 bg-neutral-200 hover:bg-[#e1e1e1] dark:hover:bg-neutral-100" 
                                                        size="sm"
                                                    >
                                                        Submit
                                                    </Button>
                                                    <Button className="cursor-pointer" onClick={() => setEditing(false)} variant="destructive" size="sm">Cancel</Button>
                                                </div>
                                            </>
                                        )
                                    }
                                    </Form>
                                    : <div>{user.bio ? <RenderMultilineText text={user.bio} /> : "--"}</div>
                                }
                            </div>
                            <EditButton what="bio" />
                        </div>
                        {
                            editing === 'location'
                            ? (
                                <Form
                                    errorBag="userInfo" 
                                    className="flex flex-col gap-1"
                                    action={updateUser({ user: user.id })}
                                    options={{ 
                                        preserveScroll: true,
                                        onSuccess: () => setEditing(false)
                                    }}
                                >
                                {
                                    ({ errors }) => (<>    
                                    <Input type="hidden" name="field" value="location" />
                                    <h3 className="font-bold">Location</h3>
                                    <div className="w-full flex gap-2 -ml-1 mt-2">
                                        <div className="flex flex-col gap-2">
                                            <Label className="ml-1">City</Label>
                                            <Input defaultValue={user.location?.city} name="city" className="dark bg-background" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="ml-1">Country</Label>
                                            <EditLocation defaultValue={user.location?.country} />
                                        </div>
                                    </div>
                                    <FieldDescription className="text-destructive-foreground">{errors.city}</FieldDescription>
                                    <FieldDescription className="text-destructive-foreground">{errors.country}</FieldDescription>
                                    <div className="flex gap-2 mt-1.5">
                                        <Button
                                            type="submit" 
                                            className="cursor-pointer text-neutral-900 bg-neutral-200 hover:bg-[#e1e1e1] dark:hover:bg-neutral-100" 
                                            size="sm"
                                        >
                                            Submit
                                        </Button>
                                        <Button className="cursor-pointer" onClick={() => setEditing(false)} variant="destructive" size="sm">Cancel</Button>
                                    </div>
                                </>)}
                                </Form>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={19} /> {
                                            user.location
                                            ? <>Lives in <span className="font-bold">{renderLocation(user.location)}</span></>
                                            : <span className="italic">Location not specified</span>
                                        }
                                    </div>
                                    <EditButton what="location" />
                                </div>
                            )
                        }
                        
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center min-h-10">
                                <h3 className="font-bold flex items-center gap-2"><Gamepad2 size={20} /> Favorite games</h3>
                                <EditButton what="fav_games" />
                            </div>
                            {
                                editing === 'fav_games'
                                    ? (
                                        <Form
                                            errorBag="userInfo" 
                                            className="flex flex-col gap-1"
                                            action={updateUser({ user: user.id })}
                                            options={{ 
                                                preserveScroll: true,
                                                onSuccess: () => setEditing(false)
                                            }}
                                        >
                                        {
                                            ({ errors }) => (<>    
                                                <Input type="hidden" name="field" value="fav_games" />
                                                <div className="flex flex-col gap-2">
                                                    <ul>
                                                    {
                                                        favGames.map((game : string, index: number) => (
                                                            <li className="flex gap-1.5 mb-1">
                                                                <Input
                                                                    value={game}
                                                                    onChange={({target}) => setFavGames((v) => {
                                                                        const temp = [...v]
                                                                        temp[index] = target.value
                                                                        return temp
                                                                    })}
                                                                    name="fav_games[]"
                                                                    className="bg-background"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    className="cursor-pointer"
                                                                    onClick={() => {setFavGames(() => favGames.filter((_, i) => i !== index))}}
                                                                    variant="ghost" 
                                                                    size="icon"
                                                                >
                                                                    <Trash />
                                                                </Button>
                                                            </li>
                                                        ))
                                                    }
                                                    </ul>
                                                </div>
                                                <FieldDescription className="text-destructive-foreground">{errors.fav_games}</FieldDescription>
                                                <div className="flex justify-between mt-1.5">
                                                    <Button className="cursor-pointer" type="button" onClick={() => setFavGames([...favGames, ''])} variant="ghost" size="sm"><Plus />Add another</Button>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="submit" 
                                                            className="cursor-pointer text-neutral-900 bg-neutral-200 hover:bg-[#e1e1e1] dark:hover:bg-neutral-100" 
                                                            size="sm"
                                                        >
                                                            Submit
                                                        </Button>
                                                        <Button 
                                                            className="cursor-pointer" 
                                                            onClick={() => {
                                                                setFavGames(user.meta?.fav_games ?? [])
                                                                setEditing(false)
                                                            }} 
                                                            variant="destructive" 
                                                            size="sm"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>)
                                        }
                                        </Form>
                                    ) : (
                                        favGames.length > 1 || (favGames.length > 0 && favGames[0] !== "")  ? <ul className="flex gap-2">
                                        {
                                            favGames.map((game, index) => (
                                                index == (favGames.length - 1) ? <li>{game}</li> : <li>{game},</li>
                                            ))
                                        }
                                        </ul> : <span>--</span>
                                    )
                            }
                        </div>
                    </>
                )
            }
            {
                currentSection == 'skills' && (
                    <>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-0">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold flex items-center gap-2"><Lightbulb size={19} /> Skills</h3>
                                    <EditButton />
                                </div>
                                <span className="text-xs">Roles that I have experience working in</span>
                            </div>
                            <div className="flex gap-2">
                                <Badge className="text-sm">Level Designer</Badge>
                                <Badge className="text-sm">Gameplay Programmer <X /></Badge>
                            </div>
                            <SearchBar searchOptions={[
                                {
                                    heading: 'Heading1',
                                    options: [
                                        {label: 'Xabel1', value: 1},
                                        {label: 'xabel2', value: 2},
                                        {label: 'Label3', value: 3},
                                    ]
                                },
                                {
                                    heading: 'Heading2',
                                    options: [
                                        {label: 'Xabel4', value: 1},
                                        {label: 'xabel5', value: 2},
                                        {label: 'Label6', value: 3},
                                    ]
                                }
                                
                            ]} />
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold flex items-center gap-2"><Hammer size={18} /> Tools</h3>
                                <EditButton />
                            </div>
                            <div className="flex gap-1.5">
                                <div className="size-16 rounded-md flex justify-center items-center bg-neutral-100 border dark:border-neutral-700  dark:bg-neutral-900">
                                    <Github size={25} />
                                </div>
                                <div className="size-16 rounded-md flex justify-center items-center bg-neutral-100 border dark:border-neutral-700  dark:bg-neutral-900">
                                    <Gitlab size={27} />
                                </div>
                                {/* <div className="size-16 rounded-md flex justify-center items-center bg-neutral-100 border dark:border-neutral-700  dark:bg-neutral-900">
                                    <Dribbble  size={25} />
                                </div> */}
                                <div className="size-16 rounded-md flex justify-center items-center bg-neutral-100 border dark:border-neutral-700  dark:bg-neutral-900">
                                    <Godot strokeWidth={1.1} size={39} />
                                </div>
                                <div className="size-16 rounded-md flex justify-center items-center bg-neutral-100 border dark:border-neutral-700  dark:bg-neutral-900">
                                    <Unity strokeWidth={1.5} size={32} />
                                </div>
                                <div className="size-16 rounded-md flex justify-center items-center bg-neutral-100 border dark:border-neutral-700  dark:bg-neutral-900">
                                    <Unreal strokeWidth={1.5} size={28} />
                                </div>
                                <div className="size-16 rounded-md flex justify-center items-center bg-neutral-100 border dark:border-neutral-700  dark:bg-neutral-900">
                                    <Figma size={23} />
                                </div>
                            </div>
                            {/* <SearchBar searchOptions={[]} /> */}
                        </div>
                    </>
                )
            }
            {
                currentSection == 'projects' && (
                    <div className="w-full flex flex-col">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-0">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold flex items-center gap-2"><PencilRuler size={18} />Projects</h3>
                                    <EditButton disabled={true} />
                                </div>
                                <span className="text-xs">Current game development projects you are working on that have not been released</span>
                            </div>
                            <NoProjects />
                        </div>
                        <Separator className="mb-5" />
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-0">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold flex items-center gap-2"><Rocket size={18} />Releases</h3>
                                    <EditButton disabled={true} />
                                </div>
                                <span className="text-xs">Completed game titles by you that are available to the public</span>
                            </div>
                            <NoReleases />
                        </div>
                    </div>
                )
            }
            {
                currentSection == 'contact' && (
                    <div className="w-full flex justify-between">
                        <div className="flex flex-col gap-10">
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold flex items-center gap-2">Contact</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AtSign size={18} /><span>{"ishteharhussain@gmail.com"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe size={18} /><span>{"https://www.ishteharhussain.com"}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold flex items-center gap-2">Socials</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Linkedin size={18} /><span>{"/in/ishteharhussain"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Instagram size={18} /><span>{"ishteharhussain"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Dribbble size={18} /><span>{"Kreatank"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Youtube size={18} /><span>{"@XEQTIONR"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Facebook size={18} /><span>{"xeqtionr"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Twitter size={18} /><span>{"@XEQTIONR"}</span>
                                </div>
                            </div>
                            {/* <EditButton /> */}
                        </div>
                        <EditButton />
                    </div>
                )
            }
            </div>
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
        <AppLayout maxWidth='md:max-w-7xl' breadcrumbs={breadcrumbs}>
            <Head title="Profile" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="h-full md:h-[400px] flex gap-4 justify-between rounded-xl border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="w-full relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                </div>
                <div className="w-full relative -top-22 md:-top-28 -mb-22 md:-mb-28 flex flex-col gap-8">
                    <div className="w-36 sm:w-44 md:w-48 ml-[50%] -translate-x-1/2 md:translate-x-0 md:ml-12 rounded-full aspect-square relative border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute rounded-full inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="md:mx-8">
                        <div className="w-full flex justify-between items-center mb-2">
                            <div className="text-2xl sm:text-5xl font-bold flex items-center gap-4 max-w-4/5">
                                {user.name}
                                {isPro && <span className="text-sm bg-primary text-background px-2 py-0.5 rounded">PRO</span>}
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="hidden lg:inline mr-3 text-sm">Let's build something together</span>
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
                            titles.map((title) => (
                                <span className="bg-neutral-100 dark:bg-neutral-900 text-neutral-500 px-4 py-2 rounded-full font-semibold">{title}</span>
                            ))
                        }
                        </div>
                        <div className="w-full mt-8">
                            <h2 className="font-semibold text-2xl">Bio</h2>
                            <p className="mt-4 text-lg">
                                I'm a full-stack developer and I'm interested in joining a team to start a new project.
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
                <div className="w-full relative h-full md:min-h-[50vh] flex overflow-hidden border-sidebar-border/70 dark:border-sidebar-border">
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
