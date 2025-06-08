import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createProfile, getProfileByEmail } from "@/lib/db";

export default function AdminRegisterForm({ onRegister }: { onRegister?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const id = uuidv4();
    try {
      if (getProfileByEmail(email)) {
        setError("Email already exists.");
        setLoading(false);
        return;
      }
      createProfile({ id, email, password, role: "admin" });
      setSuccess("Admin user created successfully!");
      setEmail("");
      setPassword("");
      if (onRegister) onRegister();
    } catch (err: any) {
      setError("Failed to create admin: " + err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold">Register Admin</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register Admin"}
      </button>
    </form>
  );
}
