import AppLayout from '@/layouts/app-layout'
import { Post, Team, type BreadcrumbItem } from '@/types'
import { Head, Link, router } from '@inertiajs/react'
import { index, show } from '@/routes/teams'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { AvatarImage } from '@radix-ui/react-avatar';
import { useInitials } from '@/hooks/use-initials';
import { Bookmark, BriefcaseBusiness, GalleryHorizontalEnd, Heart, Lightbulb, Moon, PencilRuler, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GridCard from '@/components/grid-card';
import { cn } from '@/lib/utils';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Teams',
        href: index().url,
    },
];


export default function TeamsIndex({ teams } : { teams: Team[]}) {

    const getInitials = useInitials()
    const cl = 'col-span-1 col-span-2 col-span-3 col-span-4 col-span-5'

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Team" />
            <h1 className="text-2xl font-bold mt-5 w-full max-w-9xl mx-auto">Teams</h1>
            <span className="mb-5 text-sm w-full max-w-9xl mx-auto">Teams of great people.</span>
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
                                                            <span className="font-bold text-xl">{team.name}</span>
                                                            <span className="px-1 py-0.5 text-xs font-bold rounded bg-foreground text-background">STUDIO</span>
                                                        </div>
                                                        <div className="flex gap-5">
                                                            <span className="flex items-center gap-1 font-semibold text-sm"><Users size={16} /> {team?.users_count} members</span>
                                                            <span className="flex items-center gap-1 font-semibold text-sm"><PencilRuler size={16} /> {team?.projects_count} projects</span>
                                                            <span className="flex items-center gap-1 font-semibold text-sm"><BriefcaseBusiness size={16} /> {team?.opportunities_count} opportunities</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <Button variant="outline" className="rounded-full" size="icon-lg"><Bookmark /></Button>
                                                    <Button variant="outline" className="rounded-full" size="icon-lg"><Heart /></Button>
                                                    <Button className="rounded-3xl">Get in touch</Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-5 w-full gap-5">
                                            {
                                                team.posts?.map((post) => <GridCard post={post} showAuthor={false} />)
                                            }
                                            {
                                                ((5 - (team.posts?.length ?? 0)) < 5  && (5 - (team.posts?.length ?? 0)) > 0)?
                                                <div 
                                                    className={cn('w-full h-full flex justify-center items-center rounded bg-foreground/5 col-span-' + (5 - (team.posts?.length ?? 0)))}
                                                >
                                                    <Empty>
                                                        <EmptyHeader>
                                                            <EmptyMedia className="bg-background dark:bg-muted" variant="icon">
                                                                <GalleryHorizontalEnd />
                                                            </EmptyMedia>
                                                            <EmptyTitle>No more posts to show</EmptyTitle>
                                                        </EmptyHeader>
                                                    </Empty>
                                                </div>: null
                                            }
                                            {
                                                team.posts?.length == 0 &&
                                                <div 
                                                    className={'w-full col-span-5 flex justify-center   rounded bg-foreground/5'}
                                                >
                                                    
                                                    {/* <div className="absolute left-1/2 top-1/2">No more</div> */}
                                                    <div className='h-full aspect-grid w-1/5 flex justify-center items-center'>
                                                        <Empty>
                                                            <EmptyHeader>
                                                                <EmptyMedia className="bg-background dark:bg-muted" variant="icon">
                                                                    <GalleryHorizontalEnd />
                                                                </EmptyMedia>
                                                                <EmptyTitle>This team has no posts</EmptyTitle>
                                                            </EmptyHeader>
                                                        </Empty>
                                                    </div>
                                                </div>
                                            }
                                            </div>
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
