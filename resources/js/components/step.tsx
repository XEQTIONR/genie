import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Step({bg = 'bg-muted', step, heading, children} : {bg?: string, step: number|string|ReactNode, heading?: string|ReactNode, children: ReactNode}) {
    return (<>
        <div className="w-full flex gap-3 pr-3 md:pr-0">
            <div className="flex flex-col gap-1 items-center w-7">
                <div className={cn(
                    "size-7 text-sm font-medium shrink-0 rounded-2xl text-center flex justify-center items-center",
                    bg
                )}>
                    {step}
                </div>
                {
                    !heading && <Separator className="min-h-0 shrink" orientation="vertical" />
                }
            </div>
            {
                heading ? (
                    <div className='flex items-center flex-grow'>
                        <h2 className="font-bold">{heading}</h2>
                    </div>
                ) : (
                    <div className="flex-grow mt-0.5">
                        {children}
                    </div>
                )
            }
        </div>
        <div className="w-full py-1 flex gap-3 pr-3 md:pr-0">
            <div className="flex flex-col gap-1 items-center w-7 shrink-0">
                <Separator className="min-h-5" orientation="vertical" />
            </div>
            {
                heading && (
                    <div className="flex-grow">
                        {children}
                    </div>
                )
            }
            
            
        </div>
    </>)
}