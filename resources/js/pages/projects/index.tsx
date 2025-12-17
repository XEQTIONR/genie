import AppLayout from '@/layouts/app-layout'
import { Post, Project, Team, type BreadcrumbItem } from '@/types'
import { Head, Link, router } from '@inertiajs/react'
import { index, show } from '@/routes/projects'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { AvatarImage } from '@radix-ui/react-avatar';
import { useInitials } from '@/hooks/use-initials';
import { Bookmark, BriefcaseBusiness, Heart, PencilRuler, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
                            <div className="grid grid-cols-4 gap-10 w-full max-w-9xl">
                                {
                                    projects.map((project) => (
                                        <Link href={show({project: project.slug})} className="flex gap-6">
                                            <div className="w-full h-full border bg-background overflow-clip  rounded-xl dark:shadow-neutral-900 hover:shadow-lg duration-300">
                                                <div className="w-full aspect-grid bg-neutral-800">
                                                    {
                                                        project.cover_media[0].mime.split("/")[0] == 'video'
                                                        ? (
                                                            <video className="aspect-grid object-cover rounded-lg">
                                                                <source className="" src={project.cover_media[0].url} type={project.cover_media[0].mime} />
                                                            </video>
                                                        ) : (
                                                            <img className="w-full aspect-grid object-cover rounded-lg" src={project.cover_media[0].url} />
                                                        )
                                                    }
                                                </div>
                                                <div className="w-full flex justify-between p-4 gap-5">
                                                    <div className="flex gap-3 grow">
                                                        <div className="flex flex-col gap-3">
                                                            <div>
                                                                <span className="font-bold text-xl shrink grow-0">{project.title}</span>
                                                                <span className="relative -top-0.5 mx-2 px-1 py-0.5 text-xxs font-bold rounded bg-foreground text-background">RELEASE</span>
                                                            </div>
                                                            <div className="flex gap-4">
                                                                <div className="flex items-center gap-2"> 
                                                                    <Avatar variant={project.owner_type == 'App\\Models\\Team' ? "square" : "rounded"} className="size-7 text-xxs">
                                                                        <AvatarImage src={project.owner?.avatar} />
                                                                        <AvatarFallback variant="square">{getInitials(project.owner?.name ?? "")}</AvatarFallback>
                                                                    </Avatar>
                                                                    <span className="text-xs font-medium">{project.owner?.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <Button variant="outline" className="rounded-full" size="icon-sm"><Bookmark /></Button>
                                                        <Button variant="outline" className="rounded-full" size="icon-sm"><Heart /></Button>
                                                    </div>
                                                </div>
                                                <p className="pb-4 px-4 text-dim text-sm">{project.excerpt}</p>
                                            </div>
                                        </Link>
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
