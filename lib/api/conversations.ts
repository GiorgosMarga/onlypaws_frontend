import { ChatConversation } from "../types"
import { fetchWithAuth } from "./fetchWithAuth"

export const fetchAllConversations = async () => {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URI}/conversations`)
    if(!res.ok) {
        return null
    }
    const data = await res.json()
    return data.conversations as ChatConversation[]
}

export const createConversation = async (withUser: string) => {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URI}/conversations`, {
        method: "POST",
        body: JSON.stringify({
            userId: withUser
        }),
    })  
    const data = await res.json()

    if(!res.ok) {
        console.error(data)
        return null 
    }
    return data.convId as string
}