import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import AppLayout from "@/layouts/app-layout";
import { show as showTeam } from "@/routes/teams";
import { show as showUser } from "@/routes/users";
import { BreadcrumbItem, Project, Team } from "@/types";
import { Head, Link } from "@inertiajs/react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ProjectSidebar } from "@/components/project-sidebar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@headlessui/react";
import { ChartNoAxesColumnIncreasing, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Fade from 'embla-carousel-fade'

export default function ShowProject({ project } : { project: Project }) {

    const ProjectOwnerTypeTeam = "App\\Models\\Team"

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Show Project',
            href: '/'
        },
    ]

    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <AppLayout maxHeaderWidth='md:max-w-7xl' maxBodyWidth="w-full" breadcrumbs={breadcrumbs}>
            <Head title="Show Project" />
                <div className="w-full min-h-[50vh] bg-neutral-900">
                    <h1 className="w-full md:w-1/3 text-center mx-auto text-2xl font-semibold mt-10">{project.title}</h1>
                    
                    {
                        project.owner &&
                        <div className="w-full md:w-1/3 text-center block mt-3 text-sm mx-auto">
                            by <Link 
                                href={project.owner_type == ProjectOwnerTypeTeam ? showTeam(project.owner) : showUser(project.owner)} 
                                className="font-semibold ml-1 hover:underline"
                            >
                                {project.owner?.name}
                            </Link>
                            
                        </div>
                    }
                    <h2 className="w-full md:w-1/3 text-center mx-auto mt-1">{project.excerpt}</h2>
                    <div className="flex flex-col gap-7 md:flex-row md:justify-center mx-auto w-full md:max-w-7xl items-stretch ">
                        <Carousel 
                            className="block w-full md:w-2/3 my-5"
                            opts={{ loop: true,
                                duration: 60
                             }}
                            plugins={[
                                Autoplay({ delay: 8000 }),
                                Fade()
                            ]}
                        >
                            <CarouselContent>
                                {[
                                    'https://www.youtube.com/embed/7gTmT-Kko2w?si=tKbW1693_Bo7RVCi',
                                    'https://www.youtube.com/embed/kAiFVcd9cAA?si=vqD0MBPwIfWG_a80',
                                    'https://www.kickstarter.com/projects/ivstudios/honors-end/widget/video.html'
                                ].map((url, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-1 aspect-video flex items-center justify-center border rounded-md">
                                        <iframe id={"iframe"+index} onClick={() => console.log('iframe clicked')} className="w-full h-full rounded-md" src={url} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true"></iframe>
                                    </div>
                                </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex z-60" />
                            <CarouselNext className="hidden md:flex z-60" />
                        </Carousel>
                        <div className="md:w-1/3 my-5 rounded-md border mb-18">
                                Something
                        </div>
                    </div>
                    
                </div>
               
                <div className={cn(
                    "z-60 sticky top-0 w-full h-18 border-b dark:shadow-neutral-900/80 flex md:justify-center items-center bg-background",
                    !sidebarOpen && "shadow-xl"
                )}>
                    <Sheet onOpenChange={setSidebarOpen}>
                        <ul className="flex h-full gap-4 text-sm">
                            <li className="pt-5 px-5 font-semibold border-b-4 border-foreground flex gap-3">
                                <a className="flex gap-4" href="#kontent">
                                <SheetTrigger className="md:hidden" asChild>
                                {
                                    sidebarOpen ? <Menu /> : <ChartNoAxesColumnIncreasing className="rotate-90" />
                                }
                                </SheetTrigger>
                                Project</a>
                            </li>
                            <li className="pt-5 px-5 border-b-4 border-transparent">Team</li>
                            <li className="pt-5 px-5 border-b-4 border-transparent">Activity</li>
                        </ul>
                        <SheetContent side="left">
                            Some content
                        </SheetContent>
                    </Sheet>
                    
                </div>
                <div id="kontent" className="">
                    <div className="hidden md:flex md:w-1/4 pt-10 h-full sticky float-left top-16 bg-violet-950">Something</div>
                    <div className="hidden md:flex md:w-1/4 pt-10 h-full sticky float-right top-16 bg-pink-950">Something</div>
                    <div className="w-full md:w-2/4 block mx-auto">
                        <p>I'm baby yuccie vape palo santo vaporware franzen. Big mood freegan copper mug blog, microdosing tousled bushwick. Man braid chillwave heirloom, hammock literally pabst raw denim swag hot chicken forage ramps. Cupping DIY distillery, sriracha hashtag edison bulb humblebrag hoodie listicle helvetica tacos hammock leggings. Whatever sriracha af cliche, portland tumeric normcore tofu messenger bag sus iceland chicharrones. Try-hard neutra ramps authentic iPhone, intelligentsia echo park art party. Vape cronut try-hard, 8-bit gatekeep brunch kombucha aesthetic mumblecore literally.</p>

                        <p>Retro roof party air plant, biodiesel pickled food truck PBR&B pinterest whatever flexitarian heirloom occupy. Gatekeep yr stumptown shoreditch, pour-over intelligentsia master cleanse iceland DSA normcore. Green juice enamel pin copper mug tonx quinoa hoodie freegan humblebrag kitsch knausgaard tacos pork belly cred meh pabst. Organic taiyaki bodega boys cold-pressed stumptown asymmetrical yuccie. Freegan jawn microdosing, slow-carb iceland iPhone selfies taiyaki fashion axe beard PBR&B vape activated charcoal.</p>

                        <p>Cardigan iPhone disrupt 3 wolf moon shoreditch woke blog tacos tattooed chartreuse drinking vinegar. Pitchfork pork belly letterpress microdosing edison bulb. Shaman beard marxism banh mi drinking vinegar vexillologist man bun chia readymade williamsburg umami. Yr art party roof party tumeric synth DIY fixie cloud bread.</p>

                        <p>Chillwave taxidermy thundercats, offal franzen cornhole lyft post-ironic mukbang. Sriracha heirloom flannel vibecession man braid williamsburg freegan single-origin coffee wayfarers farm-to-table af. Thundercats solarpunk marfa knausgaard blog gorpcore actually DSA gluten-free. Street art you probably haven't heard of them heirloom pour-over meggings schlitz small batch PBR&B plaid. Mukbang la croix vexillologist bespoke lo-fi pinterest, snackwave truffaut fanny pack austin slow-carb cupping microdosing.</p>

                        <p>Farm-to-table kale chips messenger bag thundercats chartreuse actually 90's. Blackbird spyplane ugh godard tousled, blue bottle live-edge wayfarers farm-to-table heirloom marxism banjo slow-carb yuccie. Chia tote bag cronut godard, chicharrones fashion axe air plant DSA ennui vape paleo franzen ramps. Vexillologist cloud bread brunch PBR&B heirloom taxidermy enamel pin neutral milk hotel YOLO.</p>

                        <p>Intelligentsia edison bulb affogato, marfa truffaut post-ironic prism church-key chia woke solarpunk single-origin coffee DSA heirloom hammock. Small batch chartreuse roof party coloring book deep v. Direct trade ennui vexillologist sartorial godard. Vice celiac shabby chic shaman blue bottle praxis cold-pressed cardigan thundercats wolf polaroid neutral milk hotel. Fanny pack solarpunk microdosing chillwave.</p>

                        <p>Bicycle rights scenester cold-pressed, blog edison bulb next level chambray raw denim messenger bag asymmetrical swag. Pour-over crucifix four dollar toast yes plz photo booth semiotics. Typewriter affogato lumbersexual, poke small batch cred retro yr lomo kinfolk bruh distillery vaporware. Single-origin coffee poke fam live-edge typewriter.</p>

                        <p>Actually four loko glossier banh mi live-edge marxism small batch pop-up brunch DSA taxidermy. Pok pok distillery meh bruh mumblecore, tofu synth ethical polaroid banh mi actually scenester hoodie. Locavore la croix 90's, fanny pack bespoke adaptogen before they sold out vaporware blue bottle chia meh distillery tumblr mukbang. Live-edge DIY freegan hoodie man braid taiyaki chambray everyday carry craft beer church-key. Blog shoreditch man braid try-hard, twee venmo keffiyeh freegan ugh. Big mood you probably haven't heard of them kickstarter blog synth bodega boys helvetica woke taiyaki neutra fixie sustainable palo santo same 8-bit. Bicycle rights gatekeep keffiyeh, vibecession synth pork belly hashtag neutral milk hotel poke sustainable art party.</p>

                        <p>Kitsch ascot ugh pour-over waistcoat, flexitarian four loko swag ramps. Air plant marfa photo booth, sus shaman gastropub crucifix drinking vinegar hell of tacos la croix typewriter. Post-ironic jianbing put a bird on it you probably haven't heard of them seitan pug portland ascot. Retro deep v gatekeep pinterest bodega boys offal organic taxidermy wolf enamel pin hell of portland letterpress marxism listicle. Schlitz tattooed before they sold out franzen scenester chambray, meh offal try-hard activated charcoal blue bottle mlkshk. Pinterest pug activated charcoal waistcoat celiac craft beer selfies. Plaid slow-carb neutra vinyl.</p>

                        <p>Paleo knausgaard four loko, gatekeep glossier celiac chia ascot flexitarian kitsch vexillologist meditation DIY. Messenger bag health goth gatekeep selvage venmo vegan. Echo park chillwave shaman iPhone craft beer, shoreditch letterpress chambray tumeric XOXO aesthetic. Fingerstache live-edge offal irony yr master cleanse, knausgaard skateboard poutine hammock.</p>

                        <p>Cupping iPhone scenester everyday carry selvage snackwave cardigan marfa humblebrag. Stumptown tousled pinterest roof party, hot chicken lo-fi adaptogen vibecession vaporware iceland irony disrupt sustainable you probably haven't heard of them selfies. Meditation woke hella swag, distillery big mood locavore glossier single-origin coffee. Fingerstache ethical affogato listicle, typewriter leggings mumblecore. Trust fund cliche man bun, master cleanse vaporware tbh humblebrag subway tile kombucha fingerstache blackbird spyplane heirloom single-origin coffee fixie shoreditch.</p>

                        <p>Aesthetic actually pok pok la croix. Pok pok pop-up knausgaard mukbang quinoa thundercats migas artisan cold-pressed fingerstache mixtape bushwick church-key DIY DSA. Unicorn dreamcatcher taxidermy viral authentic banjo gatekeep health goth hella. Ethical gastropub umami, kale chips flannel scenester hoodie semiotics live-edge fashion axe kogi. Umami yr direct trade single-origin coffee lomo health goth Brooklyn chia scenester semiotics everyday carry. Post-ironic tumblr readymade microdosing biodiesel prism mlkshk pug. Hoodie unicorn vibecession hashtag before they sold out, man braid tacos pok pok vaporware pour-over.</p>

                        <p>Crucifix green juice adaptogen raclette health goth narwhal freegan neutral milk hotel drinking vinegar chartreuse cardigan before they sold out. Selfies venmo schlitz, truffaut four loko authentic kinfolk pok pok knausgaard sus cronut. Retro VHS JOMO green juice next level live-edge. Hexagon kombucha vibecession tousled chambray bushwick pabst intelligentsia drinking vinegar synth.</p>

                        <p>Church-key copper mug man bun hexagon kogi lyft tote bag enamel pin green juice. Fixie yuccie cred woke banh mi iPhone, kombucha bitters pork belly gorpcore ascot unicorn. Pour-over cray readymade waistcoat coloring book, ramps vibecession artisan mixtape. Fashion axe fanny pack vibecession freegan. Pabst selvage wolf knausgaard, enamel pin cloud bread chia chicharrones narwhal.</p>

                        <p>Man braid coloring book shaman craft beer asymmetrical aesthetic crucifix, post-ironic etsy selvage butcher +1 locavore kinfolk ramps. Put a bird on it retro selvage selfies church-key. Photo booth hammock banh mi polaroid yuccie iPhone. Chartreuse lyft vice trust fund cardigan same whatever bruh 8-bit schlitz small batch succulents meggings chambray. Portland plaid echo park gochujang salvia man bun praxis fixie thundercats mustache locavore VHS schlitz wayfarers celiac. Ramps mustache 3 wolf moon shaman. Cray cronut health goth next level plaid affogato salvia.</p>
                    </div>
                    
                </div>
        </AppLayout>
    )
}