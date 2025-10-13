import { cn } from "@/lib/utils"
import { NavItem } from "@/types"
import { Link } from "@inertiajs/react"


type TabbedSectionHeaderItem = NavItem & { key: string }

function TabbedSectionHeaders({
    headers,
    current,
}: {
    headers: TabbedSectionHeaderItem[],
    current?: string
}) {
    return (
        <section className="mt-10 md:mx-8 flex flex-col">
            <ul className="flex gap-8">
            {
                headers.map(({title, key, href}) => (
                    <li className={cn("font-bold pb-0.5", current == key && "border-b-2 border-foreground")} key={key}><Link href={href}>{title}</Link></li>
                ))
            }
            </ul>
        </section>
    )
}

export { TabbedSectionHeaders }