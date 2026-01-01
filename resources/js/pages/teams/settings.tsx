import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/app-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import axios from 'axios'
import { show } from '@/routes/teams'
import { show as showJobPosting } from "@/routes/opportunities"
import { show as showUser } from '@/routes/users'
import { show as showProject } from '@/routes/projects'
import { show as showPost } from '@/routes/posts'
import { index as membersIndex } from '@/routes/teams/users'
import { index as projectsIndex } from '@/routes/teams/projects'
import { index as jobsIndex } from '@/routes/teams/opportunities'
import { Opportunity, NavItem, Project, ProjectMember, Team, type BreadcrumbItem, Activity } from '@/types'
import { Head, Link } from '@inertiajs/react'
import { Camera, Eraser, Globe, MapPin, Pencil, PencilRuler, Instagram, Sparkles, UserPlus, Lightbulb, BriefcaseBusiness, Settings, Image } from 'lucide-react'
import { Facebook, Twitter, Twitch, Youtube } from '@/components/icons/svgs'
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
import OpportunityList from '@/components/opportunity-list'
import Step from '@/components/step'
import GridCard from '@/components/grid-card'
import ProjectGridCard from '@/components/project-grid-card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

type ProfileTab = NavItem & {key: string, className?: string}


export default function TeamProfile({ 
    team, 
} : {
    team: Team 
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Edit Team',
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
    
    return (
        <AppLayout maxWidth='md:max-w-11xl' maxHeaderWidth='md:max-w-10xl' breadcrumbs={breadcrumbs}>
            <Head title="Team Settings" />

            <div className="w-full max-w-10xl px-4 mx-auto flex flex-col mt-12">
                {/* <h2 className="font-medium text-sm">{team.name}</h2> */}
                <div className='flex items-center gap-3'>
                    <div className='size-7 bg-foreground flex justify-center items-center rounded-full'>
                        <Settings className="stroke-background" size={18} />
                    </div>
                    <h1 className="font-bold text-2xl">Settings</h1>
                </div>
                <div className='flex flex-col w-full'>
                    <div className='w-full flex gap-10 mt-8 font-semibold text-sm'>
                        <div className=' border-b-2 border-foreground'>
                            <div className='size-full rounded p-3 hover:bg-dim'>General</div>
                        </div>
                        <div className=''>
                            <div className='size-full rounded p-3 hover:bg-dim'>Members</div>
                        </div>
                        <div className=''>
                            <div className='size-full rounded p-3 hover:bg-dim'>Integrations</div>
                        </div>
                    </div>
                    <Separator />
                </div>
            </div>
        </AppLayout>
    );
}
