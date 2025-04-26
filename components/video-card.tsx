"use client"

import { Music } from "lucide-react"
import { Video } from "@/lib/types"
import ProfileAvatar from "./ui/profile-avatar"
import VideoController from "./ui/video-controller"
import { useRef } from "react"
import { useUserStore } from "@/store/user"
import { fetchWithAuth } from "@/lib/api/fetchWithAuth"
import toast, { Toaster } from "react-hot-toast"
import { isFollowing as isFollowingReq } from "@/lib/api/user"
import { useQuery } from "@tanstack/react-query"



export function VideoCard({ video }: { video: Video }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { userId } = useUserStore()
  // const [isFollowing, setIsFollowing] = useState(true)
  const notify = () => toast.success(`You are now following ${video.name}.`);
  const { data: isFollowing, isFetching } = useQuery({
    queryKey: [`video_follower_${video.id}`],
    queryFn: async () => {
      const res = await isFollowingReq(video.userId)
      if (!res) {
        return false
      }
      const data = await res.json()
      return data.isFollowing as boolean
    }
  })
  const onClickFollowHandler = async () => {
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URI}/follows/${video.userId}`, {
        method: "POST"
      })
      const data = await res.json()
      if (!res.ok) {
        console.error(data.message)
        return
      }
      notify()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="relative h-full w-full bg-black rounded-xl overflow-hidden min-w-fit shadow-2xl shadow-red-500 ">
      <Toaster />
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
      <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <ProfileAvatar userAvatar={video.userAvatar} dogAvatar={video.dogAvatar} containerStyle="w-12 h-12 md:w-12 md:h-12" dogAvatarStyle="-ml-4" />
          <div className="flex items-center z-50">
            <span className="font-semibold text-sm text-white">{`@${video.name} - ${video.dogName}`}</span>
            {userId !== video.userId && !isFollowing && !isFetching &&
              <button onClick={onClickFollowHandler} className="cursor-pointer text-sm w-fit h-fit hover:scale-105 transition-all duratio-105 ease-in py-1 px-3 ml-2 rounded-2xl bg-[#3c8eff]">Follow</button>}
          </div>


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

