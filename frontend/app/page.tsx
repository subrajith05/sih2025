"use client"

import { useAuth } from "@/components/auth-context"
import { useEffect } from "react"
import { redirect } from "next/navigation"

export default function HomePage() {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        redirect("/dashboard")
      } else {
        redirect("/login")
      }
    }
  }, [user, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return null
}
