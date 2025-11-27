import { cn } from "@/lib/utils"
import { NavItem } from "@/types"
import { Link } from "@inertiajs/react"
import { Icon } from '@/components/icon'
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useDebouncedCallback } from 'use-debounce'

type TabbedSectionHeaderItem = NavItem & { key: string, className?: string }

function TabbedSectionHeaders({
    headers,
    current,
    onTabChange,
    className = "",
}: {
    headers: TabbedSectionHeaderItem[],
    current?: string,
    onTabChange: () => void
    className?: string
}) {

    const div = useRef<HTMLUListElement>(null)
    const [scrollLeft, setScrollLeft] = useState<number|undefined>(0)
    const [scrollLength, setScrollLength] = useState(0)
    const scrollThresh = 2

    const fn = useDebouncedCallback(() => setScrollLeft(div.current?.scrollLeft), 100)

    const updateScrollLength = () => setScrollLength(div.current.scrollWidth - div.current.offsetWidth)

    useEffect(() => {
        updateScrollLength()
        document.querySelector("#tabbedSectionHeaderContent")?.addEventListener('scroll', fn)        
        window.addEventListener("resize", updateScrollLength)

        return () => {
            document.querySelector("#tabbedSectionHeaderContent")?.removeEventListener('scroll', fn)
            window.removeEventListener("resize", updateScrollLength)
        }
    }, [div, fn])

    return (
        <section className={cn(
            className
        )}>
            {
                (scrollLeft ?? 0) > 0 && <div className="relative top-13 md:top-14 -mt-10 float-left flex items-center bg-neutral-50/50 dark:bg-neutral-900/50 size-10">
                    <ChevronLeft onClick={() => div.current.scrollLeft -= 200 } className="block mx-auto" />
                </div> 
            }

            {
                div.current && (scrollLength > 0) && (scrollLength - (scrollLeft ?? 0) > scrollThresh) && <div className="relative top-13 md:top-14 -mt-10 float-right flex items-center bg-neutral-50/50 dark:bg-neutral-900/50 size-10">
                    <ChevronRight onClick={() => div.current.scrollLeft += 200 } className="block mx-auto" />
                </div>
            }
            
            
            <ul 
                onScroll={fn} 
                ref={div} 
                id="tabbedSectionHeaderContent" 
                className={cn(
                    "scroll-smooth flex items-stretch gap-3 overflow-x-scroll scrollbar-hide h-16 md:h-20",
                    scrollLength > 0 ? "justify-start" : "justify-center"
                )}
            >
            {
                headers.map(({title, key, href, icon, className}) => (
                    <li className={cn("text-sm flex items-center font-medium border-b-2",
                        current == key ? "border-foreground" : "border-transparent",
                        
                    )} key={key}>
                    {

                            <Link
                                onClick={onTabChange} 
                                preserveScroll
                                className={cn(
                                    className,
                                    "p-2.5 hover:underline rounded-md text-nowrap",
                                )} 
                                href={href}>
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