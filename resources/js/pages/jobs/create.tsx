import AppLayout from '@/layouts/app-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { BreadcrumbItem, Location, Project } from '@/types'
import { BriefcaseBusiness, Check, Heading1, Heading2, List, ListChecks, ListOrdered, PencilRuler, Plus, WrapText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Checkbox } from '@/components/ui/checkbox'
import { create, store } from '@/routes/jobs'
import {
  Field,
  FieldSet,
  FieldLegend,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Head, Link, useForm } from '@inertiajs/react'
import { useInitials } from '@/hooks/use-initials'
import { Input } from '@/components/ui/input'
import Quill from 'quill'
import roles from '@/data/roles'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { Team } from '@/types'
import { useEffect, useRef, useState } from 'react'
import '/resources/css/quill.bubble.css'
import { Combobox, GroupedOptions } from '@/components/ui/combobox'
import axios from 'axios'

function Step({step, heading, children} : {step: number, heading: string, children: React.ReactNode}) {
    return (<>
        <div className="w-full flex gap-3 pr-3 md:pr-0">
            <div className="flex flex-col gap-1 items-center w-7">
                <div className="size-7 text-sm font-medium shrink-0 rounded-2xl bg-muted text-center flex justify-center items-center">
                    {step}
                </div>
            </div>
            <div className='flex items-center flex-grow'>
                <h2 className="font-bold">{heading}</h2>
            </div>
            
        </div>
        <div className="w-full py-1 flex gap-3 pr-3 md:pr-0">
            <div className="flex flex-col gap-1 items-center w-7 shrink-0">
                <Separator className="border-[1px] " orientation="vertical" />
            </div>
            <div className="flex-grow">
                {children}
            </div>
            
        </div>
    </>)
}

