import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        <div className="glass-card rounded-3xl p-12 shadow-2xl">
          <h1 className="text-6xl font-bold text-white mb-4">
            Assignment Portal
          </h1>
          <p className="text-2xl text-white/80 mb-8">
            Manage assignments and submissions efficiently
          </p>
          
          <div className="flex justify-center gap-6 mb-12">
            <Link
              to="/login"
              className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-xl transition backdrop-blur-sm border border-white/30 text-lg"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-500/80 hover:bg-green-600/80 text-white font-semibold px-8 py-4 rounded-xl transition text-lg"
            >
              Sign Up
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="glass p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3">👨‍🎓 For Students</h3>
              <ul className="text-white/80 space-y-2">
                <li>• View assignments</li>
                <li>• Submit tasks with files</li>
                <li>• Track grades & feedback</li>
                <li>• Monitor deadlines</li>
              </ul>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3">👨‍🏫 For Teachers</h3>
              <ul className="text-white/80 space-y-2">
                <li>• Create assignments</li>
                <li>• Review submissions</li>
                <li>• Grade & provide feedback</li>
                <li>• View statistics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;