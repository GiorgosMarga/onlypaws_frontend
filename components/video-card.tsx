"use client"

import Image from "next/image"
import { Music } from "lucide-react"
import { Video } from "@/lib/types"
import ProfileAvatar from "./ui/profile-avatar"
import VideoController from "./ui/video-controller"
import { Ref, RefObject, useRef } from "react"


export function VideoCard({ video }: { video: Video }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  return (
    <div className="relative h-full w-full bg-black rounded-xl overflow-hidden min-w-fit shadow-2xl shadow-red-500 ">
      {/* Video placeholder */}
      <div className="absolute flex flex-col inset-0  items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={video.mediaUrl[0] || "/placeholder.svg"}
          autoPlay
          loop
          playsInline
        // muted
        // controls
        />
        <VideoController key={video.id} videoRef={videoRef} />
      </div>

      {/* Video info */}
      <div className="absolute bottom-0 left-0 p-4 w-full z-10 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <ProfileAvatar userAvatar={video.userAvatar} dogAvatar={video.dogAvatar} containerStyle="w-12 h-12 md:w-12 md:h-12" dogAvatarStyle="-ml-4" />
          <span className="font-semibold text-white">{`@${video.name} - ${video.dogName}`}</span>
        </div>
        <p className="mt-2 text-sm line-clamp-2">{video.description} {
          video.tags.map((tag, index) => <button key={index} className="text-blue-500 hover:underline cursor-pointer font-semibold">{`${tag}`}</button>)
        }</p>
        <div className="flex items-center gap-2 mt-2">
          <Music className="w-4 h-4" />
          <span className="text-xs">{"Private Sound"}</span>
        </div>
      </div>
    </div>
  )
}

