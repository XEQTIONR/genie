import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import { USERMODEL, TEAMMODEL } from './values'
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

type ProjectOwnerTypeUser = typeof USERMODEL
type ProjectOwnerTypeTeam = typeof TEAMMODEL
export type ProjectOwner = ProjectOwnerTypeUser | ProjectOwnerTypeTeam

export interface Project {
    id: number
    title: string
    slug: string
    excerpt?: string
    platforms: string[]
    description: string
    body: string
    status: string | null
    creator?: User
    owner?: User | Team
    owner_type: ProjectOwner
    members?: ProjectMember[]
}

export interface ProjectInvitation {
    id: string
    to_email: string
    project: Project
    inviter: User
    invitee?: User
    project_id: number
    inviter_id: number
    invitee_id: number
    roles: string[]
}

export interface Team {
    id: number
    name: string
    avatar: string
    description: string
    slug: string
    created_at: string
    updated_at: string
    users_count?: number
    owner_id: number
}

export interface TeamInvitation {
    id: string
    to_email: string
    team: Team
    inviter: User
    invitee?: User
    team_id: number
    inviter_id: number
    invitee_id: number
    roles: string[]
}

export interface User {
    id: number
    username: string
    name: string
    email: string
    avatar?: string
    banner?: string
    email_verified_at: string | null
    location: { city: string, country: string } | null
    two_factor_enabled?: boolean
    status: string | null
    bio: string | null
    created_at: string
    updated_at: string
    meta: {
        fav_games?: string[]
        skills?: string[]
    } | null
    owned_projects?: Project[]
    [key: string]: unknown // This allows for additional properties...
}

export type ProjectMember = User & {
    pivot: {
        roles: string[]
    }
}
