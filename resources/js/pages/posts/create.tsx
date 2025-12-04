import { Button } from "@/components/ui/button"
import AppLayout from "@/layouts/app-layout";
import { Head, useForm, usePage } from "@inertiajs/react"

import { useCallback, useEffect, useRef, useState } from "react"
import FileDragArea from "@/components/file-drag-area"
import { store as storeImage } from '@/routes/api/uploads'
import axios from "axios";
import { Input } from "@/components/ui/input"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ArrowDown, ArrowUp, Copy, Hammer, Image, Lamp, Plus, SquarePlay, Trash2, Type, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";


interface ImageBlock {
    type: "image"
    file: File
}

function PostSidebar({ at, isOpen, onClose, onSelectFile } : {
    at: number
    isOpen: boolean 
    onClose?: () => void
    onSelectFile?: (file: File) => void
}) {

    const imageInput = useRef<HTMLInputElement>(null)
    const [fileState, setFileState] = useState<File|null>(null)
    const [view, setView] = useState('default')

    useEffect(() => {
        if (!isOpen) {
            setFileState(null)
        }
    }, [isOpen])

    useEffect(() => {
        setFileState(null)
        setView('default')
    }, [at])

    return (
        <Sidebar 
            side="right"
            // variant="floating"
        >
            <SidebarHeader>
                <div>
                    <Button onClick={() => {
                        if (onClose) {
                            onClose()
                        }
                    }} className="pl-2 mt-4 cursor-pointer" variant="link" >Close</Button>
                </div>
            </SidebarHeader>
            <SidebarContent> {/* className="flex-row" */}
                {
                    view == 'default' && (
                        <SidebarGroup> {/* className="w-1/2" */}
                            <SidebarGroupLabel className="text-xl mt-3">Insert block</SidebarGroupLabel>
                            {/* <SidebarGroupLabel>Basic</SidebarGroupLabel> */}
                            <SidebarGroupContent className="mt-3">
                                <SidebarMenuItem className="mb-1.5">
                                    <SidebarMenuButton className="cursor-pointer">
                                        <Type />
                                        Text
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem className="mb-1.5">
                                    <SidebarMenuButton onClick={() => setView('image')} className="cursor-pointer">
                                        <Image />
                                        Image
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem className="mb-1.5">
                                    <SidebarMenuButton className="cursor-pointer">
                                        <SquarePlay />
                                        Video
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )
                }
                {
                    view == 'image' && (
                        <SidebarGroup> {/* className="w-1/2" */}
                            {/* <SidebarGroupLabel className="text-lg mt-3">
                                <Image size={50} className="mr-3" />
                                Add Image
                            </SidebarGroupLabel> */}
                            {/* <SidebarGroupLabel>Basic</SidebarGroupLabel> */}
                            <div className="flex items-center">
                                <Image size={24} className="ml-2 mr-2 stroke-sidebar-foreground/70" />
                                <h1 className="text-xl text-sidebar-foreground/70 font-medium">Add Image</h1>
                            </div>
                            <SidebarGroupContent className="mt-3">
                                <div className="flex flex-col px-3">
                                    <h2 className="text-base mt-3">Media</h2>

                                    <div className={cn(
                                        "w-full mt-2 border rounded flex justify-center items-center",
                                        fileState ? "" : "px-5 min-h-32"
                                    )}>
                                        {
                                            !fileState
                                                ? <>
                                                    <input
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files.length > 0) {
                                                                if (onSelectFile) {
                                                                    onSelectFile(e.target.files[0])
                                                                }
                                                                setFileState(e.target.files[0])
                                                            }
                                                        }} 
                                                        ref={imageInput} 
                                                        className="hidden" 
                                                        type="file" 
                                                    />
                                                    <Button
                                                        onClick={() => imageInput.current?.click()}
                                                        variant="outline" 
                                                        className="w-full rounded-full cursor-pointer"
                                                    >
                                                        Add Image
                                                    </Button>
                                                </> 
                                                : <img className="w-full" src={URL.createObjectURL(fileState)} />
                                        }
                                    </div>
                                </div>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )
                }
                

                
            </SidebarContent>
        </Sidebar>
    )
}

