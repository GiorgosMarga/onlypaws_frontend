"use client"

import type React from "react"
import Link from "next/link"
import { Home, Search, Plus, MessageSquare, User } from "lucide-react"
import { Pages, useNavStore } from "@/store/nav"
import { useUserStore } from "@/store/user"

export function SideNav() {
  const { currentPage, setPage } = useNavStore()
  const { userId } = useUserStore()

  const handleNavClick = (item: Pages) => {
    setPage(item)
  }

  return (
    <div className="w-20 md:w-28 bg-gray-900 border-r border-gray-800 flex flex-col items-center justify-center gap-10 py-8 z-20 h-screen sticky top-0">
      <NavItem
        icon={<Home className="w-6 h-6" />}
        label="Home"
        active={currentPage === "home"}
        onClick={() => handleNavClick("home")}
        href="/"
      />
      <NavItem
        icon={<Search className="w-6 h-6" />}
        label="Discover"
        active={currentPage === "discover"}
        onClick={() => handleNavClick("discover")}
        href="/discover"
      />
      <NavItem
        icon={<Plus className="w-8 h-8" />}
        label="Create"
        special
        active={currentPage === "create"}
        onClick={() => handleNavClick("create")}
        href="/create-post"
      />
      <NavItem
        icon={<MessageSquare className="w-6 h-6" />}
        label="Inbox"
        active={currentPage === "inbox"}
        onClick={() => handleNavClick("inbox")}
        href="/inbox"
      />
      <NavItem
        icon={<User className="w-6 h-6" />}
        label="Profile"
        active={currentPage === "profile"}
        onClick={() => handleNavClick("profile")}
        href={`/profile/${userId}`}
      />
    </div>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  special?: boolean
  onClick: () => void
  href: string
}

function NavItem({ icon, label, active, special, onClick, href }: NavItemProps) {
  return (
    <Link href={href} onClick={onClick} className="flex flex-col items-center justify-center">
      {special ? (
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-1 rounded-md">{icon}</div>
      ) : (
        <>
          <div className={active ? "text-blue-400" : "text-gray-500"}>{icon}</div>
          <span className={`text-xs mt-1 ${active ? "text-blue-400" : "text-gray-500"}`}>{label}</span>
        </>
      )}
    </Link>
  )
}