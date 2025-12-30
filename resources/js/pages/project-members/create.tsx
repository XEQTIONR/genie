import allRoles from '@/data/roles'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem, Project, User } from '@/types'
import { create } from '@/routes/projects'
import { Head, useForm, usePage } from '@inertiajs/react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { index } from '@/routes/api/users'
import { store } from '@/routes/project/members'

// import 'quill/dist/quill.bubble.css'
import '/resources/css/quill.bubble.css'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ChevronRight, CircleCheck, CircleX, Mail, Plus, Trash, Users, X } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import axios from 'axios'
import { type SharedData } from '@/types';
import { useInitials } from '@/hooks/use-initials'
import { Badge } from '@/components/ui/badge'
import SearchBar from '@/components/ui/search-bar'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Multiselect } from '@/components/ui/multiselect'

interface Member {
    id?: number
    username?: string
    email: string
    name?: string
    roles: string[]
    permissions: string[]
    avatar?: string
}

export default function AddProjectMembers({ project, defaultMembers = [], apiToken } : { project: Project, defaultMembers?: User[], apiToken: string }) {
    const { auth } = usePage<SharedData>().props

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Create Project',
            href: create().url
        }
    ]

    const { data, setData, post } = useForm<{ members: Member[] }>({
        members: defaultMembers.map(({id, username, email, name, avatar}) => ({
            id, 
            username, 
            name, 
            email, 
            roles: id === auth.user.id ? ['Founder'] : ['Collaborator'], 
            avatar,
            permissions: [],
        }))
    })
    const getInitials = useInitials()

    const input = useRef<HTMLInputElement>(null)

    const [searching, setSearching] = useState(false)
    const [newUser, setNewUser] = useState<Member|undefined>(undefined)
    const [existingUser, setExistingUser] = useState<Member|undefined>(undefined)
    const [newEmail, setNewEmail] = useState<string|undefined>(undefined)
    const [missingUsername, setMissingUsername] = useState<string|undefined>(undefined)

    const searchUsers = useDebouncedCallback((str) => {
        setSearching(true)
        setExistingUser(undefined)
        setMissingUsername(undefined)
        setNewEmail(undefined)
        setNewUser(undefined)
        
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
                            avatar: data.avatar,
                            roles: ['Collaborator'],
                            permissions: [],
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


    return (
        <AppLayout maxWidth="md:max-w-7xl" breadcrumbs={breadcrumbs}>
            <Head title="Create new project" />
            <div className="w-full max-w-4xl mx-auto flex flex-col pt-8 px-4">
                <div className="flex items-center gap-3 mb-1">
                    <Users size={25} />
                    <h1 className="text-xl font-bold">Add members to <i>{project.title}</i> project</h1>
                </div>
                <span className="text-sm text-dim md:mx-10 mb-1">You can add members to your project now or skip this step for later if you have no one to add.</span>
                <span className="text-sm text-dim md:mx-10 italic mb-10">Required fields are marked with an asterisk (*).</span>
                
                <h2 className="md:mx-10 mb-4 font-bold flex gap-2">
                    Add new user
                </h2>
                <FieldGroup className="mb-10 md:px-10">
                    <div className="w-full flex gap-4">
                        <Field className="gap-2">
                            <FieldLabel>Email Address / Username</FieldLabel>
                            <div className="flex gap-2">
                                <Input
                                    ref={input}
                                    onChange={({target}) => {
                                        searchUsers(target.value)
                                    }} 
                                />
                                <Button
                                    className="gap-1" 
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
                                                    roles: ['Collaborator'],
                                                    permissions: [],
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
                                { searching && "Checking ..." }
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
                    </div>
                </FieldGroup>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        post(store(project).url)
                    }} 
                    className="md:mx-10 mb-10"
                >
                    <h2 className="mb-4 font-bold flex gap-2">
                        Added users
                    </h2>
                    <Table className='w-full'>
                        <TableCaption>A list of users added to project.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-3/12">User</TableHead>
                                <TableHead className="w-4/12">Role</TableHead>
                                <TableHead className="w-3/12">Permissions</TableHead>
                                <TableHead className="w-2/12">Remove</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data.members.map(({id, name, username, roles, email, avatar}, index) => (
                                    <TableRow className="hover:bg-transparent" key={id}>
                                        <TableCell className="w-3/12 flex items-start">
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
                                        <TableCell className="w-4/12">
                                            <div className="w-full flex flex-col pt-1">
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
                                                </div>
                                        </TableCell>
                                        <TableCell className='w-3/12 relative'>
                                            <Multiselect
                                                placeholder="Select permissions"
                                                onSelect={(v) => setData('members', data.members.map((m, i) => {
                                                    if (i == index) {
                                                        m.permissions = v
                                                    }
                                                    return m
                                                }))} 
                                                subject='permissions'
                                                items={{
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
                                                }}
                                                containerClassName='absolute top-0 w-full mt-3'
                                            />
                                        </TableCell>
                                        <TableCell className="flex justify-center">
                                        {
                                            (auth.user.id !== id) &&
                                            <Button
                                                type="button"
                                                className="hover:cursor-pointer" 
                                                onClick={() => {
                                                    setData('members', data.members.filter((_, i) => i !== index))
                                                }} 
                                                variant="ghost" 
                                                size="icon-sm"
                                            >
                                                <Trash />
                                            </Button>
                                        }
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                    <Button
                        type="submit"
                        className="float-right mt-5 gap-0.5"
                    >
                        Confirm members
                        <ChevronRight />
                    </Button>
                </form>
            </div>   
        </AppLayout>
    )
}