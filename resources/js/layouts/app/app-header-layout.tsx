import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
    maxHeaderWidth,
    maxBodyWidth,
    stickyAfter = 0,
    customMargin = ""
}: PropsWithChildren<{ 
    breadcrumbs?: BreadcrumbItem[],
    maxHeaderWidth: string, 
    maxBodyWidth: string, 
    stickyAfter?: number
    customMargin?: string
}>) {
    return (
        <AppShell>
            <AppHeader 
                stickyAfter={stickyAfter} 
                maxWidth={maxHeaderWidth} 
                breadcrumbs={breadcrumbs}
                customMargin={customMargin} 
            />
            <AppContent maxWidth={maxBodyWidth}>{children}</AppContent>
        </AppShell>
    );
}
