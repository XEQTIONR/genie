import allRoles from '@/data/roles'
import AppLayout from '@/layouts/app-layout'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import axios from 'axios'
import { Badge } from '@/components/ui/badge'
import { BreadcrumbItem, type SharedData } from '@/types'
import { Button } from '@/components/ui/button'
import { CircleCheck, CircleX, Handshake, Mail, Plus, Trash, X } from 'lucide-react'
import { create, store } from '@/routes/teams'
import { Head, useForm, usePage } from '@inertiajs/react'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { index } from '@/routes/api/users'
import { Input } from '@/components/ui/input'
import SearchBar from '@/components/ui/search-bar'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { useDebouncedCallback } from 'use-debounce'
import { useInitials } from '@/hooks/use-initials'
import { User } from '@/types'
import { useRef, useState } from 'react'

interface Member {
    id?: number
    username?: string
    email: string
    name?: string
    roles: string[]
    avatar?: string
}

function Step({step, heading, children} : {step: number, heading: string, children: React.ReactNode}) {
    return (<>
        <div className="w-full flex gap-3 pr-3 md:pr-0">
            <div className="flex flex-col gap-1 items-center w-7">
                <div className="size-7 text-sm font-medium shrink-0 rounded-2xl bg-muted text-center flex justify-center items-center">
                    {step}
                </div>
            </div>
            <div className='flex items-center flex-grow'>
                <h2 className="font-bold">{heading}</h2>
            </div>
            
        </div>
        <div className="w-full py-1 flex gap-3 pr-3 md:pr-0">
            <div className="flex flex-col gap-1 items-center w-7 shrink-0">
                <Separator className="border-[1px] " orientation="vertical" />
            </div>
            <div className="flex-grow">
                {children}
            </div>
            
        </div>
    </>)
}

