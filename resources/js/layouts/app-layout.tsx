import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Toaster } from 'sonner';
import { useAppearance } from '@/hooks/use-appearance';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    maxWidth?: string,
    maxHeaderWidth?: string,
    maxBodyWidth?: string,
    stickyAfter?: number
}

export default ({ 
    children, 
    breadcrumbs, 
    maxWidth='md:max-w-10xl',
    maxHeaderWidth,
    maxBodyWidth,
    stickyAfter = 0,
    ...props 
}: AppLayoutProps) => {
    const { appearance } = useAppearance();
    const hWidth = maxHeaderWidth ?? maxWidth
    const bWidth = maxBodyWidth ?? maxWidth
    return (
        <AppLayoutTemplate
            stickyAfter={stickyAfter}
            maxHeaderWidth={hWidth}
            maxBodyWidth={bWidth}
            breadcrumbs={breadcrumbs} 
            {...props}
        >
            <Toaster offset={{ top: '75px' }} theme={appearance} richColors position="top-center"/>
            {children}
        </AppLayoutTemplate>
    )
}
