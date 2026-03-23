import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-12 my-2 items-center justify-center rounded-md bg-white text-sidebar-primary-foreground">
                <AppLogoIcon className="size-10 fill-black text-white dark:text-black" />
            </div>
            <div className="ml-1 hidden lg:flex items-center text-left text-4xl">
                <span className="mb-0.5 truncate leading-tight font-semibold font-brand">
                    GamingJinn
                </span>
            </div>
        </>
    );
}
