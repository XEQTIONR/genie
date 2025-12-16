import AppLayout from "@/layouts/app-layout"
import { show, index } from "@/routes/users"
import { Form, Head, Link } from "@inertiajs/react"
import { BreadcrumbItem, Opportunity, User } from "@/types"
import OpportunityList from "@/components/opportunity-list"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useInitials } from "@/hooks/use-initials"

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
                        users.map(({username, name, avatar}) => (
                            <Link href={show({ username: username })} className="w-full border rounded-lg flex items-center gap-3 p-3 transition-shadow duration-300 dark:shadow-neutral-900 hover:shadow-md">
                                <Avatar className="size-12">
                                    <AvatarImage src={avatar} />
                                    <AvatarFallback>{getInitials(name)}</AvatarFallback>
                                </Avatar>
                                <div className="">
                                    <span className="font-bold">{name}</span>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </AppLayout>
    )
}