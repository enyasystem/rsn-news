import React from "react";

export default function AdminNewsPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Manage News Posts</h1>
      <p className="text-gray-500 mb-4">View, edit, or delete news posts. Click "Add News Post" to create a new one.</p>
      {/* News management table or list will go here */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-neutral-800 min-h-[200px] flex items-center justify-center">
        <span className="text-gray-400">No news posts yet.</span>
      </div>
    </div>
  );
}
