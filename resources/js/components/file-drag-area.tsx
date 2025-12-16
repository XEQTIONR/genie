import { Button } from "./ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ImagePlay } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { cn } from "@/lib/utils";

export default function FileDragArea({
    className = "",
    onSelect,
    onClicked
} : {
    className?: string,
    onSelect : (f: File) => void
    onClicked?: () => void
}) {

    

    const fileInput = useRef<HTMLInputElement>(null)

    const [dragging, setDragging] = useState(false)

    const { data, setData } = useForm<{ file: File|null }>({
        file: null
    })

    useEffect(() => {
        if (data.file) {
            if (onSelect) {
                onSelect(data.file)
            }
        }
    }, [data.file, onSelect])

    return (
        <Empty
            className={cn(
                "h-full grow border-dashed border-2 rounded-lg",
                dragging && "border-neutral-700",
                className
            )}
            onClick={(e) => {
                e.stopPropagation()
                if (onClicked) {
                    onClicked()
                }
            }}
            onDragEnter={(e) => {
                e.preventDefault()
                setDragging(true)
            }}
            onDragOver={(e) => {
                e.preventDefault()
                if (!dragging) {
                    setDragging(true)
                }
            }}
            onDragLeave={(e) => {
                e.preventDefault()
                setDragging(false)
            }}
            onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                const dataTransfer = e.dataTransfer
                const files = [...dataTransfer.files]
                setData('file', files[0])
            }}
        >
            <EmptyHeader className="max-w-full">
                <EmptyMedia variant="icon">
                <ImagePlay />
                </EmptyMedia>
                <EmptyTitle>Add Media</EmptyTitle>
                <EmptyDescription>
                    Drag and drop an image or browse
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Button type="button" onClick={() => fileInput.current?.click()}>Browse</Button>
                    <input 
                        ref={fileInput} 
                        className="hidden" 
                        type="file"
                        onChange={(e) => {
                            if (e.target.files !== null) {
                                const files = [...e.target.files]
                                setData('file', files[0])
                            } else {
                                setData('file', null)
                            }
                        }} 
                    />
                    {/* <Button variant="outline">Import Project</Button> */}
                </div>
            </EmptyContent>
            {/* <Button
                variant="link"
                asChild
                className="text-muted-foreground"
                size="sm"
            >
                <a href="#">
                Learn More <ArrowUpRightIcon />
                </a>
            </Button> */}
        </Empty>
    )
}