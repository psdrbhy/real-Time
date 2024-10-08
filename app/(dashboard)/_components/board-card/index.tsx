"use client"
// board组件
import Link from 'next/link'
import Image from 'next/image'
import {formatDistanceToNow} from 'date-fns'
import { useAuth } from '@clerk/nextjs';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal } from 'lucide-react';


import { Overlay } from './overlay';
import { Footer } from './footer';
import { Actions } from '@/components/actions';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
interface BoardCardProps{
    id: string,
    title: string,
    authorName: string,
    authorId: string,
    createdAt: number,
    imageUrl: string,
    orgId: string,
    isFavorite: boolean;
}
export const BoardCard = ({
    id,
    title,
    authorId,
    authorName,
    createdAt,
    imageUrl,
    orgId,
    isFavorite

}: BoardCardProps) => {
    const {userId} = useAuth()
    const authorLabel = userId === authorId ? "You" : authorName 
    // 对时间进行处理
    const createdAtLabel = formatDistanceToNow(createdAt, {
        addSuffix:true
    })
    // 收藏处理
    const { mutate:onFavorite, pending:pendingFavorite } = useApiMutation(api.board.favorite);
    const { mutate:onUnFavorite, pending:pendingUnFavorite } = useApiMutation(api.board.unfavorite);
    const toggleFavorite = () => {
        if (isFavorite) {
            onUnFavorite({id}).then(()=>toast.success("取消收藏成功！")).catch(()=>toast.error("取消收藏失败！"))
        } else {
            onFavorite({id,orgId}).then(()=>toast.success("收藏成功！")).catch(()=>toast.error("收藏失败！"))
        }
    }
    return (
        <Link href={`/board/${id}`}>
            <div className='group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden'>
                <div className='relative flex-1 bg-amber-50'>
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className='object-fit'
                    />
                    <Overlay />
                    <Actions
                        id={id}
                        side='right'
                        title={title}
                    >
                        <button className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none'>
                            <MoreHorizontal
                                className='text-white opacity-75 hover:opacity-100 transition-opacity'
                            />
                        </button>
                    </Actions>
                </div>
                <Footer
                    isFavorite={isFavorite}
                    title={title}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    onClick={toggleFavorite}
                    disabled={pendingFavorite || pendingUnFavorite}
                />
            </div>
        </Link>
    )
}
// 注册骨架屏
BoardCard.Skeleton = function BoardCardSkeleton() {
    return (
        <div className='aspect-[100/127] rounded-lg overflow-hidden'>
            <Skeleton className='h-full w-full'/>
           
        </div>
    )
}