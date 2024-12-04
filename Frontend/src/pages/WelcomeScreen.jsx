import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-[#2a2b32]">
      <div className="text-center">
        <h1 className="text-white text-2xl mb-4">Welcome to NovaChat</h1>
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            onClick={() => navigate('/login')}
          >
            Log in
          </button>
          <button
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            onClick={() => navigate('/register')}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
