import { Button } from "@/components/ui/button"
import AppLayout from "@/layouts/app-layout";
import { Head, useForm, usePage } from "@inertiajs/react"

import { useCallback, useEffect, useRef, useState } from "react"
import FileDragArea from "@/components/file-drag-area"
import { store as storeImage } from '@/routes/api/uploads'
import axios from "axios";
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AlignCenter, AlignLeft, AlignRight, ArrowDown, ArrowUp, Bold, Copy, Heading1, Heading2, Image, Italic, PencilRuler, Plus, SquarePlay, Trash2, Type, Underline } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import Quill from 'quill'
import '/resources/css/quill.bubble.css'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { update as updatePost } from "@/routes/posts";
import { Project, SharedData, Team, MediaBlock, Post } from "@/types";
import { useInitials } from "@/hooks/use-initials"



function PostSidebar({ 
    at,
    currentFormat,
    isOpen,
    onClose,
    onFormatChange,
    onSelectFile,
    onSelectText,
    selectedBlock 
} : {
    at: number
    currentFormat?: {[format: string]: unknown}
    isOpen: boolean 
    onClose?: () => void
    onFormatChange?: (format: string, ...args: unknown[]) => void
    onSelectFile?: (file: File) => void
    onSelectText?: () => void
    selectedBlock?: MediaBlock
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

    useEffect(() => {
        if (selectedBlock) {
            if (selectedBlock.type == 'image') {
                setView('image')
                setFileState(selectedBlock.file)
            }

            if (selectedBlock.type == 'video') {
                setView('video')
                setFileState(selectedBlock.file)
            }

            if (selectedBlock.type == 'text') {
                setView('text')
                setFileState(null)
            }
        }
    }, [selectedBlock])

    const Render = ({file} : {file: File|null}) => {
        if (file) {
            switch(file.type.split('/')[0]) {
                case "image":
                    return <img className="w-full" src={URL.createObjectURL(file)} />

                case "video":
                    return <video className="w-full" autoPlay loop>
                        <source src={URL.createObjectURL(file)} type={file.type} />
                    </video>
            }
        }

        return null
    }

    const RenderWithStrUrl = ({ url } : {url: string}) => {
        
        const p = url.split('.')
        const ext = p[p.length - 1]
        let mime = ""
        switch(ext) {
            case "jpg":
            case "jpeg":
                mime = 'image/jpeg'
                break
            case "mp4":
                mime = 'video/mp4'
                break
        }

        switch(mime) {
            case "image/jpeg":
                return <img className="w-full" src={url} />

            case "video/mp4":
                return <video className="w-full" autoPlay loop>
                    <source src={url} type={mime} />
                </video>
        }

        return null
    }

    return (
        <Sidebar side="right">
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
                                    <SidebarMenuButton onClick={() => {
                                            setView('text')
                                            if (onSelectText) {
                                                onSelectText()
                                            }
                                        }} 
                                        className="cursor-pointer">
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
                                    <SidebarMenuButton onClick={() => setView('video')} className="cursor-pointer">
                                        <SquarePlay />
                                        Video
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )
                }
                {
                    (view == 'image' || view == 'video') && (
                        <SidebarGroup>
                            <div className="flex items-center">
                                {
                                    view == 'image' &&
                                    <Image size={24} className="ml-2 mr-2 stroke-sidebar-foreground/70" />
                                }
                                {
                                    view == 'video' &&
                                    <SquarePlay size={24} className="ml-2 mr-2 stroke-sidebar-foreground/70" />
                                }
                                
                                <h1 className="text-xl text-sidebar-foreground/70 font-medium">
                                    Add {view.charAt(0).toUpperCase() + view.slice(1)}
                                </h1>
                            </div>
                            <SidebarGroupContent className="mt-3">
                                <div className="flex flex-col px-3">
                                    <h2 className="text-sm mt-3">Media</h2>

                                    <div className={cn(
                                        "w-full mt-2 border rounded flex justify-center items-center",
                                        fileState ? "" : "px-5 min-h-32"
                                    )}>
                                        {
                                            !fileState
                                                ?
                                                    selectedBlock?.url ? <RenderWithStrUrl url={selectedBlock.url} /> : 
                                                    <>
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
                                                        Add {view.charAt(0).toUpperCase() + view.slice(1)}
                                                    </Button>
                                                </> 
                                                : <Render file={fileState} />
                                        }
                                    </div>
                                </div>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )
                }
                {
                    ( view == 'text' ) && (
                        <SidebarGroup>
                            <div className="flex items-center">
                                <Type size={24} className="ml-2 mr-2 stroke-sidebar-foreground/70" />
                                
                                <h1 className="text-xl text-sidebar-foreground/70 font-medium">
                                    Edit Text
                                </h1>
                            </div>
                            <SidebarGroupContent className="mt-3">
                                <div className="w-full px-2 flex flex-col gap-5">
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-sm mt-3">Size</h2>
                                        <Select value={
                                            currentFormat?.header === 1 ? "h1"
                                                : currentFormat?.header === 2 ? "h2"
                                                : "p"
                                        
                                        } onValueChange={(v) => {
                                            console.log('change:', v)
                                            if (onFormatChange)
                                            switch (v) {
                                                case "h1":
                                                    onFormatChange('header', 1)
                                                    break
                                                case "h2":
                                                    onFormatChange('header', 2)
                                                    break
                                                case "p":
                                                    onFormatChange('p')
                                                    break
                                            }
                                        }}>
                                            <SelectTrigger>
                                                {
                                            currentFormat?.header === 1 ? <><Heading1 /> Heading</>
                                                : currentFormat?.header === 2 ? <><Heading2 /> Sub-heading</>
                                                : <><AlignLeft /> Paragraph</>
                                        
                                        }


                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="h1"><Heading1 /> Heading</SelectItem>
                                                <SelectItem value="h2"><Heading2 /> Sub-heading</SelectItem>
                                                <SelectItem value="p"><AlignLeft /> Paragraph</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-sm mt-3">Formatting</h2>
                                        <ToggleGroup value={currentFormat ? Object.keys(currentFormat): []} variant="outline" type="multiple" className="w-full">
                                            <ToggleGroupItem
                                                onClick={() => {
                                                    if (onFormatChange) {
                                                        onFormatChange('bold', !Object.keys(currentFormat ?? []).includes('bold'))
                                                    }
                                                }} value="bold" className="w-1/3" variant="outline" type="button">
                                                <Bold />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem
                                                onClick={() => {
                                                    if (onFormatChange) {
                                                        onFormatChange('italic', !Object.keys(currentFormat ?? []).includes('italic'))
                                                    }
                                                }} value="italic" className="w-1/3" variant="outline" type="button">
                                                <Italic />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem
                                                onClick={() => {
                                                    if (onFormatChange) {
                                                        onFormatChange('underline', !Object.keys(currentFormat ?? []).includes('underline'))
                                                    }
                                                }} value="underline" className="w-1/3" variant="outline" type="button">
                                                <Underline />
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-sm mt-3">Align</h2>
                                        <ToggleGroup value={currentFormat?.align ?? "left"}  variant="outline" type="single" className="w-full">
                                            <ToggleGroupItem 
                                            onClick={() => {
                                                    if (onFormatChange) {
                                                        onFormatChange('align', 'left')
                                                    }
                                                }} value="left" className="w-1/3" variant="outline" type="button">
                                                <AlignLeft />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem
                                            onClick={() => {
                                                    if (onFormatChange) {
                                                        onFormatChange('align', 'center')
                                                    }
                                                }}  value="center" className="w-1/3" variant="outline" type="button">
                                                <AlignCenter />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem
                                            onClick={() => {
                                                    if (onFormatChange) {
                                                        onFormatChange('align', 'right')
                                                    }
                                                }}  value="right" className="w-1/3" variant="outline" type="button">
                                                <AlignRight />
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                        { JSON.stringify(currentFormat) }
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
    formats,
    item, 
    selected=false,
    move,
    del,
    onFormatChange
} : {
    formats?: {[f: string]: boolean}
    item: MediaBlock
    selected?: boolean
    move?: (dir: "up"|"down") => void
    del?: () => void
    onFormatChange?: (editor: Quill|null, format: { [format: string]: unknown }|undefined) => void
}) {

    const containerRef = useRef<HTMLDivElement>(null)
    const editor = useRef<Quill>(null)
    const editorGetFormat = useCallback(() => {
        return editor.current?.getFormat()
    }, [editor])

    const editorGetContents = useCallback(() => {
        return editor.current?.getContents()
    }, [editor])
    // const [currentFormatting, setCurrentFormatting] = useState<{[format: string]: unknown}|undefined>(formats)
    const [contents, setContents] = useState(undefined)

    useEffect(() => {
        console.log('change format:', formats)
        const s = editor.current?.getSelection()
        const f = {
            //...editor.current?.getFormat(),
            ...formats
        }
        Object.keys(f).forEach((key) => {
            // console.log('formattt')
            if (s) {
                if (key == 'align') {
                    // console.log('align to->', f[key])
                    editor.current?.format('align', f[key] == 'left' ? undefined : f[key])
                    //editor.current?.
                    // console.log('RIGHT AFTER UPDATE:', editor.current?.getFormat())
                } 
                else if (key == 'header') {

                    console.log('format header')
                    editor.current?.formatLine(s.index, s.length, 'header', f[key])
                }
                else if (key == 'p') {
                    console.log('format p')
                    editor.current?.removeFormat(s.index, s.length)
                }
                else {
                    console.log('format ', key)
                    editor.current?.formatText(s, key, f[key])
                }
            }
        })
    }, [formats])

    useEffect(() => {
        if (containerRef.current) {
            const container = containerRef.current;
            const editorContainer = container.appendChild(
                container.ownerDocument.createElement('div'),
            )

            editorContainer.classList.add('flex')
            editorContainer.classList.add('flex-col')
            editorContainer.classList.add('min-h-40')
            editorContainer.classList.add('w-full')
            
            const quill = new Quill(editorContainer, {
                theme: 'bubble',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        ['link'],
                    ]
                },
                formats: [
                    'bold', 'italic', 'underline',
                    'header',
                    'align',
                ],
                placeholder: 'Add post text...'
            })

            
            if (item.type == "text") {

                if(item.html) {
                    quill.clipboard.dangerouslyPasteHTML(0, item.html)
                } else if (item.contents)
                    quill.setContents(item.contents)
            }

            editor.current = quill
            editor.current.on('text-change', () => {
                // console.log('textchnge')
                const format = editorGetFormat()
                if (onFormatChange) {
                    onFormatChange(editor.current, format)
                }
            })

            editor.current.on('selection-change', (range, oldRange, source) => {
                //console.log('selectionchange')
                if (range !== null) {
                    const format = editorGetFormat()
                    const c = editorGetContents()
                    // console.log('c:', c)
                    //console.log('setContents:', c)
                    //setContents(c)
                    if (onFormatChange) {
                        onFormatChange(editor.current, format)
                    }
                }
            })
        }
    }, [])

    const render = () => {
        if (item) {
            switch(item.type) {
                case "image":
                    return <img className="w-full" src={item.url ?? URL.createObjectURL(item.file)} />

                case "video":
                    return <video className="w-full" autoPlay loop>
                        <source src={item.url ?? URL.createObjectURL(item.file)} type={item.mime ?? item.file.type} />
                    </video>

                case "text":
                    return <div ref={containerRef} className="w-full min-h-40 flex items-stretch" />
            }
        }

        return null
    }

    return (
        <div className="w-full relative">
            { render() }
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
                                            //setContents(editor.current?.getContents())
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
                                            //setContents(editor.current?.getContents())
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
                            <TooltipTrigger>
                                <Trash2
                                    onClick={() => {
                                        if (del) {
                                            del()
                                        }
                                    }}
                                    size={18}
                                    className="cursor-pointer"
                                />
                            </TooltipTrigger>
                            <TooltipContent side="right">Delete</TooltipContent>
                        </Tooltip>
                    </div>
                )
            }
            
        </div>
    )
}

