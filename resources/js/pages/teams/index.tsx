import AppLayout from '@/layouts/app-layout'
import { Team, type BreadcrumbItem } from '@/types'
import { Head, Link, router } from '@inertiajs/react'
import { index, show } from '@/routes/teams'
import { useInitials } from '@/hooks/use-initials';
import { DraftingCompass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Group } from '@/components/icons/svgs';
import { Separator } from '@/components/ui/separator';
import { create } from '@/routes/teams';
import { Chip } from '@/components/ui/chip';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Teams',
        href: index().url,
    },
];

function Card({team} : {team: Team}) {

    const chipText = (team.opportunities_count ?? 0) > 0
        ? (team.opportunities_count ?? 0) == 1
            ? `Looking for ${team.opportunities?.[0].primary_role}`
            : `${team.opportunities_count} opportunities`
        : ''

    return <Link 
            href={show({team: team.slug})} 
            className="flex flex-col w-full dark:bg-theme-950 px-6 py-6  dark:shadow-neutral-900 hover:shadow-lg duration-300"
        >
            <div className="w-full flex flex-col justify-between grow">
                <div>
                    <div className='flex justify-between items-start'>
                        <div
                            style={{ backgroundImage: `url(${team.avatar})`}}
                            className="rounded size-12"
                        />
                        <span className="text-xs uppercase dark:text-neutral-700 font-medium">Since {(new Date(team.created_at)).getFullYear()}</span>
                    </div>
                    <h3 className="font-bold uppercase text-lg mt-5 mb-3">{team.name}</h3>
                    <span className="text-sm text-dim font-medium line-clamp-3 text-ellipsis">{team.description}</span>
                </div>
                <div>
                    <Separator className="mt-5 mb-4" />
                    <div className='flex justify-between'>
                        <div className='flex gap-5'>
                            <div className='flex items-center gap-1'>
                                <Group />
                                <span className='text-sm font-medium font-mono'>{team.users_count}</span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <DraftingCompass size={14} />
                                <span className='text-sm font-medium font-mono'>{team.projects_count}</span>
                            </div>
                        </div>
                        {
                            chipText.length > 0 && <Chip variant="theme-simple" textSize="text-xs">{chipText}</Chip>
                        }
                    </div>
                </div>
            </div>
        </Link>
}


export default function TeamsIndex({ teams } : { teams: Team[]}) {

    const getInitials = useInitials()
    const cl = 'col-span-1 col-span-2 col-span-3 col-span-4 col-span-5'

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Team" />
            
            {/* <span className="text-9xl font-bold relative left-2 -mb-36 opacity-10 max-w-[50vw]">Projects</span> */}
            <span className="font-mono uppercase mt-6 mb-2 ml-5 text-sm text-theme-950 dark:text-theme-200 tracking-widest">Network Ecosystem</span>
            <span className="text-6xl font-bold mt-2 mb-2 ml-5 mx-auto">Teams</span>
            <span className="mb-2 ml-5 text-lg text-dim max-w-xl">
                The void is vast, but you don't have to nagivate it alone.
                Connect with studios, agile indie squads, and experimental collectives
                building the next generate of digital worlds.
            </span>
            <div className="flex ml-5 mb-10">
                <Button 
                    onClick={() => router.visit(create())} 
                    variant="theme"
                    className="cursor-pointer"
                >
                    Form a team
                </Button>
            </div>
            <div className="flex flex-col items-center gap-4 overflow-x-auto rounded-xl p-4">
                {
                    teams.length > 0 && (
                        <div className="grid grid-cols-4 gap-7 w-full">
                            {
                                teams.map((team) => (
                                    <Card team={team} />
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </AppLayout>
    );
}
