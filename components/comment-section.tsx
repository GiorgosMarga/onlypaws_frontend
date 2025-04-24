"use client"

import type React from "react"
import type { Comment } from "@/lib/types"
import { useState, useRef, useEffect } from "react"
import { X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQuery } from "@tanstack/react-query"
import { useUserStore } from "@/store/user"
import CommentCard from "./ui/comment"
import { getComments } from "@/lib/api/comments"
import { Spinner } from "./ui/spinner"
import { CommentSectionSkeleton } from "./comments-skeleton"



interface CommentSectionProps {
    videoId: string
    onClose: () => void
}



export function CommentSection({ videoId, onClose }: CommentSectionProps) {

    const { data: comments, isFetching, refetch } = useQuery<Comment[]>({
        queryKey: ["comments", videoId],
        queryFn: async () => await getComments(videoId),
        enabled: !!videoId,
    })

    const [newComment, setNewComment] = useState("")
    const [replyComment, setReplyComment] = useState<Comment | null>(null)
    // const [likedComments, setLikedComments] = useState<Record<string, boolean>>({})
    const [isUploadingComment, setIsUploadingComment] = useState<boolean>(false)
    const commentInputRef = useRef<HTMLInputElement>(null)

    // Focus the comment input when the component mounts
    useEffect(() => {
        if (commentInputRef.current) {
            commentInputRef.current.focus()
        }
    }, [])


    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newComment.trim()) return

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/comments/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postId: videoId,
                    content: newComment.trim(),
                    parentId: replyComment?.id || null,
                    mainCommentId: replyComment?.mainCommentId || null
                }),
                credentials: "include",
            })
            const data = await res.json()
            if (!res.ok) {
                console.error("Error submitting comment:", data)
                return
            }
            setNewComment("")
            setReplyComment(null)
            refetch()
        } catch (err) {
            console.error("Error submitting comment:", err)
        } finally {
            setIsUploadingComment(false)
        }
    }
    if (isFetching) {
        return (
            <div className="flex flex-col h-full">
                <CommentSectionSkeleton />
            </div>
        )
    }
    const onClickReplyHandler = (comment: Comment) => {
        setReplyComment(comment)
        if (commentInputRef.current) {
            commentInputRef.current.focus()
        }
    }
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold">Comments ({comments?.length})</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments?.map((comment) => {
                    if (comment.parentId) return null // Skip replies in the main list

                    return (
                        <span key={comment.id} className="flex flex-col space-y-2">
                            <CommentCard comment={comment} onClickReplyHandler={onClickReplyHandler} />
                        </span>
                    )
                })}
            </div>

            {/* Comment input */}
            <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleCommentSubmit} className="flex gap-2 flex-col">
                    {replyComment &&
                        <div className="flex w-full items-center justify-between pr-2">
                            <span className="flex items-center bg-gray-700 px-5 w-fit text-sm py-1 rounded-full">{`you > @${replyComment.username}`}</span>
                            <X
                                onClick={() => setReplyComment(null)}
                                className="cursor-pointer hover:bg-gray-700 rounded-full p-1"
                                size={20}
                            />
                        </div>}
                    <div className="flex w-full space-x-2">
                        <Input
                            ref={commentInputRef}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 bg-gray-700 border-gray-600 text-white"
                            maxLength={150}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!newComment.trim() || isUploadingComment}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            {isUploadingComment ? <Spinner size="sm" color="white" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
