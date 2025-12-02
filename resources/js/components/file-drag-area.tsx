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
import { useEffect, useRef } from "react";
import { useForm } from "@inertiajs/react";

export default function FileDragArea({
    onSelect
} : { onSelect : (f: File) => void }) {

    

    const fileInput = useRef<HTMLInputElement>(null)

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
            className="h-full grow border-dashed border-2 rounded-lg"
            onDragEnter={(e) => {
                e.preventDefault()
            }}
            onDragOver={(e) => {
                e.preventDefault()
            }}
            onDragLeave={(e) => {
                e.preventDefault()
            }}
            onDrop={(e) => {
                e.preventDefault()
                const dataTransfer = e.dataTransfer
                const files = [...dataTransfer.files]
                setData('file', files[0])
                // console.log('files[0]:', files[0]) 
            }}
        >
            <EmptyHeader className="max-w-full">
                <EmptyMedia variant="icon">
                <ImagePlay />
                </EmptyMedia>
                <EmptyTitle>No Projects Yet</EmptyTitle>
                <EmptyDescription>
                    You haven&apos;t created any projects yet. Get started by creating your first project.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Button onClick={() => fileInput.current?.click()}>Browse</Button>
                    <input 
                        ref={fileInput} 
                        className="hidden" 
                        type="file"
                        onChange={(e) => {
                            if (e.target.files !== null) {
                                const files = [...e.target.files]
                                setData('file', files[0])
                                // console.log('files[0]:', files[0]) 
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