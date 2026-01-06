import axios from 'axios'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { useInitials } from '@/hooks/use-initials'
import { Comment, SharedData, User } from '@/types'
import { useState } from 'react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from './ui/input-group'
import { Send } from 'lucide-react'
import { store } from '@/routes/api/comments'
import { usePage } from '@inertiajs/react'

export default function CommentForm({
    commentableId,
    commentableType,
    user, 
    onSuccess,
    onError,
    className = ''
} : {
    commentableId: number
    commentableType: 'post'|'project'
    user: User
    onSuccess?: (c: Comment) => void
    onError?: (e: unknown) => void 
    className?: string
}) {
    
    const { apiToken } = usePage<SharedData>().props

    const getInitials = useInitials()
    const [comment, setComment] = useState('')

    return <Item className={className}>
        <ItemMedia>
            <Avatar className="size-7">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{getInitials(user.name ?? "")}</AvatarFallback>
            </Avatar>
        </ItemMedia>
        <ItemContent>
            <ItemDescription>
            <InputGroup>
                    <InputGroupTextarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your comment ..." />
                    <InputGroupAddon align="block-end">
                
                    <InputGroupButton
                    variant="secondary"
                    className="rounded-full ml-auto"
                    size="icon-sm"
                    onClick={() => {
                        axios.post(store().url, {
                            commentable_type: commentableType,
                            commentable_id: commentableId,
                            comment,
                        }, {
                            headers: {
                                Authorization: 'Bearer ' + apiToken
                            }
                        })
                            .then(res => {
                                if (onSuccess) {
                                    onSuccess(res.data)
                                }
                                setComment("") 
                            })
                            .catch(e => {
                                if(onError) {
                                    onError(e)
                                }
                            })
                        
                    }}
                >
                    <Send  />
                    <span className="sr-only">Send</span>
                </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
            </ItemDescription>
        </ItemContent>
    </Item>
}