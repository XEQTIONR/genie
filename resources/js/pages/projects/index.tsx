import AppLayout from '@/layouts/app-layout'
import { Post, Project, Team, type BreadcrumbItem } from '@/types'
import { Head, Link, router } from '@inertiajs/react'
import { index, show } from '@/routes/projects'
import { show as showUser } from '@/routes/users'
import { show as showTeam } from '@/routes/teams'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { AvatarImage } from '@radix-ui/react-avatar';
import { useInitials } from '@/hooks/use-initials';
import { Bookmark, BriefcaseBusiness, Eye, Heart, PencilRuler, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: index().url,
    },
];


export default function ProjectsIndex({ projects } : { projects: Project[]}) {

    const getInitials = useInitials()

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <h1 className="text-2xl font-bold mt-5 w-full max-w-9xl mx-auto">Projects</h1>
            <span className="mb-5 text-sm w-full max-w-9xl mx-auto">Projects people are working on.</span>
            <div className="flex flex-col items-center gap-4 overflow-x-auto rounded-xl p-4">
                {
                    projects.length > 0 && (
                        <>
                            <div className="grid grid-cols-4 gap-10 w-full max-w-9xl items-start">
                                {
                                    projects.map((project) => (
                                        <div className="flex gap-6">
                                            <div className="w-full h-full border flex flex-col justify-start overflow-clip  rounded-xl dark:shadow-neutral-900 hover:shadow-lg duration-300">
                                                <Link href={show({project: project.slug})} className="w-full aspect-grid">
                                                    {
                                                        project.cover_media[0].mime.split("/")[0] == 'video'
                                                        ? (
                                                            <video className="aspect-grid object-cover">
                                                                <source className="" src={project.cover_media[0].url} type={project.cover_media[0].mime} />
                                                            </video>
                                                        ) : (
                                                            <img className="w-full aspect-grid object-cover" src={project.cover_media[0].url} />
                                                        )
                                                    }
                                                </Link>
                                                <div className="w-full flex justify-between px-4 py-4 border-t">
                                                        <div className="flex flex-col gap-1 min-w-0 flex-auto">
                                                            <span className="w-full line-clamp-2 font-bold text-xl overflow-clip overflow-ellipsis">{project.title}</span>
                                                            <div className='flex justify-between'>
                                                                <Link 
                                                                    className='flex items-center gap-2'
                                                                    href={project.owner_type == 'App\\Models\\Team' ? showTeam({ slug: project.owner?.slug }).url : showUser({username: project.owner?.username}).url}
                                                                >
                                                                    <Avatar variant={project.owner_type == 'App\\Models\\Team' ? "square" : "rounded"} className="size-8 text-xs">
                                                                        <AvatarImage src={project.owner?.avatar} />
                                                                        <AvatarFallback variant="square">{getInitials(project.owner?.name ?? "")}</AvatarFallback>
                                                                    </Avatar>
                                                                    <span className="text-xs font-medium">{project.owner?.name}</span>
                                                                </Link>
                                                                <div className="flex items-center gap-4">
                                                                    {/* <div className="flex items-center gap-1">
                                                                        <Users strokeWidth={2.5} size={16} />
                                                                        <span className="text-sm font-semibold">35</span>
                                                                    </div> */}
                                                                    {/* <Button onClick={(e) => e.stopPropagation()} className="rounded-full cursor-pointer" variant="outline" size="icon-sm"><Bookmark /></Button> */}
                                                                    <div className='flex gap-1 items-center'><Bookmark className="size-4" strokeWidth={2.5} /> <span className="font-semibold text-sm">21</span></div>
                                                                    <div className='flex gap-1 items-center'><Eye className="size-4" strokeWidth={2.5} /> <span className="font-bold text-sm">500</span></div>
                                                                    {/* <Button size="icon-sm" variant="outline" className="rounded-full"><Bookmark /></Button> */}
                                                                    {/* <Button size="icon-sm" variant="outline" className="rounded-full"><Heart /></Button> */}
                                                                </div>
                                                            </div>
                                                            
                                                        </div>
                                                </div>
                                                <Link href={show({project: project.slug})}>
                                                    <p className="px-4 pb-4 text-dim text-sm">{project.excerpt}</p>
                                                </Link>
                                            </div>
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
