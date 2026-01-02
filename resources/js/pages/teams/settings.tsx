import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/app-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import axios from 'axios'
import { update as updateTeam } from '@/routes/teams'
import {  show as jobsShow } from '@/routes/opportunities'
import { edit as editTeam } from '@/routes/teams'
import { members as editMembers, opportunities as editJobs } from '@/routes/teams/edit'
import { index as jobsIndex } from '@/routes/teams/opportunities'
import { Opportunity, NavItem, Project, ProjectMember, Team, type BreadcrumbItem, Activity } from '@/types'
import { Form, Head, Link } from '@inertiajs/react'
import { Camera, Eraser, Globe, MapPin, Pencil, PencilRuler, Instagram, Sparkles, UserPlus, Lightbulb, BriefcaseBusiness, Settings, Image, ChevronRight, BadgeCheck, Users, LinkIcon, Trash, X, Trash2, EllipsisVertical, Mail, Plus } from 'lucide-react'
import { Facebook, Twitter, Twitch, Youtube } from '@/components/icons/svgs'

import { useInitials } from '@/hooks/use-initials';
import { Spinner } from '@/components/ui/spinner'
import { useEffect, useState } from 'react'

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

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
        { title: "Opportunities", href: editJobs(team), key: "jobs" },
    ]

    const [currentTab, setCurrentTab] = useState(tab)
    const [locations, setLocations] = useState<{city?: string, country:string}[]>([])
    const [locationType, setLocationType] = useState('global')

    const [countryOptions, setCountryOptions] = useState<GroupedOptions>({})
        
    const [inputCity, setInputCity] = useState<string>("")
    const [inputCountry, setInputCountry] = useState<string>("")

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

                setCountryOptions({
                    None: [{label: "Not selected", value: ""}],
                    ...grouped
                })
            })
    }, [])
    
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
                            <Form 
                                action={updateTeam(team)} 
                                className='w-full px-4 flex flex-col gap-5 items-start'
                                transform={d => d}
                            >
                                <input type="hidden" name="field" value="general" />
                                <FieldGroup className="max-w-lg">
                                    <FieldGroup>
                                        <Field className="gap-2">
                                            <FieldLabel>Team Name</FieldLabel>
                                            <Input defaultValue={team.name} onChange={({target}) => {
                                                // setData('name', target.value)
                                            }} name="name" />
                                            <FieldDescription className="text-red-600 dark:text-red-400">
                                                {/* { errors?.name } */}
                                            </FieldDescription>
                                        </Field>
                                        <Field className="gap-2">
                                            <FieldLabel>Description</FieldLabel>
                                            <Textarea defaultValue={team.description} onChange={({target}) => {
                                                // setData('description', target.value)
                                            }} name="description" className="h-28" />
                                            <FieldDescription className="text-red-600 dark:text-red-400">
                                                {/* { errors?.description } */}
                                            </FieldDescription>
                                        </Field>
                                        
                                        <FieldSet>
                                            <FieldLegend variant="label">Location</FieldLegend>
                                            <RadioGroup 
                                                onValueChange={(value) => {
                                                    // setData('location_type', value)
                                                    // if (data.location_type === 'global') {
                                                    //     setData('locations', [])
                                                    // }
                                                    setLocationType(value)
                                                    if (value === 'global') {
                                                        setLocations([])
                                                    }
                                                }} 
                                                value={locationType}
                                            >
                                                <Field orientation="horizontal">
                                                    <RadioGroupItem value="global" />
                                                    <FieldLabel className="font-normal">
                                                        Worldwide
                                                    </FieldLabel>
                                                </Field>
                                                <Field orientation="horizontal">
                                                    <RadioGroupItem value="specific" />
                                                    <FieldLabel className="font-normal">
                                                        Sepecific locations
                                                    </FieldLabel>
                                                </Field>
                                            </RadioGroup>
                                        </FieldSet>
                                        {
                                            locationType === 'specific' &&
                                            <FieldSet className="w-full mt-4 gap-4">
                                                {
                                                    locations.length > 0 &&
                                                    <div className='w-full flex flex-wrap gap-2'>
                                                    { 
                                                        locations.map((l, idx) => {
                                                            return (
                                                                <Badge
                                                                    className="cursor-pointer" 
                                                                    key={idx}
                                                                    onClick={() => setLocations(locations.filter((_, i) => i !== idx))}
                                                                >
                                                                    {
                                                                        l.city ? (l.city + ', ' + l.country) : l.country
                                                                    } 
                                                                    <X />
                                                                </Badge>
                                                            )
                                                        })
                                                    }
                                                    </div>
                                                }
                                                <FieldDescription>Add Locations</FieldDescription>
                                                <div className="flex flex-col md:flex-row gap-4">
                                                    <Field className='w-full md:w-56'>
                                                        <FieldLabel>City</FieldLabel>
                                                        <Input 
                                                            value={inputCity} 
                                                            onChange={(e) => setInputCity(e.target.value)}
                                                        />
                                                    </Field>
                                                    <Field className='w-full md:w-56'>
                                                        <FieldLabel>Country</FieldLabel>
                                                        <Combobox
                                                            defaultValue={inputCountry} 
                                                            onSelectValue={(value) => setInputCountry(value)} 
                                                            items={countryOptions} 
                                                        />
                                                    </Field>
                                                </div>
                                                <Button
                                                    onClick={() => {
                                                        const regex = / +/g
                                                        const city = inputCity === "" ? undefined : inputCity.trim().replaceAll(regex, " ")
                                                        const idx = locations.findIndex((location) => location.city == city && location.country == inputCountry)

                                                        if (idx === -1 && inputCountry.length > 0) {
                                                            setLocations([...locations, { city: city, country: inputCountry }])
                                                        }

                                                        setInputCity("")
                                                    }} 
                                                    variant="secondary"
                                                    size="sm"
                                                    className="w-32 cursor-pointer"
                                                    type="button"
                                                >
                                                    <Plus />
                                                    Add location
                                                </Button>
                                            </FieldSet>
                                        }
                                        
                                    </FieldGroup>
                                    {/* <Button>Save</Button> */}
                                    <FieldSeparator className='max-w-lg' />

                                    <FieldGroup className="max-w-lg gap-2">
                                        <FieldLabel>Links</FieldLabel>
                                        <Field className="gap-2">
                                            <InputGroup>
                                                <InputGroupInput onChange={({target}) => {
                                                    // setData('name', target.value)
                                                }} />

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
                                                }} />

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
                                                }} />

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
                                                }} />

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
                                                }} />

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
                                <Button type="submit" size="sm">Save</Button>
                            </Form>
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
                                    <FieldGroup>
                                        <Field className="gap-2">
                                            <FieldLabel>Invitations Sent</FieldLabel>
                                            <Table>
                                                <TableBody>
                                                {
                                                    team.invitations?.map(invitation => (
                                                        <TableRow className='hover:bg-transparent'>
                                                            <TableCell className='w-6'>
                                                                {
                                                                    invitation.invitee
                                                                        ? <Avatar className='size-6'>
                                                                            <AvatarImage src={invitation.invitee?.avatar} />
                                                                            <AvatarFallback>{ getInitials(invitation.invitee?.name ?? "") }</AvatarFallback>
                                                                        </Avatar> : <div className='bg-muted flex justify-center items-center size-7 rounded-full'>
                                                                            <Mail size={15} />
                                                                        </div>
                                                                        
                                                                }
                                                                
                                                            </TableCell>
                                                            <TableCell>{invitation.invitee?.name ?? invitation.to_email}</TableCell>
                                                            <TableCell>{invitation.roles.join(", ")}</TableCell>
                                                            <TableCell className="text-xs">{invitation.permissions && invitation.permissions.map(p => <Badge variant="outline">{p}</Badge>)}</TableCell>
                                                            <TableCell className='w-6'>
                                                                <Button type='button' variant="ghost" size="icon">
                                                                    <EllipsisVertical />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                                </TableBody>
                                            </Table>
                                            {/* <div className='flex w-full gap-4'>
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
                                                
                                            </div> */}
                                        </Field>
                                    </FieldGroup>
                                </FieldGroup>
                                <Button size="sm">Save</Button>
                            </div>
                        )
                    }
                    {
                        currentTab === 'jobs' && (
                            <div className='w-full px-4 flex flex-col gap-5 items-start'>
                                <FieldGroup className="max-w-lg">
                                    <FieldGroup>
                                        <Field className="gap-2">
                                            <FieldLabel>Current Opportunites</FieldLabel>
                                            <Table>
                                                <TableBody>
                                                {
                                                    team.opportunities?.map(job => (
                                                        <TableRow className='hover:bg-transparent'>
                                                            {/* <TableCell className='w-6'>
                                                                {
                                                                    jobs.invitee
                                                                        ? <Avatar className='size-6'>
                                                                            <AvatarImage src={invitation.invitee?.avatar} />
                                                                            <AvatarFallback>{ getInitials(invitation.invitee?.name ?? "") }</AvatarFallback>
                                                                        </Avatar> : <div className='bg-muted flex justify-center items-center size-7 rounded-full'>
                                                                            <Mail size={15} />
                                                                        </div>
                                                                        
                                                                }
                                                                
                                                            </TableCell> */}
                                                            <TableCell><Link href={jobsShow(job)}>{job.title}</Link></TableCell>
                                                            <TableCell><Badge variant="outline">{job.publish  ? "Published" : "Archived"}</Badge></TableCell>
                                                            <TableCell className='w-6'>
                                                                <Button type='button' variant="ghost" size="icon">
                                                                    <EllipsisVertical />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                                </TableBody>
                                            </Table>
                                            {/* <div className='flex w-full gap-4'>
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
                                                
                                            </div> */}
                                        </Field>
                                    </FieldGroup>
                                </FieldGroup>
                                <Button size="sm">Save</Button>
                            </div>
                        )
                    }
                    
                </div>
            
            </div>
        </AppLayout>
    );
}
