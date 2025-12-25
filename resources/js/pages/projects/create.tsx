import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { create } from '@/routes/projects'
import { Head } from '@inertiajs/react'
import { User, Team } from '@/types'
import ProjectForm from './components/project-form'

export default function CreateProject({ user, teams } : { user: User, teams: Team[] }) {


    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Create Project',
            href: create().url
        }
    ]

    return (
        <AppLayout maxWidth="md:max-w-7xl" breadcrumbs={breadcrumbs}>
            <Head title="Create new project" />
            <ProjectForm user={user} teams={teams} />
        </AppLayout>
    )
}