// import allRoles from '@/data/roles'
import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/app-layout'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import axios from 'axios'
// import { update as updateTeam } from '@/routes/teams'
// import { show as jobsShow } from '@/routes/opportunities'
// import { edit as editTeam, show as showTeam } from '@/routes/teams'
import { edit as editProject, show as showProject, update as updateProject } from '@/routes/projects'
// import { members as editMembers, opportunities as editJobs } from '@/routes/teams/edit'
import { NavItem, Team, type BreadcrumbItem, Location, User, Project } from '@/types'
import { Form, Head, Link, router, useForm } from '@inertiajs/react'
// import {  Pencil, Instagram,  LinkIcon,  X, Trash2, EllipsisVertical, Mail, Plus, ArrowLeft, PencilRuler, Trash } from 'lucide-react'
// import { Facebook, Twitter, Twitch, Youtube } from '@/components/icons/svgs'

import { useInitials } from '@/hooks/use-initials';
import { useCallback, useEffect, useRef, useState } from 'react'

import { Input } from "@/components/ui/input"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from '@/components/ui/textarea'
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import FileDragArea from '@/components/file-drag-area'
import { store as storeImage } from '@/routes/api/uploads'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Eye, Film, Heading1, Heading2, Image, List, ListChecks, ListOrdered, Lock, PencilRuler, Trash, WrapText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ButtonGroup } from '@/components/ui/button-group'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import Quill from 'quill'
import '/resources/css/quill.bubble.css'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type ProfileTab = NavItem & {key: string, className?: string}

