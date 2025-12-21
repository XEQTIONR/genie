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
}: PropsWithChildren<{ 
    breadcrumbs?: BreadcrumbItem[],
    maxHeaderWidth: string, 
    maxBodyWidth: string, 
    stickyAfter?: number
}>) {
    return (
        <AppShell>
            <AppHeader stickyAfter={stickyAfter} maxWidth={maxHeaderWidth} breadcrumbs={breadcrumbs} />
            <AppContent maxWidth={maxBodyWidth}>{children}</AppContent>
        </AppShell>
    );
}
