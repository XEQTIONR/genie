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
}: {
    headers: TabbedSectionHeaderItem[],
    current?: string,
    onTabChange: () => void
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
        <section className="mt-10 mr-2 md:mx-8 max-w-full">
            {
                (scrollLeft ?? 0) > 0 && <div className="relative top-10 -mt-10 float-left flex items-center bg-neutral-50/50 dark:bg-neutral-900/50 size-10">
                    <ChevronLeft onClick={() => div.current.scrollLeft -= 200 } className="block mx-auto" />
                </div> 
            }

            {
                div.current && (scrollLength > 0) && (scrollLength - (scrollLeft ?? 0) > scrollThresh) && <div className="relative top-10 -mt-10 float-right flex items-center bg-neutral-50/50 dark:bg-neutral-900/50 size-10">
                    <ChevronRight onClick={() => div.current.scrollLeft += 200 } className="block mx-auto" />
                </div>
            }
            
            
            <ul onScroll={fn} ref={div} id="tabbedSectionHeaderContent" className="scroll-smooth flex items-center gap-1 w-full overflow-scroll scrollbar-hide">
            {
                headers.map(({title, key, href, icon, className}) => (
                    <li className="font-bold mb-4 md:mb-0" key={key}>
                    {
                        current == key
                            ? <span className="pt-2 pb-1.5 mx-2 border-b-2 border-foreground text-nowrap">{title}</span>
                            : <Link
                                onClick={onTabChange} 
                                preserveScroll 
                                className={cn(
                                    className,
                                    "py-2 rounded-md flex items-center text-nowrap",
                                    "hover:bg-accent  px-3 gap-1.5"
                                )} 
                                href={href}>
                                {icon && (
                                    <Icon
                                        iconNode={icon}
                                        className="h-4 w-4"
                                    />
                                )}
                                <span>{title}</span>
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