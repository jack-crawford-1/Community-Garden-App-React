import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../nav/Navbar";
import { API_BASE_URL } from "../../api/config";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      setSuccess("🎉 Registered successfully! You can now log in.");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="bg-[#111c16] min-h-screen">
      <Navbar />
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto mt-20 p-8 bg-white/[0.03] border border-white/10 rounded-2xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7fd1a3] text-center mb-2">
          Community gardens
        </p>
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Create an account
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-white/70 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-white/10 rounded-md bg-[#0d150f] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#55b47e]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-white/70 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-white/10 rounded-md bg-[#0d150f] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#55b47e]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-[#55b47e] hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          Register
        </button>

        <p className="text-center text-white/60 mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-[#55b47e] hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
