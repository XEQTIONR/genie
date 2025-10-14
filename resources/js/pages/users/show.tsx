import { Button } from '@/components/ui/button'
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern'
import AppLayout from '@/layouts/app-layout'
import { show } from '@/routes/users'
import { show as showTeams } from '@/routes/users/teams'
import { NavItem, User, type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { EllipsisVertical, Mail, MapPin, UserPlus, Users } from 'lucide-react'
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

type ProfileTab = NavItem & {key: string, className?: string}


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
                <Button className="cursor-pointer">Create a new team</Button>
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

export default function Profile({ user, tab = 'showcase', teams } : { user: User, tab: string, teams: Array<string> }) {

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
        { title: "Teams / Studios", href: showTeams({ user: user.username }).url, key: "teams"},
        { title: "About", href: "/", key: "about" },
    ]

    if ( auth.user?.id === user.id ) {
        tabs.push({ title: "Invite", href: "/", key: "invite", icon: Mail, className: "ml-2 border" })
    } else {
        tabs.push({ title: "Add to team", href: "/", key: "invite", icon: UserPlus, className: "ml-2 border" })
    }

    const isPro = true

    return (
        <AppLayout maxWidth='md:max-w-7xl' breadcrumbs={breadcrumbs}>
            <Head title="Profile" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="h-full md:h-[400px] flex gap-4 justify-between rounded-xl border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="w-full relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                </div>
                <div className="w-full relative -top-14 md:-top-28 -mb-14 md:-mb-28 flex flex-col gap-8">
                    <div className="w-24 md:w-48 ml-4 md:ml-12 rounded-full aspect-square relative border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute rounded-full inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="md:mx-8">
                        <div className="w-full flex justify-between items-center">
                            <div className="text-2xl md:text-5xl font-bold flex items-center gap-4 max-w-4/5">
                                {user.name}
                                {isPro && <span className="text-sm bg-primary text-background px-2 py-0.5 rounded">PRO</span>}
                            </div>
                            <div className="flex gap-1 items-center">
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
                {/* <div className="flex justify-between"> */}
                    <div className="w-full relative h-full md:min-h-[50vh] flex items-center overflow-hidden rounded-xl border-sidebar-border/70 dark:border-sidebar-border">
                        {/* <NoTeams /> */}
                        {
                            loading 
                                ? <Spinner className="block mx-auto size-6" />
                                : (tab == 'teams' && teams.length == 0 && <NoTeams />)
                        }
                    </div>
                {/* </div> */}
                
            </div>
        </AppLayout>
    );
}
