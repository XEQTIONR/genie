import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem, Project } from '@/types'
import { create } from '@/routes/projects'
import { Form, Head } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import roles from '@/data/roles'

// import 'quill/dist/quill.bubble.css'
import '/resources/css/quill.bubble.css'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

export default function AddTeamMembers({ project } : { project: Project }) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Create Project',
            href: create().url
        }
    ]

    return (
        <AppLayout maxWidth="md:max-w-7xl" breadcrumbs={breadcrumbs}>
            <Head title="Create new project" />
            <Form 
                className="w-full max-w-4xl mx-auto flex flex-col pt-8 px-4"
            >
                <h1 className="text-xl font-bold md:mx-10 mb-1.5">Add members to <i>{project.title}</i> project</h1>
                <span className="text-sm text-dim md:mx-10 mb-1">You can add members to your project now or skip this step for later if you have no one to add.</span>
                <span className="text-sm text-dim md:mx-10 italic mb-10">Required fields are marked with an asterisk (*).</span>
                <FieldGroup className="mt-5 md:mx-10">
                    <div className="w-full flex gap-4">
                        <Field className="gap-2 w-1/3">
                            <FieldLabel className="font-semibold w-1/2">Email Address / Username</FieldLabel>
                            <Input />
                            <FieldDescription>Checking ...</FieldDescription>
                        </Field>
                        <Field className="gap-2 w-1/3">
                            <FieldLabel className="font-semibold w-1/2">Roles</FieldLabel>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder={<span className="mr-2">Select a role</span>}/>
                                </SelectTrigger>
                                <SelectContent>
                                {
                                    roles.map(({name, items}) => (
                                        <SelectGroup>
                                            <SelectLabel>{name}</SelectLabel>
                                            {
                                                items.map((item) => <SelectItem value={item}>{item}</SelectItem>)
                                            }
                                        </SelectGroup>
                                    ))
                                }
                                </SelectContent>
                            </Select>
                        </Field>
                        <Button disabled={true} className="mt-6.5" variant="outline">Send Invite</Button>
                    </div>
                    <div className="w-full flex justify-end  max-w-4xl mx-auto py-4">
                        <Button className="mr-3 md:mr-0">View project</Button>
                    </div>
                </FieldGroup>
                
            </Form>   
        </AppLayout>
    )
}