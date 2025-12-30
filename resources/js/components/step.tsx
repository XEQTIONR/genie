import { Separator } from "@/components/ui/separator";

export default function Step({step, heading, children} : {step: number|string, heading: string, children: React.ReactNode}) {
    return (<>
        <div className="w-full flex gap-3 pr-3 md:pr-0">
            <div className="flex flex-col gap-1 items-center w-7">
                <div className="size-7 text-sm font-medium shrink-0 rounded-2xl bg-muted text-center flex justify-center items-center">
                    {step}
                </div>
            </div>
            <div className='flex items-center flex-grow'>
                <h2 className="font-bold">{heading}</h2>
            </div>
            
        </div>
        <div className="w-full py-1 flex gap-3 pr-3 md:pr-0">
            <div className="flex flex-col gap-1 items-center w-7 shrink-0">
                <Separator className="" orientation="vertical" />
            </div>
            <div className="flex-grow">
                {children}
            </div>
            
        </div>
    </>)
}