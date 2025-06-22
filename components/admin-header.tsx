import React from "react";
import Image from "next/image";

export default function AdminHeader() {
  return (
    <header className="w-full bg-primary text-primary-foreground shadow flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2">
        <Image
          src="/RSN NEWS.jpg"
          alt="RSN News Logo"
          width={40}
          height={40}
          className="rounded-full bg-white p-1 shadow-sm"
        />
        <span className="text-2xl font-bold tracking-tight">RSN Admin</span>
        <span className="ml-2 text-xs bg-secondary text-secondary-foreground rounded px-2 py-1">
          Dashboard
        </span>
      </div>
      <div className="flex items-center gap-4">
        {/* Placeholder for admin actions, notifications, or profile */}
        <span className="text-sm font-medium">Welcome, Admin</span>
      </div>
    </header>
  );
}
