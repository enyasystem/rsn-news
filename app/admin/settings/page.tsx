"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const ChangePasswordForm = dynamic(() => import("@/components/admin-change-password-form"), { ssr: false });

export default function AdminSettingsPage() {
  // Example settings state
  const [settings, setSettings] = useState({
    siteTitle: "RSN NEWS",
    maintenanceMode: false,
    allowRegistrations: true,
    defaultUserRole: "reader",
    notificationEmail: "admin@rsnnews.com",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 1200); // Simulate save
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Settings</h1>
      <p className="text-gray-500 mb-4">Configure platform settings and preferences.</p>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-neutral-800 max-w-xl mx-auto space-y-6">
        <div>
          <label className="block font-medium mb-1">Site Title</label>
          <input
            type="text"
            name="siteTitle"
            className="w-full border rounded px-3 py-2"
            value={settings.siteTitle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleChange}
            id="maintenanceMode"
            className="accent-primary"
          />
          <label htmlFor="maintenanceMode" className="font-medium">Maintenance Mode</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="allowRegistrations"
            checked={settings.allowRegistrations}
            onChange={handleChange}
            id="allowRegistrations"
            className="accent-primary"
          />
          <label htmlFor="allowRegistrations" className="font-medium">Allow New User Registrations</label>
        </div>
        <div>
          <label className="block font-medium mb-1">Default User Role</label>
          <select
            name="defaultUserRole"
            className="w-full border rounded px-3 py-2"
            value={settings.defaultUserRole}
            onChange={handleChange}
          >
            <option value="reader">Reader</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Notification Email</label>
          <input
            type="email"
            name="notificationEmail"
            className="w-full border rounded px-3 py-2"
            value={settings.notificationEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold hover:bg-primary/90 transition"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
      <div className="mt-10">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
