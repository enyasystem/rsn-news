"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin({ onLogin }: { onLogin?: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [debug, setDebug] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setDebug(null)
    setLoading(true)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      setDebug(`Response: ${JSON.stringify(data)}`)
      if (!res.ok) {
        setError(data.error || "Login failed")
      } else {
        // Save session to localStorage for dashboard access
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_session", JSON.stringify(data.user))
          // Set cookie for middleware authentication
          document.cookie = `admin_session=${data.token}; path=/; max-age=86400; secure; samesite=strict`
        }
        if (onLogin) onLogin()
        router.push("/admin") // Redirect to dashboard after login
      }
    } catch (err: any) {
      setDebug(`Error: ${err.message}`)
      setError("Failed to login: " + err.message)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold">Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {debug && <pre className="text-xs text-gray-500 bg-gray-100 rounded p-2 mt-2 overflow-x-auto">{debug}</pre>}
    </form>
  )
}
