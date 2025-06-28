import { useState } from "react"

export default function NewsPostForm({ onPost }: { onPost?: () => void }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      formData.append("slug", title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))
      formData.append("categoryId", category)
      if (image) formData.append("image", image)
      const res = await fetch("/api/news", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to post news")
      setSuccess("News posted successfully!")
      setTitle("")
      setContent("")
      setCategory("")
      setImage(null)
      if (onPost) onPost()
    } catch (err: any) {
      setError(err.message || "Failed to post news")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-xl font-semibold mb-2">Post News Update</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        className="w-full border rounded px-3 py-2 min-h-[120px]"
        required
      />
      <input
        type="text"
        placeholder="Category ID"
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={e => setImage(e.target.files?.[0] || null)}
        className="w-full"
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Posting..." : "Post News"}
      </button>
    </form>
  )
}
