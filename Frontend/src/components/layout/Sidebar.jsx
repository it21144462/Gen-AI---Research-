// src/components/layout/Sidebar.jsx
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setOpen(false)} 
      />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-[#202123] transform transition-transform duration-200 ease-in-out lg:transform-none lg:relative ${
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <span className="text-white font-medium">Memory Full</span>
            </div>
            <button onClick={() => setOpen(false)} className="lg:hidden text-gray-400">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Quick Actions Grid */}
          <div className="p-4 grid grid-cols-2 gap-2">
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <div className="text-emerald-500 text-sm mb-1">✓ Create image</div>
            </div>
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <div className="text-emerald-500 text-sm mb-1">✓ Surprise me</div>
            </div>
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <div className="text-emerald-500 text-sm mb-1">✓ Analyze data</div>
            </div>
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <div className="text-emerald-500 text-sm mb-1">✓ Summarize text</div>
            </div>
          </div>

          {/* Chat History (Hidden on mobile) */}
          <nav className="hidden lg:block flex-1 px-2 py-4 space-y-1">
            {['How to write an impacting', 'Web accessibility', 'Design inspiration', 'What is machine learning'].map((item, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center px-2 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700"
              >
                <span>{item}</span>
              </a>
            ))}
          </nav>

          {/* Footer (Hidden on mobile) */}
          <div className="hidden lg:block px-2 py-4 space-y-1 border-t border-gray-700">
            <Link to="/login" className="flex items-center px-2 py-2 text-sm text-red-400 rounded-md hover:bg-gray-700">
              Log out
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setOpen(true)} 
        className="fixed bottom-4 right-4 p-2 bg-emerald-600 rounded-full lg:hidden"
      >
        <Menu className="h-6 w-6 text-white" />
      </button>
    </>
  );
}
