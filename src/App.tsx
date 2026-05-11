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
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import CreateProject from './pages/CreateProject';

import Footer from './components/layout/Footer';

const ProtectedRoute: React.FC<{ children: React.ReactNode, roles?: string[] }> = ({ children, roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
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
            <Route 
              path="/projects/create" 
              element={
                <ProtectedRoute roles={['TEACHER', 'ADMIN']}>
                  <CreateProject />
                </ProtectedRoute>
              } 
            />
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
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        
        <Footer />
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
