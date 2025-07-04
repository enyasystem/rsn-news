import React from "react";

export default function AdminNotificationsPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Notifications</h1>
      <p className="text-gray-500 mb-4">View and manage admin notifications and alerts.</p>
      {/* Notifications list or settings will go here */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-neutral-800 min-h-[200px] flex items-center justify-center">
        <span className="text-gray-400">No notifications yet.</span>
      </div>
    </div>
  );
}
