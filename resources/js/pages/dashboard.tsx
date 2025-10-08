import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { SearchCheckIcon, SearchIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const items = (new Array(50)).fill(0)

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                
                <div className="h-full md:h-[450px] flex  gap-4 rounded-xl border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="w-1/2 flex gap-3 flex-col justify-center border-sidebar-border/70 dark:border-sidebar-border">
                        <p className="text-6xl font-bold">Find passionate people <br /> to build games with <br /> in 3 clicks.</p>
                        <div className="w-full relative">
                            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input className='pl-10' placeholder='What are you looking for?' />
                        </div>
                    </div>
                    <div className="w-1/2 border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {
                        items.map(() => (
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                        ))
                    }
                </div>
            </div>
        </AppLayout>
    );
}