export default function CreateTeam({ apiToken } : { apiToken: string }) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Create Project',
            href: create().url
        }
    ]
    const page = usePage<SharedData>();
    const { auth, errors } = page.props;
    const getInitials = useInitials();

    const input = useRef<HTMLInputElement>(null)
    
    const [existingUser, setExistingUser] = useState<Member|undefined>(undefined)
    const [missingUsername, setMissingUsername] = useState<string|undefined>(undefined)
    const [newEmail, setNewEmail] = useState<string|undefined>(undefined)
    const [newUser, setNewUser] = useState<Member|undefined>(undefined)
    const [searching, setSearching] = useState(false)


    const searchUsers = useDebouncedCallback((str) => {
        setExistingUser(undefined)
        setMissingUsername(undefined)
        setNewEmail(undefined)
        setNewUser(undefined)
        setSearching(true)
        
        if (str != "") { // not empty string
            const existing  = data.members.find(({ username, email }) => username === str || email === str)
            if (existing !== undefined) { // string matches existing user
                setExistingUser(existing)
                setSearching(false)
                
            } else {
                axios.get(index({
                    query: {
                        q: str
                    }
                }).url, {
                    headers: {
                        Authorization: 'Bearer ' + apiToken,
                        Accept: 'application/json'
                    }
                }).then(({data} : {data: User}) => {
                    setSearching(false)
                    if (data) { // new user found
                        setNewUser({
                            id: data.id,
                            username: data.username,
                            name: data.name,
                            email: data.email,
                            roles: ['Collaborator'],
                            avatar: data.avatar
                        })
                    } else { // new user not found
                        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

                        if (emailRegex.test(str)) { // search query is an email address
                            setNewEmail(str)
                        } else { // search query is a username
                            setMissingUsername(str)
                        }
                    }
                }).catch((e) => {
                    setSearching(false)
                    console.log('e:', e)
                })
            }
        } else {
            setSearching(false)
        }
    }, 500)

    const { data, setData, post } = useForm<{ name: string, description: string, members: Member[] }>({
        name: '',
        description: '',
        members: [
            { 
                id: auth.user.id,
                username: auth.user.username,
                email: auth.user.email,
                name: auth.user.name,
                avatar: auth.user.avatar, 
                roles: ['Founder'] 
            },
        ]
    })

    return (
        <AppLayout maxWidth="md:max-w-7xl" breadcrumbs={breadcrumbs}>
            <Head title="Create new team" />
            <form 
                className="w-full max-w-4xl mx-auto flex flex-col pt-8 px-4"
                onSubmit={(e) => {
                    e.preventDefault()
                    post(store().url)
                }}
            >
                <div className="flex items-center gap-3 mb-1">
                    <Handshake size={25} />
                    <h1 className="text-xl font-bold">Create a new team</h1>
                </div>
                <span className="text-sm text-dim md:mx-10 mb-1">
                    Teams are groups of people with skills that work together on
                    game development projects.
                </span>
                <span className="text-sm text-dim md:mx-10 italic mb-10">Required fields are marked with an asterisk (*).</span>
                
                <Step step={1} heading="General">
                    <FieldGroup className="mt-2 mb-10">
                        <Field className="gap-2">
                            <FieldLabel className="font-semibold">Team Name *</FieldLabel>
                            <Input onChange={({target}) => {
                                setData('name', target.value)
                            }} name="title" />
                            <FieldDescription className="text-red-600 dark:text-red-400">
                                { errors?.name }
                            </FieldDescription>
                        </Field>
                        <Field className="gap-2">
                            <FieldLabel className="font-semibold">Description</FieldLabel>
                            <Textarea onChange={({target}) => {
                                setData('description', target.value)
                            }} name="description" className="h-28" />
                            <FieldDescription className="text-red-600 dark:text-red-400">
                                { errors?.description }
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </Step>
                <Step step={2} heading="Members">
                    <FieldGroup className="mt-2">
                        <Field className="gap-2">
                            <FieldLabel className="font-semibold">Email Address / Username</FieldLabel>
                            <div className="flex gap-2">
                                <Input
                                    ref={input}
                                    onChange={({target}) => {
                                        searchUsers(target.value)
                                    }}
                                />
                                <Button
                                    className="gap-1 cursor-pointer" 
                                    variant="outline" 
                                    type="button"
                                    disabled={!(newUser || newEmail)}
                                    onClick={() => {
                                        if (newUser) {
                                            setData('members', [
                                                newUser,
                                                ...data.members
                                            ])

                                            setNewUser(undefined)
                                            if (input.current?.value) {
                                                input.current.value = ""
                                                input.current.focus()
                                            }
                                        } else if (newEmail) {
                                            setData('members', [
                                                {
                                                    email: newEmail,
                                                    roles: ['Collaborator']
                                                },
                                                ...data.members,
                                            ])

                                            setNewEmail(undefined)
                                            if (input.current?.value) {
                                                input.current.value = ""
                                                input.current.focus()
                                            }
                                        }
                                    }}
                                >
                                    <Plus />
                                    Add user
                                </Button>
                            </div>
                            
                            <FieldDescription>
                            {   searching && "Checking ..."   }
                            { 
                                newUser && (<span className="flex items-center gap-1 text-xs text-green-500"> 
                                    <CircleCheck size={15} />
                                    <b>{newUser.username}</b>
                                    found.
                                </span>) 
                            }
                            { 
                                existingUser && (<span className="flex items-center gap-1 text-xs text-red-500"> 
                                    <CircleX size={15} />
                                    <b>{existingUser.username}</b> already added.
                                </span>)
                            }
                            {
                                newEmail && (<span className="flex items-center gap-1 text-xs text-green-500"> 
                                    <CircleCheck size={15} />
                                    <b>{newEmail}</b> can be sent an invitation.
                                </span>)
                            }
                            {
                                missingUsername && (<span className="flex items-center gap-1 text-xs text-red-500"> 
                                    <CircleX size={15} />
                                    User <b>{missingUsername}</b> not found.
                                </span>)
                            }
                            </FieldDescription>
                        </Field>

                        <Field className="gap-2">
                            <FieldLabel className="font-semibold">Added users</FieldLabel>
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-4/12">User</TableHead>
                                        <TableHead className="w-7/12">Roles</TableHead>
                                        <TableHead className="w-1/12">Remove</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {
                                    data.members.map(({id, avatar, name, email, roles, username}, index) => (
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell className="flex items-start">
                                                <div className="flex items-center gap-1.5 my-1">
                                                    {
                                                        id !== undefined
                                                            ? (<>
                                                                <Avatar className="size-8 overflow-hidden rounded-full">
                                                                    <AvatarImage
                                                                        src={avatar}
                                                                        alt={name}
                                                                    />
                                                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white font-medium">
                                                                        {getInitials(name ?? "")}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex flex-col">
                                                                    <span>{name}</span>
                                                                    <span className="text-dim">{username}</span>
                                                                </div>
                                                            </>)
                                                            : <>
                                                                <Avatar className="size-8 overflow-hidden rounded-full">
                                                                    <AvatarImage
                                                                        src=""
                                                                        alt={email}
                                                                    />
                                                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                                        <Mail size={17} />
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex flex-col">
                                                                    <span>{email}</span>
                                                                    <span className="text-dim italic text-xs">An invitation will be emailed</span>
                                                                </div>
                                                            </>
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    {
                                                        roles.length > 0 &&
                                                        <div className="flex flex-wrap gap-2 my-2">
                                                        {
                                                            roles.map(r => (
                                                                <Badge className="cursor-pointer" onClick={() => {
                                                                    setData('members', data.members.map((m, i) => {
                                                                        if (i !== index) {
                                                                            return m
                                                                        } else {
                                                                            const set = new Set([...m.roles])
                                                                            set.delete(r)
                                                                            m.roles = [...set.values()]
                                                                            return m
                                                                        }
                                                                    }))
                                                                }}>
                                                                    {r} <X />
                                                                </Badge>
                                                            )) 
                                                        }
                                                        </div>
                                                    }
                                                    <SearchBar
                                                        placeholder="Add roles..."
                                                        onSelectOption={(val) => {
                                                            setData('members', data.members.map((m, i) => {
                                                                if (i !== index) {
                                                                    return m
                                                                } else {
                                                                    const set = new Set([...m.roles, val])
                                                                    m.roles = [...set.values()]
                                                                    return m
                                                                }
                                                            }))
                                                        }} 
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
                                                </div>
                                            </TableCell>
                                            <TableCell className="flex items-start justify-center">
                                                <Button
                                                    disabled={id === auth.user.id}
                                                    onClick={() => setData('members', data.members.filter((_, i) => i !== index))} 
                                                    className="cursor-pointer" 
                                                    variant="ghost" 
                                                    type="button" 
                                                    size="icon"
                                                >
                                                    <Trash />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                                </TableBody>
                            </Table>
                        </Field>
                    </FieldGroup>
                </Step>
                <div className="w-full flex justify-end  max-w-4xl mx-auto py-4">
                    <Button type="submit" className="mr-3 md:mr-0">Create team</Button>
                </div>
            </form>
        </AppLayout>
    )
}