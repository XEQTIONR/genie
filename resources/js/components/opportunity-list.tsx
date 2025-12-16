import { Badge } from '@/components/ui/badge'
import { Opportunity } from "@/types";
import { show as showJobPosting } from "@/routes/opportunities"
import { Link } from '@inertiajs/react'
import roles from '@/data/roles'

export default function OpportunityList({opportunities} : {opportunities: Opportunity[]}) {
    return (
        opportunities.map(({id, title, tags, work_location, compensation_type, employment_type, location_type, locations, primary_role}) => (
            <Link href={showJobPosting({ id: id })} className="flex flex-col py-7 border-b">
                <div className="cursor-pointer">
                <h3 className="text-lg font-semibold pl-1">{title}</h3>
                <div className="text-sm pl-1 mt-0.5">
                    {
                        work_location.map((l => l.charAt(0).toUpperCase() + l.slice(1))).join(" / ")
                    }
                    <span className="mx-1.5">&bull;</span>
                    {
                        compensation_type.charAt(0).toUpperCase() + compensation_type.slice(1)
                    }
                    <span className="mx-1.5">&bull;</span>
                    {
                        employment_type.map((l => l.charAt(0).toUpperCase() + l.slice(1))).sort((a, b) => a < b ? 1 : -1).join(" / ")
                    }
                    <span className="mx-1.5">&bull;</span>
                    {
                        location_type === 'global'
                            ? 'Worldwide'
                            : locations.map(({city, country}) => city ? `${city}, ${country}` : country).join(" / ") 
                    }
                </div>
                <div className="flex flex-wrap gap-1.5 mt-5">
                    { tags?.map((tag) => <Badge className="text-sm" variant="secondary">{tag}</Badge>)}
                    {
                        primary_role
                            ? <>
                                
                                <Badge className="text-sm" variant="secondary">{ primary_role }</Badge>
                                <Badge className="text-sm" variant="secondary">{
                                    roles.find(({items}) => items.includes(primary_role))?.name
                                }</Badge>
                            </>
                            : null
                    }
                </div>
                </div>
            </Link>
        ))
    )
}