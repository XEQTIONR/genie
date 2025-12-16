import AppLayout from "@/layouts/app-layout"
import { show, index } from "@/routes/opportunities"
import { Form, Head, Link } from "@inertiajs/react"
import { BreadcrumbItem, Opportunity } from "@/types"
import OpportunityList from "@/components/opportunity-list"

export default function JobsIndex({opportunities}: {opportunities: { data: Opportunity[]}}) {
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Opportunities',
            href: index().url
        }
    ]

    return (
        <AppLayout maxBodyWidth="md:max-w-10xl" breadcrumbs={breadcrumbs}>
            <Head title="Opportunities" />
            <div className="w-full flex flex-col px-3">
                <OpportunityList opportunities={opportunities.data ?? []} />
            </div>
        </AppLayout>
    )
}