import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import AppLayout from "@/layouts/app-layout";
import { show as showTeam } from "@/routes/teams";
import { show as showUser } from "@/routes/users";
import { BreadcrumbItem, Project, Team } from "@/types";
import { Head, Link } from "@inertiajs/react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ProjectSidebar } from "@/components/project-sidebar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { ChartNoAxesColumnIncreasing, ChevronDown, Code, CodeXml, Facebook, Heart, Mail, Menu, Twitter } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Fade from 'embla-carousel-fade'
import '/resources/css/projects.css'

export default function ShowProject({ project, h } : { project: Project, h: { hash: string, text: string}[] }) {

    const ProjectOwnerTypeTeam = "App\\Models\\Team"

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Show Project',
            href: '/'
        },
    ]

    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <AppLayout maxHeaderWidth='md:max-w-7xl' maxBodyWidth="w-full" breadcrumbs={breadcrumbs}>
            <Head title="Show Project" />
                <div className="w-full min-h-[50vh] bg-neutral-900">
                    <h1 className="w-full md:w-1/3 text-center mx-auto text-2xl font-semibold mt-10">{project.title}</h1>
                    
                    
                    <h2 className="w-full md:w-1/3 text-center mx-auto mt-1">{project.excerpt}</h2>
                    <div className="flex flex-col gap-7 md:flex-row mx-auto w-full md:max-w-7xl items-stretch">
                        <Carousel 
                            className="block w-full md:w-2/3 my-5"
                            opts={{ loop: true,
                                duration: 60
                             }}
                            plugins={[
                                Autoplay({ delay: 8000 }),
                                Fade()
                            ]}
                        >
                            <CarouselContent>
                                {[
                                    'https://www.youtube.com/embed/7gTmT-Kko2w?si=tKbW1693_Bo7RVCi',
                                    'https://www.youtube.com/embed/kAiFVcd9cAA?si=vqD0MBPwIfWG_a80',
                                    'https://www.kickstarter.com/projects/ivstudios/honors-end/widget/video.html',
                                ].map((url, index) => (
                                <CarouselItem key={index}>
                                    <div className="aspect-video flex items-center justify-center border rounded-md">
                                        <iframe id={"iframe"+index} onClick={() => console.log('iframe clicked')} className="w-full h-full rounded-md" src={url} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true"></iframe>
                                    </div>
                                </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex z-60" />
                            <CarouselNext className="hidden md:flex z-60" />
                        </Carousel>
                        <div className="md:w-1/3 my-5 mb-18 p-5 flex flex-col bg-background rounded justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold">{project.title}</h1>
                                <h2 className="mt-5">{project.excerpt}</h2>
                                {/* {
                                    project.owner &&
                                    <div className="w-full block text-sm mt-1">
                                        by <Link 
                                            href={project.owner_type == ProjectOwnerTypeTeam ? showTeam(project.owner) : showUser(project.owner)} 
                                            className="font-semibold hover:underline"
                                        >
                                            {project.owner?.name}
                                        </Link>
                                        
                                    </div>
                                } */}
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <div className="w-full flex gap-5 items-center">
                                    <span className="rounded-sm">Share this</span>
                                    <div className="flex gap-5">
                                        <Facebook />
                                        <Twitter />
                                        <Mail />
                                        <CodeXml />
                                    </div>
                                    
                                </div>
                                <Button className="w-full rounded-sm">Learn More</Button>
                            </div>
                        </div>
                    </div>
                    
                </div>
               
                <div className={cn(
                    "z-60 sticky top-0 w-full h-18 border-b dark:shadow-neutral-900/80 flex md:justify-center items-center bg-background",
                    !sidebarOpen && "shadow-xl"
                )}>
                    <Sheet onOpenChange={setSidebarOpen}>
                        <ul className="flex h-full gap-4 text-sm">
                            <li className="pt-5 px-5 font-semibold border-b-4 border-foreground flex gap-3">
                                <a className="flex gap-4" href="#kontent">
                                <SheetTrigger className="md:hidden" asChild>
                                {
                                    sidebarOpen ? <Menu /> : <ChartNoAxesColumnIncreasing className="rotate-90" />
                                }
                                </SheetTrigger>
                                Project</a>
                            </li>
                            <li className="pt-5 px-5 border-b-4 border-transparent">Creator</li>
                            <li className="pt-5 px-5 border-b-4 border-transparent">Activity</li>
                        </ul>
                        <SheetContent side="left">
                            Some content
                        </SheetContent>
                    </Sheet>
                    
                </div>
                <div id="kontent">
                    <div className="hidden md:inline md:w-1/4 pt-10 h-full sticky float-left top-16">
                        <div className="w-96 block mr-0 ml-auto">
                            <h4 className="mb-10">Contents</h4>
                            <ul className="">
                            {
                                h.map(({hash, text}) => <li className="mb-3"><a href={'#' + hash}>{text}</a></li>)    
                            }
                            </ul>
                        </div>
                        
                    </div>
                    <div className="hidden md:flex md:w-1/4 pt-10 h-full sticky float-right top-16">
                        <div className="border w-96 p-6 mt-5">
                            <div className="relative size-18 rounded-full border overflow-hidden -top-14 -mb-8">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                            <h3 className="font-bold text-lg">{project.creator?.name}</h3>
                            <p className="mt-5">{project.creator?.bio}</p>
                        </div>
                    </div>
                    <div
                        className="w-full md:w-2/4 block mx-auto pt-10 px-4"
                    >
                        <h1 className="mt-3 text-2xl ">Story</h1>
                        <div
                            id="description" 
                            className="w-full mt-10"
                            dangerouslySetInnerHTML={{__html: project.description}} 
                        /> 
                    </div>
                    
                </div>
        </AppLayout>
    )
}