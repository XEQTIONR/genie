import { Button } from '@/components/ui/button'
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern'
import AppLayout from '@/layouts/app-layout'
import { profile } from '@/routes'
import { User, type BreadcrumbItem } from '@/types'
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
import { TabbedSectionHeaders } from '@/components/ui/tabbed-sections'




export default function Profile({ user } : { user: User }) {

    const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile',
        href: profile({ user: user.username }).url,
    },
];

    const titles = [
        'Software Engineer',
        'Full Stack Developer',
        'Backend Developer'
    ]

    const currentTab = 'showcase'

    return (
        <AppLayout maxWidth='md:max-w-7xl' breadcrumbs={breadcrumbs}>
            <Head title="Profile" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="h-full md:h-[400px] flex gap-4 justify-between rounded-xl border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="w-full relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                </div>
                <div className="w-full relative -top-14 md:-top-28 flex flex-col gap-8">
                    <div className="w-24 md:w-48 ml-4 md:ml-12 rounded-full aspect-square relative border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute rounded-full inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="md:mx-8">
                        <div className="w-full flex justify-between items-center">
                            <div className="text-2xl md:text-5xl font-bold flex items-center gap-4 max-w-4/5">{user.name}<span className="text-sm bg-primary text-background px-2 py-0.5 rounded">PRO</span></div>
                            <div className="flex gap-1 items-center">
                                <span className="hidden lg:inline mr-3 text-sm">Let's build something together</span>
                                <Button className="hidden lg:inline cursor-pointer">Get in touch</Button>
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
                        <div className="flex flex-wrap gap-4 mt-4">
                        {
                            titles.map((title) => (
                                <span className="bg-neutral-100 dark:bg-neutral-900 text-neutral-500 px-4 py-2 rounded-full font-semibold">{title}</span>
                            ))
                        }
                        </div>
                        <div className="w-full mt-8">
                            <h2 className="font-semibold text-2xl">Bio</h2>
                            <p className="mt-4 text-lg">
                                I'm a full-stack developer and I'm interested in joining a team to start a new project.
                            </p>
                        </div>
                    </div>
                    <TabbedSectionHeaders
                        current={currentTab}
                        headers={[
                            { title: "Showcase", href: "/", key: "showcase"},
                            { title: "Activity", href: "/", key: "activity"},
                            { title: "Teams / Studios", href: "/", key: "teams"},
                            { title: "About", href: "/", key: "about" },
                        ]}
                    />
                </div>
                
            </div>
        </AppLayout>
    );
}
