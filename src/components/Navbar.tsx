import { Link } from "react-router-dom";
import { Search, User, LogOut, Menu, X, BookOpen, Users, Compass } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [role, setRole] = useState(localStorage.getItem("role") || "student");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f8f7f4]/80 backdrop-blur-md border-b border-[#0e4971]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xl font-serif font-bold text-[#0e4971] tracking-tight">
              Research<span className="text-[#f37e22]">AI</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-[#5b86a2] hover:text-[#0e4971] transition-colors">Home</Link>
            <Link to="/teams" className="text-sm font-medium text-[#5b86a2] hover:text-[#0e4971] transition-colors">Teams</Link>
            {isLoggedIn && (
              <>
                <Link to="/explore" className="text-sm font-medium text-[#5b86a2] hover:text-[#0e4971] transition-colors">Explore</Link>
                <Link to="/my-posts" className="text-sm font-medium text-[#5b86a2] hover:text-[#0e4971] transition-colors">My Posts</Link>
              </>
            )}
            {isLoggedIn && role === "teacher" && (
              <Link to="/projects" className="text-sm font-medium text-[#5b86a2] hover:text-[#0e4971] transition-colors">Projects</Link>
            )}
            <Link to="/about" className="text-sm font-medium text-[#5b86a2] hover:text-[#0e4971] transition-colors">About</Link>
            {isLoggedIn && role === "teacher" && (
              <>
                <Link to="/ams" className="text-sm font-medium text-[#5b86a2] hover:text-[#0e4971] transition-colors">Applicants</Link>
                <Link to="/ranking" className="text-sm font-medium text-[#5b86a2] hover:text-[#0e4971] transition-colors">Ranking</Link>
              </>
            )}
          </div>


          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="text-sm font-medium text-[#0e4971] hover:underline">Log in</Link>
                <Link 
                  to="/signup" 
                  className="bg-[#0e4971] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#0a3a5c] transition-colors"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/search" className="p-2 text-[#0e4971] hover:bg-[#0e4971]/5 rounded-full transition-colors">
                  <Search size={20} />
                </Link>
                <Link to="/profile" className="p-2 text-[#0e4971] hover:bg-[#0e4971]/5 rounded-full transition-colors">
                  <User size={20} />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-[#0e4971] hover:bg-[#0e4971]/5 rounded-full transition-colors"
                >
                  <LogOut size={20} />
                </button>

              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#0e4971] hover:bg-[#0e4971]/5 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#f8f7f4] border-b border-[#0e4971]/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-[#0e4971] hover:bg-[#0e4971]/5">Home</Link>
              <Link to="/teams" className="block px-3 py-2 rounded-md text-base font-medium text-[#0e4971] hover:bg-[#0e4971]/5">Teams</Link>
              {isLoggedIn && (
                <>
                  <Link to="/explore" className="block px-3 py-2 rounded-md text-base font-medium text-[#0e4971] hover:bg-[#0e4971]/5">Explore</Link>
                </>
              )}
              <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-[#0e4971] hover:bg-[#0e4971]/5">About</Link>
              <div className="pt-4 flex flex-col gap-2">
                {!isLoggedIn ? (
                  <>
                    <Link to="/login" className="w-full text-center py-2 text-sm font-medium text-[#0e4971] border border-[#0e4971] rounded-full">Log in</Link>
                    <Link to="/signup" className="w-full text-center py-2 text-sm font-medium text-white bg-[#0e4971] rounded-full">Sign up</Link>
                  </>
                ) : (
                  <button className="w-full text-center py-2 text-sm font-medium text-white bg-[#0e4971] rounded-full">Log out</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
