import {create} from "zustand"
import { persist } from "zustand/middleware"

type SoundStore = {
    isMuted:boolean,
    volume: number
    setIsMuted: () => void
    setVolume: (newVolume: number) => void
}

export const useSoundStore = create<SoundStore>()(
    persist(
        (set,get) => ({
            volume: 40,
            isMuted: false,
            setIsMuted: () => {
               const state = get()
                set({
                ...state,
                isMuted: !state.isMuted
            })},
            setVolume: (newVolume:number) => {
                const state = get()
                set({
                    ...state,
                    volume: newVolume   
                })
            }
        }),
        {
            name: "sound-storage"
        }
    )
)