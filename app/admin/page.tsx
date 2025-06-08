"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import NewsPostForm from "@/components/news-post-form"

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
      if (!data.user) {
        router.replace("/admin/login")
      }
    }
    getUser()
  }, [router])

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        {/* TODO: Add news post form and image upload */}
        <p className="mb-4">Welcome, {user.email}!</p>
        <button
          className="mb-8 bg-red-600 text-white px-4 py-2 rounded"
          onClick={async () => { await supabase.auth.signOut(); router.replace("/admin/login"); }}
        >
          Logout
        </button>
        <NewsPostForm />
        {/* News posting form and dashboard UI will go here */}
      </div>
    </div>
  )
}
