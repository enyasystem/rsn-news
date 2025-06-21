import React from "react";

export default function AdminProfilePage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Profile</h1>
      <p className="text-gray-500 mb-4">Manage your admin account details and preferences.</p>
      {/* Profile form or details will go here */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-neutral-800 min-h-[200px] flex items-center justify-center">
        <span className="text-gray-400">Profile details not available yet.</span>
      </div>
    </div>
  );
}
