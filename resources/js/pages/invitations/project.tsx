import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem, ProjectInvitation as ProjectInvitationType } from '@/types'
import { Head, router, useForm, usePage } from '@inertiajs/react'
import { login, register } from '@/routes'
import { useInitials } from '@/hooks/use-initials'
import { show, update } from '@/routes/projectInvitation'
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
import { ShieldX } from 'lucide-react'
import { type SharedData } from '@/types';

export default function ProjectInvitation({ invitation, mine } : { invitation: ProjectInvitationType, mine: boolean  }) {

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
                                    src=""
                                />
                                <AvatarFallback>{getInitials(invitation.project.title)}</AvatarFallback>
                            </Avatar>
                        ) : <ShieldX />
                    }
                    </EmptyMedia>
                    <EmptyTitle>
                        { "Invitation to join " + invitation.project.title } 
                    </EmptyTitle>
                    <EmptyDescription>
                    {
                        (mine || !auth.user)
                            ? <>
                                 You&apos;ve been invited to join <b>{invitation.project.title}</b> by <b>{invitation.inviter.name}</b> <br />
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