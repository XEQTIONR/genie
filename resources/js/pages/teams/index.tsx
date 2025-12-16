import AppLayout from '@/layouts/app-layout'
import { Post, Team, type BreadcrumbItem } from '@/types'
import { Head, Link, router } from '@inertiajs/react'
import { index, show } from '@/routes/teams'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { AvatarImage } from '@radix-ui/react-avatar';
import { useInitials } from '@/hooks/use-initials';
import { Bookmark, BriefcaseBusiness, Heart, PencilRuler, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Teams',
        href: index().url,
    },
];


export default function TeamsIndex({ teams } : { teams: Team[]}) {

    const getInitials = useInitials()

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teamw" />
            <div className="flex flex-col items-center gap-4 overflow-x-auto rounded-xl p-4">
                {
                    teams.length > 0 && (
                        <>
                            <div className="flex flex-col gap-10 w-full max-w-9xl">
                                {
                                    teams.map((team) => (
                                        <Link href={show({team: team.slug})} className="flex flex-col gap-6 w-full border bg-background  rounded-xl px-6 py-5  dark:shadow-neutral-900 hover:shadow-lg duration-300 p-4">
                                            <div className="w-full flex justify-between">
                                                <div className="flex gap-3">
                                                    <Avatar variant="square" className="size-16">
                                                        <AvatarImage src={team.avatar} />
                                                        <AvatarFallback variant="square">{getInitials(team.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-2xl">{team.name}</span>
                                                            <span className="px-1 py-0.5 text-xs font-bold rounded bg-foreground text-background">STUDIO</span>
                                                        </div>
                                                        <div className="flex gap-5">
                                                            <span className="flex items-center gap-1 text-sm"><Users size={16} /> 52 members</span>
                                                            <span className="flex items-center gap-1 text-sm"><PencilRuler size={16} /> 5 projects</span>
                                                            <span className="flex items-center gap-1 text-sm"><BriefcaseBusiness size={16} /> 8 opportunities</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <Button variant="outline" className="rounded-full" size="icon-lg"><Bookmark /></Button>
                                                    <Button variant="outline" className="rounded-full" size="icon-lg"><Heart /></Button>
                                                    <Button className="rounded-3xl">Get in touch</Button>
                                                </div>
                                            </div>
                                            <div className="flex w-full gap-5">
                                                <div className="w-1/4 aspect-grid border rounded-lg"></div>
                                                <div className="w-1/4 aspect-grid border rounded-lg"></div>
                                                <div className="w-1/4 aspect-grid border rounded-lg"></div>
                                                <div className="w-1/4 aspect-grid border rounded-lg"></div>
                                            </div>
                                            
                                            {/* {team.avatar} */}
                                        </Link>
                                    ))
                                }
                            </div>
                        </>
                    )
                }
            </div>
        </AppLayout>
    );
}
