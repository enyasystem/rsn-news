"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardStats {
  postCount: number;
  categoryCount: number;
  adminCount: number;
  recentPosts: Array<{
    id: number;
    title: string;
    category: { name: string } | null;
    createdAt: string;
  }>;

}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load stats");
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load stats");
        setStats(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="flex min-h-screen">
       
        {/* Main Content */}
        <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div className="flex items-center space-x-4">
              <button
                className="md:hidden text-2xl"
                aria-label="Toggle sidebar menu"
                onClick={() => {
                  const sidebar = document.getElementById("sidebar");
                  if (sidebar) sidebar.classList.toggle("hidden");
                }}
              >
                ☰
              </button>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="text-gray-600">
              Welcome,{" "}
              <span className="font-medium">Admin</span>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-gray-500">Total News Posts</p>
              <h3 className="text-2xl font-bold">
                {loading || !stats ? "--" : stats.postCount}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-gray-500">Categories</p>
              <h3 className="text-2xl font-bold">
                {loading || !stats ? "--" : stats.categoryCount}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-gray-500">Admins</p>
              <h3 className="text-2xl font-bold">
                {loading || !stats ? "--" : stats.adminCount}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-gray-500">Recent Posts</p>
              <h3 className="text-2xl font-bold">
                {loading || !stats ? "--" : stats.recentPosts.length}
              </h3>
            </div>
          </div>
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent News Posts */}
            <div className="col-span-2 bg-white p-4 rounded shadow overflow-x-auto">
              <h2 className="text-xl font-bold mb-4">Recent News Posts</h2>
              {loading ? (
                <div className="text-gray-400" aria-live="polite">Loading...</div>
              ) : error ? (
                <div className="text-red-600" aria-live="polite">{error}</div>
              ) : (Array.isArray(stats?.recentPosts) && stats.recentPosts.length === 0 ? (
                <div className="text-gray-400 text-center py-8" aria-live="polite">No recent news posts found.</div>
              ) : (
                <table className="w-full text-left border-t border-gray-200">
                  <thead className="text-gray-500 uppercase text-sm">
                    <tr>
                      <th className="py-2">Title</th>
                      <th className="py-2">Category</th>
                      <th className="py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats?.recentPosts || []).map((post) => (
                      <tr className="border-t" key={post.id}>
                        <td className="py-2 text-blue-600">{post.title}</td>
                        <td className="py-2">{post.category?.name || "General"}</td>
                        <td className="py-2">
                          {new Date(post.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
            {/* Quick Actions */}
            <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors font-semibold shadow-sm flex items-center justify-center"
                    onClick={() => router.push("/admin/news")}
                  >
                    <span className="mr-2" role="img" aria-label="Add News">📝</span>
                    Add News Post
                  </button>
                  <button
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-semibold shadow-sm flex items-center justify-center"
                    onClick={() => router.push("/admin/categories")}
                  >
                    <span className="mr-2" role="img" aria-label="Categories">🏷️</span>
                    Manage Categories
                  </button>
                  <button
                    className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors font-semibold shadow-sm flex items-center justify-center"
                    onClick={() => router.push("/admin/users")}
                  >
                    <span className="mr-2" role="img" aria-label="Admins">👥</span>
                    View All Admins
                  </button>
                  <button
                    className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors font-semibold shadow-sm flex items-center justify-center"
                    onClick={() => router.push("/admin/settings")}
                  >
                    <span className="mr-2" role="img" aria-label="Settings">⚙️</span>
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
