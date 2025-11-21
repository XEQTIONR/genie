import { useEffect, useRef, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

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
import { Input } from "@/components/ui/input"

export interface Option {
    label: string | React.ReactNode,
    value: string
}

export interface GroupedOptions {
    [key: string]: Option[]
}

export function Combobox({
    name = "default-combobox-name",
    defaultValue = "",
    items = [], 
    containerClassName = "", 
    placeholder = "Select...",
    searchLabel = "Search...",
    noResultsLabel = "No results found.",
    onQueryChange,
    onSelectValue,
} : {
    name?: string
    defaultValue?: string
    items?: Option[]|GroupedOptions
    containerClassName?: string 
    placeholder?: string
    searchLabel?: string
    noResultsLabel?: string
    onQueryChange?: (q: string) => void
    onSelectValue?: (val: string) => void

}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const container = useRef<HTMLButtonElement>(null)

  return (
    <>
    <Input type="hidden" name={name} value={value} />
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger ref={container} className={containerClassName} asChild>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between"
            >
            {
                value
                    ? Array.isArray(items)
                        ? items.find((item) => item.value === value)?.label
                        : Object.values(items).flat().find((item) => item.value === value)?.label
                    : placeholder
            }
                <ChevronsUpDown className="opacity-50" />
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
                                        setValue(currentValue === value ? "" : currentValue)
                                        if (onSelectValue) {
                                            onSelectValue(currentValue === value ? "" : currentValue)
                                        }
                                        setOpen(false)
                                    }}>
                                        {item.label}
                                        <Check className={cn(
                                                "ml-auto",
                                                value === item.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
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
                                            setValue(currentValue === value ? "" : currentValue)
                                            if (onSelectValue) {
                                                onSelectValue(currentValue === value ? "" : currentValue)
                                            }
                                            setOpen(false)
                                        }}>
                                            {item.label}
                                            <Check className={cn(
                                                    "ml-auto",
                                                    value === item.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
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
