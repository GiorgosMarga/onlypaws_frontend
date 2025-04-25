"use client"

import React, { useReducer } from "react"
import { Heart, MessageCircle, Share, BookmarkPlus } from "lucide-react"
import type { Video } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { likeVideo } from "@/lib/api/videos"

enum LikesActionKind {
  LIKE = "like"
}

function likesReducer(state: LikeState, action: LikesAction) {
  if (action.type === 'like') {
    if (state.isLiked) {
      // post is liked, need to dislike it
      return {
        likes: state.likes - 1,
        isLiked: false
      }
    }
    return {
      likes: state.likes + 1,
      isLiked: true
    };
  }
  throw Error('Unknown action.');
}


type LikeState = {
  isLiked: boolean;
  likes: number;
}

type LikesAction = {
  type: LikesActionKind
  payload?: {
    likes: number
    isLiked: boolean
  }
}

export function VideoControls({ video, onCommentsClick }: { video: Video, onCommentsClick: () => void }) {
  const [state, dispatch] = useReducer(likesReducer, {
    isLiked: video.isLiked,
    likes: video.likes
  })
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationKey: ["like_video"],
    mutationFn: async () => {
      dispatch({ type: LikesActionKind.LIKE })
      const res = await likeVideo(video.id, state.isLiked)
      if (!res) {
        dispatch({ type: LikesActionKind.LIKE })
      }
    },
    onMutate: async (videoId: string) => {
      await queryClient.cancelQueries({ queryKey: ["videos"] })
      const previousVideos = queryClient.getQueriesData<Video[]>({
        queryKey: ["videos"]
      })
      if (!previousVideos) return
      queryClient.setQueryData(["videos"], (old: Video[]) => {
        if (state.isLiked) {
          return old?.map(v =>
            v.id === videoId ? { ...v, likes: v.likes - 1, isLiked: false } : v
          )
        } else {
          return old?.map(v =>
            v.id === videoId ? { ...v, likes: v.likes + 1, isLiked: true } : v
          )
        }
      })
      return { previousVideos }
    },
    onError: (err) => {
      console.error(err)
    },
  })


  const onClickLikeHandler = async () => {
    mutation.mutate(video.id)
  }

  return (
    <div className="flex flex-col gap-8 items-center justify-center h-[90vh]">
      <button className="cursor-pointer flex flex-col items-center" onClick={onClickLikeHandler}>
        <Heart className={cn("w-7 h-7", state.isLiked && "fill-red-500 text-red-500")} />
        <span className="text-xs mt-1">{state.likes}</span>
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

