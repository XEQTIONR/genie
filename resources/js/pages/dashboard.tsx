import GridCard from '@/components/grid-card'
import { Input } from '@/components/ui/input'
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern'
import AppLayout from '@/layouts/app-layout'
import { home } from '@/routes'
import { Post, type BreadcrumbItem } from '@/types'
import { Head, router } from '@inertiajs/react'
import { ChevronDown, SearchIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { show } from '@/routes/posts'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import PostFilterDropDown from '@/components/post-filter-dropdown'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: home().url,
    },
];

export default function Dashboard({posts} : {posts: Post[]}) {
    const [q, setQ] = useState("")
    
    const [searchType, setSearchType] = useState('Ideas')

    return (
        <AppLayout breadcrumbs={breadcrumbs} stickyAfter={300}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col justify-center gap-4 overflow-x-auto rounded-xl p-4">
                
                <div className="h-full md:h-[450px] flex gap-4 justify-between rounded-xl border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="w-full lg:w-1/2 flex gap-6 flex-col justify-center border-sidebar-border/70 dark:border-sidebar-border">
                        <p className="text-6xl md:text-6xl font-bold">Find passionate people <br className="hidden md:inline" /> to build games with <br className="hidden md:inline" /> in 3 clicks.</p>
                        
                        <form className="w-full relative flex">
                            {/* <Search size={16} className='absolute top-[13px] left-2' /> */}
                            <SearchIcon size={18} className='absolute top-3 left-3' />
                            {/* <Input placeholder='Search for ideas, projects or opportunites' className="pl-7 py-5 min-w-md" /> */}
                            <Input
                                value={q}
                                onChange={({target}) => setQ(target.value)} 
                                className="pl-10 py-5"
                                placeholder='Search for ideas, projects or opportunites'
                            />
                            {
                                q.length > 0 &&
                                <XIcon
                                    size={18}
                                    onClick={() => setQ("")} 
                                    className="absolute hover:text-foreground cursor-pointer right-5 top-5 transform text-ring" 
                                />
                            }
                            <DropdownMenu>
                                <DropdownMenuTrigger className="mt-1 -translate-x-full -mr-[100%] relative -left-1" size="sm" asChild>
                                    <Button variant="outline">
                                        {searchType}
                                        <ChevronDown />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-36 mt-1" align="end">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onSelect={() => setSearchType('Ideas')}>
                                            Ideas
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => setSearchType('Projects')}>
                                            Projects
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => setSearchType('Opportunities')}>
                                            Opportunities
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </form>
                    </div>
                    <div className="hidden lg:flex w-1/2 justify-end border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="w-full relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>
                </div>
                {
                    posts.length > 0 && (
                        <>
                            <h2 className="text-3xl font-bold mt-10">Discover</h2>
                            <PostFilterDropDown />
                            <div className="grid auto-rows-min gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {
                                    posts.map((post) => (
                                        <div className="relative overflow-hidden">
                                            <GridCard className="cursor-pointer" onClick={() => router.visit(show({post: post.id}))} post={post} />
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                    )
                }
            </div>
        </AppLayout>
    );
}
