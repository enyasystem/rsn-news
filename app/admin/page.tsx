"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import NewsPostForm from "@/components/news-post-form"

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("admin_session")
      if (session) {
        setUser(JSON.parse(session))
      } else {
        router.replace("/admin/login")
      }
      setLoading(false)
    }
  }, [router])

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            onClick={() => {
              localStorage.removeItem("admin_session")
              router.replace("/admin/login")
            }}
          >
            Logout
          </button>
        </div>
        <div className="mb-6 p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          <span className="font-semibold">Welcome,</span> <span className="text-blue-600 dark:text-blue-400">{user.email}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow border border-zinc-200 dark:border-zinc-800">
          <NewsPostForm />
        </div>
      </div>
    </div>
  )
}
