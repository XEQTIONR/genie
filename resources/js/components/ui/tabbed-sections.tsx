import { cn } from "@/lib/utils"
import { NavItem } from "@/types"
import { Link } from "@inertiajs/react"
import { Icon } from '@/components/icon'

type TabbedSectionHeaderItem = NavItem & { key: string, className?: string }

function TabbedSectionHeaders({
    headers,
    current,
}: {
    headers: TabbedSectionHeaderItem[],
    current?: string
}) {
    return (
        <section className="mt-10 md:mx-8 flex flex-col">
            <ul className="flex items-center gap-1 flex-wrap">
            {
                headers.map(({title, key, href, icon, className}) => (
                    <li className="font-bold mb-4 md:mb-0" key={key}>
                    {
                        current == key
                            ? <span className="pt-2 pb-1.5 mx-2 border-b-2 border-foreground">{title}</span>
                            : <Link className={cn(
                                className,
                                "py-2 rounded-md flex items-center text-nowrap",
                                "hover:bg-accent  px-3 gap-1.5"
                            )} href={href}>
                                {icon && (
                                    <Icon
                                        iconNode={icon}
                                        className="h-4 w-4"
                                    />
                                )}
                                {title}
                            </Link>
                    }
                    </li>
                ))
            }
            </ul>
        </section>
    )
}

export { TabbedSectionHeaders }