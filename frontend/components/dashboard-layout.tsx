"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-context"
import { Sidebar } from "@/components/sidebar"
import { redirect } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/login")
    }
  }, [user, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex bg-background">
      <div className="fixed left-0 top-0 h-screen z-10">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </div>
      <main className={`flex-1 overflow-auto ${collapsed ? "ml-16" : "ml-64"}`}>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
