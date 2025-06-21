import React from "react";

export default function AdminAuditLogsPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Audit Logs</h1>
      <p className="text-gray-500 mb-4">Track all admin actions and changes for accountability and security.</p>
      {/* Audit logs table or list will go here */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-neutral-800 min-h-[200px] flex items-center justify-center">
        <span className="text-gray-400">No audit logs yet.</span>
      </div>
    </div>
  );
}
