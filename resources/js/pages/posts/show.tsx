import AppLayout from '@/layouts/app-layout'
import { Post, BreadcrumbItem, SharedData } from '@/types';
import { useEffect } from 'react';
import { store as storeView } from '@/routes/api/views';
import axios from 'axios'
import { usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Show Post',
        href: '/posts/',
    },
];

function replaceNbsps(str: string) {
  const re = new RegExp(String.fromCharCode(160), "g");
  return str.replace(re, " ");
}

export default function ShowPost({post} : {post: Post}) {

    const { apiToken } = usePage<SharedData>().props
    useEffect(() => {
        console.log('storeView')
        axios.post(storeView().url, {
            viewable_type: 'post',
            viewable_id: post.id
        }, {
            headers: {
                Authorization: 'Bearer ' + apiToken
            }
        })
            .then(res => console.log('storeView response:', res))
            .catch(e => console.log('error:', e))
    }, [])
    return <AppLayout breadcrumbs={breadcrumbs}>
        {
            <div className="w-full flex flex-col gap-7 mx-auto max-w-5xl">
                {/* <p>
                    {
                        JSON.stringify(post)
                    }
                </p> */}
                <h1 className='text-4xl font-bold text-center'>{post.title}</h1>
                {
                    post.cover_type.split('/')[0] == 'video' &&
                    <video autoPlay loop controls preload="true">
                        <source src={post.cover} type={post.cover_type} />
                    </video>
                }
                {
                    post.cover_type.split('/')[0] == 'image' &&
                    <img src={post.cover} className="w-full max-h-[70vh] object-contain" />
                }
                {
                    post.body.map((block) => {

                        if (block.type == "text") {
                            return <div className="max-w-full wrap-anywhere" dangerouslySetInnerHTML={{__html: replaceNbsps(block.html)}}>
                                
                                </div>
                        }

                        if (block.type == "image") {
                            return <img src={block.url} className="w-full" />
                        }

                        if (block.type == "video") {
                            return <video autoPlay loop controls preload="true">
                                <source src={block.url} type={block.mime} />
                            </video>
                        }
                    })
                }
            </div>
            
        }
    </AppLayout>
}