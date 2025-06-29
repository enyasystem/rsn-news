"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { SidebarVisibilityProvider, useSidebarVisibility } from "../../components/SidebarVisibilityContext";

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

// Professional Spinner component
function Spinner() {
  return (
    <span
      className="inline-block w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin align-middle"
      role="status"
      aria-label="Loading"
    />
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { toggle } = useSidebarVisibility();

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
    <SidebarVisibilityProvider>
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
                  onClick={toggle}
                >
                  ☰
                </button>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">
                  Welcome,{" "}
                  <span className="font-medium">Admin</span>
                </span>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View site as visitor"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-600 text-indigo-700 bg-white font-semibold shadow-sm hover:bg-indigo-50 hover:text-indigo-900 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Site</span>
                </a>
              </div>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div
                className="bg-white p-4 rounded-lg shadow text-center cursor-pointer hover:bg-indigo-50 transition"
                title="View all news posts"
                onClick={() => router.push("/admin/news")}
              >
                <p className="text-gray-500">Total News Posts</p>
                <h3 className="text-2xl font-bold min-h-[2rem] flex items-center justify-center">
                  {loading ? <Spinner /> : !stats ? "--" : stats.postCount}
                </h3>
              </div>
              <div
                className="bg-white p-4 rounded-lg shadow text-center cursor-pointer hover:bg-blue-50 transition"
                title="View all categories"
                onClick={() => router.push("/admin/categories")}
              >
                <p className="text-gray-500">Categories</p>
                <h3 className="text-2xl font-bold min-h-[2rem] flex items-center justify-center">
                  {loading ? <Spinner /> : !stats ? "--" : stats.categoryCount}
                </h3>
              </div>
              <div
                className="bg-white p-4 rounded-lg shadow text-center cursor-pointer hover:bg-teal-50 transition"
                title="View all admins"
                onClick={() => router.push("/admin/users")}
              >
                <p className="text-gray-500">Admins</p>
                <h3 className="text-2xl font-bold min-h-[2rem] flex items-center justify-center">
                  {loading ? <Spinner /> : !stats ? "--" : stats.adminCount}
                </h3>
              </div>
              <div
                className="bg-white p-4 rounded-lg shadow text-center cursor-pointer hover:bg-gray-100 transition"
                title="View recent posts"
                onClick={() => router.push("/admin/news")}
              >
                <p className="text-gray-500">Recent Posts</p>
                <h3 className="text-2xl font-bold min-h-[2rem] flex items-center justify-center">
                  {loading ? <Spinner /> : !stats ? "--" : stats.recentPosts.length}
                </h3>
              </div>
            </div>
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent News Posts */}
              <div className="col-span-2 bg-white p-4 rounded shadow overflow-x-auto">
                <h2 className="text-xl font-bold mb-4">Recent News Posts</h2>
                {loading ? (
                  <div className="flex justify-center items-center py-8" aria-live="polite">
                    <Spinner />
                    <span className="ml-2 text-gray-500">Loading...</span>
                  </div>
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
                      title="Add a new news post"
                      onClick={() => router.push("/admin/news")}
                    >
                      <span className="mr-2" role="img" aria-label="Add News">📝</span>
                      Add News Post
                    </button>
                    <button
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-semibold shadow-sm flex items-center justify-center"
                      title="Manage categories"
                      onClick={() => router.push("/admin/categories")}
                    >
                      <span className="mr-2" role="img" aria-label="Categories">🏷️</span>
                      Manage Categories
                    </button>
                    <button
                      className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors font-semibold shadow-sm flex items-center justify-center"
                      title="View all admins"
                      onClick={() => router.push("/admin/users")}
                    >
                      <span className="mr-2" role="img" aria-label="Admins">👥</span>
                      View All Admins
                    </button>
                    <button
                      className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors font-semibold shadow-sm flex items-center justify-center"
                      title="Go to settings"
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
    </SidebarVisibilityProvider>
  );
}
