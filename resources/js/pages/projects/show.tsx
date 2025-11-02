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
import { Button } from "@headlessui/react";
import { ChartNoAxesColumnIncreasing, ChevronDown, Menu } from "lucide-react";
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

export default function ShowProject({ project } : { project: Project }) {

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
                    
                    {
                        project.owner &&
                        <div className="w-full md:w-1/3 text-center block mt-3 text-sm mx-auto">
                            by <Link 
                                href={project.owner_type == ProjectOwnerTypeTeam ? showTeam(project.owner) : showUser(project.owner)} 
                                className="font-semibold ml-1 hover:underline"
                            >
                                {project.owner?.name}
                            </Link>
                            
                        </div>
                    }
                    <h2 className="w-full md:w-1/3 text-center mx-auto mt-1">{project.excerpt}</h2>
                    <div className="flex flex-col gap-7 md:flex-row md:justify-center mx-auto w-full md:max-w-7xl items-stretch ">
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
                                    'https://www.kickstarter.com/projects/ivstudios/honors-end/widget/video.html'
                                ].map((url, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-1 aspect-video flex items-center justify-center border rounded-md">
                                        <iframe id={"iframe"+index} onClick={() => console.log('iframe clicked')} className="w-full h-full rounded-md" src={url} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true"></iframe>
                                    </div>
                                </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex z-60" />
                            <CarouselNext className="hidden md:flex z-60" />
                        </Carousel>
                        <div className="md:w-1/3 my-5 rounded-md border mb-18">
                                Something
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
                            <li className="pt-5 px-5 border-b-4 border-transparent">Team</li>
                            <li className="pt-5 px-5 border-b-4 border-transparent">Activity</li>
                        </ul>
                        <SheetContent side="left">
                            Some content
                        </SheetContent>
                    </Sheet>
                    
                </div>
                <div id="kontent" className="">
                    <div className="hidden md:flex md:w-1/4 pt-10 h-full sticky float-left top-16 bg-violet-950">Something</div>
                    <div className="hidden md:flex md:w-1/4 pt-10 h-full sticky float-right top-16 bg-pink-950">Something</div>
                    <div
                        id="description"
                        dangerouslySetInnerHTML={{__html: project.description}}
                        className="w-full md:w-2/4 block mx-auto pt-4 px-4"
                    > 
                    </div>
                    
                </div>
        </AppLayout>
    )
}