import allRoles from '@/data/roles'
import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/app-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import axios from 'axios'
import { update as updateTeam } from '@/routes/teams'
import {  show as jobsShow } from '@/routes/opportunities'
import { edit as editTeam } from '@/routes/teams'
import { members as editMembers, opportunities as editJobs } from '@/routes/teams/edit'
import { index as jobsIndex } from '@/routes/teams/opportunities'
import { Opportunity, NavItem, Project, ProjectMember, Team, type BreadcrumbItem, Activity, Location, User } from '@/types'
import { Form, Head, Link, router } from '@inertiajs/react'
import { Camera, Eraser, Globe, MapPin, Pencil, PencilRuler, Instagram, Sparkles, UserPlus, Lightbulb, BriefcaseBusiness, Settings, Image, ChevronRight, BadgeCheck, Users, LinkIcon, Trash, X, Trash2, EllipsisVertical, Mail, Plus, ArrowLeft, ShieldAlert } from 'lucide-react'
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
import { Combobox, GroupedOptions } from '@/components/ui/combobox'
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
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import SearchBar from '@/components/ui/search-bar'
import { Multiselect } from '@/components/ui/multiselect'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'

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

    const [currentTab] = useState(tab)
    const [locations, setLocations] = useState<Location[]>(team.locations ?? [])
    const [locationType, setLocationType] = useState(team.locations ? 'specific': 'global')

    const [countryOptions, setCountryOptions] = useState<GroupedOptions>({})
        
    const [inputCity, setInputCity] = useState<string>("")
    const [inputCountry, setInputCountry] = useState<string>("")
    const [links, setLinks] = useState<string[]>(team.meta?.links ?? [])
    const [linkIcons, setLinkIcons] = useState(() => {
        return team.meta?.links?.map((l) => {
            
            if (l.toLowerCase().includes('facebook.com')) {
                return <Facebook />
            }

            if (l.toLowerCase().includes('twitter.com') || l.toLowerCase().includes('x.com')) {
                return <Twitter />
            }

            if (l.toLowerCase().includes('twitch.tv')) {
                return <Twitter />
            }

            if (l.toLowerCase().includes('youtube.com')) {
                return <Youtube />
            }

            if (l.toLowerCase().includes('instagram.com')) {
                return <Instagram />
            }
            
            return <LinkIcon />
        })
    })
    const [selectedMember, setSelectedMember] = useState<User|undefined>(undefined)
    const [currentRoles, setCurrentRoles] = useState<string[]>([])
    const [currentPermissions, setCurrentPermissions] = useState<string[]>([])
    const [editRoles, setEditRoles] = useState(false)
    const [editPermissions, setEditPermissions] = useState(false)

    useEffect(() => {
        if (selectedMember) {
            setCurrentRoles(team.users?.find(t => t.id === selectedMember.id)?.pivot.roles ?? [])
            setCurrentPermissions(team.users?.find(t => t.id === selectedMember.id)?.pivot.permissions ?? [])
        } else {
            setCurrentRoles([])
            setCurrentPermissions([])
        }
    }, [selectedMember, team])

    useEffect(() => {
        setLinkIcons(() => {
            return links?.map((l) => {
                if (l.toLowerCase().includes('facebook.com')) {
                    return <Facebook />
                }

                if (l.toLowerCase().includes('twitter.com') || l.toLowerCase().includes('x.com')) {
                    return <Twitter />
                }

                if (l.toLowerCase().includes('twitch.tv')) {
                    return <Twitch />
                }

                if (l.toLowerCase().includes('youtube.com')) {
                    return <Youtube />
                }

                if (l.toLowerCase().includes('instagram.com')) {
                    return <Instagram />
                }
                
                return <LinkIcon />
            }) ?? []
        })
        
    }, [links])

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
            <div className="w-full max-w-10xl px-4 mx-auto flex flex-col">
                <div className='w-full h-full grow flex'>
                    <aside className='w-xs border-r flex flex-col gap-3'>
                        <h1 className="font-semibold text-xl">Settings</h1>
                        <div className="flex w-full max-w-md flex-col gap-1 pr-3">
                            {
                                tabs.map(t => (
                                    <Button 
                                        size="sm" className={cn('w-full justify-start cursor-pointer', {
                                            'bg-muted' : (currentTab == t.key)
                                        })} 
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            router.visit(t.href)
                                        }}
                                    >
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
                                transform={d => ({
                                    ...d,
                                    locations: JSON.stringify(locations)
                                })}
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
                                                    locations && locations.length > 0 &&
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
                                                        const city = inputCity === "" ? null : inputCity.trim().replaceAll(regex, " ")
                                                        
                                                        let idx = -1
                                                        
                                                        if (locations) {
                                                            idx = locations.findIndex((location) => location.city == city && location.country == inputCountry)
                                                        }

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
                                        <div className='flex justify-between'>
                                            <FieldLabel>Links</FieldLabel>
                                            <Button type="button" onClick={() => setLinks(l => [...l, ""])} className="mr-1" variant="ghost" size="icon-sm"><Plus /></Button>
                                        </div>
                                        <Field className="gap-2">
                                            {
                                                links.map((link, idx: number) => (
                                                    <InputGroup>
                                                        <InputGroupInput name="links[]" value={link} onChange={({target}) => {
                                                            // setData('name', target.value)
                                                            setLinks(l => l.map((v, i) => {
                                                                if (i == idx) {
                                                                    return target.value
                                                                }

                                                                return v
                                                            }) )
                                                        }} />

                                                        <InputGroupAddon>
                                                            { linkIcons[idx] }
                                                        </InputGroupAddon>
                                                        <InputGroupAddon align="inline-end">
                                                            <Trash2 onClick={() => setLinks(l => l.filter((_, i) => i !== idx))} className='hover:stroke-foreground cursor-pointer' />
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                ))
                                            }
                                            {/* <InputGroup>
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
                                            </InputGroup> */}
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
                                    {
                                            selectedMember
                                                ? <Field className="gap-2">
                                                    <div className='flex flex-col gap-3'>
                                                        <div className='flex'>
                                                            <Button
                                                                className='cursor-pointer'
                                                                onClick={() => setSelectedMember(undefined)} 
                                                                type="button" 
                                                                size="sm" 
                                                                variant="secondary"
                                                            >
                                                                <ArrowLeft /> Back to all team members
                                                            </Button>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Avatar className="size-10">
                                                                <AvatarImage src={selectedMember.avatar} />
                                                                <AvatarFallback className="">{getInitials(selectedMember.name)}</AvatarFallback>
                                                            </Avatar>
                                                            {selectedMember.name}
                                                        </div>
                                                    </div>
                                                    <div className='text-xs font-semibold mt-3 flex gap-2 items-center'>
                                                        <span>Roles</span>
                                                    {
                                                        !editRoles && (
                                                            <div onClick={() => setEditRoles(true)} className='rounded-full border p-1.5 hover:bg-muted cursor-pointer'>
                                                                <Pencil size={12} />
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        editRoles && (
                                                            <>
                                                                <Button className="text-xxs cursor-pointer" size="sm" variant="outline" type="button">
                                                                    Save
                                                                </Button>
                                                                <Button onClick={() => {
                                                                    if (selectedMember) {
                                                                        setCurrentRoles(team.users?.find(t => t.id === selectedMember.id)?.pivot.roles ?? [])
                                                                    }
                                                                    setEditRoles(false)
                                                                }} className="text-xxs cursor-pointer" size="sm" variant="destructive" type="button">
                                                                    Cancel
                                                                </Button>
                                                            </>
                                                        )
                                                    }
                                                    </div>

                                                    <div className='flex flex-wrap text-xs my-3 gap-1.5'>
                                                    {
                                                        currentRoles.map(r => (
                                                            <Badge
                                                                onClick={() => {
                                                                    if (editRoles) {
                                                                        setCurrentRoles(role => role.filter(rr => rr!== r))
                                                                    }
                                                                }} 
                                                                variant="secondary"
                                                            >
                                                                { r } { editRoles && <X /> }
                                                            </Badge>
                                                        ))
                                                    }
                                                    </div>
                                                    {
                                                        editRoles && (
                                                            <SearchBar
                                                                onSelectOption={o => setCurrentRoles((c) => {
                                                                    if (c.findIndex(x => x === o) == -1) {
                                                                        return [...c, o]
                                                                    }
                                                                    return c
                                                                })} 
                                                                placeholder="Select roles"
                                                                searchOptions={allRoles.map(({name, items}) => {
                                                                    return {
                                                                        heading: name,
                                                                        options: items.map((item) => {
                                                                            return {
                                                                                label: item,
                                                                                value: item
                                                                            }
                                                                        })
                                                                    }
                                                                })}
                                                            />
                                                        )
                                                    }
                                                    

                                                    

                                                    <div className='text-xs font-semibold mt-3 flex gap-2 items-center'>
                                                        <span>Permissions</span>
                                                        {
                                                            !editPermissions && (
                                                                <div onClick={() => setEditPermissions(true)} className='rounded-full border p-1.5 hover:bg-muted cursor-pointer'>
                                                                    <Pencil size={12} />
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            editPermissions && (
                                                                <>
                                                                    <Button className="text-xxs cursor-pointer" size="sm" variant="outline" type="button">
                                                                        Save
                                                                    </Button>
                                                                    <Button onClick={() => {
                                                                        if (selectedMember) {
                                                                            setCurrentPermissions(team.users?.find(t => t.id === selectedMember.id)?.pivot.permissions ?? [])
                                                                        }
                                                                        setEditPermissions(false)
                                                                    }} className="text-xxs cursor-pointer" size="sm" variant="destructive" type="button">
                                                                        Cancel
                                                                    </Button>
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                    <div className='flex flex-wrap text-xs mt-3 gap-1.5'>
                                                        {
                                                            currentPermissions.map((r) => <Badge variant="outline">{r}</Badge>)
                                                        }
                                                    </div>
                                                    {
                                                        editPermissions && <Multiselect onSelect={(v) => setCurrentPermissions(v)} defaultValue={currentPermissions} items={{
                                                            Ideas: [
                                                                {
                                                                    label: 'Create ideas',
                                                                    value: 'create-posts'
                                                                },
                                                                {
                                                                    label: 'Edit ideas',
                                                                    value: 'edit-posts'
                                                                },
                                                                {
                                                                    label: 'Delete ideas',
                                                                    value: 'delete-posts'
                                                                },
                                                            ],
                                                            Team: [
                                                                {
                                                                    label: 'Edit team info',
                                                                    value: 'edit-info'
                                                                },
                                                                {
                                                                    label: 'Transfer team',
                                                                    value: 'transfer'
                                                                },
                                                            ],
                                                            Members: [
                                                                {
                                                                    label: 'Add members',
                                                                    value: 'add-member'
                                                                },
                                                                {
                                                                    label: 'Remove members',
                                                                    value: 'delete-member'
                                                                },
                                                                {
                                                                    label: 'Edit role',
                                                                    value: 'edit-role'
                                                                },
                                                            ],
                                                            Projects: [
                                                                {
                                                                    label: 'Create projects',
                                                                    value: 'create-project'
                                                                },
                                                                {
                                                                    label: 'Edit projects',
                                                                    value: 'edit-project'
                                                                },
                                                                {
                                                                    label: 'Delete projects',
                                                                    value: 'delete-project'
                                                                },
                                                                {
                                                                    label: 'Add members',
                                                                    value: 'add-project-member'
                                                                },
                                                            ],
                                                            Opportunities: [
                                                                {
                                                                    label: 'Create opportunities',
                                                                    value: 'create-jobs'
                                                                },
                                                                {
                                                                    label: 'Edit opportunities',
                                                                    value: 'edit-jobs'
                                                                },
                                                                {
                                                                    label: 'Delete opportunities',
                                                                    value: 'delete-jobs'
                                                                },
                                                            ]
                                                        }} />
                                                    }
                                                </Field> :
                                                <Field className="gap-2">
                                                    <FieldLabel>Contributors</FieldLabel>
                                                    <div className='flex w-full gap-4'>
                                                        {
                                                            team.users?.map(user => (
                                                                <HoverCard>
                                                                    <HoverCardTrigger>
                                                                        <Avatar onClick={() => setSelectedMember(user)} className='size-10 cursor-pointer'>
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
                                                                            <div className='flex flex-wrap text-xs my-3 gap-1.5'>
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
                                    }  
                                    </FieldGroup>
                                    {
                                        !selectedMember && (
                                            <FieldGroup>
                                                <Field className="gap-2">
                                                    <FieldLabel>Pending Invitations</FieldLabel>
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
                                        )
                                    }
                                </FieldGroup>
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
