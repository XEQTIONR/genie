import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { create, store } from '@/routes/projects'
import { store as storeImage } from '@/routes/api/uploads'
import { Form, Head } from '@inertiajs/react'
import { Separator } from '@/components/ui/separator'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Textarea } from '@/components/ui/textarea'
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

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Eye, Film, Heading1, Heading2, Image, List, ListCheck, ListChecks, ListOrdered, Lock, Video, WrapText } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
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

import Quill from 'quill'
// import 'quill/dist/quill.bubble.css'
import '/resources/css/quill.bubble.css'
import { ButtonGroup } from '@/components/ui/button-group'
import { Label } from '@/components/ui/label'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import axios from 'axios'

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



export default function CreateProject({ user, teams, apiToken } : { user: User, teams: Team[], apiToken: string }) {

    const [ownerType, setOwnerType] = useState<string|null>(null)
    const [ownerId, setOwnerId] = useState<number|null>(null)
    const [ownerLabel, setOwnerLabel] = useState<string>('public')

    const [insertVideoDialogOpen, setInsertVideoDialogOpen] = useState<boolean>(false)
    const [insertImageDialogOpen, setInsertImageDialogOpen] = useState<boolean>(false)
    const [lastSelection, setLastSelection] = useState<number[]|null>(null)

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Create Project',
            href: create().url
        }
    ]

    const editor = useRef<Quill>(undefined)
    const videoInput = useRef<HTMLInputElement>(null)
    const imageInput = useRef<HTMLInputElement>(null)
    const [image, setImage] = useState<Blob|null>(null)

    useEffect(() => {
        const quill = new Quill('#editor', {
            theme: 'bubble',
            bounds: '#editor',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['link'],
                ]
            },
            formats: [
                'bold', 'italic', 'underline', 'strike',
                'blockquote',
                'header', 'list',
                'align',
                'image',
                'video',
                // Exclude 'color' and 'background' from this list
            ]
            // placeholder: 'This is the placeholder text'
        })
        editor.current = quill
    }, [])

    const selection = () : number[] => {
        const range = editor.current?.getSelection()

        if (range) {
            const cursorIndex = range.index
            const selectionLength = range.length
            return [cursorIndex, selectionLength]
        }

        return []
    }

    return (
        <AppLayout maxWidth="md:max-w-7xl" breadcrumbs={breadcrumbs}>
            <Head title="Create new project" />
            <Form 
                action={store()} 
                className="w-full max-w-4xl mx-auto flex flex-col pt-8 px-4"
                transform={(data) => ({
                    ...data,
                    description: editor.current?.root.innerHTML
                })}
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
                        <Field className="gap-3">
                            <FieldLabel className="font-semibold">Description</FieldLabel>
                            {/* <Textarea name="description" className="h-28" /> */}
                            <div className='max-w-full flex justify-start'>
                                <ButtonGroup>
                                    <ButtonGroup>
                                        <Button type="button" variant="outline" size="icon" onClick={() => {
                                            const [a, b] = selection()
                                            if (a !== undefined && b !== undefined) {
                                                editor.current?.formatLine(a, b, 'list', 'ordered')
                                            }
                                        }}>
                                            <ListOrdered />
                                        </Button>
                                        <Button type="button" variant="outline" size="icon" onClick={() => {
                                            const [a, b] = selection()
                                            if (a !== undefined && b !== undefined) {
                                                editor.current?.formatLine(a, b, 'list', 'bullet')
                                            }
                                        }}>
                                            <List />
                                        </Button>
                                        <Button type="button" variant="outline" size="icon" onClick={() => {
                                            const [a, b] = selection()
                                            if (a !== undefined && b !== undefined) {
                                                editor.current?.formatLine(a, b, 'list', 'checked')
                                            }
                                        }}>
                                            <ListChecks />
                                        </Button>
                                    </ButtonGroup>
                                    <ButtonGroup>
                                        <Button type="button" variant="outline" size="icon" onClick={() => {
                                            const [a, b] = selection()
                                            if (a !== undefined && b !== undefined) {
                                                editor.current?.formatLine(a, b, 'header', 1)
                                            }
                                        }}>
                                            <Heading1 />
                                        </Button>
                                        <Button type="button" variant="outline" size="icon" onClick={() => {
                                            const [a, b] = selection()
                                            if (a !== undefined && b !== undefined) {
                                                editor.current?.formatLine(a, b, 'header', 2)
                                            }
                                        }}>
                                            <Heading2 />
                                        </Button>
                                        <Button type="button" variant="outline" size="icon" onClick={() => {
                                            const [a, b] = selection()
                                            if (a !== undefined && b !== undefined) {
                                                editor.current?.removeFormat(a, b)
                                            }
                                        }}>
                                            <WrapText />
                                        </Button>
                                    </ButtonGroup>
                                    <ButtonGroup>
                                        <Button variant="outline" size="icon"onClick={() => {
                                            const [a, b] = selection()
                                            if (a !== undefined && b !== undefined) {
                                                editor.current?.formatLine(a, b, 'align', false)
                                            }
                                        }}> 
                                            <AlignLeft /> 
                                        </Button>
                                         <Button variant="outline" size="icon"onClick={() => {
                                            const [a, b] = selection()
                                            if (a !== undefined && b !== undefined) {
                                                editor.current?.formatLine(a, b, 'align', 'center')
                                            }
                                        }}> 
                                            <AlignCenter /> 
                                        </Button>
                                        <Button variant="outline" size="icon"onClick={() => {
                                            const [a, b] = selection()
                                            if (a !== undefined && b !== undefined) {
                                                editor.current?.formatLine(a, b, 'align', 'right')
                                            }
                                        }}> 
                                            <AlignRight /> 
                                        </Button>
                                        <Button variant="outline" size="icon"onClick={() => {
                                            const [a, b] = selection()
                                            if (a !== undefined && b !== undefined) {
                                                editor.current?.formatLine(a, b, 'align', 'justify')
                                            }
                                        }}> 
                                            <AlignJustify /> 
                                        </Button>
                                    </ButtonGroup>
                                    <ButtonGroup>
                                        <Dialog open={insertVideoDialogOpen} onOpenChange={setInsertVideoDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button type="button" variant="outline" size="icon" 
                                                    onClick={() => {
                                                        console.log('selektion:', selection())
                                                        setLastSelection(selection())
                                                    }}
                                                >
                                                    <Film />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Edit profile</DialogTitle>
                                                    <DialogDescription>
                                                        Make changes to your profile here. Click save when you&apos;re
                                                        done.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4">
                                                    <div className="grid gap-3">
                                                    <Label htmlFor="video-url">URL</Label>
                                                    {/* <Input ref={videoInput} id="video-url" name="video-url" defaultValue="https://example.com/video" /> */}

                                                    <InputGroup>
                                                        <InputGroupInput ref={videoInput} placeholder="example.com" className="!pl-1" />
                                                        <InputGroupAddon>
                                                        <InputGroupText>https://</InputGroupText>
                                                        </InputGroupAddon>
                                                        {/* <InputGroupAddon align="inline-end">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                            <InputGroupButton className="rounded-full" size="icon-xs">
                                                                <IconInfoCircle />
                                                            </InputGroupButton>
                                                            </TooltipTrigger>
                                                            <TooltipContent>This is content in a tooltip.</TooltipContent>
                                                        </Tooltip>
                                                        </InputGroupAddon> */}
                                                    </InputGroup>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <Button onClick={() => {
                                                        if (lastSelection && lastSelection.length > 0 && lastSelection[0] !== undefined) {
                                                            editor.current?.insertEmbed(lastSelection[0], 'video', videoInput.current?.value)
                                                        } else {
                                                            editor.current?.insertEmbed(0, 'video', videoInput.current?.value)
                                                        }
                                                        setInsertVideoDialogOpen(false)
                                                    }}>Save changes</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        
                                        <Dialog open={insertImageDialogOpen} onOpenChange={setInsertImageDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button type="button" variant="outline" size="icon" 
                                                    onClick={() => {
                                                        setLastSelection(selection())
                                                    }}
                                                >
                                                    <Image />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Upload image</DialogTitle>
                                                    <DialogDescription>
                                                        Add an image
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4">
                                                    <div className="grid gap-3">
                                                        <Label htmlFor="video-url">Image</Label>
                                                        <Input
                                                            ref={imageInput}
                                                            onChange={e => {
                                                                if (e.target.files) {
                                                                    setImage(e.target.files[0])
                                                                } else {
                                                                    setImage(null)
                                                                }
                                                            }} 
                                                            type="file" 
                                                            id="image" 
                                                            name="image"
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter className="mt-4">
                                                    <DialogClose asChild>
                                                        <Button type="button" variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <Button
                                                        disabled={image === null}
                                                        onClick={() => {

                                                            if ( image !== null) {
                                                                const data = new FormData()

                                                                data.append('image', image)

                                                                axios.post(storeImage.url(), data, {
                                                                    headers: {
                                                                        Authorization: 'Bearer ' + apiToken
                                                                    }
                                                                }).then((res) => {
                                                                    if (lastSelection && lastSelection.length > 0 && lastSelection[0] !== undefined) {
                                                                        editor.current?.insertEmbed(lastSelection[0], 'image', res.data.upload)
                                                                    } else {
                                                                        editor.current?.insertEmbed(0, 'image', res.data.upload)
                                                                    }
                                                                    setImage(null)
                                                                    setInsertImageDialogOpen(false)
                                                                }).catch((error) => {
                                                                    console.log('error:', error)
                                                                })
                                                            }
                                                        }} 
                                                        type="button"
                                                    >
                                                        Add Image
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </ButtonGroup>
                                </ButtonGroup>
                            </div>
                            <div onChange={(c) => console.log('change: ', c)} className='min-h-36 border p-0 rounded-md' id="editor" />
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
                                                    <span className="mr-2">{user.name}</span>
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