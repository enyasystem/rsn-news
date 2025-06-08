"use client"
import AdminLogin from "@/components/admin-login"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-white">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800">
        <AdminLogin />
      </div>
    </div>
  )
}
