"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-context"
import { Home, User, BarChart3, Target, Settings, ChevronLeft, ChevronRight, LogOut, BookOpen } from "lucide-react"

const navigation = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
    description: "Welcome & last login",
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
    description: "Edit profile & interests",
  },
  {
    name: "Dashboard",
    href: "/skills",
    icon: BarChart3,
    description: "Current skills & recommendations",
  },
  {
    name: "Scope",
    href: "/jobs",
    icon: Target,
    description: "Job recommendations",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Language, notifications, themes",
  },
]

interface SidebarProps {
  className?: string
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ className, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const displayUser = user

  return (
    <div
      className={cn(
        "h-screen flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-lg">SkillPath</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* User Profile */}
      {displayUser && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={displayUser.avatar || "/placeholder.svg"} alt={displayUser.name} />
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                {displayUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{displayUser.name}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">{displayUser.email}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs opacity-70 truncate">{item.description}</p>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center",
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="ml-2">Log out</span>}
        </Button>
      </div>
    </div>
  )
}
