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
        <AppLayout maxBodyWidth="md:max-w-9xl" breadcrumbs={breadcrumbs}>
            <Head title="Opportunities" />
            <h1 className="text-2xl font-bold mt-5">Opportunities</h1>
            <span className="mb-5 text-sm">Find opportunitites on projects or teams where you can help.</span>
            <div className="w-full flex flex-col">
                <OpportunityList opportunities={opportunities.data ?? []} />
            </div>
        </AppLayout>
    )
}