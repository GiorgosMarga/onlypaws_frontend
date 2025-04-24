import { VideoFeed } from "@/components/video-feed"
import { SideNav } from "@/components/side-nav"

export default function Home() {
  return (
    <main className="flex h-screen bg-gray-900 text-white overflow-y-scroll relative">
      <SideNav />
      <div className="flex-1 flex items-center justify-center">
        <VideoFeed />
      </div>
    </main>
  )
}

