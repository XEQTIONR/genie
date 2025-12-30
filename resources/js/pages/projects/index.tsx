import AppLayout from '@/layouts/app-layout'
import { Project, type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { index } from '@/routes/projects'
import ProjectGridCard from '@/components/project-grid-card'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: index().url,
    },
]

export default function ProjectsIndex({ projects } : { projects: Project[]}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <h1 className="text-2xl font-bold mt-5 w-full max-w-9xl mx-auto">Projects</h1>
            <span className="mb-5 text-sm w-full max-w-9xl mx-auto">Projects people are working on.</span>
            <div className="flex flex-col items-center gap-4 overflow-x-auto rounded-xl p-4">
                {
                    projects.length > 0 && (
                        <>
                            <div className="grid grid-cols-4 gap-8 w-full max-w-9xl items-start">
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