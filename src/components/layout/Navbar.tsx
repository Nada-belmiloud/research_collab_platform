import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const beforeLoginLinks = [
    { name: 'Home', path: '/' },
    { name: 'Teams', path: '/teams' },
    { name: 'Research Labs', path: '/labs' },
    { name: 'About', path: '/about' },
  ];

  const afterLoginLinks = [
    { name: 'Home', path: '/' },
    { name: 'Teams', path: '/teams' },
    { name: 'Research Labs', path: '/labs' },
    { name: 'Projects', path: '/projects' },
    { name: 'My Applications', path: '/applications' },
  ];

  const navLinks = user ? afterLoginLinks : beforeLoginLinks;

  return (
    <nav className="sticky top-0 z-50 bg-brand-cream/80 backdrop-blur-md border-b border-brand-navy/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-brand-navy rounded-lg flex items-center justify-center">
                <span className="text-white font-sans text-2xl font-bold italic">R</span>
              </div>
              <span className="text-2xl font-bold text-brand-navy tracking-tight">Research Lab</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-brand-orange ${isActive ? 'text-brand-orange border-b-2 border-brand-orange' : 'text-brand-navy/70'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="flex items-center space-x-4 pl-4 border-l border-brand-navy/10">
              {user ? (
                <>
                  <div className="relative group">
                    <button className="flex items-center space-x-2 bg-brand-navy/5 px-3 py-1.5 rounded-full hover:bg-brand-navy/10 transition-all">
                      <UserIcon className="w-4 h-4 text-brand-navy" />
                      <span className="text-sm font-semibold">{user.name}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-brand-navy/10 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-brand-navy hover:bg-brand-cream">
                        Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-sm font-medium text-brand-navy hover:text-brand-orange">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-brand-navy text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-brand-teal transition-all shadow-md active:scale-95"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-navy p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-cream border-b border-brand-navy/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-brand-navy/70 hover:text-brand-orange"
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2 text-sm font-medium text-brand-navy border border-brand-navy/20 rounded-full"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2 text-sm font-bold text-white bg-brand-navy rounded-full"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
