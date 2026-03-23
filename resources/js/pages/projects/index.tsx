import AppLayout from '@/layouts/app-layout'
import { Project, type BreadcrumbItem } from '@/types'
import { Head, router } from '@inertiajs/react'
import { index } from '@/routes/projects'
import ProjectGridCard from '@/components/project-grid-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { create } from '@/routes/projects'
import { cn } from '@/lib/utils'

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
            <span className="text-9xl font-bold relative left-2 -mb-36 opacity-10 max-w-[50vw]">Projects</span>
            <span className="font-mono uppercase mt-10 mb-2 ml-5 text-sm text-theme-950 dark:text-theme-200 tracking-widest">Central Repository</span>
            <div className="w-full px-5 flex justify-between items-end z-10">
                <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold mt-2 mb-2 w-full mx-auto">Projects</span>
                    <span className={cn(
                        "font-mono text-sm font-medium",
                        "text-theme-800 bg-theme-200/50 border-theme-800",
                        "dark:text-theme-200 dark:bg-theme-200/15 dark:border-theme-200",
                        "whitespace-nowrap uppercase border  px-3 py-1"
                    )}>52 active</span>
                </div>
                <Button
                    className="cursor-pointer"
                    onClick={() => router.visit(create())} 
                    size="lg" 
                    variant="theme"
                >
                    <Plus strokeWidth={2.5} />
                    Forge new project
                </Button>
            </div>
            
            {/* <span className="mb-5 ml-5 text-sm w-full mx-auto text-dim">Projects people are working on.</span> */}
            <div className="flex flex-col md:flex-row max-w-screen">
                <div className="w-full md:w-1/4">
                    <div className='w-full h-40 bg-violet-800/30 sticky top-20'>

                    </div>
                </div>
                <div className="flex flex-col items-center gap-4 max-w-screen rounded-xl p-4 w-full md:3/4">
                    {
                        projects.length > 0 && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full items-start">
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
            </div>
            
        </AppLayout>
    );
}