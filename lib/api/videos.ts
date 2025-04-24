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
