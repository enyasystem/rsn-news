import { useState } from "react";

export default function AdminRegisterForm({ onRegister }: { onRegister?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        setSuccess("Admin user created successfully!");
        setEmail("");
        setPassword("");
        if (onRegister) onRegister();
      }
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
