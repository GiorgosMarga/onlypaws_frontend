"use client"

import { useEffect, useState } from "react"
import { VideoCard } from "@/components/video-card"
import { VideoControls } from "@/components/video-controls"
import { ChevronUp, ChevronDown, Video } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { CommentSection } from "./comment-section"
import { whoAmI } from "@/lib/api/user"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/user"
import { getVideos } from "@/lib/api/videos"
import { VideoFeedSkeleton } from "./video-feed-skeleton"

export function VideoFeed() {
  const router = useRouter()
  const { setUser } = useUserStore()
  const [showComments, setShowComments] = useState(false)

  const { data: posts, isFetching } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => await getVideos(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => Math.max(prev - 1, 0))
    }
  }

  const handleNext = () => {
    if (!posts) return
    if (currentIndex < posts.length - 1) {
      setCurrentIndex(prev => Math.min(posts.length, prev + 1))
    }
  }

  const handleCommentsClick = () => {
    setShowComments((prev) => !prev)
  }

  useEffect(() => {
    let throttle = false


    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        handlePrev()
      } else if (event.key === "ArrowDown") {
        handleNext()
      } else if (event.key === "Escape") {
        setShowComments(false)
      }
    }

    const scrollDown = (event: WheelEvent) => {
      if (throttle) return
      throttle = true
      if (event.deltaY > 0) {
        handleNext()
      } else {
        handlePrev()
      }
      setTimeout(() => {
        throttle = false
      }, 300)
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("wheel", scrollDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("wheel", scrollDown)

    }
  }, [posts, currentIndex])

  useEffect(() => {
    const authenticateUser = async () => {
      const userId = await whoAmI()
      if (!userId) {
        router.push("/login")
        return
      } else {
        setUser(userId)
      }
    }
    authenticateUser()
  }, [])

  useEffect(() => {
    console.log("Posts:", posts)
  }, [posts])
  if (isFetching || !posts) {
    return <div className="flex w-full max-w-5xl mx-auto px-4 justify-center">
      <VideoFeedSkeleton />
    </div>
  }


  return (
    <div className="flex w-full max-w-5xl mx-auto px-4 justify-center">
      {/* Engagement controls on the left */}
      <div className="flex items-center mr-4">
        {posts[currentIndex] &&
          <VideoControls key={posts[currentIndex].id} video={posts[currentIndex]} onCommentsClick={handleCommentsClick} />}
      </div>

      {/* Video container in the center */}
      <div className="relative w-auto h-[90vh] aspect-[9/16] rounded-xl overflow-hidden shadow-2xl">
        {posts[currentIndex] && <VideoCard key={posts[currentIndex].id} video={posts[currentIndex]} />}
      </div>
      {showComments && (
        <div className="w-full max-w-md ml-4 h-[90vh] bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          {posts[currentIndex] && <CommentSection videoId={posts[currentIndex].id} onClose={handleCommentsClick} />}
        </div>
      )}

      {/* Navigation controls on the far right */}
      <div className="flex items-center ml-8">
        <div className="flex flex-col gap-4 justify-center h-[90vh]">
          {/* Video progress indicators */}
          <div className="flex flex-col gap-2 py-2 items-center">
            {posts?.map((_, idx) => (
              <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentIndex ? "bg-white" : "bg-gray-500"}`} />
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="bg-gray-800 rounded-full p-2 disabled:opacity-30"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === posts.length - 1}
              className="bg-gray-800 rounded-full p-2 disabled:opacity-30"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

