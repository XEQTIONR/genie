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
import ProjectGridCard from '@/components/project-grid-card'

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
                                        <ProjectGridCard project={project} />
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
