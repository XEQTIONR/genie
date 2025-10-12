import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Toaster } from 'sonner';
import { useAppearance } from '@/hooks/use-appearance';

interface AppLayoutProps {
    maxWidth?: string,
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, maxWidth='md:max-w-10xl', ...props }: AppLayoutProps) => {
    const { appearance } = useAppearance();
    return (
    <AppLayoutTemplate maxWidth={maxWidth} breadcrumbs={breadcrumbs} {...props}>
        <Toaster theme={appearance} richColors position="top-right"/>
        {children}
    </AppLayoutTemplate>
)};
