import { createConversation } from "@/lib/api/conversations";
import { fetchUsersByUsername } from "@/lib/api/user";
import { ChatConversation, ChatUser } from "@/lib/types";
import { Search } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface SearchUserProps {
    setCurrentConversation: (conv: ChatConversation) => void
}

export default function SearchUser({ setCurrentConversation }: SearchUserProps) {
    const [inputVal, setInputVal] = useState("")
    const [users, setUsers] = useState<ChatUser[]>([])

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputVal(e.target.value)
    }

    const onClickNewConversationHandler = async (user: ChatUser) => {

        const newConvId = await createConversation(user.userId)
        if (!newConvId) {
            return
        }
        setCurrentConversation({
            id: newConvId,
            user,
            lastMessage: "",
            lastMessageTime: "",
            unreadCount: 0,
            isRead: false,
            messages: [],

        })
    }

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (inputVal.length === 0) return
            const res = await fetchUsersByUsername(inputVal)
            if (res) {
                console.log(res)
                setUsers(res)
            }
        }, 500)
        return () => clearTimeout(timeout)
    }, [inputVal])

    return (
        <div className="w-full h-32 absolute top-0 left-0 z-10 p-2 bg-gray-900 ">
            <label className="input bg-gray-900">
                <Search className="w-5 h-5 text-gray-500" />
                <input className="grow" type="search" placeholder="Search user..." value={inputVal} onChange={onChangeHandler} />
            </label>
            {
                users.length > 0 &&
                <ul className="menu h-full w-full rounded-box bg-gray-800 shadow-sm mt-2 p-3">
                    {
                        users.map((u: ChatUser) =>
                        (<li key={u.userId} className="text-white hover:bg-gray-900/50 cursor-pointer items-center w-full flex flex-row p-2 rounded-xl" onClick={() => {onClickNewConversationHandler(u)}}>
                            <div className="w-10 h-10 rounded-full items-center justify-center relative overflow-hidden flex">
                                <Image
                                    src={u.userAvatar}
                                    alt={u.name}
                                    width={250}
                                    height={250}
                                    className="object-cover absolute w-full h-full" />
                            </div>
                            <p className="w-fit h-fit">@{u.name}</p>
                        </li>)
                        )
                    }
                </ul>
            }
        </div >
    )
}