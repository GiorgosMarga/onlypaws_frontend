import { fetchWithAuth } from "./fetchWithAuth"

export const whoAmI = async () => {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URI}/users/whoAmI`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
        credentials: "include",
    })
    const data = await res.json()
    if (!res.ok) {
        return null
    }
    return data.userId
}

export const refreshToken = async () => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/tokens/refresh`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
        credentials: "include",
    })
    const data = await res.json()
    if (!res.ok) {
        return null
    }

    return data.userId
}

export const loginWithGoogle = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/users/register-google`)
        const data = await res.json()   
        if(!res.ok) {
            throw new Error("Failed to login with Google")
        }
        console.log("Google login response:", data)
    }catch(err)
    {
        console.error("Error logging in with Google:", err)
    }
}

export const isFollowing = async (followingId: string) => {
    try{    
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URI}/follows/is-following/${followingId}`)
        if(!res.ok){
            return null
        }
        return res
    }catch(err){
        console.error(err)
    }
}