import { store, update } from '@/routes/projects'
import { store as storeImage } from '@/routes/api/uploads'
import { Form, usePage } from '@inertiajs/react'
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
import { User, Team, SharedData, Project } from '@/types'
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

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Eye, Film, Heading1, Heading2, Image, List, ListChecks, ListOrdered, Lock, PencilRuler, Trash, WrapText } from 'lucide-react'
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
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import axios from 'axios'
import FileDragArea from '@/components/file-drag-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useInitials } from '@/hooks/use-initials'

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

export default function ProjectForm({
    user,
    teams,
    project,
    id,
    action = 'store'
} : {
    user: User,
    teams: Team[],
    project?: Project,
    id?: string,
    action?: 'store' | 'update'
}) {
    const { apiToken } = usePage<SharedData>().props
    const [ownerType, setOwnerType] = useState<string|null>(project?.owner_type ? project.owner_type.split('\\')[2]?.toLowerCase() : null)
    const [ownerId, setOwnerId] = useState<number|null>(project?.owner_id ?? null)
    const [ownerLabel, setOwnerLabel] = useState<string>('public')

    const [insertVideoDialogOpen, setInsertVideoDialogOpen] = useState<boolean>(false)
    const [insertImageDialogOpen, setInsertImageDialogOpen] = useState<boolean>(false)
    const [lastSelection, setLastSelection] = useState<number[]|null>(null)

    const editor = useRef<Quill>(undefined)
    const videoInput = useRef<HTMLInputElement>(null)
    const imageInput = useRef<HTMLInputElement>(null)
    const [image, setImage] = useState<Blob|null>(null)
    const [slides, setSlides] = useState<{url: string, mime: string, id: number}[]>(project?.cover_media.map((v, i) => ({
        ...v,
        id: Date.now() + i
    })) ?? [])
    const [carouselApi, setCarouselApi] = useState<CarouselApi>()

    const getInitials = useInitials()
    

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
            ],
            placeholder: 'Detailed description and information about your project'
        })

        quill.clipboard.dangerouslyPasteHTML(0, project?.description ?? "")
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


    return <Form
                id={id} 
                action={action == 'store' ? store() : update(project?.id ?? 0)} 
                className="w-full max-w-4xl mx-auto flex flex-col pt-8 px-4"
                transform={(data) => ({
                    ...data,
                    description: editor.current?.root.innerHTML,
                    cover_media: slides.map(({url, mime}) => ({url, mime}))
                })}
            >
                <div className="flex items-center gap-3 mb-1">
                    <PencilRuler size={25} />
                    <h1 className="text-xl font-semibold">
                        {
                            project ? <>Edit project: <span className="font-bold">{project.title}</span></> : "Create a new project"
                        }
                        
                    </h1>
                </div>
                <span className="text-sm text-dim md:mx-10 mb-1">
                    {
                        project 
                        ? <span className="font-semibold">Project Settings</span>
                        :"Projects are game development endeavors in which one or multiple people " +
                        "participate in with the goal of creating a finished product that can be called " +
                        "a game."
                    }
                </span>
                <span className="text-sm text-dim md:mx-10 italic mb-10">
                    Required fields are marked with an asterisk (*).
                </span>
                
                <Step step={1} heading={"General"}>
                    <FieldGroup className="mt-2 mb-10">
                        <Field className="gap-2">
                            <FieldLabel>Project Name *</FieldLabel>
                            <Input defaultValue={project?.title ?? ""} name="title" />
                        </Field>
                        <Field className="gap-2">
                            <FieldLabel>Excerpt</FieldLabel>
                            <Input defaultValue={project?.excerpt ?? ""} name="excerpt" />
                            <FieldDescription>A short description about the project</FieldDescription>
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
                        <Field className="gap-3">
                            <FieldLabel>Description</FieldLabel>
                            {/* <Textarea name="description" className="h-28" /> */}
                            <div className='max-w-full flex justify-start'>
                                <ButtonGroup className="flex-wrap">
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
                    </FieldGroup>
                </Step>
                <Step step={2} heading={"Configuration"}>
                    <FieldGroup className="mt-2">
                        

                        <input name="owner_type" type="hidden" value={ownerType ?? ""} />
                        <input name="owner_id" type="hidden" value={ownerId ?? ""} />
                        <Field>
                            <Item variant="outline">
                                <ItemContent>
                                <ItemTitle>Choose owner *</ItemTitle>
                                <ItemDescription>
                                    Choose an owner for this project
                                </ItemDescription>
                                </ItemContent>
                                <ItemActions>
                                    <Select defaultValue={project?.owner_type.split("\\")[2].toLowerCase() === 'team' ? ('team-' + project.owner_id) : ('user-' + project?.owner_id)} onValueChange={(v) => {
                                        const [type, idString] = v.split('-')
                                        const id = parseInt(idString)
                                        setOwnerType(type)
                                        setOwnerId(id)
                                    }}>
                                        <SelectTrigger >
                                            <SelectValue placeholder={<span className="mr-2">Select an owner</span>}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Users</SelectLabel>
                                                <SelectItem value={`user-${user.id}`}>
                                                    {/* <div className="size-4 relative">
                                                        <PlaceholderPattern className="absolute border rounded-full inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                                    </div> */}
                                                    <Avatar className="size-5">
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback className="text-3xs">{getInitials(user.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="mr-2">{user.name}</span>
                                                </SelectItem>
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel>Teams</SelectLabel>
                                                {
                                                    teams.map(({id, name, avatar}) => (
                                                        <SelectItem value={`team-${id}`}>
                                                            <Avatar variant="square" className="size-5">
                                                        <AvatarImage src={avatar} />
                                                        <AvatarFallback variant="square" className="text-xxs">{getInitials(name)}</AvatarFallback>
                                                    </Avatar>
                                                            
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
                                        <SelectTrigger defaultValue={project?.visibility ?? 'public'} className="min-w-[155px]">
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
                </Step>
                <div className="w-full flex justify-end  max-w-4xl mx-auto py-4">
                    <Button className="mr-3 md:mr-0">Create project</Button>
                </div>
            </Form>
}