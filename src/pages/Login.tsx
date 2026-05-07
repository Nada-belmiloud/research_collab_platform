import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';



const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(
  err.response?.data?.detail ||
  err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-texture">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-2xl border border-brand-navy/5"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif mb-3">Welcome Back.</h2>
          <p className="text-brand-navy/60 font-sans font-light">Continue your journey of discovery.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-navy/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-brand-navy/5 border border-transparent rounded-2xl focus:border-brand-orange focus:bg-white outline-none transition-all font-sans"
                placeholder="email@institution.edu"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-navy/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-brand-navy/5 border border-transparent rounded-2xl focus:border-brand-orange focus:bg-white outline-none transition-all font-sans"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-navy text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg hover:bg-brand-teal transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-brand-navy/50 font-sans">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-orange font-bold hover:underline">
              Join ResearcherAI
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
