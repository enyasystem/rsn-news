"use client"
import AdminLogin from "@/components/admin-login"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }
    getUser()
  }, [])

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (!user) return <AdminLogin />

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      {/* TODO: Add news post form and image upload */}
      <p>Welcome, {user.email}!</p>
      <button
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
        onClick={async () => { await supabase.auth.signOut(); location.reload(); }}
      >
        Logout
      </button>
    </div>
  )
}
