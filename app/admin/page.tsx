"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-2 sm:px-4 md:px-6 lg:px-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 tracking-tight">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Responsive Stat Widgets */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 flex flex-col items-start justify-between min-h-[120px] border border-gray-100 dark:border-neutral-800">
          <h2 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-1">
            Total News Posts
          </h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            --
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 flex flex-col items-start justify-between min-h-[120px] border border-gray-100 dark:border-neutral-800">
          <h2 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-1">
            Categories
          </h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            --
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 flex flex-col items-start justify-between min-h-[120px] border border-gray-100 dark:border-neutral-800">
          <h2 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-1">
            Admins
          </h2>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            --
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 flex flex-col items-start justify-between min-h-[120px] border border-gray-100 dark:border-neutral-800">
          <h2 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-1">
            Active Users
          </h2>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            --
          </p>
        </div>
      </div>
      {/* Responsive Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-neutral-800">
          <h3 className="text-lg font-semibold mb-4">Recent News Posts</h3>
          <div className="space-y-3">
            {/* Example recent post row */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-neutral-800 last:border-b-0">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                No recent posts
              </span>
              <span className="text-xs text-gray-400">--</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-neutral-800">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <button
              className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:bg-primary/90 transition"
              onClick={() => router.push("/admin/news")}
              aria-label="Add News Post"
            >
              Add News Post
            </button>
            <button
              className="w-full bg-secondary text-secondary-foreground font-semibold py-2 rounded-lg hover:bg-secondary/90 transition"
              onClick={() => router.push("/admin/categories")}
              aria-label="Manage Categories"
            >
              Manage Categories
            </button>
            <button
              className="w-full bg-muted text-muted-foreground font-semibold py-2 rounded-lg hover:bg-muted/80 transition"
              onClick={() => router.push("/admin/users")}
              aria-label="View All Admins"
            >
              View All Admins
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
