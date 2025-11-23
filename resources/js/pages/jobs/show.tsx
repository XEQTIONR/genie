import AppLayout from "@/layouts/app-layout"
import { show } from "@/routes/opportunities"
import { show as showUser } from "@/routes/users"
import { BreadcrumbItem, Opportunity } from "@/types"
import { Head, Link } from "@inertiajs/react"
import '/resources/css/projects.css'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useInitials } from "@/hooks/use-initials"

export default function ShowJobPosting({ job } : { job: { data: Opportunity } }) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Show Project',
            href: show({
                id: job.data.id
            }).url
        }
    ]

    const getInitials = useInitials()

    return (
        <AppLayout maxBodyWidth="md:max-w-4xl" breadcrumbs={breadcrumbs}>
            <Head title={job.data.title} />
            <div className="w-full flex flex-col px-4 md:px-0">
                <h1 className="mt-14 text-xl font-medium mb-0.5">{job.data.title}</h1>
                <div className="flex flex-wrap gap-4 mb-3 text-dim text-sm">{
                    job.data.location_type == 'global' 
                        ? "WorldWide"
                        : job.data.locations.map((l) => <span>{l.city} {l.country}</span>)
                }</div>
                <div className="flex flex-wrap gap-1 mb-5">
                    {job.data.tags?.map(t => <Badge variant="secondary">{t}</Badge>)}
                </div>
                
                <div className="mb-4">
                    <Button>Inquire about this position</Button>
                </div>

                <div id="description" dangerouslySetInnerHTML={{ __html: job.data.description}} className="w-full">
                </div>

                {
                    job.data.creator &&
                    <div className="w-full flex flex-col gap-1">
                        <span className="text-sm">Posted by</span>
                        <Link href={showUser({ username: job.data.creator.username })} className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src={job.data.creator?.avatar} />
                                <AvatarFallback>{ getInitials(job.data.creator.name ?? "") }</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">{job.data.creator?.name}</span>
                                <span className="text-xs">{(new Date(job.data.created_at)).toDateString()}</span>
                            </div>
                        </Link>
                    </div>
                }
                

                <Separator className="mt-10" />
                <div className="w-full flex flex-col gap-5 items-center py-14">
                    <span className="font-semibold text-center">Interested in this opportunity ?</span>
                    <span className="text-dim text-center">Take a first step towards creating something truly awesome.</span>
                    {/* <div className="mb-4"> */}
                        <Button>Inquire about this position</Button>
                    {/* </div> */}
                </div>
            </div>
        </AppLayout>
    )
}