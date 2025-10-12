import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { home } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { SearchIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: home().url,
    },
];

const items: Array<string> = []//(new Array(50)).fill(0)


export default function Home() {
    const [q, setQ] = useState("")
    
    return (
        <AppLayout maxWidth='md:max-w-7xl' breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col justify-center gap-4 overflow-x-auto rounded-xl p-4">
                
                <div className="h-full md:h-[450px] flex gap-4 justify-between rounded-xl border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="w-full lg:w-1/2 flex gap-6 flex-col justify-center border-sidebar-border/70 dark:border-sidebar-border">
                        <p className="text-6xl md:text-6xl font-bold">Find passionate people <br className="hidden md:inline" /> to build games with <br className="hidden md:inline" /> in 3 clicks.</p>
                        <form className="w-full relative">
                            <SearchIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-ring" />
                            <Input
                                value={q}
                                onChange={({target}) => setQ(target.value)} 
                                className="pl-10 py-6 text-lg"
                                textSizeClasses="text-lg" 
                                placeholder="What are you looking for?"
                            />
                            {
                                q.length > 0 &&
                                <XIcon
                                    onClick={() => setQ("")} 
                                    className="absolute hover:text-foreground cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-ring" 
                                />
                            }
                            
                        </form>
                    </div>
                    <div className="hidden lg:flex w-1/2 justify-end border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>
                </div>
                {
                    items.length > 0 && (
                        <>
                            <Separator />
                            <h2 className="text-xl font-bold">Discover</h2>
                            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                                {
                                    items.map(() => (
                                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                        </div>
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
