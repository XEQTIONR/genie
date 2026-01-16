import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react'
import { login } from '@/routes';
import { toast } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { home } from '@/routes';
import { show } from '@/routes/users'
import { index as indexPosts, create as createPost } from '@/routes/posts'
import { index as indexTeams } from '@/routes/teams'
import { index as indexProjects } from '@/routes/projects'
import { index as indexJobs } from '@/routes/opportunities'
import { index as indexUsers } from '@/routes/users';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BadgeHelpIcon, Bell, BookOpen, BriefcaseBusiness, ChevronDown, Folder, Handshake, Lightbulb, LogIn, LucideIcon, Menu, MessageCircle, MessageSquareText, PencilRuler, Plus, Search, ShieldAlertIcon, User2, UserRoundSearch, UserSearch } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce'
import { Input } from './ui/input';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from './ui/item';

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

function ListItem({
  icon,
  iconSize,
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { icon?: LucideIcon, iconSize?: string, href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
            <div className="flex w-full gap-3 items-start">
                {/* <Lightbulb /> */}
                { icon && <Icon className={cn("stroke-foreground", iconSize ?? "size-5")} iconNode={icon} /> }
                <div className="flex flex-col">
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </div>
            </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[]
    maxWidth: string
    stickyAfter?: number
}

export function AppHeader({ breadcrumbs = [], maxWidth, stickyAfter = 0 }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth, notification } = page.props;
    const getInitials = useInitials();

    const [scrollY, setScrollY] = useState(window.scrollY ?? 0)
    const [searchType, setSearchType] = useState('Ideas')
    const [showMobileSearchBar, setShowMobileSearchBar] = useState(false)

    const fn = useDebouncedCallback(() => {
        console.log('setScrollY', window.scrollY)
        setScrollY(window.scrollY)
    }, 100)

    const mainNavItems: NavItem[] = [
        {
            title: 'Home',
            href: home().url,
            // icon: BookOpen,
        },
    ];

    if (auth.user) {
        mainNavItems.push({
            title: 'Profile',
            href: show({ user: auth.user.username }).url,
            // icon: LayoutGrid,
        })
    }

    useEffect(() => {
        if (notification) {
            setTimeout(() => {
                toast(notification.message,  {
                    type: notification.type
                })
            }, 500)
        }
    }, [notification]);

    const isMobile = useIsMobile()

    useEffect(() => {
        const f = () => {
            // console.log(window.scrollY)
            fn()
        }
        window.addEventListener('scroll', f)

        return () => window.removeEventListener('scroll', f)
    }, [])

    return (
        <>
            
            
            <div className={cn(
                "h-20 top-0 z-50 bg-background",
                scrollY >= stickyAfter ? "sticky" : null
            )}>
                <div className={cn(
                    "w-full h-20",
                    scrollY >= stickyAfter ? "fixed" : null
                )}>
                    <div className={cn(
                        "mx-auto flex justify-between lg:gap-5 items-center px-4 my-auto h-20",
                        maxWidth
                    )}>
                        {/* Mobile Menu */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="mr-2 h-[34px] w-[34px]"
                                    >
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
                                >
                                    <SheetTitle className="sr-only">
                                        Navigation Menu
                                    </SheetTitle>
                                    <SheetHeader className="flex justify-start text-left">
                                        <div className="flex aspect-square size-12 -mt-2 items-center justify-center rounded-md bg-white text-sidebar-primary-foreground">
                                            <AppLogoIcon className="size-10 fill-black" />
                                        </div>
                                    </SheetHeader>
                                    <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                        <div className="flex h-full flex-col justify-between text-sm">
                                            <div className="flex flex-col space-y-2">
                                                {mainNavItems.map((item) => (
                                                    <Link
                                                        key={item.title}
                                                        href={item.href}
                                                        className={cn(
                                                            "flex items-center space-x-2 font-medium rounded p-2",
                                                            page.url === item.href && "bg-accent"
                                                        )}
                                                    >
                                                        {item.icon && (
                                                            <Icon
                                                                iconNode={item.icon}
                                                                className="h-5 w-5"
                                                            />
                                                        )}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                ))}
                                            </div>

                                            <div className="flex flex-col space-y-4">
                                                {rightNavItems.map((item) => (
                                                    <a
                                                        key={item.title}
                                                        href={
                                                            typeof item.href ===
                                                            'string'
                                                                ? item.href
                                                                : item.href.url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center space-x-2 font-medium"
                                                    >
                                                        {item.icon && (
                                                            <Icon
                                                                iconNode={item.icon}
                                                                className="h-5 w-5"
                                                            />
                                                        )}
                                                        <span>{item.title}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                        
                        <div className={cn(
                            'flex items-center grow gap-2',
                        )}>
                            <Link
                                href={home()}
                                prefetch
                                className={cn(
                                    "flex space-x-2 left-1/2 -translate-x-1/2 lg:-translate-x-0 lg:left-auto absolute lg:relative",
                                    
                                )}
                            >
                                <AppLogo />
                            </Link>
                        
                            {/* Desktop Navigation */}
                            <NavigationMenu className="hidden lg:flex" viewport={false}>
                                <NavigationMenuList>
                                    <NavigationMenuItem key="explore">
                                        <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                        <ul className="grid w-[200px] p-1">
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link className="flex flex-row items-center gap-2 p-2" href={indexPosts.url()}>
                                                        <Lightbulb className="size-4.5 stroke-2.5 -ml-0.5 stroke-foreground" />
                                                        <span className="font-medium">Ideas</span>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link className="flex flex-row items-center gap-2 p-2" href={indexProjects().url}>
                                                        <PencilRuler className="size-4 stroke-foreground" /> 
                                                        <span className="font-medium">Projects</span></Link>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link className="flex flex-row items-center gap-2 p-2" href={indexTeams.url()}>
                                                        <Handshake className="size-4 stroke-foreground" /> 
                                                        <span className="font-medium">Teams</span></Link>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem key="opportunites">
                                        <NavigationMenuTrigger>Opportunities</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid p-1 gap-2 sm:w-[350px]">
                                                <ListItem iconSize="size-4.5" icon={BriefcaseBusiness} title="Find Openings" href={indexJobs.url()}>
                                                Find opportunites to contribute
                                                </ListItem>
                                                <ListItem iconSize="size-4.5" icon={UserSearch} title="Find Talent" href={indexUsers.url()}>
                                                    Search user profiles
                                                </ListItem>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem key="community">
                                        <NavigationMenuTrigger>Community</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid p-1 gap-2 sm:w-[350px]">
                                                <ListItem iconSize="size-4.5" icon={MessageSquareText} title="Blog" href={indexJobs.url()}>
                                                    Latest stories and developments
                                                </ListItem>
                                                <ListItem iconSize="size-4.5" icon={BadgeHelpIcon} title="Help Center" href={indexUsers.url()}>
                                                    Get quick answers and learn how to use GamingJinn
                                                </ListItem>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                            {
                                scrollY >= stickyAfter && (
                                    <div className={cn("relative hidden lg:flex grow max-w-lg")}>
                                        <Search size={16} className='absolute top-[13px] left-3' />
                                        <Input placeholder='Search for ideas, projects or opportunites' className="pl-9 pr-28 py-5 grow shrink-0" />
                                        <DropdownMenu>
                                            <DropdownMenuTrigger size="sm" className='relative -translate-x-full -left-1 top-1' asChild>
                                                <Button variant="outline">
                                                    {searchType}
                                                    <ChevronDown />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-36" align="end">
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem onSelect={() => setSearchType('Ideas')}>
                                                        Ideas
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => setSearchType('Projects')}>
                                                        Projects
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => setSearchType('Opportunities')}>
                                                        Opportunities
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )
                            }
                        </div>
                        
                        
                        {/* Right Navigation */}
                        <div className="flex items-center space-x-2">
                            <div className="relative flex items-center gap-3">
                                <Button
                                    onClick={() => {
                                        console.log(showMobileSearchBar)
                                        console.log('setShowMobileSearchBar')
                                        setShowMobileSearchBar(v => !v)
                                    }} 
                                    variant="ghost"
                                    size="icon"
                                    className="group cursor-pointer lg:hidden"
                                >
                                    <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                                </Button>
                                {/* <Button
                                    variant="ghost"
                                    size="icon"
                                    className="group cursor-pointer"
                                >
                                    <MessageCircle className="!size-5 opacity-80 group-hover:opacity-100" />
                                </Button> */}
                                {
                                    auth.user ? (<>
                                        <Button className="hidden lg:flex cursor-pointer" onClick={() => router.visit(createPost()) }>
                                            <Plus />
                                            Share Work
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                {/* <> */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="group cursor-pointer relative"
                                                >
                                                    <Bell className="!size-5 opacity-80 group-hover:opacity-100" />
                                                    <span className="bg-red-700 px-1 rounded-full absolute right-0 top-0 text-xs">8</span>
                                                </Button>
                                                
                                                {/* </> */}
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuGroup>
                                                    {
                                                        [1,2,3,4,5].map((_,i,a) => (
                                                            <>
                                                            <DropdownMenuItem className='p-0'>
                                                                <Item>
                                                                    <ItemMedia variant="icon">
                                                                        <ShieldAlertIcon />
                                                                    </ItemMedia>
                                                                    <ItemContent>
                                                                    <ItemTitle>Security Alert</ItemTitle>
                                                                    <ItemDescription>
                                                                        New login detected from unknown device.
                                                                    </ItemDescription>
                                                                    </ItemContent>
                                                                    
                                                                </Item>
                                                            </DropdownMenuItem>
                                                            {
                                                                (i < a.length - 1) &&  <DropdownMenuSeparator />
                                                            }
                                                            
                                                            </>
                                                        ))
                                                    }
                                                    
                                                    
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="size-10 rounded-full p-1"
                                                >
                                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                            {getInitials(auth.user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56 z-100" align="end">
                                                <UserMenuContent user={auth.user} />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </>) : (<>
                                        <Button size="icon" onClick={() => router.visit(login())} className="cursor-pointer lg:hidden" variant="outline">
                                            <LogIn />
                                        </Button>
                                        <Button onClick={() => router.visit(login())} className="cursor-pointer hidden lg:flex" variant="outline">
                                            <LogIn />
                                            Sign In
                                        </Button>
                                    </>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
            {
                showMobileSearchBar && scrollY >= stickyAfter &&  (
                    <div className='inline lg:hidden w-full px-4 sticky top-16 z-60 -mt-14'>
                        <Search className='relative size-5 top-7 left-2' />
                        <Input placeholder='Search for ideas, projects or opportunities' className='pl-8  bg-background' />
                    </div>
                )
            }
            
        </>
    );
}
