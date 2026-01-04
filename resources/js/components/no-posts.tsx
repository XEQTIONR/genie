import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ArrowUpRight, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { create } from "@/routes/posts"
import { router } from "@inertiajs/react"

export default function NoPosts() {
    return (
        <Empty className="h-full w-full">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Lightbulb />
                </EmptyMedia>
                <EmptyTitle>No posts</EmptyTitle>
                <EmptyDescription>
                    You don&apos;t posted any ideas. Share your first one.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2"> 
                    <Button onClick={() => router.visit(create())} className="cursor-pointer">Create a new post</Button>
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