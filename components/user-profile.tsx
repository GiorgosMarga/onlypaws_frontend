"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid, Heart, Bookmark, MessageCircle, MoreHorizontal, Plus, FileVideoIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useUserStore } from "@/store/user"
import type { Post, ReqError, UserInfo, Video } from "@/lib/types"
import { getUserData, getUserPosts } from "@/lib/api/profile"
import { formatNumber } from "@/lib/utils"
import ProfileAvatar from "./ui/profile-avatar"
import { getLikedVideos } from "@/lib/api/videos"


export function UserProfile({ id }: { id: string }) {
    const { userId } = useUserStore()
    const { data: userData, isFetching: isFetchingUser } = useQuery<UserInfo | ReqError>({
        queryFn: async () => await getUserData(id),
        queryKey: ["user"]
    })

    const { data: postsData, isFetching: isFetchingPosts } = useQuery<Post[]>({
        queryFn: async () => await getUserPosts(id),
        queryKey: ["posts"]
    })

    const { data: likedPosts } = useQuery<Video[]>({
        queryKey: ["liked_videos"],
        queryFn: async () => await getLikedVideos()
    })
    const [activeTab, setActiveTab] = useState("posts")


    if (isFetchingUser || isFetchingPosts) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <div className="animate-spin rounded-full h-32 w-32  border-b-2 border-blue-600"></div>
            </div>)
    }

    if (userData && "message" in userData) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <h1 className="text-2xl font-bold text-gray-500">{userData.message}</h1>
            </div>
        )
    }


    return (
        <div className="flex w-full">
            <div className="flex-1 max-w-5xl mx-auto px-4 py-6">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                    {/* Avatar */}
                    <ProfileAvatar userAvatar={userData?.userAvatar} dogAvatar={userData?.dogAvatar} />

                    {/* Profile Info */}
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <div>
                                <h1 className="text-xl font-bold flex items-center gap-1">
                                    {userData?.name}
                                    {userData?.isVerified && (
                                        <span className="w-4 h-4 bg-blue-500 text-white rounded-full text-[10px] flex items-center justify-center">
                                            ✓
                                        </span>
                                    )}
                                </h1>
                                <p className="text-gray-400">@ {userData?.name}</p>
                            </div>

                            <div className="flex gap-2 mt-2 md:mt-0 md:ml-auto">
                                {userData?.userId === userId && <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                                    Edit Profile
                                </Button>}
                                <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 mb-4">
                            <div className="flex flex-col items-center">
                                <span className="font-bold">{postsData && formatNumber(postsData.length)}</span>
                                <span className="text-sm text-gray-400">Posts</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-bold">{userData && formatNumber(userData.followers)}</span>
                                <span className="text-sm text-gray-400">Followers</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-bold">{userData && formatNumber(userData.following)}</span>
                                <span className="text-sm text-gray-400">Following</span>
                            </div>
                        </div>

                        {/* Bio */}
                        <p className="text-sm mb-2">{userData?.bio}</p>

                        {/* Dog Info */}
                        <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                            <span className="bg-gray-800 px-2 py-1 rounded-full">🐕 {userData?.dogName}</span>
                            <span className="bg-gray-800 px-2 py-1 rounded-full">{userData?.dogBreed}</span>
                            <span className="bg-gray-800 px-2 py-1 rounded-full">{userData?.dogAge} years old</span>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="posts" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3 mb-6 bg-gray-800">
                        <TabsTrigger value="posts" className="cursor-pointer data-[state=active]:bg-gray-700">
                            <Grid className="h-4 w-4 mr-2" />
                            Posts
                        </TabsTrigger>
                        <TabsTrigger value="liked" className="cursor-pointer data-[state=active]:bg-gray-700">
                            <Heart className="h-4 w-4 mr-2" />
                            Liked
                        </TabsTrigger>
                        <TabsTrigger value="saved" className="cursor-pointer data-[state=active]:bg-gray-700">
                            <Bookmark className="h-4 w-4 mr-2" />
                            Saved
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="posts" className="mt-0">
                        {postsData && postsData.length === 0
                            ?
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <FileVideoIcon className="h-12 w-12 mb-4 stroke-1" />
                                <h3 className="text-lg font-medium mb-2">No uploaded posts yet</h3>
                                <p className="text-sm text-center max-w-md">Posts that you upload will appear here</p>
                            </div>
                            :
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2">
                                {postsData && postsData.map((post) => (
                                    <div key={post.id} className="aspect-[9/16] relative group overflow-hidden rounded-md">
                                        <video
                                            src={post.mediaUrl[0] || "/placeholder.svg"}
                                            muted
                                            className="object-cover w-full h-full"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-end p-2">
                                            <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-3">
                                                <div className="flex items-center">
                                                    <Heart className="h-3 w-3 mr-1" />
                                                    <span className="text-xs">{formatNumber(post.likes)}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <MessageCircle className="h-3 w-3 mr-1" />
                                                    <span className="text-xs">{formatNumber(post.comments)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    </TabsContent>

                    <TabsContent value="liked" className="mt-0">
                        {
                            likedPosts && likedPosts.length > 0 ?
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2">
                                    {likedPosts.map(post => <div key={post.id} className="aspect-[9/16] relative group overflow-hidden rounded-md">
                                        <video
                                            src={post.mediaUrl[0] || "/placeholder.svg"}
                                            muted
                                            className="object-cover w-full h-full"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-end p-2">
                                            <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-3">
                                                <div className="flex items-center">
                                                    <Heart className="h-3 w-3 mr-1" />
                                                    <span className="text-xs">{formatNumber(post.likes)}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <MessageCircle className="h-3 w-3 mr-1" />
                                                    <span className="text-xs">{formatNumber(post.comments)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    )}
                                </div>
                                :
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <Heart className="h-12 w-12 mb-4 stroke-1" />
                                    <h3 className="text-lg font-medium mb-2">No liked posts yet</h3>
                                    <p className="text-sm text-center max-w-md">Videos that you like will appear here</p>
                                </div>}
                    </TabsContent>

                    <TabsContent value="saved" className="mt-0">
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Bookmark className="h-12 w-12 mb-4 stroke-1" />
                            <h3 className="text-lg font-medium mb-2">No saved posts yet</h3>
                            <p className="text-sm text-center max-w-md">Videos that you save will appear here</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Create Post Button */}
            <Link href="/create-post" className="fixed bottom-6 right-6 z-10">
                <Button className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 shadow-lg">
                    <Plus className="h-6 w-6" />
                </Button>
            </Link>
        </div>
    )
}

