import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";

import { ArrowUpRightIcon, Image, ImagePlay } from "lucide-react"
import { Input } from "@/components/ui/input";
import { useCallback, useRef, useState } from "react";
import FileDragArea from "@/components/file-drag-area";
import { store as storeImage } from '@/routes/api/uploads'
import axios from "axios";
import { SharedData } from "@/types";

export default function CreatePost () {

    const fileInput = useRef<HTMLInputElement>(null)

    const apiToken = usePage().props.apiToken
    const [file, setFile] = useState<File|null>(null)
    const [fileType, setFileType] = useState<string|null>(null)

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
        }).catch((e) => {
            console.log('error:', e)
        })

    }, [apiToken])


    const renderFile = () => {
        if (file!== null && fileType!== null) {
            switch(fileType.split('/')[0]) {
                case "image":
                    return <img className="w-full max-w-7xl mt-10" src={URL.createObjectURL(file)} />

                case "video":
                    return <video className="w-full max-w-7xl mt-10" controls autoPlay>
                        <source src={URL.createObjectURL(file)} type={fileType} />
                    </video>
            }
        }
        return null
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center px-5 py-6">
            <div className="flex w-full justify-between">
                <Button variant="outline">Cancel</Button>

                <div className="flex gap-3">
                    <Button variant="secondary">Save as draft</Button>
                    <Button>Continue</Button>
                </div>
            </div>

            <h1 className="text-3xl mt-14 font-bold">What have you been working on?</h1>


            {
                file == null
                    ? <div className="w-full max-w-7xl mt-10 flex flex-col grow">
                    <FileDragArea onSelect={handleSelect} />    
                </div>
                    : renderFile()
            }
            
        </div>
    )
}