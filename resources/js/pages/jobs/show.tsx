import AppLayout from "@/layouts/app-layout"
import { show } from "@/routes/opportunities"
import { show as showUser } from "@/routes/users"
import { show as showTeam } from "@/routes/teams"
import { show as showProject } from "@/routes/projects"
import { store } from "@/routes/opportunities/inquiries"
import { BreadcrumbItem, Opportunity } from "@/types"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, Head, Link } from "@inertiajs/react"
import '/resources/css/projects.css'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useInitials } from "@/hooks/use-initials"
import { useEffect, useState } from "react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PencilRuler, Send } from "lucide-react"

export default function ShowJobPosting({ job, notification } : { job: { data: Opportunity }, notification: object }) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Show Project',
            href: show({
                id: job.data.id
            }).url
        }
    ]

    const [showDialog, setShowDialog] = useState(false)

    const getInitials = useInitials()

    useEffect(() => {
        if (notification) {
            setShowDialog(false)
        }
    }, [notification])

    return (
        <AppLayout maxBodyWidth="md:max-w-4xl" breadcrumbs={breadcrumbs}>
            <Head title={job.data.title} />
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="md:max-w-[60vw] aspect-video md:p-10">
                    <div className="w-full h-full flex flex-col lg:flex-row lg:gap-20">
                        <div className="w-full md:h-full">
                            <h1 className="text-3xl md:text-5xl mt-[10%] md:mt-[25%] font-medium">Inquire about</h1>
                            {/* <h2 className="text-xl mt-1">{job.data.title}</h2> */}
                            <h2 className="mt-2 font-medium">{job.data.title}</h2>
                            <p className="text-sm mt-2">Introduce yourself and speak about why you are interested in this position.</p>
                            <div className="mt-4 flex items-center gap-3">
                                <Avatar className="md:size-12 lg:size-14">
                                    <AvatarImage src={job.data.creator?.avatar} />
                                    <AvatarFallback>{ getInitials(job.data.creator?.name ?? "") }</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-base">{job.data.creator?.name}</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-full flex flex-col justify-between">
                            <Form action={store(job.data.id)} className="mt-6 lg:mt-[25%] grow flex flex-col gap-5 md:gap-10 justify-between">
                                <FieldGroup className="flex flex-col grow gap-4.5">
                                    <Field>
                                        <FieldLabel>Full Name *</FieldLabel>
                                        <Input name="name" />
                                    </Field>
                                    <Field>
                                        <FieldLabel>Email *</FieldLabel>
                                        <Input name="email" />
                                    </Field>
                                    <Field className="h-full flex flex-col grow">
                                        <FieldLabel>Message *</FieldLabel>
                                        <Textarea name="message" className="grow" />
                                    </Field>
                                </FieldGroup>
                                <div className="w-full flex justify-end">
                                    <Button type="submit" className="font-semibold" size="lg">
                                        <Send /> Send Message
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </DialogContent>

            </Dialog>
            <div className="w-full flex flex-col px-4 mt-5 ">
                {
                    job.data.owner_type == 'Team' &&
                    
                        <Link 
                            href={showTeam({ slug: job.data.owner?.slug })} 
                            className="flex items-center gap-2 mb-2"
                        >
                            <Avatar variant="square">
                                <AvatarImage src={job.data.owner?.avatar} />
                                <AvatarFallback variant="square">{ getInitials(job.data.owner?.name ?? "") }</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">{job.data.owner?.name}</span>
                                {/* <span className="text-xs">{(new Date(job.data.created_at)).toDateString()}</span> */}
                            </div>
                        </Link>

                }
                {
                    job.data.owner_type == 'Project' &&
                    
                        <Link 
                            href={showProject({ slug: job.data.owner?.slug })}
                            className="flex items-center gap-2 mb-2"
                        >
                            <PencilRuler className="size-5" />
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">{job.data.owner?.title}</span>
                                {/* <span className="text-xs">{(new Date(job.data.created_at)).toDateString()}</span> */}
                            </div>
                        </Link>

                }
                <h1 className="text-xl font-medium mb-0.5">{job.data.title}</h1>
                <div className="flex flex-wrap gap-4 mb-3 text-dim text-sm">{
                    job.data.location_type == 'global' 
                        ? "WorldWide"
                        : job.data.locations.map((l) => <span>{l.city} {l.country}</span>)
                }</div>
                <div className="flex flex-wrap gap-1 mb-5">
                    {job.data.tags?.map(t => <Badge variant="secondary">{t}</Badge>)}
                </div>
                
                <div className="mb-4">
                    <Button onClick={() => setShowDialog(true)}>Inquire about this position</Button>
                </div>

                <div id="description" dangerouslySetInnerHTML={{ __html: job.data.description}} className="w-full">
                </div>

                <div className="flex w-full justify-between">
                {
                    job.data.creator &&
                    <div className="flex flex-col gap-1">
                        <span className="text-sm">Posted by</span>
                        <Link href={showUser({ username: job.data.creator.username })} className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src={job.data.creator?.avatar} />
                                <AvatarFallback className="text-xs">{ getInitials(job.data.creator.name ?? "") }</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">{job.data.creator?.name}</span>
                                <span className="text-xs">{(new Date(job.data.created_at)).toDateString()}</span>
                            </div>
                        </Link>
                    </div>
                }
                {
                    job.data.owner_type == 'Team' &&
                    <div className="flex flex-col gap-1">
                        <span className="text-sm">Team</span>
                        <Link 
                            href={showTeam({ slug: job.data.owner?.slug })} 
                            className="flex gap-2"
                        >
                            <Avatar variant="square">
                                <AvatarImage src={job.data.owner?.avatar} />
                                <AvatarFallback variant="square">{ getInitials(job.data.owner?.name ?? "") }</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">{job.data.owner?.name}</span>
                                {/* <span className="text-xs">{(new Date(job.data.created_at)).toDateString()}</span> */}
                            </div>
                        </Link>
                    </div>
                }
                {
                    job.data.owner_type == 'Project' &&
                    <div className="flex flex-col gap-1">
                        <span className="text-sm">Project</span>
                        <Link 
                            href="#"
                            className="flex gap-2"
                        >
                            <Avatar variant="square">
                                <AvatarImage src={job.data.owner?.avatar} />
                                <AvatarFallback variant="square" className="text-xs">{ getInitials(job.data.owner?.title ?? "") }</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">{job.data.owner?.title}</span>
                                {/* <span className="text-xs">{(new Date(job.data.created_at)).toDateString()}</span> */}
                            </div>
                        </Link>
                    </div>
                }
                </div>
                

                <Separator className="mt-10" />
                <div className="w-full flex flex-col gap-5 items-center py-14">
                    <span className="font-semibold text-center">Interested in this opportunity ?</span>
                    <span className="text-dim text-center">Take a first step towards creating something truly awesome.</span>
                    {/* <div className="mb-4"> */}
                        <Button onClick={() => setShowDialog(true)}>Inquire about this position</Button>
                    {/* </div> */}
                </div>
            </div>
        </AppLayout>
    )
}