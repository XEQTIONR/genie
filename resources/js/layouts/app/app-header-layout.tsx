import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
    maxWidth,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[], maxWidth: string }>) {
    return (
        <AppShell>
            <AppHeader maxWidth={maxWidth} breadcrumbs={breadcrumbs} />
            <AppContent maxWidth={maxWidth}>{children}</AppContent>
        </AppShell>
    );
}
