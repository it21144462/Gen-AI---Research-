import { Link } from "react-router-dom";
import {
  MessageSquare,
  Sun,
  LogOut,
  Menu,
  X,
  Pencil,
  Plus,
  ExternalLink,
  Image,
  Sparkles,
  BarChart3,
  AlignJustify
  
} from "lucide-react";
import { useState } from "react";

export default function Welcome() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const chatHistory = [
    "How to covert a string to integer in Python",
    "Lets talk about topic that help you to improve your skills",
  ];


  const quickActions = [
    { icon: <Sparkles size={18} />, text: "Math Bot", color: "text-blue-500", path: "/chat/math" },
    { icon: <BarChart3 size={18} />, text: "English Bot", color: "text-purple-500", path: "/chat/english" },
    { icon: <AlignJustify size={18} />, text: "Code Bot", color: "text-yellow-500", path: "/chat/code" },
  ];  

  return (
    <div className="flex h-screen bg-[#1a1a1a]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-80 bg-[#202123] p-4 flex-col">
        <div className="flex items-center justify-between px-4 py-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
              <span className="text-white text-sm">KS</span>
            </div>
            <div>
              <div className="text-white text-sm">Kavindu Sandaruwan</div>
              <div className="text-gray-400 text-xs">Premium Plan</div>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-hidden mb-4">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#2a2b32] text-gray-300 cursor-pointer"
            >
              <MessageSquare size={18} />
              <span className="text-sm truncate">{chat}</span>
            </div>
            

          ))}
        </div>
        <div>
          <button className="flex items-center space-x-2 w-full p-3 rounded-lg bg-emerald-600 text-white mb-20 hover:bg-emerald-700">
            <Plus size={18} />
            <span>Start a new chat</span>
          </button>
        </div>
        

        <div className="border-t border-gray-700 pt-4 space-y-2">
          <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#2a2b32] text-gray-300">
            <MessageSquare size={18} />
            <span>Clear all conversations</span>
          </button>
          
          <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#2a2b32] text-gray-300">
            <ExternalLink size={18} />
            <span>Updates & FAQ</span>
          </button>

          <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#2a2b32] text-red-400">
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} 
        onClick={() => setIsMobileMenuOpen(false)} 
      />
      
      <div className={`fixed inset-y-0 left-0 w-64 bg-[#202123] transform transition-transform duration-200 ease-in-out z-50 lg:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                <span className="text-white text-sm">KS</span>
              </div>
              <span className="text-white">Kavindu Sandaruwan</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#2a2b32] text-gray-300 cursor-pointer"
              >
                <MessageSquare size={18} />
                <span className="text-sm truncate">{chat}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 pt-4 space-y-2">
          <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#2a2b32] text-gray-300">
            <MessageSquare size={18} />
            <span>Clear all conversations</span>
          </button>
            
          <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#2a2b32] text-gray-300">
            <ExternalLink size={18} />
            <span>Updates & FAQ</span>
          </button>
            <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#2a2b32] text-red-400">
              <LogOut size={18} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-400">
            <Menu className="h-6 w-6" />
          </button>
          <div className="text-white font-medium">NovaChat</div>
          <Pencil className="h-5 w-5 text-gray-400" />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-[#1a1a1a] to-[#132721] p-4 mt-20">
          <div className="flex-1 flex flex-col justify-start max-w-2xl mx-auto w-full pt-8">
            <h1 className="text-2xl lg:text-4xl font-bold text-white mb-6 text-center">
              Welcome to {" "}
              <span className="inline-block px-2 py-1  bg-gradient-to-r from-[#097F4D] to-transparent">
              <span className="typing-text">Nova Chat</span>
            </span>
            </h1>
            <p className="text-gray-400 text-center">
            The power of AI at your service - Tame the knowledge !
          </p>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block m-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="How to write an impacting ..."
                  className="w-full p-4 pr-12 rounded-lg bg-[#2a2b32] text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-emerald-500"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 rounded-lg">
                  <img src="/send.svg" alt="Send" className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2">
                <span className="text-gray-400 text-sm">NovaChat can make mistakes. Check important info.</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex flex-col items-center space-y-3 lg:flex-row lg:space-y-0 lg:space-x-4 lg:justify-center ">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className="flex items-center justify-center p-3 rounded-lg text-white hover:bg-gray-700/40 transition-colors w-full max-w-sm lg:w-auto border border-gray-700"
                >
                  <span className={`${action.color} mr-2`}>{action.icon}</span>
                  {action.text}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 ">
            <div className="max-w-xl mx-auto relative">
              <input
                type="text"
                placeholder="How to write an impacting ..."
                className="w-full p-4 pr-12 rounded-lg bg-[#2a2b32] text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-emerald-500"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 rounded-lg">
                <img src="/send.svg" alt="Send" className="w-5 h-5" />
              </button>
            </div>
            <div className="max-w-xl mx-auto mt-2">
              <span className="text-gray-400 text-sm">NovaChat can make mistakes. Check important info.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}