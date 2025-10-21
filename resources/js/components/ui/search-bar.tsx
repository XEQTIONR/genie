import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useState } from "react"


interface SearchOption {
    label: string
    value: string | number
    disabled?: boolean
}

interface SearchOptionGroup {
    heading: string
    options: SearchOption[]
}

export default function SearchBar({
    placeholder,
    onQueryChange,
    onSelectOption,
    searchOptions,
}: {
    placeholder?: string,
    onQueryChange?: (q: string) => void
    onSelectOption?: (option: unknown) => void
    searchOptions: SearchOption[] | SearchOptionGroup[]
}) {

    const [queryString, setQueryString] = useState("")

    return (
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
            <CommandInput 
                onValueChange={(v) => {
                    setQueryString(v)
                    if (onQueryChange) {
                        onQueryChange(v)
                    }
                }} 
                placeholder={placeholder ?? "Search..."} 
            />
            { queryString.length > 0 && <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {
                    searchOptions.length > 0
                        ? ( "heading" in searchOptions[0]
                            ? (
                                searchOptions.map((opts, index) => {
                                    const {heading, options} = opts as SearchOptionGroup
                                    return (
                                        <>
                                            <CommandGroup heading={heading}>
                                            {
                                                options.map(({label, value, disabled = false}: SearchOption) => { 
                                                    return <CommandItem disabled={disabled} onSelect={() => {
                                                        if (onSelectOption) {
                                                            onSelectOption(value)
                                                        }
                                                    }}>{label}</CommandItem>
                                                })
                                            }
                                            </CommandGroup>
                                            
                                            {/* { (index !== searchOptions.length - 1) && <CommandSeparator /> } */}
                                        </>
                                    )
                                }))
                            : (
                                <CommandGroup>
                                {
                                    searchOptions.map((opts) => {
                                        const {label, value, disabled = false} = opts as SearchOption
                                        return (
                                            <>
                                                <CommandItem disabled={disabled} onSelect={() => {
                                                    if (onSelectOption) {
                                                        onSelectOption(value)
                                                    }
                                                }}>{label}</CommandItem>
                                            </>
                                        )
                                    })    
                                }
                                </CommandGroup>
                            )
                        )
                        : null
                }
            </CommandList> }
        </Command>
    )
}