function Block({
    item, 
    selected=false,
    move
} : {
    item: ImageBlock
    selected?: boolean
    move?: (dir: "up"|"down") => void
}) {
    return (
        <div className="w-full relative">
            <img className="w-full" src={URL.createObjectURL(item.file)} />
            {
                selected && (
                    <div className="absolute -top-3 -right-16 flex flex-col gap-3 p-4 rounded-full bg-accent">
                        <Tooltip>
                            <TooltipTrigger>
                                <ArrowUp 
                                    size={18} 
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (move) {
                                            move("up")
                                        }
                                    }}
                                />
                            </TooltipTrigger>
                            <TooltipContent side="right">Move Up</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <ArrowDown 
                                    size={18}  
                                    className="cursor-pointer" 
                                    onClick={() => {
                                        if (move) {
                                            move("down")
                                        }
                                    }} 
                                />
                            </TooltipTrigger>
                            <TooltipContent side="right">Move Down</TooltipContent>
                        </Tooltip>
                        <Separator className="bg-neutral-500 my-1" />
                        <Tooltip>
                            <TooltipTrigger><Copy size={18}  className="cursor-pointer" /></TooltipTrigger>
                            <TooltipContent side="right">Copy</TooltipContent>
                        </Tooltip>
                        <Separator className="bg-neutral-500 my-1" />
                        <Tooltip>
                            <TooltipTrigger><Trash2 size={18}  className="cursor-pointer" /></TooltipTrigger>
                            <TooltipContent side="right">Delete</TooltipContent>
                        </Tooltip>
                    </div>
                )
            }
            
        </div>
    )
}

