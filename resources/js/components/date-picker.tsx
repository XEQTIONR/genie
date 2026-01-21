import { useState } from "react"
import { format as formatFunc } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function DatePicker({
  initialDate = new Date(), 
  onSelect,
  className = "",
  format = "MMMM dd, yyyy"
} : { 
  initialDate?: Date 
  onSelect?: (date: Date|undefined) => void
  className?: string
  format?: string
}) {

  const [dropdown, setDropdown] = useState<React.ComponentProps<typeof Calendar>["captionLayout"]>("dropdown")
  
  const [date, setDate] = useState<Date|undefined>(initialDate)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className={cn(
            "data-[empty=true]:text-muted-foreground justify-start text-left font-normal",
            className
          )}
        >
          <CalendarIcon className="stroke-dim" />
          <span>{date ? formatFunc(date, format) : "Pick a date"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          className="rounded-lg border shadow-sm"
          required={false}
          mode="single"
          defaultMonth={date}
          selected={date}
          captionLayout={dropdown} 
          onSelect={(d) => {
            setDate(d)
            if (onSelect) {
              onSelect(d)
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}