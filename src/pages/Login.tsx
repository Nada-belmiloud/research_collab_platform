import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", email.includes("teacher") ? "teacher" : "student");
    window.location.href = "/explore";
  };


  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#f8f7f4]">
      <div className="max-w-md w-full px-4">
        <div className="flex justify-center mb-12">
          <Link to="/" className="text-3xl font-serif font-bold text-[#0e4971] tracking-tight">
            Research<span className="text-[#f37e22]">AI</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-[#0e4971]/10 p-8 md:p-12 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-[#0e4971] mb-2">Welcome Back</h2>
            <p className="text-[#5b86a2]">Log in to your research hub.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0e4971] uppercase tracking-widest pl-1">ENSIA Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5b86a2]" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(email)}
                  placeholder="name@ensia.edu.dz"
                  className="w-full bg-[#f8f7f4] border border-[#0e4971]/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#0e4971] transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center pl-1">
                <label className="text-xs font-bold text-[#0e4971] uppercase tracking-widest">Password</label>
                <a href="#" className="text-[10px] text-[#5b86a2] hover:text-[#0e4971]">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5b86a2]" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f8f7f4] border border-[#0e4971]/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#0e4971] transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0e4971] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0a3a5c] transition-all"
            >
              Log in <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-[#5b86a2]">
          New to the hub? <Link to="/signup" className="text-[#0e4971] font-bold">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