export default function CreatePost () {

    const titleInput = useRef<HTMLInputElement>(null)

    const apiToken = usePage().props.apiToken
    const {data, setData} = useForm({
        title: ''
    })
    
    const [file, setFile] = useState<File|null>(null)
    const [fileType, setFileType] = useState<string|null>(null)
    const [initialized, setInitialized] = useState(false)
    const [sWidth, setSWidth] = useState("20rem")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [hoverAddButton, setHoverAddButton] = useState(false)
    const [body, setBody] = useState<ImageBlock[]>([])
    const [insertAt, setInsertAt] = useState(0)
    const [time, setTime] = useState(Date.now())
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number|undefined>(undefined)

    const handleSelect = useCallback((f: File) => {
        console.log('selectedxx: ', f)
        console.log('type:', f.type)
        setFileType(f.type)

        const data = new FormData()
        data.append('file', f)
        data.append('mime', f.type)
        console.log('apiKey:', apiToken)
        setFile(f)

        axios.post(storeImage().url, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + apiToken
            }
        }).then((res) => {
            console.log('success:', res)
            setInitialized(true)
            setTimeout(() => {
                titleInput.current?.focus()
            }, 100) 
        }).catch((e) => {
            console.log('error:', e)
        })

    }, [apiToken])


    const renderFile = () => {
        if (file!== null && fileType!== null) {
            switch(fileType.split('/')[0]) {
                case "image":
                    return <img className="w-full max-w-7xl mt-10 mx-auto" src={URL.createObjectURL(file)} />

                case "video":
                    return <video className="w-full max-w-7xl mt-10 mx-auto" controls autoPlay>
                        <source src={URL.createObjectURL(file)} type={fileType} />
                    </video>
            }
        }
        return null
    }

    return (
        <SidebarProvider
            open={sidebarOpen}
            style={{
                "--sidebar-width": sWidth,
                // "--sidebar-width-mobile": sWidth,
            }}
        >
            <div 
                className="w-full min-h-screen flex flex-col items-center px-5 py-6"
                onClick={() => setSidebarOpen(false)}
            >
                <Head title="Create a new post" />
                <div className="flex w-full justify-between">
                    <Button
                        onClick={() => {
                            setSWidth((v) => {
                                if (v == "20rem")
                                    return "50rem"

                                return "20rem"
                            })
                        }} 
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="secondary">Save as draft</Button>
                        <Button>Continue</Button>
                    </div>
                </div>

                {
                    !initialized
                        ? <h1 className="text-3xl mt-14 font-bold">What have you been working on?</h1>
                        : <Input
                            onFocus={() => setSidebarOpen(false)}
                            onClick={(e) => e.stopPropagation()} 
                            onChange={(e) => setData('title', e.target.value)} 
                            value={data.title} 
                            ref={titleInput} 
                            textSizeClasses="text-3xl"
                            className="mt-14 font-bold max-w-4xl min-h-14" 
                            placeholder="Add a post title"
                        />
                }
                {
                    file == null
                        ? <div className="w-full max-w-7xl mt-10 flex flex-col grow">
                            <FileDragArea onSelect={handleSelect} />    
                        </div>
                        : <div className="w-full flex flex-col">
                            { renderFile() }
                        </div>
                }
                {
                    <div className="w-full max-w-7xl mt-10 flex flex-col grow">
                        {
                            body.map((item, idx) => {
                                return (
                                    <>
                                        <div className="flex items-center w-full my-5 max-w-7xl opacity-0 hover:opacity-100">
                                            <div className="grow h-full w-full">
                                                <Separator className="mt-4" />
                                            </div>
                                            <Button
                                                size={ hoverAddButton ? "default" : "icon"}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setInsertAt(idx)
                                                    setTime(Date.now())
                                                    setSidebarOpen(true)
                                                }}
                                                onMouseEnter={() => setHoverAddButton(true)}
                                                onMouseLeave={() => setHoverAddButton(false)} 
                                                className={cn(
                                                    "cursor-pointer mx-5 rounded-3xl transition-[width] duration-300",
                                                    hoverAddButton ? "w-32" : ""
                                                )} 
                                                variant="outline"
                                            >
                                                <Plus /> { hoverAddButton && "Add Block" }
                                            </Button>
                                            <div className="grow h-full w-full">
                                                <Separator className="mt-4" />
                                            </div>
                                        </div>
                                        
                                        <div 
                                            onClick={() => {
                                                setSelectedBlockIndex(idx)
                                                console.log('parent')
                                            }} 
                                            className={cn("w-full p-1 border-2", selectedBlockIndex == idx ? 'border-accent' : 'border-transparent')}
                                        >
                                            <Block 
                                                selected={selectedBlockIndex == idx} 
                                                item={item}
                                                move={(dir) => {
                                                    const length = body.length
                                                    const items = [...body]

                                                    if (dir == 'down') {
                                                        if (idx < length - 1) {
                                                            const temp = items[idx]
                                                            items[idx] = items[idx + 1]
                                                            items[idx + 1] = temp
                                                            setBody(items)

                                                            if (selectedBlockIndex !== undefined) {
                                                                const newIndex = selectedBlockIndex + 1
                                                                setTimeout(() => {
                                                                    setSelectedBlockIndex(newIndex)
                                                                }, 100)
                                                            }
                                                        }
                                                    } else if (dir == 'up') {
                                                        if (idx > 0) {
                                                            const temp = items[idx]
                                                            items[idx] = items[idx - 1]
                                                            items[idx - 1] = temp
                                                            setBody(items)

                                                            if (selectedBlockIndex !== undefined) {
                                                                const newIndex = selectedBlockIndex - 1
                                                                setTimeout(() => {
                                                                    setSelectedBlockIndex(newIndex)
                                                                }, 100)
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </>
                                )
                            })
                        }
                    </div>
                }
                {
                    initialized && (
                        <div className="flex items-center w-full mt-5 max-w-7xl">
                            <div className="grow h-full w-full">
                                <Separator className="mt-4" />
                            </div>
                            <Button
                                size={ hoverAddButton ? "default" : "icon"}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setInsertAt(body.length)
                                    setTime(Date.now())
                                    setSidebarOpen(true)
                                }}
                                onMouseEnter={() => setHoverAddButton(true)}
                                onMouseLeave={() => setHoverAddButton(false)} 
                                className={cn(
                                    "cursor-pointer mx-5 rounded-3xl transition-[width] duration-300",
                                    hoverAddButton ? "w-32" : ""
                                )} 
                                variant="outline"
                            >
                                <Plus /> { hoverAddButton && "Add Block" }
                            </Button>
                            <div className="grow h-full w-full">
                                <Separator className="mt-4" />
                            </div>
                        </div>
                    )
                }
                
            </div>
            <PostSidebar
                at={time}
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                onSelectFile={(f) => {
                    setBody((b) => {
                        const c = [...b]
                        c.splice(insertAt, 0, { type: "image", file: f })
                        return c
                    })
                }}
            />
        </SidebarProvider>
    )
}