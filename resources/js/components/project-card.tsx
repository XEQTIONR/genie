import { PencilRuler } from "lucide-react"
import Platforms from "@/data/platforms"
import { LucideIcon } from 'lucide-react';
import { Icon } from "./icon";
import { Link } from "@inertiajs/react";
export default function ProjectCard({title, excerpt = "", href, platforms = [], icon = PencilRuler} : {title: string, excerpt?: string, href: string, platforms: string[], icon?: LucideIcon}) {
    return (
        <div className="border min-h-28 px-3 py-3 rounded-sm flex flex-col gap-2">
            <div className="w-full flex items-center gap-1.5">
                <Icon className="stroke-muted-foreground" iconNode={icon} size={15} />             
                <Link href={href} className="text-sm text-link font-semibold hover:underline">{title}</Link>
            </div>
            <p className='text-sm font-medium text-dim w-full text-ellipsis line-clamp-2 h-10'>{excerpt}</p>
            <ul className="flex flex-wrap gap-3.5 text-xs">
                {
                    platforms.map((p) => {
                        const platform = Platforms.find((platform) => platform.id === p)

                        return <li className="flex items-center gap-1 font-medium text-dim">
                            <div style={{ backgroundColor: platform?.color ?? "#FFF" }} className={"size-1 rounded"} />{platform?.name ?? p}
                        </li>
                    })
                }
            </ul>
        </div>
    )
}