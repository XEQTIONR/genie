import { useRef, useState } from "react"
import { Check, ChevronDown, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "./badge"
import { Checkbox } from "./checkbox"

export interface Option {
    label: string | React.ReactNode,
    value: string|number 
}

export interface GroupedOptions {
    [key: string]: Option[]
}

export function Multiselect({
    // name = "default-multiselect-name",
    subject = "item",
    defaultValue = [],
    items = [], 
    containerClassName = "", 
    placeholder = "Select...",
    searchLabel = "Search...",
    noResultsLabel = "No results found.",
    onQueryChange,
    onSelect,
} : {
    // name?: string
    subject?: string
    defaultValue?: (string|number)[]
    items?: Option[]|GroupedOptions
    containerClassName?: string 
    placeholder?: string
    searchLabel?: string
    noResultsLabel?: string
    onQueryChange?: (q: string) => void
    onSelect?: (val: (string|number)[]) => void

}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const container = useRef<HTMLButtonElement>(null)

  return (
    <>
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger ref={container} className={containerClassName} asChild>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between"
            >
            {
                value.length > 0
                    ? <div className="flex gap-1"><Badge className="rounded-full" variant="secondary">{value.length}</Badge> selected</div>
                    : placeholder
            }
                <ChevronDown className="opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent
            style={{ width: container.current?.offsetWidth }} 
            align="start" 
            className="p-0"
        >
            <Command>
                <CommandInput
                    onValueChange={(v) => {
                        if (onQueryChange) {
                            onQueryChange(v)
                        }
                    }} 
                    placeholder={searchLabel} 
                    className="h-9"
                />
                <CommandList>
                    <CommandEmpty>{noResultsLabel}</CommandEmpty>
                    {
                        Array.isArray(items)
                            ? <CommandGroup>
                            {
                                items.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.value}
                                        onSelect={(currentValue) => {
                                        //setValue(currentValue === value ? "" : currentValue)
                                        if (!value.includes(currentValue)) {
                                            const val = [...value, currentValue]
                                            setValue(val)
                                            if (onSelect) {
                                                onSelect(val)
                                            }
                                        } else {
                                            const val = value.filter(x => x !== currentValue)
                                            setValue(val)
                                            if (onSelect) {
                                                onSelect(val)
                                            }
                                        }
                                    }}>
                                        <Checkbox checked={value.includes(item.value)} />
                                        {item.label}
                                    </CommandItem>
                                ))
                            }
                            </CommandGroup>
                            : Object.keys(items).map(key => (
                                <CommandGroup heading={key}>
                                {
                                    items[key].map((item) => (
                                        <CommandItem
                                            key={item.value}
                                            value={item.value}
                                            onSelect={(currentValue) => {

                                            
                                            if (!value.includes(currentValue)) {
                                                const val = [...value, currentValue]
                                                setValue(val)
                                                if (onSelect) {
                                                    onSelect(val)
                                                }
                                            } else {
                                                const val = value.filter(x => x !== currentValue)
                                                setValue(val)
                                                if (onSelect) {
                                                    onSelect(val)
                                                }
                                            }
                                        }}>
                                            <Checkbox checked={value.includes(item.value)} />
                                            {item.label}
                                        </CommandItem>
                                    ))
                                }
                                </CommandGroup>
                            ))
                    }
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
    </>
  )
}
