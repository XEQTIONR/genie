import { Button } from '@/components/ui/button'
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern'
import AppLayout from '@/layouts/app-layout'
import { profile } from '@/routes'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { EllipsisVertical, MapPin } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile',
        href: profile().url,
    },
];


export default function Home() {

    const titles = [
        'Software Engineer',
        'Full Stack Developer',
        'Backend Developer'
    ]

    return (
        <AppLayout maxWidth='md:max-w-7xl' breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="h-full md:h-[400px] flex gap-4 justify-between rounded-xl border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="w-full relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                </div>
                <div className="w-full relative -top-28 flex flex-col gap-8">
                    <div className="w-48 ml-12 rounded-full aspect-square relative border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute rounded-full inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="flex justify-between">
                        <div className="ml-12 w-full">
                            <div className="w-full flex justify-between items-center">
                                <div className="text-5xl font-bold flex items-center gap-4">Ishtehar Hussain <span className="text-sm bg-primary text-background px-2 py-0.5 rounded">PRO</span></div>
                                <div className="flex gap-1 items-center">
                                    <span className="mr-3 text-sm">Let's build something together</span>
                                    <Button className="cursor-pointer">Get in touch</Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button className="cursor-pointer" variant="outline" size="icon"><EllipsisVertical /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent sideOffset={10} className="dark:bg-neutral-900" align="end">
                                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="cursor-pointer">Contact</DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">Add to team</DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">Block</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-neutral-400 font-medium"><MapPin size={16} /> Dhaka, Bangladesh</div>
                            <div className="flex gap-4 mt-4">
                            {
                                titles.map((title) => (
                                    <span className="bg-neutral-100 dark:bg-neutral-900 text-neutral-500 px-4 py-2 rounded-full font-semibold">{title}</span>
                                ))
                            }
                            </div>
                            <div className="w-full mt-8">
                                <h2 className="font-semibold text-2xl">A little about me</h2>
                                <p className="mt-4 text-lg">
                                    I'm a full-stack developer and I'm interested in joining a team to start a new project.
                                </p>
                            </div>
                        </div>
                        
                    </div>
                </div>
                
            </div>
        </AppLayout>
    );
}
