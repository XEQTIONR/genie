import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem, Project } from '@/types'
import { edit } from '@/routes/projects'
import { Head } from '@inertiajs/react'
import { User, Team } from '@/types'
import ProjectForm from './components/project-form'

export default function EditProject({ user, teams, project } : { user: User, teams: Team[], project: Project }) {


    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Edit Project',
            href: edit(project).url
        }
    ]

    return (
        <AppLayout maxWidth="md:max-w-7xl" breadcrumbs={breadcrumbs}>
            <Head title="Edit project" />
            <ProjectForm action="update" project={project} user={user} teams={teams} />
        </AppLayout>
    )
}