export default function ProjectSettings({ 
    project,
    tab,
    apiToken,
} : {
    project: Project
    tab: string
    apiToken: string
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Edit Project',
            href: '/',
        },
    ];

    const getInitials = useInitials();

    const tabs: ProfileTab[] = [
        // { title: "Showcase", href: show({ user: user.username }), key: "showcase"},
        { title: "General", href: editProject(project), key: "general"},
        { title: "Members", href: "#", key: "members" },
        { title: "Opportunities", href: "#", key: "jobs" },
        { title: "Release", href: "#", key: "release" },
    ]

    const [currentTab, setCurrentTab] = useState(tab)

    // const [selectedMember, setSelectedMember] = useState<User|undefined>(undefined)
    // const [currentRoles, setCurrentRoles] = useState<string[]>([])
    // const [currentPermissions, setCurrentPermissions] = useState<string[]>([])
    // const [editRoles, setEditRoles] = useState(false)
    // const [editPermissions, setEditPermissions] = useState(false)

    const [carouselApi, setCarouselApi] = useState<CarouselApi>()
    const [slides, setSlides] = useState<{url: string, mime: string, id: number}[]>(project?.cover_media.map((v, i) => ({
        ...v,
        id: Date.now() + i
    })) ?? [])

    const editor = useRef<Quill>(undefined)

    const handleSelect = useCallback((f: File) => {
        //setFileType(f.type)

        const data = new FormData()
        data.append('file', f)
        data.append('mime', f.type)

        //setData('cover_type', f.type)

        //setFile(f)

        axios.post(storeImage().url, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + apiToken
            }
        }).then((res) => {
            console.log('success:', res.data.upload)
            setSlides((s) => [...s, { url: res.data.upload, mime: f.type, id: Date.now() }]) 
        }).catch((e) => {
            console.log('error:', e)
        })

    }, [apiToken])

    const deleteSlide = ((index: number) => {
        setSlides([...slides.filter((_, i) => i !== index)])
    })

    const selection = () : number[] => {
        const range = editor.current?.getSelection()

        if (range) {
            const cursorIndex = range.index
            const selectionLength = range.length
            return [cursorIndex, selectionLength]
        }

        return []
    }

    const [insertVideoDialogOpen, setInsertVideoDialogOpen] = useState<boolean>(false)
    const [insertImageDialogOpen, setInsertImageDialogOpen] = useState<boolean>(false)
    const [lastSelection, setLastSelection] = useState<number[]|null>(null)
    const [visibility, setVisibility] = useState(project.visibility ?? 'public')

    const videoInput = useRef<HTMLInputElement>(null)
    const imageInput = useRef<HTMLInputElement>(null)
    const [image, setImage] = useState<Blob|null>(null)

    useEffect(() => {
        if (document.querySelector('#editor')) {
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
                ],
                placeholder: 'Detailed description and information about your project'
            })

            quill.clipboard.dangerouslyPasteHTML(0, project?.description ?? "")
            editor.current = quill
        }
        
    }, [])

    const {transform, post} = useForm({
        userId: 0,
        roles: [],
        permissions: []
    })
    
    return (
        <AppLayout maxWidth='md:max-w-11xl' maxHeaderWidth='md:max-w-10xl' breadcrumbs={breadcrumbs}>
            <Head title="Project Settings" />
            <div className="w-full max-w-10xl px-4 mx-auto flex flex-col">
                <div className='w-full h-full grow flex'>
                    <aside className='w-xs border-r flex flex-col gap-3'>
                        <Link href={showProject(project)} className='flex items-center gap-1.5 my-3 w-full max-w-10xl mx-auto'>
                            <PencilRuler className="size-5"/>
                            <h2 className="font-medium">
                                
                                {project.title}
                            </h2>
                        </Link>
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
                                            setCurrentTab(t.key)
                                            //router.visit(t.href)
                                        }}
                                    >
                                        {/* <Settings /> */}
                                        {/* <Link href={t.href}> */}
                                            {t.title}
                                        {/* </Link> */}
                                    </Button>
                                ))
                            }
                        </div>
                    </aside>
                    {
                        currentTab === 'general' && (
                            <Form 
                                action={updateProject(project)} 
                                className='w-full px-5 py-3 flex flex-col gap-5 items-start'
                                transform={d => ({
                                    ...d,
                                    owner_type: project.owner_type.split("\\").pop()?.toLowerCase(),
                                    owner_id: project.owner_id,
                                    description: editor.current?.root.innerHTML,
                                    cover_media: slides.map(({url, mime}) => ({
                                        url,
                                        mime
                                    }))
                                })}
                            >
                                <FieldGroup className="max-w-3xl">
                                    <FieldGroup>
                                        <Field className="gap-2">
                                            <FieldLabel>Project Title</FieldLabel>
                                            <Input defaultValue={project.title} name="title" />
                                            <FieldDescription className="text-red-600 dark:text-red-400">
                                                {/* { errors?.name } */}
                                            </FieldDescription>
                                        </Field>
                                        <Field className="gap-2">
                                            <FieldLabel>Excerpt</FieldLabel>
                                            <Input defaultValue={project.excerpt ?? ""} name="excerpt" />
                                            <FieldDescription className="text-red-600 dark:text-red-400">
                                                {/* { errors?.description } */}
                                            </FieldDescription>
                                        </Field>
                                        <Field>
                                            <FieldLabel>
                                                <div className="flex items-center justify-between w-full">
                                                    <span>Cover Images</span>
                                                </div>
                                            </FieldLabel>
                                            <div className="flex justify-end">
                                                
                                            </div>
                                            <Carousel setApi={setCarouselApi} onChange={(e) => console.log('change:', e)} defaultPlay={false} showAutoplay={false} className="max-w-4xl mx-auto">
                                                <CarouselContent>
                                                    {
                                                        // Array.from({length: slides.length}).map((_, idx: number) => (
                                                        slides.map(({ url, mime, id }, idx) => (
                                                            <CarouselItem key={id}>
                                                                        <div className='w-full relative'>
                                                                    {
                                                                        mime.split("/")[0] === 'image' && (
                                                                            <img className="w-full object-cover aspect-grid rounded-lg" src={url} />
                                                                        )
                                                                    }
                                                                    {
                                                                        mime.split("/")[0] === 'video' && (
                                                                            <div className='rounded-lg border overflow-clip'>
                                                                                <video preload="false" className="w-full">
                                                                                    <source src={url} type={mime} />
                                                                                </video>
                                                                            </div>
                                                                            
                                                                        )
                                                                    }
                                                                        <Button type="button" onClick={() => { 
                                                                            deleteSlide(idx)
                                                                            console.log('l:', carouselApi)
                                                                            console.log(carouselApi?.slideNodes())
                                                                        }} variant="destructive" className='absolute top-1 right-1' size="icon-sm"><Trash /></Button>
                                                                    </div>
                                                            
                                                            </CarouselItem>
                                                        ))
                                                    }
                                                    <CarouselItem>
                                                            <FileDragArea className='h-full' onSelect={handleSelect}  />
                                                    </CarouselItem>
                                                </CarouselContent>
                                                <CarouselPrevious />
                                                <CarouselNext />
                                            </Carousel>
                                        </Field>
                                        <Field className="gap-0">
                                            <div className='w-full sticky z-50 pt-2 top-20 bg-background flex flex-col'>
                                                <FieldLabel className=''>Description</FieldLabel>
                                                <div className='max-w-full flex justify-start sticky top-24 z-50 py-3 bg-background'>
                                                    <ButtonGroup className="flex-wrap">
                                                        <ButtonGroup>
                                                            <Button type="button" variant="outline"  size="icon" onClick={() => {
                                                                const [a, b] = selection()
                                                                if (a !== undefined && b !== undefined) {
                                                                    editor.current?.formatLine(a, b, 'list', 'ordered')
                                                                }
                                                            }}>
                                                                <ListOrdered />
                                                            </Button>
                                                            <Button type="button"  variant="outline" size="icon" onClick={() => {
                                                                const [a, b] = selection()
                                                                if (a !== undefined && b !== undefined) {
                                                                    editor.current?.formatLine(a, b, 'list', 'bullet')
                                                                }
                                                            }}>
                                                                <List />
                                                            </Button>
                                                            <Button type="button"  variant="outline" size="icon" onClick={() => {
                                                                const [a, b] = selection()
                                                                if (a !== undefined && b !== undefined) {
                                                                    editor.current?.formatLine(a, b, 'list', 'checked')
                                                                }
                                                            }}>
                                                                <ListChecks />
                                                            </Button>
                                                        </ButtonGroup>
                                                        <ButtonGroup>
                                                            <Button type="button"  variant="outline" size="icon" onClick={() => {
                                                                const [a, b] = selection()
                                                                if (a !== undefined && b !== undefined) {
                                                                    editor.current?.formatLine(a, b, 'header', 1)
                                                                }
                                                            }}>
                                                                <Heading1 />
                                                            </Button>
                                                            <Button type="button"  variant="outline" size="icon" onClick={() => {
                                                                const [a, b] = selection()
                                                                if (a !== undefined && b !== undefined) {
                                                                    editor.current?.formatLine(a, b, 'header', 2)
                                                                }
                                                            }}>
                                                                <Heading2 />
                                                            </Button>
                                                            <Button type="button"  variant="outline" size="icon" onClick={() => {
                                                                const [a, b] = selection()
                                                                if (a !== undefined && b !== undefined) {
                                                                    editor.current?.removeFormat(a, b)
                                                                }
                                                            }}>
                                                                <WrapText />
                                                            </Button>
                                                        </ButtonGroup>
                                                        <ButtonGroup>
                                                            <Button  variant="outline" size="icon"onClick={() => {
                                                                const [a, b] = selection()
                                                                if (a !== undefined && b !== undefined) {
                                                                    editor.current?.formatLine(a, b, 'align', false)
                                                                }
                                                            }}> 
                                                                <AlignLeft /> 
                                                            </Button>
                                                            <Button  variant="outline" size="icon"onClick={() => {
                                                                const [a, b] = selection()
                                                                if (a !== undefined && b !== undefined) {
                                                                    editor.current?.formatLine(a, b, 'align', 'center')
                                                                }
                                                            }}> 
                                                                <AlignCenter /> 
                                                            </Button>
                                                            <Button  variant="outline" size="icon"onClick={() => {
                                                                const [a, b] = selection()
                                                                if (a !== undefined && b !== undefined) {
                                                                    editor.current?.formatLine(a, b, 'align', 'right')
                                                                }
                                                            }}> 
                                                                <AlignRight /> 
                                                            </Button>
                                                            <Button  variant="outline" size="icon"onClick={() => {
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
                                                                    <Button type="button"  variant="outline" size="icon" 
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
                                                                    <Button  variant="outline" type="button" size="icon" 
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
                                            </div>
                                            {/* <Textarea name="description" className="h-28" /> */}
                                            
                                            <div 
                                                onClick={() => {
                                                    const textBox: HTMLDivElement|null = document.querySelector('.ql-editor')
                                                    if (textBox) {
                                                        textBox.focus()
                                                    }
                                                }}
                                                className='min-h-36 border p-0 rounded-md' 
                                                id="editor"
                                            />
                                        </Field>
                                        <Field className="gap-3">
                                            <Item variant="outline">
                                                <ItemContent>
                                                    <ItemTitle>Choose visibility *</ItemTitle>
                                                    <ItemDescription>
                                                        Choose project visibility
                                                    </ItemDescription>
                                                </ItemContent>
                                                <ItemActions>
                                                    <Select defaultValue={project.visibility} onValueChange={(v: "public"|"private") => setVisibility(v)} name="visibility">
                                                        <SelectTrigger className="min-w-[155px]">
                                                            <SelectValue placeholder="Select an owner">
                                                            {
                                                                visibility 
                                                                    ? (
                                                                        visibility == 'public'
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
                                        </Field>
                                        <Field className="gap-3">
                                            <Item variant="outline">
                                                <ItemContent>
                                                    <ItemTitle>Choose targetted platform</ItemTitle>
                                                        <input type="hidden" name="platforms[]" value="" />
                                                    <ItemDescription>
                                                    <div className="w-full flex flex-wrap mt-1 gap-6">
                                                        <div className="flex gap-1.5 items-center">
                                                            <Checkbox defaultChecked={project?.platforms?.includes("pc")} name="platforms[]" value="pc" /> PC
                                                        </div>
                                                        <div className="flex gap-1.5 items-center">
                                                            <Checkbox defaultChecked={project?.platforms?.includes("mac")} name="platforms[]" value="mac" /> Mac
                                                        </div>
                                                        <div className="flex gap-1.5 items-center">
                                                            <Checkbox defaultChecked={project?.platforms?.includes("ps")} name="platforms[]" value="ps" /> PlayStation
                                                        </div>
                                                        <div className="flex gap-1.5 items-center">
                                                            <Checkbox defaultChecked={project?.platforms?.includes("xbox")} name="platforms[]" value="xbox" /> XBox
                                                        </div>
                                                        <div className="flex gap-1.5 items-center">
                                                            <Checkbox defaultChecked={project?.platforms?.includes("switch")} name="platforms[]" value="switch" /> Switch
                                                        </div>
                                                        <div className="flex gap-1.5 items-center">
                                                            <Checkbox defaultChecked={project?.platforms?.includes("ios")} name="platforms[]" value="ios" /> iOS
                                                        </div>
                                                        <div className="flex gap-1.5 items-center">
                                                            <Checkbox defaultChecked={project?.platforms?.includes("android")} name="platforms[]" value="android" /> Android
                                                        </div>
                                                    </div>
                                                    </ItemDescription>
                                                </ItemContent>
                                            </Item>
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
                                {
                                    project.members?.map(m => (
                                        <Avatar className='size-12'>
                                            <AvatarImage src={m.avatar} />
                                            <AvatarFallback>{ getInitials(m.name) }</AvatarFallback>
                                        </Avatar>
                                    ))
                                }
                                </FieldGroup>
                            </div>
                        )
                    }
                    {
                        // currentTab === 'jobs' && (
                        //     <div className='w-full px-4 flex flex-col gap-5 items-start'>
                        //         <FieldGroup className="max-w-lg">
                        //             <FieldGroup>
                        //                 <Field className="gap-2">
                        //                     <FieldLabel>Current Opportunites</FieldLabel>
                        //                     <Table>
                        //                         <TableBody>
                        //                         {
                        //                             team.opportunities?.map(job => (
                        //                                 <TableRow className='hover:bg-transparent'>
                        //                                     {/* <TableCell className='w-6'>
                        //                                         {
                        //                                             jobs.invitee
                        //                                                 ? <Avatar className='size-6'>
                        //                                                     <AvatarImage src={invitation.invitee?.avatar} />
                        //                                                     <AvatarFallback>{ getInitials(invitation.invitee?.name ?? "") }</AvatarFallback>
                        //                                                 </Avatar> : <div className='bg-muted flex justify-center items-center size-7 rounded-full'>
                        //                                                     <Mail size={15} />
                        //                                                 </div>
                                                                        
                        //                                         }
                                                                
                        //                                     </TableCell> */}
                        //                                     <TableCell><Link href={jobsShow(job)}>{job.title}</Link></TableCell>
                        //                                     <TableCell><Badge variant="outline">{job.publish  ? "Published" : "Archived"}</Badge></TableCell>
                        //                                     <TableCell className='w-6'>
                        //                                         <Button type='button' variant="ghost" size="icon">
                        //                                             <EllipsisVertical />
                        //                                         </Button>
                        //                                     </TableCell>
                        //                                 </TableRow>
                        //                             ))
                        //                         }
                        //                         </TableBody>
                        //                     </Table>
                        //                     {/* <div className='flex w-full gap-4'>
                        //                         {
                        //                             team.users?.map(user => (
                        //                                 <HoverCard>
                        //                                     <HoverCardTrigger>
                        //                                         <Avatar className='size-10 cursor-pointer'>
                        //                                             <AvatarImage src={user.avatar} />
                        //                                             <AvatarFallback>{ getInitials(user.name) }</AvatarFallback>
                        //                                         </Avatar>
                        //                                     </HoverCardTrigger>
                        //                                     <HoverCardContent className='min-w-sm'>
                        //                                         <div className='flex flex-col'>
                        //                                             <div className='flex justify-between items-start'>
                        //                                                 <div className='flex gap-2'>
                        //                                                     <Avatar className='size-8'>
                        //                                                         <AvatarImage src={user.avatar} />
                        //                                                         <AvatarFallback>{ getInitials(user.name) }</AvatarFallback>
                        //                                                     </Avatar>
                        //                                                     <div className='flex flex-col'>

                        //                                                     <h4 className="font-bold">{user.name}</h4>
                        //                                                     <span className="relative -top-1 text-sm">{user.username}</span>
                        //                                                     </div>
                        //                                                 </div>
                        //                                                 <Button type='button' variant="ghost" size="icon-sm">
                        //                                                     <EllipsisVertical />
                        //                                                 </Button>
                        //                                             </div>
                                                                    
                        //                                             <h5 className='text-xs font-semibold mt-3'>Roles</h5>
                        //                                             <div className='flex flex-wrap text-xs my-3'>
                        //                                                 {
                        //                                                     user.pivot.roles.map((r) => <Badge variant="secondary">{r}</Badge>)
                        //                                                 }
                        //                                             </div>

                        //                                             <h5 className='text-xs font-semibold mt-3'>Permissions</h5>
                        //                                             <div className='flex flex-wrap text-xs mt-3 gap-1.5'>
                        //                                                 {
                        //                                                     user.pivot.permissions.map((r) => <Badge variant="outline">{r}</Badge>)
                        //                                                 }
                        //                                             </div>
                                                                    
                        //                                         </div>
                        //                                     </HoverCardContent>
                        //                                 </HoverCard>
                                                        
                        //                             ))
                        //                         }
                                                
                        //                     </div> */}
                        //                 </Field>
                        //             </FieldGroup>
                        //         </FieldGroup>
                        //         <Button size="sm">Save</Button>
                        //     </div>
                        // )
                    }
                    
                </div>
            
            </div>
        </AppLayout>
    );
}
