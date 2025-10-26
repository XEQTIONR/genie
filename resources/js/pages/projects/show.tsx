import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import AppLayout from "@/layouts/app-layout";
import { show as showTeam } from "@/routes/teams";
import { show as showUser } from "@/routes/users";
import { BreadcrumbItem, Project, Team } from "@/types";
import { Head, Link } from "@inertiajs/react";


export default function ShowProject({ project } : { project: Project }) {

    const ProjectOwnerTypeTeam = "App\\Models\\Team"

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Show Project',
            href: '/'
        },
    ]

    return (
        <AppLayout maxHeaderWidth='md:max-w-7xl' maxBodyWidth="w-full" breadcrumbs={breadcrumbs}>
            <Head title="Show Project" />
                
                <div className="w-full min-h-[50vh] bg-neutral-900">
                    <h1 className="w-1/3 text-center mx-auto text-3xl font-semibold mt-5">{project.title}</h1>
                    <h2 className="w-1/3 text-center mx-auto mt-1">{project.excerpt}</h2>
                    {
                        project.owner &&
                        <div className="w-1/3 text-center block mt-3 text-sm mx-auto">
                            by <Link 
                                href={project.owner_type == ProjectOwnerTypeTeam ? showTeam(project.owner) : showUser(project.owner)} 
                                className="font-semibold ml-1 hover:underline"
                            >
                                {project.owner?.name}
                            </Link>
                            
                        </div>
                    }
                    {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                </div>
                <div className="sticky top-16 w-full h-18 border-b shadow-xl dark:shadow-neutral-900/80 flex justify-center items-center">
                    <ul className="flex h-full gap-4 text-sm">
                        <li className="pt-5 px-5 font-semibold border-b-4 border-foreground">Project</li>
                        <li className="pt-5 px-5 border-b-4 border-transparent">Team</li>
                        <li className="pt-5 px-5 border-b-4 border-transparent">Activity</li>
                    </ul>
                </div>
                <div className="w-full">
                    
                </div>
        </AppLayout>
    )
}