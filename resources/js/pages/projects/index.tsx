import AppLayout from '@/layouts/app-layout'
import { Project, type BreadcrumbItem } from '@/types'
import { Head, router } from '@inertiajs/react'
import { index } from '@/routes/projects'
import ProjectGridCard from '@/components/project-grid-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { create } from '@/routes/projects'
import { Field, FieldContent, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

import { Badge } from '@/components/ui/badge'
import { Chip } from '@/components/ui/chip'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: index().url,
    },
]



export default function ProjectsIndex({ projects } : { projects: Project[]}) {


    const roles = ['C++ Dev', 'UI/UX Designer']
    const engines = ['Godot', 'Unity', 'Unreal']
    const devStatuses: {[key: string]: number} = {
        'Team Formation': 152,
        'Crowd Funding': 55,
        'In Development': 105,
        'Beta Testing': 9,
        'Released': 122
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <span className="text-9xl font-bold relative left-2 -mb-36 opacity-10 max-w-[50vw]">Projects</span>
            <span className="font-mono uppercase mt-10 mb-2 ml-5 text-sm text-theme-950 dark:text-theme-200 tracking-widest">Central Repository</span>
            <div className="w-full px-5 flex justify-between items-end z-10">
                <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold mt-2 mb-2 w-full mx-auto">Projects</span>
                    <Chip>52 active</Chip>
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
                    <div className='w-full sticky top-20 ml-3 p-3'>
                        <FieldGroup>
                            <FieldSet>
                                <FieldLegend className="uppercase font-mono text-xs font-medium tracking-widest">Game Engine</FieldLegend>
                                    <FieldGroup className="gap-0">
                                        {
                                            engines.map(e => (
                                                <Field className="hover:bg-secondary text-dim py-2.5 -mx-2 px-2" orientation="horizontal">
                                                    <Checkbox />
                                                    <FieldContent>
                                                        <Label className='mt-0.5'>{e}</Label>
                                                    </FieldContent>
                                                </Field>
                                            ))
                                        }
                                        
                                    </FieldGroup>
                            </FieldSet>
                            <FieldSet>
                                <FieldLegend className="uppercase font-mono text-xs font-medium tracking-widest">Roles Needed</FieldLegend>
                                <div className="flex flex-wrap gap-2 items-start">
                                    {
                                        roles.map(r => <Chip textSize="text-xs" variant="default">{r}</Chip>)
                                    }
                                </div>
                            </FieldSet>
                            <FieldSet>
                                <FieldLegend className="uppercase font-mono text-xs font-medium tracking-widest">Development Status</FieldLegend>
                                <FieldGroup className='gap-0'>
                                    {
                                        Object.keys(devStatuses).map(k => (
                                            <Field className='text-dim hover:bg-secondary py-2 -mx-2 px-2 cursor-pointer' key={k}>
                                                <div className="w-full flex items-center justify-between">
                                                    <span className='text-sm'>{k}</span>
                                                    <Badge className='font-mono' variant="secondary">{devStatuses[k]}</Badge>
                                                </div>
                                            </Field>
                                        ))
                                    }
                                    
                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
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