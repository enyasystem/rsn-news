import React from "react";

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Manage Admins</h1>
      <p className="text-gray-500 mb-4">View, add, or remove admin users for the platform.</p>
      {/* Admin users management table or list will go here */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-neutral-800 min-h-[200px] flex items-center justify-center">
        <span className="text-gray-400">No admin users yet.</span>
      </div>
    </div>
  );
}
