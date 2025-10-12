import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    maxWidth?: string,
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, maxWidth='md:max-w-10xl', ...props }: AppLayoutProps) => (
    <AppLayoutTemplate maxWidth={maxWidth} breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppLayoutTemplate>
);
