import { Video } from "../types"
import { fetchWithAuth } from "./fetchWithAuth"

export const getVideos = async () => {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URI}/posts`, {
            credentials: "include",
    })
    if (!res.ok) {
        throw new Error("Failed to fetch videos")
    }
    const data = await res.json()
    return data.posts as Video[]
}


export const likeVideo = async (videoId: string, isLiked: boolean) => {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URI}/likes/${videoId}`, {
        method: !isLiked ? "POST" : "DELETE",
        credentials: "include",
    })
    const data = await res.json()
    if(!res.ok) {
        return null
    }
    return data
}

export const getLikedVideos = async () => {
    try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URI}/likes/`)
        if(!res) {
            console.log("Error")
            return []
        }
        const data = await res.json()
        return data.posts as Video[]
    }catch(err) {
        console.log(err)
        return []
    }
}