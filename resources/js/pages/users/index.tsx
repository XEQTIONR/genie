import AppLayout from "@/layouts/app-layout"
import { show, index } from "@/routes/users"
import { Form, Head, Link } from "@inertiajs/react"
import { BreadcrumbItem, Opportunity, User } from "@/types"
import OpportunityList from "@/components/opportunity-list"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useInitials } from "@/hooks/use-initials"
import GridCard from "@/components/grid-card"
import { PencilRuler, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export default function UserIndex({users}: {users: User[]}) {
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Opportunities',
            href: index().url
        }
    ]

    const getInitials = useInitials()

    return (
        <AppLayout maxBodyWidth="md:max-w-9xl" breadcrumbs={breadcrumbs}>
            <Head title="Opportunities" />
            <h1 className="text-2xl font-bold mt-5">Find users</h1>
            <span className="mb-5 text-sm">Find creative professionals ready to work on your next project.</span>
            <div className="w-full flex">
                <div className="w-full flex flex-col gap-5">
                    {
                        users.map(({username, name, avatar, owned_posts, teams_count, projects_count}) => (
                            <Link href={show({ username: username })} className="w-full border rounded-lg flex flex-col gap-3 p-3 transition-shadow duration-300 dark:shadow-neutral-900 hover:shadow-md">
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-14">
                                        <AvatarImage src={avatar} />
                                        <AvatarFallback>{getInitials(name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col relative -top-0.5">
                                        <span className="font-semibold text-lg">{name}</span>
                                        <ul className="flex gap-4">
                                            <li className="flex items-center gap-1 text-sm text-neutral-500"><Users className="size-4 stroke-neutral-500 " /> {teams_count} teams</li>
                                            <li className="flex items-center gap-1 text-sm text-neutral-500"><PencilRuler className="size-4 stroke-neutral-500 " /> {projects_count} projects</li>
                                        </ul>
                                    </div>
                                    
                                </div>
                                
                                {
                                    owned_posts && owned_posts.length > 0 && (
                                        <div className="w-full grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                                        {
                                            owned_posts.map((post, index) => <GridCard 
                                                className={cn(
                                                    index < 2 ? "flex" : "hidden", 
                                                    index == 4 && "xl:flex",
                                                    index == 3 && "lg:flex",
                                                    index == 2 && "md:flex",
                                                )} 
                                                post={post} 
                                                showAuthor={false} 
                                            />)
                                        }
                                        </div>
                                    )
                                }
                                
                            </Link>
                        ))
                    }
                </div>
            </div>
        </AppLayout>
    )
}