export default function CreateJobPosting({ projects, teams } : { projects: Project[], teams: Team[] }) {

    const [tagsFocused, setTagFocused] = useState<boolean>(false)

    const tagsInpurRef = useRef<HTMLInputElement>(null)

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Create Project',
            href: create().url
        }
    ]
    
    const [countryOptions, setCountryOptions] = useState<GroupedOptions>({})
    
    const [inputCity, setInputCity] = useState<string>("")
    const [inputCountry, setInputCountry] = useState<string>("")

    const editor = useRef<Quill>(undefined)

    const getInitials = useInitials()

    useEffect(() => {
        const quill = new Quill('#editor', {
            theme: 'bubble',
            bounds: '#editor',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['link'],
                ]
            },
            formats: [
                'bold', 'italic', 'underline', 'strike',
                'blockquote',
                'header', 'list',
            ],
            placeholder: 'Description about the position'
        })
        editor.current = quill
    }, [])

    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all?fields=name,flag,region')
            .then(({data}) => {
                const opts = data.map(({name, flag, region} : { name: { common: string }, flag: string, region: string}) => {
                    return { name: name.common, flag, region }
                }).sort((a: {name: string}, b: {name: string}) => a.name.localeCompare(b.name))
                .filter(({name} : {name: string}) => name !== 'Israel')
                .map(({ name, flag, region } : { name: string, flag: string, region: string }) => {
                    return { label: flag + ' ' + name, value: name, region }
                })

                const grouped = Object.groupBy(opts, (opt : {region: string}) => opt.region)

                setCountryOptions({
                    None: [{label: "Not selected", value: ""}],
                    ...grouped
                })
            })
    }, [])

    const getRoleOptions = () => {
        const obj : GroupedOptions = {}

        obj['Default'] = [{ label: 'Not Selected', value: ''}]

        roles.forEach(({name, items}) => {
            obj[name] = items.map(itm => ({ label: itm, value: itm}))
        })
        
        return obj
    }

    const { data, setData, transform, post } = useForm<{
        title: string
        publish: boolean
        primary_role: string 
        locations: Location[]
        location_type: string
        compensation_type: string 
        tags: string[]
        work_location: string[]
        employment_type: string[]
        owner_type: string|null
        owner_id: number|null
    }>({
        title: '',
        publish: true,
        primary_role: '',
        locations: [],
        location_type: 'global',
        compensation_type: 'compensated',
        tags: [],
        work_location: [],
        employment_type: [],
        owner_type: null,
        owner_id: null
    })

    transform((data) => ({
        ...data,
        description_html: editor.current?.root.innerHTML,
        description: editor.current?.getText(),
    }))

    const selection = () : number[] => {
        const range = editor.current?.getSelection()

        if (range) {
            const cursorIndex = range.index
            const selectionLength = range.length
            return [cursorIndex, selectionLength]
        }

        return []
    }

    return (
        <AppLayout maxWidth="md:max-w-7xl" breadcrumbs={breadcrumbs}>
            <Head title="Create new project" />
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    post(store().url)
                }}
                onKeyDown={(e) => {
                    if (e.key == 'Enter' && tagsFocused) {
                        e.preventDefault()
                    }
                }} 
                className="w-full max-w-4xl mx-auto flex flex-col pt-8 px-4"
            >
                <div className="flex items-center gap-3 mb-1">
                    <BriefcaseBusiness size={25} />
                    <h1 className="text-xl font-bold">Create a new job listing</h1>
                </div>
                <span className="text-sm text-dim md:mx-10 mb-1 font-medium">Add a job posting that people can use to contact you to join your team. Job postings can be compensated or voluntary</span>
                <span className="text-sm text-dim md:mx-10 italic mb-10 font-medium">Required fields are marked with an asterisk (*).</span>
                
                <Step step={1} heading={"General Information"}>
                    <FieldGroup className="mt-2 mb-10">
                        <Field className="gap-2">
                            <FieldLabel>Job Title *</FieldLabel>
                            <Input value={data.title} onChange={(e) => setData('title', e.target.value)} name="title" />
                        </Field>
                        <Field>
                            <FieldLabel>Primary Role</FieldLabel>
                            <Combobox onSelectValue={(val) => setData('primary_role', val)} placeholder="Select primary role" items={getRoleOptions()} />
                        </Field>
                        <Field className="gap-3">
                            <FieldLabel>Description *</FieldLabel>
                            <div className='max-w-full flex justify-start'>
                                <ButtonGroup className="flex flex-wrap">
                                    <ButtonGroup>
                                        <Button type="button" variant="outline" size="icon" onClick={() => {
                                            const [a, b] = selection()
                                            if (a !== undefined && b !== undefined) {
                                                editor.current?.formatLine(a, b, 'header', 1)
                                            }
                                        }}>
                                            <Heading1 />
                                        </Button>
                                        <Button type="button" variant="outline" size="icon" onClick={() => {
                                            const [a, b] = selection()
                                            if (a !== undefined && b !== undefined) {
                                                editor.current?.formatLine(a, b, 'header', 2)
                                            }
                                        }}>
                                            <Heading2 />
                                        </Button>
                                        <Button type="button" variant="outline" size="icon" onClick={() => {
                                            const [a, b] = selection()
                                            if (a !== undefined && b !== undefined) {
                                                editor.current?.removeFormat(a, b)
                                            }
                                        }}>
                                            <WrapText />
                                        </Button>
                                    </ButtonGroup>
                                    <ButtonGroup>
                                        <Button type="button" variant="outline" size="icon" onClick={() => {
                                            const [a, b] = selection()
                                            if (a !== undefined && b !== undefined) {
                                                editor.current?.formatLine(a, b, 'list', 'ordered')
                                            }
                                        }}>
                                            <ListOrdered />
                                        </Button>
                                        <Button type="button" variant="outline" size="icon" onClick={() => {
                                            const [a, b] = selection()
                                            if (a !== undefined && b !== undefined) {
                                                editor.current?.formatLine(a, b, 'list', 'bullet')
                                            }
                                        }}>
                                            <List />
                                        </Button>
                                        <Button type="button" variant="outline" size="icon" onClick={() => {
                                            const [a, b] = selection()
                                            if (a !== undefined && b !== undefined) {
                                                editor.current?.formatLine(a, b, 'list', 'checked')
                                            }
                                        }}>
                                            <ListChecks />
                                        </Button>
                                    </ButtonGroup>
                                </ButtonGroup>
                            </div>
                            <div 
                                onClick={() => {
                                    const textBox: HTMLDivElement|null = document.querySelector('.ql-editor')
                                    if (textBox) {
                                        textBox.focus()
                                    }
                                }}
                                className='min-h-36 border p-0 rounded-md cursor-text' 
                                id="editor"
                            />
                        </Field>
                    </FieldGroup>
                </Step>

                <Step step={2} heading={"Job Options"}>
                    <Field className="w-full max-w-md mt-2">
                        <FieldLabel>Choose team or project *</FieldLabel>
                        <FieldDescription>
                            Choose a team or project that this position is for.
                        </FieldDescription>

                        <Select onValueChange={(value) => {
                            const [ownerType, ownerId] = value.split('-')
                            setData('owner_type', ownerType)
                            setData('owner_id', parseInt(ownerId))
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select team / project" />
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Teams</SelectLabel>
                                        {
                                            teams.map(({ avatar, id, name, }) => (
                                                <SelectItem value={`team-${id}`}>
                                                    <Avatar variant="square" className="size-5">
                                                        <AvatarImage src={avatar}></AvatarImage>
                                                        <AvatarFallback>{getInitials(name)}</AvatarFallback>
                                                    </Avatar>
                                                    {name}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Projects</SelectLabel>
                                        {
                                            projects.map(({id, title}) => (
                                                <SelectItem value={`project-${id}`}>
                                                    <PencilRuler size={5} />
                                                    {title}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </SelectTrigger>
                        </Select>
                    </Field>

                    <Field className="w-full max-w-md mt-8">
                        <FieldLabel>Tags</FieldLabel>
                        <FieldDescription>
                            Add tags that are related to this role
                        </FieldDescription>
                        <div className='min-h-5 flex flex-wrap gap-1'>
                        {
                            data.tags.length == 0
                                ? ' '
                                : data.tags.map((tag) => (
                                    <Badge 
                                        variant="secondary"
                                        onClick={() => setData('tags', data.tags.filter((f) => f !== tag))}
                                    >
                                        {tag} <X />
                                    </Badge>
                                )) 
                        }
                        </div>
                        <Input
                            ref={tagsInpurRef} 
                            onFocus={() => setTagFocused(true)}
                            onBlur={() => setTagFocused(false)} 
                            onKeyUp={(e) => {
                                if (e.key == 'Enter') {
                                    if (tagsInpurRef.current && (tagsInpurRef.current.value.length > 0)) {
                                        const set = new Set(data.tags)
                                        set.add(tagsInpurRef.current.value)
                                        setData('tags', [...set])
                                        tagsInpurRef.current.value = ""
                                    }
                                }
                            }}
                            className="text-sm" 
                            placeholder='e.g. Game design, ' 
                        />
                    </Field>

                    <FieldSet className="w-full mt-8">
                        <FieldLabel>Compensation *</FieldLabel>
                        <FieldDescription>
                            How contributions will be compensated. 
                            {/* <div className="inline pb-1"> */}
                                <a className="text-xxs relative -top-0.5 left-2" target='_blank' href="https://google.com">Learn more</a>
                            {/* </div> */}
                        </FieldDescription>
                        
                        <RadioGroup onValueChange={(value) => setData('compensation_type', value)} value={data.compensation_type}>
                            <Field orientation="horizontal">
                                <RadioGroupItem value="compensated" />
                                <FieldLabel className="font-normal">
                                    Compensated
                                </FieldLabel>
                            </Field>
                            <Field orientation="horizontal">
                                <RadioGroupItem value="ownership" />
                                <FieldLabel className="font-normal">
                                    Shared Ownership
                                </FieldLabel>
                            </Field>
                            <Field orientation="horizontal">
                                <RadioGroupItem value="credited" />
                                <FieldLabel className="font-normal">
                                    Credited
                                </FieldLabel>
                            </Field>
                            <Field orientation="horizontal">
                                <RadioGroupItem value="voluntary" />
                                <FieldLabel className="font-normal">
                                    Voluntary
                                </FieldLabel>
                            </Field>
                        </RadioGroup>
                    </FieldSet>

                    <FieldSet className="w-full mt-8">
                        <FieldLabel>Location *</FieldLabel>
                        <FieldDescription>
                            Where contributors must be from.
                        </FieldDescription>
                        <RadioGroup 
                            onValueChange={(value) => {
                                setData('location_type', value)
                                if (data.location_type === 'global') {
                                    setData('locations', [])
                                }
                            }} 
                            value={data.location_type}
                        >
                            <Field orientation="horizontal">
                                <RadioGroupItem value="global" />
                                <FieldLabel className="font-normal">
                                    Worldwide
                                </FieldLabel>
                            </Field>
                            <Field orientation="horizontal">
                                <RadioGroupItem value="specific" />
                                <FieldLabel className="font-normal">
                                    Sepecific locations
                                </FieldLabel>
                            </Field>
                        </RadioGroup>
                    </FieldSet>
                    {
                        data.location_type === 'specific' &&
                        <FieldSet className="w-full mt-4 gap-4">
                            {
                                data.locations.length > 0 &&
                                <div className='w-full flex flex-wrap gap-2'>
                                { 
                                    data.locations.map((l, idx) => {
                                        return (
                                            <Badge
                                                className="cursor-pointer" 
                                                key={idx}
                                                onClick={() =>setData('locations', data.locations.filter((_, i) => i !== idx))}
                                            >
                                                {
                                                    l.city ? (l.city + ', ' + l.country) : l.country
                                                } 
                                                <X />
                                            </Badge>
                                        )
                                    })
                                }
                                </div>
                            }
                            <FieldDescription>Add Locations</FieldDescription>
                            <div className="flex flex-col md:flex-row gap-4">
                                <Field className='w-full md:w-56'>
                                    <FieldLabel>City</FieldLabel>
                                    <Input 
                                        value={inputCity} 
                                        onChange={(e) => setInputCity(e.target.value)}
                                    />
                                </Field>
                                <Field className='w-full md:w-56'>
                                    <FieldLabel>Country</FieldLabel>
                                    <Combobox
                                        defaultValue={inputCountry} 
                                        onSelectValue={(value) => setInputCountry(value)} 
                                        items={countryOptions} 
                                    />
                                </Field>
                            </div>
                            <Button
                                onClick={() => {
                                    const regex = / +/g
                                    const city = inputCity === "" ? null : inputCity.trim().replaceAll(regex, " ")
                                    const idx = data.locations.findIndex((location) => location.city == city && location.country == inputCountry)

                                    if (idx === -1 && inputCountry.length > 0) {
                                        setData('locations', [...data.locations, { city: city, country: inputCountry }])
                                    }

                                    setInputCity("")
                                }} 
                                variant="secondary"
                                size="sm"
                                className="w-32 cursor-pointer"
                                type="button"
                            >
                                <Plus />
                                Add location
                            </Button>
                        </FieldSet>
                    }
                    

                    <FieldSet className="w-full mt-8">
                        <FieldLegend variant="label">
                            Contribute from *
                        </FieldLegend>
                        <FieldDescription className="-mb-3">
                            Select from where team members can contribute from.
                        </FieldDescription>
                        <FieldGroup className="gap-3">
                            <Field orientation="horizontal">
                                <Checkbox
                                    checked={data.work_location.includes('remote')} 
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setData('work_location', [...data.work_location, 'remote'])
                                        } else {
                                            setData('work_location', data.work_location.filter(value => value !== 'remote') )
                                        }
                                    }}  
                                    id="check-remote" 
                                />
                                <FieldLabel
                                    htmlFor="check-remote"
                                    className="font-normal"
                                    defaultChecked
                                >
                                    Remote
                                </FieldLabel>
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox 
                                    checked={data.work_location.includes('on-site')} 
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setData('work_location', [...data.work_location, 'on-site'])
                                        } else {
                                            setData('work_location', data.work_location.filter(value => value !== 'on-site') )
                                        }
                                    }} 
                                    id="check-on-site" 
                                />
                                <FieldLabel
                                    htmlFor="check-on-site"
                                    className="font-normal"
                                >
                                    On-site
                                </FieldLabel>
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSet className="w-full max-w-md mt-8">
                        <FieldLegend variant="label">
                            Commitment *
                        </FieldLegend>
                        <FieldDescription className="-mb-3">
                            Select the commitment required from potential teammates.
                        </FieldDescription>
                        <FieldGroup className="gap-3">
                            <Field orientation="horizontal">
                                <Checkbox
                                    checked={data.employment_type.includes('part-time')} 
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setData('employment_type', [...data.employment_type, 'part-time'])
                                        } else {
                                            setData('employment_type', data.employment_type.filter(value => value !== 'part-time') )
                                        }
                                    }}  
                                    id="check-part-time" 
                                />
                                <FieldLabel
                                    htmlFor="check-part-time"
                                    className="font-normal"
                                    defaultChecked
                                >
                                    Part-time
                                </FieldLabel>
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox
                                    checked={data.employment_type.includes('full-time')} 
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setData('employment_type', [...data.employment_type, 'full-time'])
                                        } else {
                                            setData('employment_type', data.employment_type.filter(value => value !== 'full-time') )
                                        }
                                    }}  
                                    id="check-full-time" 
                                />
                                <FieldLabel
                                    htmlFor="check-full-time"
                                    className="font-normal"
                                >
                                    Full-time
                                </FieldLabel>
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox
                                    checked={data.employment_type.includes('flexible')} 
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setData('employment_type', [...data.employment_type, 'flexible'])
                                        } else {
                                            setData('employment_type', data.employment_type.filter(value => value !== 'flexible') )
                                        }
                                    }} 
                                    id="check-flexible" 
                                />
                                <FieldLabel
                                    htmlFor="check-flexible"
                                    className="font-normal"
                                >
                                    Flexible
                                </FieldLabel>
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <Field className="w-full mt-8" orientation="horizontal">
                        <FieldContent>
                            <FieldLabel htmlFor="publish">Publish this job upon creation *</FieldLabel>
                            <FieldDescription className="hidden md:inline max-w-md">
                                This posting will be published immediately upon creation and people will
                                be able to view this and reply to it.
                            </FieldDescription>
                        </FieldContent>
                        <div className='flex items-center gap-3'>
                        {
                            data.publish
                                ? <span className="text-xs flex items-center gap-1 text-green-400"><Check size={15} />Publish</span>
                                : <span className="text-xs flex items-center gap-1 text-red-400"><X size={15} /> Don't publish</span>
                        }
                            <Switch checked={data.publish} onCheckedChange={(checked) => setData('publish', checked)} id="publish" />
                        </div>
                    </Field>
                    <FieldDescription className="md:hidden pt-2">
                        This posting will be published immediately upon creation and people will
                        be able to view this and reply to it.
                    </FieldDescription>
                </Step>
                <div className="w-full flex justify-end  max-w-4xl mx-auto py-4">
                    <Button type="submit" className="mr-3 md:mr-0">Create job listing</Button>
                </div>
            </form>
        </AppLayout>
    )
}