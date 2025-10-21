import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

interface NotificationButton {
    label: string
    link: string
}
export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
    notification? : { 
        type: 'info' | 'warning' | 'error',
        message: string,
        button: NotificationButton | null
    }
}

export interface Team {
    id: number
    name: string
    description: string
    slug: string
    created_at: string
    updated_at: string
    users_count?: number
    owner_id: number
}

export interface User {
    id: number
    username: string
    name: string
    email: string
    avatar?: string
    email_verified_at: string | null
    location: { city: string, country: string } | null
    two_factor_enabled?: boolean
    status: string | null
    bio: string | null
    created_at: string
    updated_at: string
    [key: string]: unknown // This allows for additional properties...
}
