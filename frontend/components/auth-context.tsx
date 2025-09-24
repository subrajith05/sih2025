"use client"

import api from "@/api"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  lastLogin?: Date
  job?: string
  jobDescription?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, job?: string, jobDescription?: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      const { data } = await api.post("http://localhost:8000/auth/login", new URLSearchParams({
        username: email,
        password: password,
      }), {
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
      })

      console.log(data)

      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("refresh_token", data.refresh_token)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "1",
        name: data.username,
        email,
        avatar: "/diverse-user-avatars.png",
        lastLogin: new Date(),
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, job?: string, jobDescription?: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      const { data } = await api.post("http://localhost:8000/auth/register", {
        "name": name,
        "email": email,
        "password": password
      })
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "1",
        name,
        email,
        avatar: "/diverse-user-avatars.png",
        job,
        jobDescription,
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
