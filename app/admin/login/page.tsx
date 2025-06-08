"use client"
import AdminLogin from "@/components/admin-login"
import AdminRegisterForm from "@/components/admin-register-form"
import { useEffect, useState } from "react"

export default function AdminLoginPage() {
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    // Optionally, you could check if an admin exists and hide register if so
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-white">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800">
        {showRegister ? (
          <>
            <AdminRegisterForm onRegister={() => setShowRegister(false)} />
            <button className="mt-4 w-full text-blue-600 underline" onClick={() => setShowRegister(false)}>
              Already have an account? Login
            </button>
          </>
        ) : (
          <>
            <AdminLogin />
            <button className="mt-4 w-full text-blue-600 underline" onClick={() => setShowRegister(true)}>
              Register Admin
            </button>
          </>
        )}
      </div>
    </div>
  )
}
