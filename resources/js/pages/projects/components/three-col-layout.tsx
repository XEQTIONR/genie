export default function ThreeColLayout({
    id,
    children = null,
    leftChildren = null,
    rightChilren = null,
}: {
    id: string,
    children: React.ReactNode
    leftChildren: React.ReactNode
    rightChilren: React.ReactNode
}) {
    return (
        <div id={id}>
            <div className="hidden md:inline md:w-1/4 pt-10 h-full sticky float-left top-16">
                { leftChildren }
            </div>
            <div className="hidden md:flex md:w-1/4 pt-10 h-full sticky float-right top-16">
                { rightChilren }
            </div>
            <div className="w-full md:w-2/4 block mx-auto pt-10 px-4">
                { children }
            </div>
        </div>
    )
}