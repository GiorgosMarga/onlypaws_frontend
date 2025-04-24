"use client"

import { useEffect, useState } from "react"
import { Heart, MessageCircle, Share, BookmarkPlus } from "lucide-react"
import type { Video } from "@/lib/types"
import { cn } from "@/lib/utils"
import { StatusCodes } from "http-status-codes"
import { useRouter } from "next/navigation"



export function VideoControls({ video, onCommentsClick }: { video: Video, onCommentsClick: () => void }) {
  const router = useRouter()
  const [liked, setLiked] = useState(video.isLiked)
  const [likes, setLikes] = useState(video.likes)

  useEffect(() => {
    setLiked(video.isLiked)
    setLikes(video.likes)
  }, [video])

  const onClickLikeHandler = async () => {
    setLiked((prev) => !prev)
    setLikes((prev) => (liked ? prev - 1 : prev + 1))
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/likes/${video.id}`, {
        method: !liked ? "POST" : "DELETE",
        credentials: "include",
      })
      if (!res.ok) {
        setLiked((prev) => !prev)
        setLikes((prev) => (liked ? prev + 1 : prev - 1))
        if (res.status === StatusCodes.UNAUTHORIZED) {
          console.error("Unauthorized. Please log in.")
          router.push("/login")
        }
      }
    } catch (error) {
      setLiked((prev) => !prev)
      setLikes((prev) => (liked ? prev + 1 : prev - 1))
      console.error("Error liking video:", error)
    }
  }

  return (
    <div className="flex flex-col gap-8 items-center justify-center h-[90vh]">
      <button className="cursor-pointer flex flex-col items-center" onClick={onClickLikeHandler}>
        <Heart className={cn("w-7 h-7", liked && "fill-red-500 text-red-500")} />
        <span className="text-xs mt-1">{likes}</span>
      </button>

      <button className="cursor-pointer flex flex-col items-center" onClick={onCommentsClick}>
        <MessageCircle className="w-7 h-7" />
        <span className="text-xs mt-1">{video.comments}</span>
      </button>

      <button className="cursor-pointer flex flex-col items-center">
        <BookmarkPlus className="w-7 h-7" />
        <span className="text-xs mt-1">Save</span>
      </button>

      <button className="cursor-pointer flex flex-col items-center">
        <Share className="w-7 h-7" />
        <span className="text-xs mt-1">Share</span>
      </button>
    </div>
  )
}

