import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../nav/Navbar";

interface LoginFormProps {
  onLogin?: (token: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      onLogin?.(data.token);
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <>
      <Navbar />
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center text-[#55b47e] mb-6">
          Login
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-[#55b47e] hover:bg-green-600 text-white font-bold rounded-md transition"
        >
          Login
        </button>
      </form>

      <p className="text-center text-gray-300 mt-4">
        Don’t have an account?{" "}
        <Link to="/register" className="text-[#55b47e] hover:underline">
          Register here
        </Link>
      </p>
    </>
  );
}

// TODO add user feedback / validation to show when logged in
