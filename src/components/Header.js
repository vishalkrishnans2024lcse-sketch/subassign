import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white flex items-center">
          <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
          </svg>
          Assignment Portal
        </Link>
        
        {user && (
          <nav className="flex items-center space-x-3">
            <Link to="/dashboard" className="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition">
              Dashboard
            </Link>
            <Link to="/assignments" className="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition">
              Assignments
            </Link>
            {user.role === 'student' && (
              <Link to="/submit-task" className="bg-green-500/80 text-white px-4 py-2 rounded-lg hover:bg-green-600/80 transition">
                Submit Task
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/assignments/create" className="bg-blue-500/80 text-white px-4 py-2 rounded-lg hover:bg-blue-600/80 transition">
                Create Assignment
              </Link>
            )}
            <span className="text-white/90 px-3">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500/80 text-white px-4 py-2 rounded-lg hover:bg-red-600/80 transition"
            >
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;