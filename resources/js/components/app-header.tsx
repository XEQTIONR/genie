import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react'
import { create } from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
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
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { index as indexPosts } from '@/routes/posts';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, BriefcaseBusiness, Circle, CircleCheck, CircleHelp, Folder, Handshake, Lightbulb, LogIn, LucideIcon, Menu, PencilRuler, User2, UserSearch } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import { useEffect } from 'react';
import { Separator } from './ui/separator';

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Ideas",
    href: "/docs/primitives/alert-dialog",
    description:
      "Inspirational ideas worth sharing.",
  },
  
  {
    title: "Teams",
    href: "/docs/primitives/progress",
    description:
      "Group of talented people that work on game projects and releases",
  },
  {
    title: "Projects",
    href: "/docs/primitives/hover-card",
    description:
      "Game development projects that people and teams are working on.",
  },
  {
    title: "Releases",
    href: "/docs/primitives/scroll-area",
    description: "Finished development titles that are availble to the public.",
  },
  {
    title: "Openings",
    href: "/docs/primitives/tabs",
    description:
      "Help people finish their existing projects.",
  },
  {
    title: "Users",
    href: "/docs/primitives/tooltip",
    description:
      "All people that are on this app.",
  },
]

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
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { icon?: LucideIcon, href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
            <div className="flex w-full gap-3 items-start">
                {/* <Lightbulb /> */}
                { icon && <Icon className="stroke-foreground size-5" iconNode={icon} /> }
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
}

export function AppHeader({ breadcrumbs = [], maxWidth }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth, notification } = page.props;
    const getInitials = useInitials();

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

    return (
        <>
            <div className="h-20 sticky top-0 z-50 bg-background">
                <div className="w-full fixed h-20 ">
                    <div className={cn(
                        "mx-auto flex gap-20 items-center px-4 my-auto h-20",
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

                        <Link
                            href={home()}
                            prefetch
                            className="flex items-center space-x-2"
                        >
                            <AppLogo />
                        </Link>

                        {/* Desktop Navigation */}
                        <NavigationMenu className="flex" viewport={false}>
                            <NavigationMenuList>
                                
                                {/* <NavigationMenuItem>
                                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                        <Link href="/">Home</Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                                    <NavigationMenuContent >
                                        <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                            <a
                                                className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                                                href="/"
                                            >
                                                <div className="mb-2 text-lg font-medium sm:mt-4">
                                                shadcn/ui
                                                </div>
                                                <p className="text-muted-foreground text-sm leading-tight">
                                                Beautifully designed components built with Tailwind CSS.
                                                </p>
                                            </a>
                                            </NavigationMenuLink>
                                        </li>
                                        <ListItem href="/docs" title="Introduction">
                                            Re-usable components built using Radix UI and Tailwind CSS.
                                        </ListItem>
                                        <ListItem href="/docs/installation" title="Installation">
                                            How to install dependencies and structure your app.
                                        </ListItem>
                                        <ListItem href="/docs/primitives/typography" title="Typography">
                                            Styles for headings, paragraphs, lists...etc
                                        </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem> */}
                                
                                {/* <NavigationMenuItem>
                                    <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        {components.map((component) => (
                                            <ListItem
                                            key={component.title}
                                            title={component.title}
                                            href={component.href}
                                            >
                                            {component.description}
                                            </ListItem>
                                        ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem> */}
                                <NavigationMenuItem className="hidden md:block">
                                    <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                    <ul className="grid w-[200px] p-1">
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link className="flex flex-row items-center gap-2 p-2" href={indexPosts.url()}>
                                                    <Lightbulb className="size-4 stroke-foreground" />
                                                    <span className="font-medium">Ideas</span>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link className="flex flex-row items-center gap-2 p-2" href="#">
                                                    <PencilRuler className="size-4 stroke-foreground" /> 
                                                    <span className="font-medium">Projects</span></Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link className="flex flex-row items-center gap-2 p-2" href="#">
                                                    <Handshake className="size-4 stroke-foreground" /> 
                                                    <span className="font-medium">Teams</span></Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Opportunities</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid p-1 gap-2 sm:w-[350px]">
                                            <ListItem icon={BriefcaseBusiness} title="Find Openings" href="/">
                                                Create an opening for people to come and help your project.
                                            </ListItem>
                                            <ListItem icon={UserSearch} title="Find Talent" href="/">
                                                Search user profiles
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    {/* <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                        <Link href="/">Home</Link>
                                    </NavigationMenuLink> */}
                                    <NavigationMenuTrigger>Start</NavigationMenuTrigger>
                                    <NavigationMenuContent >
                                        <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                            <a
                                                className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                                                href="/"
                                            >
                                                <div className="mb-2 text-lg font-medium sm:mt-4">
                                                shadcn/ui
                                                </div>
                                                <p className="text-muted-foreground text-sm leading-tight">
                                                Beautifully designed components built with Tailwind CSS.
                                                </p>
                                            </a>
                                            </NavigationMenuLink>
                                        </li>
                                        <ListItem href="/docs" title="Introduction">
                                            Re-usable components built using Radix UI and Tailwind CSS.
                                        </ListItem>
                                        <ListItem href="/docs/installation" title="Installation">
                                            How to install dependencies and structure your app.
                                        </ListItem>
                                        <ListItem href="/docs/primitives/typography" title="Typography">
                                            Styles for headings, paragraphs, lists...etc
                                        </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                {/* <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/docs">Docs</Link>
                                </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem className="hidden md:block">
                                <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[200px] gap-4">
                                    <li>
                                        <NavigationMenuLink asChild>
                                        <Link href="#" className="flex-row items-center gap-2">
                                            <CircleHelp />
                                            Backlog
                                        </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                        <Link href="#" className="flex-row items-center gap-2">
                                            <Circle />
                                            To Do
                                        </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                        <Link href="#" className="flex-row items-center gap-2">
                                            <CircleCheck />
                                            Done
                                        </Link>
                                        </NavigationMenuLink>
                                    </li>
                                    </ul>
                                </NavigationMenuContent>
                                </NavigationMenuItem> */}
                            </NavigationMenuList>
                        </NavigationMenu>

                        <div className="ml-auto flex items-center space-x-2">
                            <div className="relative flex items-center space-x-1">
                                {/* <Button
                                    variant="ghost"
                                    size="icon"
                                    className="group h-9 w-9 cursor-pointer"
                                >
                                    <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                                </Button> */}
                                {/* <div className="hidden lg:flex">
                                    {rightNavItems.map((item) => (
                                        <TooltipProvider
                                            key={item.title}
                                            delayDuration={0}
                                        >
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <a
                                                        href={
                                                            typeof item.href ===
                                                            'string'
                                                                ? item.href
                                                                : item.href.url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                                    >
                                                        <span className="sr-only">
                                                            {item.title}
                                                        </span>
                                                        {item.icon && (
                                                            <Icon
                                                                iconNode={item.icon}
                                                                className="size-5 opacity-80 group-hover:opacity-100"
                                                            />
                                                        )}
                                                    </a>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{item.title}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))}
                                </div> */}
                            </div>
                            {
                                auth.user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="size-10 rounded-full p-1"
                                            >
                                                <Avatar className="size-8 overflow-hidden rounded-full">
                                                    <AvatarImage
                                                        src={auth.user.avatar}
                                                        alt={auth.user.name}
                                                    />
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
                                ) : (
                                    <Button onClick={() => router.visit(login())} className="cursor-pointer" variant="outline">
                                        <LogIn />
                                        Sign In
                                    </Button>
                                )
                            }
                            
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
        </>
    );
}
