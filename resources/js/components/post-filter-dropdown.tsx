import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PostFilterDropDown() {
    return <Select defaultValue="popular">
        <SelectTrigger className="w-[180px] font-semibold">
            <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent className="font-semibold">
            <SelectGroup>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="new">New</SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
}