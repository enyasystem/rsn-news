import React from "react";

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Manage Categories</h1>
      <p className="text-gray-500 mb-4">View, edit, or delete categories. Click "Add Category" to create a new one.</p>
      {/* Categories management table or list will go here */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-neutral-800 min-h-[200px] flex items-center justify-center">
        <span className="text-gray-400">No categories yet.</span>
      </div>
    </div>
  );
}
