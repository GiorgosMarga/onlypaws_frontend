import {create} from "zustand"
import {persist} from "zustand/middleware"

export type Pages = "home" | "profile" | "discover" | "create" | "chat"

type NavStore = {
    currentPage:Pages,
    setPage: (currentPage:Pages) => void
}

export const useNavStore = create<NavStore>()((set) => ({
    currentPage: "home",
    setPage: (currentPage: Pages) => set({ currentPage })
}))