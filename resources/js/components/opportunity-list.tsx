import { Badge } from '@/components/ui/badge'
import { Opportunity } from "@/types";
import { show as showJobPosting } from "@/routes/opportunities"
import { Link } from '@inertiajs/react'
import roles from '@/data/roles'
import { Avatar, AvatarFallback } from './ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { useInitials } from '@/hooks/use-initials';
import { PencilRuler } from 'lucide-react';

export default function OpportunityList({opportunities} : {opportunities: Opportunity[]}) {

    const getInitials = useInitials()
    return (
        opportunities.map(({id, title, tags, work_location, compensation_type, employment_type, location_type, locations, primary_role, owner, owner_type}) => (
            <Link href={showJobPosting({ id: id })} className="flex flex-col py-7 border-b">
                
                <div className="cursor-pointer">
                    
                    <div className='flex gap-2 items-center'>
                        {
                            owner_type == "Team" && (
                                <>
                                    <Avatar className="size-6" variant="square">
                                        <AvatarImage src={owner?.avatar} />
                                        <AvatarFallback variant="square">{ getInitials(owner?.name ?? "") }</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">{owner?.name}</span>
                                        {/* <span className="text-xs">{(new Date(job.data.created_at)).toDateString()}</span> */}
                                    </div>
                                </>
                            )
                        }

                        {
                            owner_type == "Project" && (
                                <>
                                    <PencilRuler className='size-5' />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">{owner?.title}</span>
                                        {/* <span className="text-xs">{(new Date(job.data.created_at)).toDateString()}</span> */}
                                    </div>
                                </>
                            )
                        }
                            
                    </div>
                   
                    <h3 className="text-lg font-semibold mt-1">{title}</h3>
                    <div className="text-sm mt-0.5">
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