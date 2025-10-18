"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUser, type User } from "@/lib/auth"
import { UserMenu } from "@/components/user-menu"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] AuthWrapper checking user, pathname:", pathname)
    const currentUser = getCurrentUser()
    console.log("[v0] Current user:", currentUser?.email || "none")
    setUser(currentUser)
    setIsLoading(false)

    if (!currentUser && pathname !== "/login") {
      console.log("[v0] No user found, redirecting to login")
      router.push("/login")
    }
  }, [pathname]) // Removed router from dependencies as it's stable

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (pathname === "/login") {
    return <>{children}</>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <h1 className="text-lg font-semibold">安全マップ</h1>
          <UserMenu user={user} />
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
