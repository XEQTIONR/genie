import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem, Project, User } from '@/types'
import { create } from '@/routes/projects'
import { Form, Head } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import roles from '@/data/roles'
import { index } from '@/routes/api/users'

// import 'quill/dist/quill.bubble.css'
import '/resources/css/quill.bubble.css'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { ChevronRight, CircleCheck, CircleX, PencilRuler, Plus, Send, Trash, UserRoundPlus, Users, UsersRound } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import axios from 'axios'

interface Member {
    id: number
    username: string
    email: string
    name: string
    role: string
}

export default function AddTeamMembers({ project, defaultMembers = [], apiToken } : { project: Project, defaultMembers?: User[], apiToken: string }) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Create Project',
            href: create().url
        }
    ]

    const [members, setMembers] = useState<Member[]>(() => defaultMembers.map(({id, username, email, name}) => ({
        id, username, name, email, role: 'Collaborator'
    })))

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
        
        if (str != "") {
            const existing  = members.find(({ username, email }) => username === str || email === str)
            if (existing !== undefined) {
                setExistingUser(existing)
                setSearching(false)
                
            } else {
                setExistingUser(undefined)
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
                    if (data) {
                        setNewUser({
                            id: data.id,
                            username: data.username,
                            name: data.name,
                            email: data.email,
                            role: 'Collaborator'
                        })
                    } else {
                        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

                        if (emailRegex.test(str)) {
                            setNewEmail(str)
                        } else {
                            setMissingUsername(str)
                        }

                    }
                }).catch((e) => {
                    setSearching(false)
                    console.log('e:', e)
                })
            }
        }
        setSearching(false)
    }, 500)

    return (
        <AppLayout maxWidth="md:max-w-7xl" breadcrumbs={breadcrumbs}>
            <Head title="Create new project" />
            <Form 
                className="w-full max-w-4xl mx-auto flex flex-col pt-8 px-4"
            >
                <div className="flex items-center gap-3 mb-1">
                    <Users size={25} />
                    <h1 className="text-xl font-bold">Add members to <i>{project.title}</i> project</h1>
                </div>
                {/* <h1 className="text-xl font-bold md:mx-10 mb-1.5">Add members to <i>{project.title}</i> project</h1> */}
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
                                <Input onChange={({target}) => {
                                    searchUsers(target.value)
                                }} />
                                <Button variant="outline" type="button">
                                    <Plus />
                                    Add User
                                </Button>
                            </div>
                            
                            <FieldDescription>
                                { searching && "Checking ..." }
                                { newUser && (<span className="flex items-center gap-1 text-xs text-green-500"> 
                                        <CircleCheck size={15} />
                                        <b>{newUser.username}</b>
                                        found.
                                    </span>) 
                                }
                                { existingUser && (<span className="flex items-center gap-1 text-xs text-red-500"> 
                                        <CircleX size={15} />
                                        <b>{existingUser.username}</b> 
                                        already added.
                                    </span>)
                                }
                                {
                                    newEmail && (<span className="flex items-center gap-1 text-xs text-green-500"> 
                                        <CircleCheck size={15} />
                                        <b>{newEmail}</b> 
                                        can be sent an invitation.
                                    </span>)
                                }
                                {
                                    missingUsername && (<span className="flex items-center gap-1 text-xs text-red-500"> 
                                        <CircleX size={15} />
                                        User
                                        <b>{missingUsername}</b> 
                                        not found
                                    </span>)
                                }
                            </FieldDescription>
                        </Field>
                    </div>
                </FieldGroup>

                <div className="md:mx-10 mb-10">
                    <h2 className="mb-4 font-bold flex gap-2">
                        
                        Added users
                    </h2>
                    <Table className='w-full'>
                        <TableCaption>A list of users added to project.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-6/12">User</TableHead>
                                <TableHead className="w-5/12">Role</TableHead>
                                <TableHead className="w-1/12">Remove</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                members.map(({id, name, username, role}, index) => (
                                    <TableRow className="hover:bg-transparent" key={id}>
                                        <TableCell>
                                            {name} <br />
                                            <span className="text-dim text-xs">{username}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Select onValueChange={(value) => {
                                                setMembers(members.map((m, i) => {
                                                    if (i === index) {
                                                        m.role = value
                                                    }
                                                    return m
                                                }))
                                            }} value={role}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={<span className="mr-2">Select a role</span>}/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                {
                                                    roles.map(({name, items}) => (
                                                        <SelectGroup>
                                                            <SelectLabel>{name}</SelectLabel>
                                                            {
                                                                items.map((item) => <SelectItem value={item}>{item}</SelectItem>)
                                                            }
                                                        </SelectGroup>
                                                    ))
                                                }
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="flex justify-center">
                                            <Button
                                                className="hover:cursor-pointer" 
                                                onClick={() => setMembers(members.filter((_, i) => i !== index))} 
                                                variant="ghost" 
                                                size="icon-sm"
                                            >
                                                <Trash />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                    <Button className="float-right mt-5 gap-0.5">
                        Continue
                        <ChevronRight />
                    </Button>
                </div>
            </Form>   
        </AppLayout>
    )
}