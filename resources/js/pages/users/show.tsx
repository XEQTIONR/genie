import { Button } from '@/components/ui/button'
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern'
import AppLayout from '@/layouts/app-layout'
import { show, about } from '@/routes/users'
import { show as showTeam } from '@/routes/teams'
import { store } from '@/actions/App/Http/Controllers/TeamController'
import { index as showTeams } from '@/routes/users/teams'
import { NavItem, Team, User, type BreadcrumbItem } from '@/types'
import { Head, Link } from '@inertiajs/react'
import { AtSign, Dribbble, Drill, EllipsisVertical, Facebook, Figma, Gamepad2, Github, Gitlab, GraduationCap, House, Instagram, Lightbulb, Linkedin, Mail, MapPin, Pencil, PencilRuler, Slack, SquarePen, Twitch, Twitter, UserPlus, Users, Youtube } from 'lucide-react'
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
import { useState } from 'react'
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

type ProfileTab = NavItem & {key: string, className?: string}

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
        <>
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
        </>
    )
}



export default function Profile({ user, tab = 'showcase', teams } : { user: User, tab: string, teams: Team[] }) {

    const [loading, setLoading] = useState(false)

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
        { title: "Activity", href: "/", key: "activity"},
        { title: "About", href: about({ user: user.username }), key: "about" },
        { title: "Teams / Studios", href: showTeams({ user: user.username }).url, key: "teams"},
    ]

    if ( auth.user?.id === user.id ) {
        tabs.push({ title: "Invite", href: "/", key: "invite", icon: Mail, className: "ml-2 border" })
    } else {
        tabs.push({ title: "Add to team", href: "/", key: "invite", icon: UserPlus, className: "ml-2 border" })
    }

    const isPro = true

    function About() {
        
        const [currentSection, setCurrentSection] = useState('overview')
        const sectionLabels = [
            {label: 'Overview', name: 'overview'},
            {label: 'Skills & tools', name: 'skills'},
            {label: 'Personal projects', name: 'projects'},
            {label: 'Contact & socials', name: 'contact'},
        ]

        return <div className="w-full flex border bg-neutral-50 dark:bg-neutral-900 mx-8 rounded-lg">
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
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold">Bio</h3>
                                <EditButton />
                            </div>
                            <div>I'm a full-stack developer and I'm interested in joining a team to start a new project.</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <MapPin size={19} /> Lives in <span className="font-bold">Dhaka, Bangladesh</span>
                            </div>
                            <EditButton />
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold flex items-center gap-2"><Gamepad2 size={20} /> Favorite games</h3>
                                <EditButton />
                            </div>
                            <ul className="flex gap-2">
                                <li>Street Fighter II,</li>
                                <li>Doom,</li>
                                <li>Unreal Tournament 2004</li>
                            </ul>
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
                                <h3 className="font-bold flex items-center gap-2"><Drill size={19} /> Tools</h3>
                                <EditButton />
                            </div>
                            <ul className="flex gap-2">
                                <li>Street Fighter II,</li>
                                <li>Doom,</li>
                                <li>Unreal Tournament 2004</li>
                            </ul>
                        </div>
                    </>
                )
            }
            {
                currentSection == 'projects' && (
                    <>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold flex items-center gap-2"><PencilRuler size={19} />Projects</h3>
                                <EditButton />
                            </div>
                            <div>I'm a full-stack developer and I'm interested in joining a team to start a new project.</div>
                        </div>
                    </>
                )
            }
            {
                currentSection == 'contact' && (
                    <>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <AtSign size={18} /><span className="font-bold">{user.email}</span>
                            </div>
                            <EditButton />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Linkedin size={18} /><span className="font-bold">{"/in/ishteharhussain"}</span>
                            </div>
                            <EditButton />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Dribbble size={18} /><span className="font-bold">{"/in/ishteharhussain"}</span>
                            </div>
                            <EditButton />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Instagram size={18} /><span className="font-bold">{"/in/ishteharhussain"}</span>
                            </div>
                            <EditButton />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Twitter size={18} /><span className="font-bold">{"/in/ishteharhussain"}</span>
                            </div>
                            <EditButton />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Twitch size={18} /><span className="font-bold">{"/in/ishteharhussain"}</span>
                            </div>
                            <EditButton />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Facebook size={18} /><span className="font-bold">{"/in/ishteharhussain"}</span>
                            </div>
                            <EditButton />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Youtube size={18} /><span className="font-bold">{"/in/ishteharhussain"}</span>
                            </div>
                            <EditButton />
                        </div>
                        {/* <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Github size={18} /><span className="font-bold">{"/in/ishteharhussain"}</span>
                            </div>
                            <EditButton />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Gitlab size={18} /><span className="font-bold">{"/in/ishteharhussain"}</span>
                            </div>
                            <EditButton />
                        </div> */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Slack size={18} /><span className="font-bold">{"/in/ishteharhussain"}</span>
                            </div>
                            <EditButton />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Figma size={18} /><span className="font-bold">{"/in/ishteharhussain"}</span>
                            </div>
                            <EditButton />
                        </div>

                        {/* <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold flex items-center gap-2"><Gamepad2 size={20} /> Favorite games</h3>
                                <EditButton />
                            </div>
                            <ul className="flex gap-2">
                                <li>Street Fighter II,</li>
                                <li>Doom,</li>
                                <li>Unreal Tournament 2004</li>
                            </ul>
                        </div> */}
                    </>
                )
            }
            </div>
        </div>
    }
    
    function EditButton() {
        return auth.user?.id === user.id 
            ? <Button className="cursor-pointer" size="icon" variant="ghost"><Pencil /></Button>
            : null
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
                    <About />
                )
            default: 
                return null
        }
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
                        <div className="w-full flex justify-between items-center">
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
                        <div className="flex items-center gap-2 mt-2 text-neutral-400 font-medium"><MapPin size={16} /> Dhaka, Bangladesh</div>
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
    );
}
