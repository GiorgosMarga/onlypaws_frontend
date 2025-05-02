import {create} from "zustand"
import {persist} from "zustand/middleware" 
type SocketStore = {
    socket: WebSocket | null;
    setSocket: (socket:WebSocket|null) => void;
}

export const useSocketStore = create<SocketStore>()(
    persist(
        (set,get) => ({
            socket: null,
            setSocket: (socket:WebSocket|null) => set({socket})
        }),
        {
            name: "socket-storage"
        }
    )
)