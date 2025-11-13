import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem, Team, TeamInvitation as TeamInvitationType } from '@/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import { show } from '@/routes/teamInvitation'
import { useInitials } from '@/hooks/use-initials'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function TeamInvitation({ invitation } : { invitation: TeamInvitationType }) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Accept Invitation',
            href: show(invitation).url
        }
    ]

    const getInitials = useInitials();

    return (
        <AppLayout maxWidth="md:max-w-7xl" breadcrumbs={breadcrumbs}>
            <Head title="Join team" />
            <Empty className="h-full">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                    <Avatar variant="square" className="size-12">
                        <AvatarImage
                            src={invitation.team.avatar}
                        />
                        <AvatarFallback>{getInitials(invitation.team.name)}</AvatarFallback>
                    </Avatar>
                    </EmptyMedia>
                    <EmptyTitle>Invitation to join {invitation.team.name}</EmptyTitle>
                    <EmptyDescription>
                        You&apos;ve been invited to join <b>{invitation.team.name}</b> by <b>{invitation.inviter.name}</b> <br />
                        Assigned roles: <i>{invitation.roles.join(', ')}</i>
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button className="cursor-pointer" size="sm">
                        Accept Invitation
                    </Button>
                </EmptyContent>
            </Empty>
        </AppLayout>
    )
}