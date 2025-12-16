import GridCard from '@/components/grid-card';
import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { home } from '@/routes';
import { Post, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { show } from '@/routes/posts';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: home().url,
    },
];

const items: Array<string> = []//(new Array(50)).fill(0)


export default function PostsIndex({posts} : {posts: Post[]}) {
    const [q, setQ] = useState("")
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Show posts" />
            <div className="flex h-full flex-col justify-center gap-4 overflow-x-auto rounded-xl p-4">
                {
                    posts.length > 0 && (
                        <>
                            {/* <h2 className="text-xl font-bold">Discover</h2> */}
                            <Select defaultValue="popular">
                                <SelectTrigger className="w-[180px] font-semibold">
                                    <SelectValue placeholder="Select a fruit" />
                                </SelectTrigger>
                                <SelectContent className="font-semibold">
                                    <SelectGroup>
                                        <SelectItem value="popular">Popular</SelectItem>
                                        <SelectItem value="new">New</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div className="grid auto-rows-min gap-8 md:grid-cols-3">
                                {
                                    posts.map((post) => (
                                        <div className="relative overflow-hidden rounded-xl">
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
