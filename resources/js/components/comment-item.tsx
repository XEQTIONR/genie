import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { useInitials } from '@/hooks/use-initials'
import { Comment } from '@/types'
import { Separator } from './ui/separator'
export default function CommentItem({comment, className = ''} : {comment: Comment, className?: string}) {
    
    const getInitials = useInitials()

    const formatDate = (dateStr: string) => {

        const MILISECONDS_IN_SECOND = 1000
        const MILISECONDS_IN_MINUTE = 60 * 1000
        const MILISECONDS_IN_HOUR = 60 * 60 * 1000
        const MILISECONDS_IN_DAY = 24 * 60 * 60 * 1000
        const MILISECONDS_IN_WEEK = 7 * 24 * 60 * 60 * 1000
        const MILISECONDS_IN_MONTH = 30 * 24 * 60 * 60 * 1000
        const MILISECONDS_IN_YEAR = 12 * 30 * 24 * 60 * 60 * 1000

        const date = new Date(dateStr)
        const diff = Date.now() - date.getTime()

        if (diff / MILISECONDS_IN_YEAR >= 1) {
            return Math.floor(diff / MILISECONDS_IN_YEAR) + "y ago"
        }

        if (diff / MILISECONDS_IN_MONTH >= 1) {
            return Math.floor(diff / MILISECONDS_IN_MONTH) + "mon ago"
        }

        if (diff / MILISECONDS_IN_WEEK >= 1) {
            return Math.floor(diff / MILISECONDS_IN_WEEK) + "w ago"
        }

        if (diff / MILISECONDS_IN_DAY >= 1) {
            return Math.floor(diff / MILISECONDS_IN_DAY) + "d ago"
        }

        if (diff / MILISECONDS_IN_HOUR >= 1) {
            return Math.floor(diff / MILISECONDS_IN_HOUR) + "h ago"
        }

        if (diff / MILISECONDS_IN_MINUTE >= 1) {
            return Math.floor(diff / MILISECONDS_IN_MINUTE) + "m ago"
        }

        // if (diff / MILISECONDS_IN_SE >= 1) {
            return Math.floor(diff / MILISECONDS_IN_SECOND) + "s ago"
        // }
    }

    return <Item className={className}>
        <ItemMedia>
            <Avatar className="size-7">
                <AvatarImage src={comment.user?.avatar} />
                <AvatarFallback>{getInitials(comment.user?.name ?? "")}</AvatarFallback>
            </Avatar>
        </ItemMedia>
        <ItemContent>
            <ItemTitle>
                <div className='flex items-center gap-2'>

                    <span className='font-semibold'>{comment.user?.name}</span>
                    <Separator className='!h-3.5 bg-dim' orientation='vertical' />
                    <span className='text-xs font-medium'>{formatDate(comment.created_at)}</span>
                </div>
            </ItemTitle>
            <ItemDescription 
                className='text-foreground line-clamp-none text-left' 
                dangerouslySetInnerHTML={{__html: comment.comment.replace(/(?:\r\n|\r|\n)/g, '<br>')}} 
            />
        </ItemContent>
    </Item>
}