export default function EditPost ({ post } : { post: Post }) {

    const titleInput = useRef<HTMLInputElement>(null)

    const { apiToken, auth } = usePage<SharedData>().props
    const {data, setData, put} = useForm<{
        title: string
        cover: string
        cover_type: string
        // author_type: string
        // author_id: number
        body: any[]
    }>({
        title: post.title,
        cover: post.cover,
        cover_type: post.cover_type,
        body: post.body,
        // author_type: 'user',
        // author_id: auth.user.id
    })

    const [sWidth, setSWidth] = useState("20rem")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [hoverAddButton, setHoverAddButton] = useState(false)
    const [body, setBody] = useState<MediaBlock[]>(post.body)
    const [insertAt, setInsertAt] = useState(0)
    const [time, setTime] = useState(Date.now())
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number|undefined>(undefined)
    const [format, setFormat] = useState<{[format: string]: unknown}|undefined>(undefined)

    const submitPost = () => {
        put(updatePost.url({post: post.id}))
    }

    const renderCover = () => {
        switch(data.cover_type.split('/')[0]) {
            case "image":
                return <img className="w-full max-w-5xl mt-10 mx-auto rounded-xl" src={data.cover} />

            case "video":
                return <video className="w-full max-w-5xl mt-10 mx-auto rounded-xl" autoPlay loop>
                    <source src={data.cover} type={data.cover_type} />
                </video>
        }
    }

    useEffect(() => {
        if (selectedBlockIndex !== undefined) {
            setSidebarOpen(true)
        }
    }, [selectedBlockIndex])

    useEffect(() => {
        setData('body', body.map(b => {
            const x: any = {}
            x.type = b.type
            
            if (b.type == 'image' || b.type == 'video') {
                x.mime = b.mime ?? b.file.type
                x.url = b.url
            } else {
                x.mime = 'text/html'
                x.html = b.html
            }

            return x
        }))
    }, [body, setData])

    

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
                onClick={() => {
                    setSidebarOpen(false)
                    setSelectedBlockIndex(undefined)
                }}
            >
                <Head title="Create a new post" />
                <div className="flex w-full justify-between">
                    <Button
                        onClick={() => {
                            history.back()
                        }} 
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="secondary">Save as draft</Button>
                        <Button type="button" onClick={() => {
                                    submitPost()
                                }}>Continue</Button>
                        
                    </div>
                </div>

                <Input
                    onFocus={() => setSidebarOpen(false)}
                    onClick={(e) => e.stopPropagation()} 
                    onChange={(e) => setData('title', e.target.value)} 
                    value={data.title} 
                    ref={titleInput} 
                    textSizeClasses="text-3xl"
                    className="mt-14 font-bold max-w-5xl min-h-14" 
                    placeholder="Add a post title"
                />
                
                <div className="w-full flex">
                    { renderCover() }
                </div>
                {
                    <div className="w-full max-w-6xl px-10 mt-10 flex flex-col grow ">
                        {
                            body.map((item, idx) => {
                                return (
                                    <>
                                        <div className="flex items-center w-full my-5 opacity-0 hover:opacity-100">
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
                                            onClick={(e) => {
                                                setSelectedBlockIndex(idx)
                                                e.stopPropagation()
                                            }} 
                                            className={cn("w-full p-1 border-2", selectedBlockIndex == idx ? 'border-accent' : 'border-transparent')}
                                        >
                                            <Block
                                                key={item.block_id}
                                                formats={item.type == 'text' ? item.formats : undefined } 
                                                selected={selectedBlockIndex == idx} 
                                                item={item}
                                                del={() => {
                                                    setBody((b) => b.filter((_, i) => i !== idx))
                                                    setTimeout(() => {
                                                        setSelectedBlockIndex(undefined)
                                                    }, 100)
                                                }}
                                                move={(dir) => {
                                                    const length = body.length

                                                    if (dir == 'down') {
                                                        if (idx < length - 1) {
                                                            setBody((b) => {
                                                                const temp = b[idx]
                                                                b[idx] = b[idx + 1]
                                                                b[idx + 1] = temp

                                                                return b
                                                            })

                                                            if (selectedBlockIndex !== undefined) {
                                                                const newIndex = selectedBlockIndex + 1
                                                                setTimeout(() => {
                                                                    setSelectedBlockIndex(newIndex)
                                                                }, 100)
                                                            }
                                                        }
                                                    } else if (dir == 'up') {
                                                        if (idx > 0) {
                                                            setBody((b) => {
                                                                const temp = b[idx]
                                                                b[idx] = b[idx - 1]
                                                                b[idx - 1] = temp
                                                                return b
                                                            })

                                                            if (selectedBlockIndex !== undefined) {
                                                                const newIndex = selectedBlockIndex - 1
                                                                setTimeout(() => {
                                                                    setSelectedBlockIndex(newIndex)
                                                                }, 100)
                                                            }
                                                        }
                                                    }
                                                }}
                                                onFormatChange={(editor, f) => {
                                                    setFormat(f)
                                                    setBody(b => b.map((block, i) => {
                                                        if (editor && i == idx && block.type == "text") {
                                                            block.contents = editor.getContents()
                                                            block.html = editor.getSemanticHTML()
                                                        }
                                                        return block
                                                    }))
                                                }}
                                            />
                                        </div>
                                    </>
                                )
                            })
                        }
                    </div>
                }
                
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
                
            </div>
            <PostSidebar
                currentFormat={format}
                selectedBlock={selectedBlockIndex === undefined ? selectedBlockIndex : body[selectedBlockIndex]}
                at={time}
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                onFormatChange={(format, flag) => {
                    if (selectedBlockIndex !== undefined ) {
                        const block = body[selectedBlockIndex]

                        if (block && block.type == "text") {
                            block.formats =  {...block.formats}
                            block.formats[format] = flag

                            if (format == "p") {
                                delete block.formats['header']
                            }

                            setFormat(block.formats)
                            setBody((b) => {
                                b[selectedBlockIndex] = block
                                return b
                            })
                        }
                    }

                }}
                onSelectFile={(f) => {

                    const data = new FormData()
                    data.append('file', f)
                    data.append('mime', f.type)

                    axios.post(storeImage().url, data, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: 'Bearer ' + apiToken
                        }
                    }).then((res) => {
                            setBody((b) => {
                            const c = [...b]
                            c.splice(insertAt, 0, { type: f.type.split("/")[0], file: f, block_id: Date.now(), url: res.data.upload })
                            return c
                        })
                    }).catch((e) => {
                        console.log('error:', e)
                    })

                    
                }}
                onSelectText={() => {
                    setBody((b) => {
                        const c = [...b]
                        c.splice(insertAt, 0, { type: 'text', block_id: Date.now() })
                        return c
                    })
                }}
            />
        </SidebarProvider>
    )
}