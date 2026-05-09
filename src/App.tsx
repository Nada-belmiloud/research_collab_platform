/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import Teams from './pages/Teams';
import GroupDetails from './pages/GroupDetails';
import About from './pages/About';
import Labs from './pages/Labs';
import LabDetails from './pages/LabDetails';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:id" element={<GroupDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/labs/:id" element={<LabDetails />} />
            <Route 
              path="/applications" 
              element={
                <ProtectedRoute>
                  <Applications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        
        <footer className="bg-brand-navy py-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                <span className="text-white font-sans text-xl font-bold italic">R</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Research Lab</span>
            </div>
            
            <div className="flex gap-8 text-white/50 text-sm font-sans">
              <a href="#" className="hover:text-brand-orange transition-colors">Documentation</a>
              <a href="#" className="hover:text-brand-orange transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-orange transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-brand-orange transition-colors">Contact</a>
            </div>
            
            <div className="text-white/30 text-xs font-mono uppercase tracking-widest">
              © 2026 RESEARCH LAB FOUNDATION
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
