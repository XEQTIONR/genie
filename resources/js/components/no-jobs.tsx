import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react"
import { Button } from "@/components/ui/button"
import { create } from "@/routes/opportunities"
import { router } from "@inertiajs/react"

export default function NoJobs() {
    return (
        <Empty className="h-full w-full">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <BriefcaseBusiness />
                </EmptyMedia>
                <EmptyTitle>No opportunities</EmptyTitle>
                <EmptyDescription>
                    You don&apos;t have any current opportunities. You are free to create one.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2"> 
                    <Button onClick={() => router.visit(create())} className="cursor-pointer">Create a new opportunity</Button>
                    {/* <Button className="cursor-pointer" variant="outline">Join existing team</Button> */}
                </div>
            </EmptyContent>
            <Button
                variant="link"
                asChild
                className="text-muted-foreground"
                size="sm"
            >
                <a href="#">
                Learn More <ArrowUpRight />
                </a>
            </Button>
        </Empty>
    )
}