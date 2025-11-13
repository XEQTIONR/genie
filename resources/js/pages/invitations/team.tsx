import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem, Team, TeamInvitation as TeamInvitationType } from '@/types'
import { Head, Link, router, useForm, usePage } from '@inertiajs/react'
import { show } from '@/routes/teamInvitation'
import { login, register } from '@/routes'
import { useInitials } from '@/hooks/use-initials'
import { update } from '@/routes/teamInvitation'
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
import { Bell, ShieldX } from 'lucide-react'
import { type SharedData } from '@/types';

export default function TeamInvitation({ invitation, mine } : { invitation: TeamInvitationType, mine: boolean  }) {

    const { auth } = usePage<SharedData>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Accept Invitation',
            href: invitation ? show(invitation).url : ""
        }
    ]

    const getInitials = useInitials();

    const { put } = useForm();

    return (
        <AppLayout maxWidth="md:max-w-7xl" breadcrumbs={breadcrumbs}>
            <Head title="Join team" />
            <Empty className="h-full">
                <EmptyHeader>
                    <EmptyMedia variant={mine ? "default" : "icon"}>
                    {
                        mine || !auth.user ? (
                            <Avatar variant="square" className="size-12">
                                <AvatarImage
                                    src={invitation.team.avatar}
                                />
                                <AvatarFallback>{getInitials(invitation.team.name)}</AvatarFallback>
                            </Avatar>
                        ) : <ShieldX />
                    }
                    </EmptyMedia>
                    <EmptyTitle>
                        { "Invitation to join " + invitation.team.name } 
                    </EmptyTitle>
                    <EmptyDescription>
                    {
                        (mine || !auth.user)
                            ? <>
                                 You&apos;ve been invited to join <b>{invitation.team.name}</b> by <b>{invitation.inviter.name}</b> <br />
                                 Assigned roles: <i>{invitation.roles.join(', ')}</i>
                            </>
                            : "This invitation is not meant for you"
                    }
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                {
                    <div className="flex gap-2">
                    {
                        mine ? (
                            <Button
                                onClick={() => {
                                    put(update(invitation).url)
                                }} 
                                type="button" 
                                className="cursor-pointer" 
                                size="sm"
                            >
                                Accept Invitation
                            </Button>
                        ) : auth.user 
                                ? null 
                                : <>
                                    <Button onClick={() => router.visit(login())} type="button" className="cursor-pointer" size="sm">
                                        Sign in to your account
                                    </Button>
                                    <Button onClick={() => router.visit(register().url + '?email=' + invitation.to_email)} variant="outline" type="button" className="cursor-pointer" size="sm">
                                        Register as new user
                                    </Button>
                                </>
                    }
                    </div>
                }
                </EmptyContent>
            </Empty>
        </AppLayout>
    )
}