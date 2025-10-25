import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { create, store } from '@/routes/projects'
import { Form, Head } from '@inertiajs/react'
import { Separator } from '@/components/ui/separator'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Textarea } from '@/components/ui/textarea'
import { Combobox, Option } from '@/components/ui/combobox'
import { User, Team } from '@/types'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, Lock } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'


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



export default function CreateProject({ user, teams } : { user: User, teams: Team[] }) {

    const [ownerType, setOwnerType] = useState<string|null>(null)
    const [ownerId, setOwnerId] = useState<number|null>(null)
    const [ownerLabel, setOwnerLabel] = useState<string>('public')

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Create Project',
            href: create().url
        }
    ]

    return (
        <AppLayout maxWidth="md:max-w-7xl" breadcrumbs={breadcrumbs}>
            <Head title="Create new project" />
            <Form 
                action={store()} 
                className="w-full max-w-4xl mx-auto flex flex-col pt-4 px-4"
            >
                <h1 className="text-xl font-bold md:mx-10 mb-1.5">Create a new project</h1>
                <span className="text-sm text-dim md:mx-10 mb-1">Projects are game development endeavors in which one or multiple people 
                    participate in with the goal of creating a finished product that can be called
                    a game.
                </span>
                <span className="text-sm text-dim md:mx-10 italic mb-10">Required fields are marked with an asterisk (*).</span>
                
                <Step step={1} heading={"General"}>
                    <FieldGroup className="mt-2 mb-10">
                        <Field className="gap-2">
                            <FieldLabel className="font-semibold">Project Name *</FieldLabel>
                            <Input name="title" />
                        </Field>
                        <Field className="gap-2">
                            <FieldLabel className="font-semibold">Excerpt</FieldLabel>
                            <Input name="excerpt" />
                            <FieldDescription>A short description about the project</FieldDescription>
                        </Field>
                        <Field className="gap-2">
                            <FieldLabel className="font-semibold">Description</FieldLabel>
                            <Textarea name="description" className="h-28" />
                        </Field>
                    </FieldGroup>
                </Step>
                <Step step={2} heading={"Configuration"}>
                    <FieldGroup className="mt-2">
                        {/* <Field className="w-1/2"> */}
                            <input name="owner_type" type="hidden" value={ownerType ?? ""} />
                            <input name="owner_id" type="hidden" value={ownerId ?? ""} />
                            {/* <FieldLabel className="font-semibold">Owner *</FieldLabel> */}
                            
                        {/* </Field> */}
                        <Field>
                            <Item variant="outline">
                                <ItemContent>
                                <ItemTitle>Choose owner *</ItemTitle>
                                <ItemDescription>
                                    Choose an owner for this project
                                </ItemDescription>
                                </ItemContent>
                                <ItemActions>
                                    <Select onValueChange={(v) => {
                                        const [type, idString] = v.split('-')
                                        const id = parseInt(idString)
                                        setOwnerType(type)
                                        setOwnerId(id)
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={<span className="mr-2">Select an owner</span>}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Users</SelectLabel>
                                                <SelectItem value={`user-${user.id}`}>
                                                    <div className="size-4 relative">
                                                        <PlaceholderPattern className="absolute border rounded-full inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                                    </div>
                                                    {user.name}
                                                </SelectItem>
                                            </SelectGroup>
                                            <SelectGroup>
                                                
                                                <SelectLabel>Teams</SelectLabel>
                                                {
                                                    teams.map(({id, name}) => (
                                                        <SelectItem value={`team-${id}`}>
                                                            <div className="size-4 relative">
                                                                <PlaceholderPattern className="absolute border rounded inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                                            </div>
                                                            <span className="mr-2">{name}</span>
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </ItemActions>
                            </Item>
                            <Item variant="outline">
                                <ItemContent>
                                    <ItemTitle>Choose visibility *</ItemTitle>
                                    <ItemDescription>
                                        Choose an owner for this project
                                    </ItemDescription>
                                </ItemContent>
                                <ItemActions>
                                    <Select defaultValue="public" onValueChange={(v) => setOwnerLabel(v)} name="visibility">
                                        <SelectTrigger className="min-w-[155px]">
                                            {/* <SelectValue /> */}
                                            <SelectValue placeholder="Select an owner">
                                            {
                                                ownerLabel 
                                                    ? (
                                                        ownerLabel == 'public'
                                                            ? <span className='flex items-center gap-1.5'><Eye /> Public</span>
                                                            : <span className='flex items-center gap-1.5'><Lock /> Private</span>
                                                    )
                                                    : null
                                            }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem className="pr-5" value="public">
                                                <div className="flex items-start gap-2 selection:hidden">
                                                    <Eye className="mt-1" /> 
                                                    <div className="flex flex-col w-60">
                                                        <h6 className="font-bold">Public</h6>
                                                        <p>Can be seen by everyone who visits the profiles of the users or the team associated with the project.</p>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                            <SelectItem className="pr-5" value="private">
                                                <div className="flex items-start gap-2 selection:hidden">
                                                    <Lock className="mt-1" /> 
                                                    <div className="flex flex-col w-60">
                                                        <h6 className="font-bold">Private</h6>
                                                        <p>Is only visibile to those who have been added to the project.</p>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </ItemActions>
                            </Item>
                            <Item variant="outline">
                                <ItemContent>
                                    <ItemTitle>Choose targetted platform</ItemTitle>
                                    <input type="hidden" name="platforms[]" value="" />
                                    <ItemDescription>
                                    <div className="w-full flex flex-wrap mt-1 gap-6">
                                        <div className="flex gap-1.5 items-center">
                                            <Checkbox name="platforms[]" value="pc" /> PC
                                        </div>
                                        <div className="flex gap-1.5 items-center">
                                            <Checkbox name="platforms[]" value="mac" /> Mac
                                        </div>
                                        <div className="flex gap-1.5 items-center">
                                            <Checkbox name="platforms[]" value="ps" /> PlayStation
                                        </div>
                                        <div className="flex gap-1.5 items-center">
                                            <Checkbox name="platforms[]" value="xbox" /> XBox
                                        </div>
                                        <div className="flex gap-1.5 items-center">
                                            <Checkbox name="platforms[]" value="switch" /> Switch
                                        </div>
                                        <div className="flex gap-1.5 items-center">
                                            <Checkbox name="platforms[]" value="ios" /> iOS
                                        </div>
                                        <div className="flex gap-1.5 items-center">
                                            <Checkbox name="platforms[]" value="android" /> Android
                                        </div>
                                    </div>
                                    </ItemDescription>
                                </ItemContent>
                            </Item>
                        </Field>
                    </FieldGroup>
                </Step>
                <div className="w-full flex justify-end  max-w-4xl mx-auto py-4">
                    <Button className="mr-3 md:mr-0">Create project</Button>
                </div>
            </Form>
            
        </AppLayout>
    )
}