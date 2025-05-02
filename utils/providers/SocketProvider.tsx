'use client'
import { useSocketStore } from '@/store/socket'
import { useUserStore } from '@/store/user'
import { useEffect } from 'react'



export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const { setSocket, socket } = useSocketStore()
    const { userId } = useUserStore()
    // Set the first conversation as active by default after loading
    useEffect(() => {
        const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URI!);
        setSocket(ws)
        return () => {
            ws.close()
            console.log("Removing socket")
            setSocket(null)
        }
    }, [])
    useEffect(() => {
        if (!socket) return

        const handleOpen = () => {
            console.log("WebSocket connected")
            socket.send(JSON.stringify({
                type: "join",
                from: userId
            }))
        }

        // Attach handler
        socket.addEventListener("open", handleOpen)

        return () => {
            // Clean up handler
            socket.removeEventListener("open", handleOpen)
        }
    }, [socket, userId])


    return (
        <>
            {children}
        </>
    )
}
