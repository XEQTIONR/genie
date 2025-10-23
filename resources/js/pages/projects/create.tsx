import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { create } from '@/routes/projects'
import { Head } from '@inertiajs/react'
import { Separator } from '@/components/ui/separator'


function Step({step, heading, children} : {step: number, heading: string, children: React.ReactNode}) {
    return (<>
        <div className="w-full flex gap-3">
            <div className="flex flex-col gap-1 items-center w-7">
                <div className="size-7 text-sm font-medium shrink-0 rounded-2xl bg-muted text-center flex justify-center items-center">
                    {step}
                </div>
            </div>
            <div className='flex items-center flex-grow'>
                <h2 className="font-bold">{heading}</h2>
            </div>
            <div className="h-full w-7">

            </div>
        </div>
        <div className="w-full py-1 flex gap-3">
            <div className="flex flex-col gap-1 items-center w-7 shrink-0">
                <Separator className="border-[1px] " orientation="vertical" />
            </div>
            <div className="flex-grow">
                {children}
            </div>
            <div className="h-full w-7 shrink-0">

            </div>
        </div>
    </>)
}



export default function CreateProject() {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Create Project',
            href: create().url
        }
    ]

    return (
        <AppLayout maxWidth="md:max-w-7xl" breadcrumbs={breadcrumbs}>
            <Head title="Create new project" />
            <div className="w-full max-w-4xl mx-auto flex flex-col py-4 px-4">
                <h1 className="text-xl font-bold md:mx-10">Create a new project</h1>
                <span className="text-sm text-dim md:mx-10 mb-10">Projects are game development endeavors in which one or multiple people 
                    participate in with the goal of creating a finished product that can be called
                    a game.
                </span>
                
                <Step step={1} heading={"General"}>
                    <span className="text-sm">Something is a here</span>    
                </Step>
                <Step step={2} heading={"Configuration"}>
                    Something is here, I can feel it
                </Step>
                <Step step={3} heading={"Confirm"}>
                    I'm baby pitchfork tattooed slow-carb single-origin coffee taiyaki heirloom. Activated charcoal banh mi forage jean shorts lo-fi hella viral scenester big mood mustache taiyaki. Enamel pin artisan fixie synth, four loko williamsburg literally mustache banjo hella tote bag same lomo tumeric. Hammock jean shorts truffaut jawn forage cold-pressed photo booth fingerstache gochujang. Butcher irony cornhole organic roof party kombucha, mustache direct trade put a bird on it ascot plaid tbh seitan hell of offal. DIY aesthetic listicle helvetica, williamsburg vegan vexillologist paleo kogi pop-up. Cliche lomo 90's, taiyaki VHS fit air plant chambray everyday carry copper mug food truck retro shaman cold-pressed.
                </Step>
                
            </div>
        </AppLayout>
    )
}