import {create} from "zustand"
import {persist} from "zustand/middleware" 
type UserStore = {
    userId: string
    setUser: (userId:string) => void
}

export const useUserStore = create<UserStore>()(
    persist(
        (set,get) => ({
            userId: "",
            setUser: (userId:string) => set({userId})
        }),
        {
            name: "user-storage"
        }
    )
)