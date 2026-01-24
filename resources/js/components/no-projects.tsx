import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ArrowUpRight, PencilRuler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { create } from "@/routes/projects"
import { router } from "@inertiajs/react"

export default function NoProjects() {
    return (
        <Empty className="h-full w-full my-auto">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <PencilRuler />
                </EmptyMedia>
                <EmptyTitle>No projects</EmptyTitle>
                <EmptyDescription>
                    You don&apos;t have any projects. You are free to create one.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2"> 
                    <Button onClick={() => router.visit(create())} className="cursor-pointer">Create a new project</Button>
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