// src/lib/api.ts
import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8000", // adjust if different
})

// Attach access token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle refresh token automatically on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem("refresh_token")
        if (!refreshToken) throw new Error("No refresh token")

        const { data } = await axios.post("http://localhost:8000/auth/refresh", {
          refresh_token: refreshToken,
        })

        localStorage.setItem("access_token", data.access_token)
        api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`

        return api(originalRequest)
      } catch (err) {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        window.location.href = "/login" // force logout
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default api
