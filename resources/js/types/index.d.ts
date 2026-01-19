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

    notifications: unknown[]
}

interface Location {
    city: string|null,
    country: string
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
    owner_id: string | number
    owner_type: ProjectOwner
    members?: ProjectMember[]
    cover_media: { url: string, mime: string}[]
    views_count?: number
    likes_count?: number
    likes: Like[]
    posts?: Post[]
    comments?: Comment[]
    comments_count?: number
    visibility: "public" | "private"
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
    banner: string
    description: string
    slug: string
    created_at: string
    updated_at: string
    users_count?: number
    projects_count?: number
    opportunities_count?: number
    owner_id: number
    posts?: Post[]
    activities?: Activity[]
    users?: (User & {
        pivot: {
            permissions: string[]
            roles: string[]
        }
    })[]

    invitations?: TeamInvitation[]
    opportunities?: Opportunity[]
    locations?: Location[]
    meta: null | {
        links?: string[]
        [key: string]: unknown
    }
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
    permissions: string[]|null
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
        websites?: string[]
        tools?: string[]
        socials?: string[]
    } | null
    owned_projects?: Project[]
    [key: string]: unknown // This allows for additional properties...
    posts?: Post[]
    owned_posts?: Post[]
    teams_count?: number
    projects_count?: number
    likes?: Like[]
}

export type Post = {
    id: number
    title: string
    body: unknown[]
    cover: string
    cover_type: string
    owner?: User|Team|Project
    owner_type: string
    num_likes?: number
    views_count?: number
    likes_count?: number
    likes?: Like[]
    comments?: Comment[]
    comments_count?: number
}

export type ProjectMember = User & {
    pivot: {
        roles: string[]
    }
}

export interface Opportunity {
    id: string
    compensation_type: string
    description: string
    employment_type: string[]
    location_type: string
    locations: Location[]
    primary_role: string|null
    tags?: string[]
    title: string
    work_location: string[]
    creator?: User
    owner?: Team | Project
    owner_id: number,
    owner_type: 'Team' | 'Project'
    created_at: string
    publish: boolean
}

export interface Comment {
    id: string
    commentable_id: string
    commentable_type: string
    user_id: number
    user?: User
    commentable?: Post|Project
    comment: string
    created_at: string
}
export interface Like {
    id: number
    likeable_type: string
    likeable_id: number
    user_id: number
}

export interface ImageBlock {
    block_id: number
    type: "image"
    file: File
    url?: string
}

export interface VideoBlock {
    block_id: number
    type: "video"
    file: File
    url?: string
}

export interface TextBlock {
    block_id: number
    type: "text"
    formats?: {
        [format: string]: unknown
    }
    contents?: Delta | Op[]
    html?: string 
}

export type MediaBlock = ImageBlock | VideoBlock | TextBlock

export interface Activity {
    id: string
    subject_type: string
    subject_id: number
    type: string
    created_at: string
    user?: User
    subject?: User|Team|Project|Post
    content?: {
        [key: string]: unknown
    }
    [others: string]: unknown
}
