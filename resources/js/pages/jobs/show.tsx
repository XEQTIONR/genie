import AppLayout from "@/layouts/app-layout";
import { show } from "@/routes/jobs";
import { BreadcrumbItem, JobPosting } from "@/types";
import { Head } from "@inertiajs/react";
import '/resources/css/projects.css'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ShowJobPosting({ job } : { job: { data: JobPosting } }) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Show Project',
            href: show({
                id: job.data.id
            }).url
        }
    ]

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