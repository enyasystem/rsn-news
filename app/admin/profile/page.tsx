"use client";
import React, { useState, useEffect } from "react";

export default function AdminProfilePage() {
  const [form, setForm] = useState({
    id: 1, // Will be set from backend
    name: "",
    email: "",
    password: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    // Fetch current admin info from backend
    async function fetchProfile() {
      setFetching(true);
      try {
        const res = await fetch("/api/admin/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setForm((f) => ({ ...f, ...data, password: "" }));
      } catch (err: any) {
        setFetchError(err.message || "Error loading profile");
      } finally {
        setFetching(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitSuccess("");
    setSubmitError("");
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setSubmitSuccess("Profile updated successfully!");
      setForm((f) => ({ ...f, password: "" }));
    } catch (err: any) {
      setSubmitError(err.message || "Error updating profile");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-12 text-gray-400">Loading profile...</div>;
  }
  if (fetchError) {
    return <div className="text-center py-12 text-red-500">{fetchError}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Profile</h1>
      <p className="text-gray-500 mb-4">Manage your admin account details and preferences.</p>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-neutral-800 max-w-md mx-auto space-y-6">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input type="text" name="name" className="w-full border rounded px-3 py-2" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input type="email" name="email" className="w-full border rounded px-3 py-2" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Password <span className="text-xs text-gray-400">(leave blank to keep current)</span></label>
          <input type="password" name="password" className="w-full border rounded px-3 py-2" value={form.password} onChange={handleChange} autoComplete="new-password" />
        </div>
        {submitSuccess && <div className="text-green-600 text-sm">{submitSuccess}</div>}
        {submitError && <div className="text-red-500 text-sm">{submitError}</div>}
        <div className="flex justify-end">
          <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold hover:bg-primary/90 transition" disabled={submitLoading}>
            {submitLoading ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
