import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/app-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import axios from 'axios'
import { show } from '@/routes/teams'
import { index as projectsIndex } from '@/routes/teams/projects'
import { edit as editTeam } from '@/routes/teams'
import { members as editMembers } from '@/routes/teams/edit'
import { index as jobsIndex } from '@/routes/teams/opportunities'
import { Opportunity, NavItem, Project, ProjectMember, Team, type BreadcrumbItem, Activity } from '@/types'
import { Head, Link } from '@inertiajs/react'
import { Camera, Eraser, Globe, MapPin, Pencil, PencilRuler, Instagram, Sparkles, UserPlus, Lightbulb, BriefcaseBusiness, Settings, Image, ChevronRight, BadgeCheck, Users, LinkIcon, Trash, X, Trash2, EllipsisVertical } from 'lucide-react'
import { Facebook, Twitter, Twitch, Youtube } from '@/components/icons/svgs'

import { useInitials } from '@/hooks/use-initials';
import { Spinner } from '@/components/ui/spinner'
import { useState } from 'react'

import { Input } from "@/components/ui/input"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Textarea } from '@/components/ui/textarea'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Combobox } from '@/components/ui/combobox'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type ProfileTab = NavItem & {key: string, className?: string}


export default function TeamSettings({ 
    team,
    tab, 
} : {
    team: Team
    tab: string 
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Edit Team',
            href: '/',
        },
    ];

    const getInitials = useInitials();

    const tabs: ProfileTab[] = [
        // { title: "Showcase", href: show({ user: user.username }), key: "showcase"},
        { title: "General", href: editTeam(team), key: "general"},
        { title: "Members", href: editMembers(team), key: "members" },
        { title: "Opportunities", href: projectsIndex({ team: team.slug }), key: "jobs" },
    ]

    const [currentTab, setCurrentTab] = useState(tab)
    
    return (
        <AppLayout maxWidth='md:max-w-11xl' maxHeaderWidth='md:max-w-10xl' breadcrumbs={breadcrumbs}>
            <Head title="Team Settings" />
            <div className='flex items-center gap-1.5 my-3 w-full max-w-10xl px-4 mx-auto'>
                <Avatar variant="square" className="size-8">
                    <AvatarImage src={team.avatar} />
                    <AvatarFallback variant="square" className="text-xs">{getInitials(team.name)}</AvatarFallback>
                </Avatar>
                <h2 className="font-medium">{team.name}</h2>
                {/* <div className='size-7 bg-foreground flex justify-center items-center rounded-full'>
                    <Settings className="stroke-background" size={18} />
                </div> */}
            </div>
            <div className="w-full max-w-10xl -\h-screen px-4 mx-auto flex flex-col">
                <div className='w-full h-full grow flex'>
                    <aside className='w-xs border-r flex flex-col gap-3'>
                        <h1 className="font-semibold text-xl">Settings</h1>
                        <div className="flex w-full max-w-md flex-col gap-1 pr-3">
                            {
                                tabs.map(t => (
                                    <Button size="sm" className={cn('w-full justify-start', {
                                        'bg-muted' : (currentTab == t.key)
                                    })} variant="ghost">
                                        {/* <Settings /> */}
                                        <Link href={t.href}>
                                            {t.title}
                                        </Link>
                                    </Button>
                                ))
                            }
                        </div>
                    </aside>
                    {
                        currentTab === 'general' && (
                            <div className='w-full px-4 flex flex-col gap-5 items-start'>
                                <FieldGroup className="max-w-lg">
                                    <FieldGroup>
                                        <Field className="gap-2">
                                            <FieldLabel>Team Name *</FieldLabel>
                                            <Input onChange={({target}) => {
                                                // setData('name', target.value)
                                            }} name="title" />
                                            <FieldDescription className="text-red-600 dark:text-red-400">
                                                {/* { errors?.name } */}
                                            </FieldDescription>
                                        </Field>
                                        <Field className="gap-2">
                                            <FieldLabel>Description</FieldLabel>
                                            <Textarea onChange={({target}) => {
                                                // setData('description', target.value)
                                            }} name="description" className="h-28" />
                                            <FieldDescription className="text-red-600 dark:text-red-400">
                                                {/* { errors?.description } */}
                                            </FieldDescription>
                                        </Field>
                                        
                                        <FieldSet>
                                            <FieldLegend variant="label">Location</FieldLegend>
                                            <FieldGroup>
                                                <div className="flex flex-col md:flex-row gap-4">
                                                    <Field className='w-full'>
                                                        <FieldLabel>City</FieldLabel>
                                                        <Input 
                                                            // value={inputCity} 
                                                            // onChange={(e) => setInputCity(e.target.value)}
                                                        />
                                                    </Field>
                                                    <Field className='w-full'>
                                                        <FieldLabel>Country</FieldLabel>
                                                        <Combobox
                                                            // defaultValue={inputCountry} 
                                                            // onSelectValue={(value) => setInputCountry(value)} 
                                                            items={[]} 
                                                        />
                                                    </Field>
                                                </div>
                                            </FieldGroup>
                                        </FieldSet>
                                        
                                    </FieldGroup>
                                    {/* <Button>Save</Button> */}
                                    <FieldSeparator className='max-w-lg' />

                                    <FieldGroup className="max-w-lg gap-2">
                                        <FieldLabel>Links</FieldLabel>
                                        <Field className="gap-2">
                                            <InputGroup>
                                                <InputGroupInput onChange={({target}) => {
                                                    // setData('name', target.value)
                                                }} name="title" />

                                                <InputGroupAddon>
                                                    <Facebook />
                                                </InputGroupAddon>
                                                <InputGroupAddon align="inline-end">
                                                    <Trash2 className='hover:stroke-foreground cursor-pointer' />
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <InputGroup>
                                                <InputGroupInput onChange={({target}) => {
                                                    // setData('name', target.value)
                                                }} name="title" />

                                                <InputGroupAddon>
                                                    <Twitter />
                                                </InputGroupAddon>
                                                <InputGroupAddon align="inline-end">
                                                    <Trash2 />
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <InputGroup>
                                                <InputGroupInput onChange={({target}) => {
                                                    // setData('name', target.value)
                                                }} name="title" />

                                                <InputGroupAddon>
                                                    <Twitch />
                                                </InputGroupAddon>
                                                <InputGroupAddon align="inline-end">
                                                    <Trash2 />
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <InputGroup>
                                                <InputGroupInput onChange={({target}) => {
                                                    // setData('name', target.value)
                                                }} name="title" />

                                                <InputGroupAddon>
                                                    <Youtube />
                                                </InputGroupAddon>
                                                <InputGroupAddon align="inline-end">
                                                    <Trash2 />
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <InputGroup>
                                                <InputGroupInput onChange={({target}) => {
                                                    // setData('name', target.value)
                                                }} name="title" />

                                                <InputGroupAddon>
                                                    <LinkIcon />
                                                </InputGroupAddon>
                                                <InputGroupAddon align="inline-end">
                                                    <Trash2 />
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </Field>
                                    </FieldGroup>
                                </FieldGroup>
                                <Button size="sm">Save</Button>
                            </div>
                        )
                    }
                    {
                        currentTab === 'members' && (
                            <div className='w-full px-4 flex flex-col gap-5 items-start'>
                                <FieldGroup className="">
                                    <FieldGroup>
                                        <Field className="gap-2">
                                            <FieldLabel>Contributors</FieldLabel>
                                            {/* <Table>
                                                <TableBody>
                                                {
                                                    team.users?.map(user => (
                                                        <TableRow className='hover:bg-transparent'>
                                                            <TableCell className='w-6'>
                                                                <Avatar className='size-6'>
                                                                    <AvatarImage src={user.avatar} />
                                                                    <AvatarFallback>{ getInitials(user.name) }</AvatarFallback>
                                                                </Avatar>
                                                            </TableCell>
                                                            <TableCell>{user.name}</TableCell>
                                                            <TableCell className='w-6'>
                                                                <Button type='button' variant="ghost" size="icon">
                                                                    <EllipsisVertical />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                                </TableBody>
                                            </Table> */}
                                            <div className='flex w-full gap-4'>
                                                {
                                                    team.users?.map(user => (
                                                        <HoverCard>
                                                            <HoverCardTrigger>
                                                                <Avatar className='size-10 cursor-pointer'>
                                                                    <AvatarImage src={user.avatar} />
                                                                    <AvatarFallback>{ getInitials(user.name) }</AvatarFallback>
                                                                </Avatar>
                                                            </HoverCardTrigger>
                                                            <HoverCardContent className='min-w-sm'>
                                                                <div className='flex flex-col'>
                                                                    <div className='flex justify-between items-start'>
                                                                        <div className='flex gap-2'>
                                                                            <Avatar className='size-8'>
                                                                                <AvatarImage src={user.avatar} />
                                                                                <AvatarFallback>{ getInitials(user.name) }</AvatarFallback>
                                                                            </Avatar>
                                                                            <div className='flex flex-col'>

                                                                            <h4 className="font-bold">{user.name}</h4>
                                                                            <span className="relative -top-1 text-sm">{user.username}</span>
                                                                            </div>
                                                                        </div>
                                                                        <Button type='button' variant="ghost" size="icon-sm">
                                                                            <EllipsisVertical />
                                                                        </Button>
                                                                    </div>
                                                                    
                                                                    <h5 className='text-xs font-semibold mt-3'>Roles</h5>
                                                                    <div className='flex flex-wrap text-xs my-3'>
                                                                        {
                                                                            user.pivot.roles.map((r) => <Badge variant="secondary">{r}</Badge>)
                                                                        }
                                                                    </div>

                                                                    <h5 className='text-xs font-semibold mt-3'>Permissions</h5>
                                                                    <div className='flex flex-wrap text-xs mt-3 gap-1.5'>
                                                                        {
                                                                            user.pivot.permissions.map((r) => <Badge variant="outline">{r}</Badge>)
                                                                        }
                                                                    </div>
                                                                    
                                                                </div>
                                                            </HoverCardContent>
                                                        </HoverCard>
                                                        
                                                    ))
                                                }
                                                
                                            </div>
                                        </Field>
                                    </FieldGroup>
                                </FieldGroup>
                                <Button size="sm">Save</Button>
                            </div>
                        )
                    }
                    
                </div>
                
                {/* <div className='flex flex-col w-full'>
                    <div className='w-full flex gap-10 mt-8 font-semibold text-sm'>
                        <div className=' border-b-2 border-foreground'>
                            <div className='size-full rounded py-3 hover:bg-dim'>General</div>
                        </div>
                        <div className=''>
                            <div className='size-full rounded py-3 hover:bg-dim'>Members</div>
                        </div>
                        <div className=''>
                            <div className='size-full rounded py-3 hover:bg-dim'>Integrations</div>
                        </div>
                    </div>
                    <Separator />
                </div>

                <div className="w-full">
                    <FieldGroup className="mb-10 max-w-lg">
                        <Field className="gap-2">
                            <FieldLabel>Team Name *</FieldLabel>
                            <Input onChange={({target}) => {
                                // setData('name', target.value)
                            }} name="title" />
                            <FieldDescription className="text-red-600 dark:text-red-400">
                                
                            </FieldDescription>
                        </Field>
                        <Field className="gap-2">
                            <FieldLabel>Description</FieldLabel>
                            <Textarea onChange={({target}) => {
                                // setData('description', target.value)
                            }} name="description" className="h-28" />
                            <FieldDescription className="text-red-600 dark:text-red-400">
                                
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </div> */}
            </div>
        </AppLayout>
    );
}
