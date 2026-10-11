import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Sparkles, Bookmark, Plane, Bot } from 'lucide-react';
import { useTravel } from '../context/TravelContext';

export const Navbar = () => {
  const location = useLocation();
  const { savedTrips, setIsAiChatOpen, isAiChatOpen } = useTravel();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-navy-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-teal-300 p-0.5 shadow-glow flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
              <Compass className="w-6 h-6 text-brand-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                Travel<span className="text-brand-400">AI</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-300 border border-brand-500/20">
                PRO
              </span>
            </div>
            <span className="text-[11px] text-slate-400 tracking-wide font-medium -mt-1 hidden sm:block">
              Intelligent Itinerary Engine
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive('/') 
                ? 'text-brand-300 bg-brand-500/10 border border-brand-500/20' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Explore
          </Link>

          <Link
            to="/plan"
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              isActive('/plan') 
                ? 'text-brand-300 bg-brand-500/10 border border-brand-500/20' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Plan Trip</span>
          </Link>

          <Link
            to="/saved"
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 relative ${
              isActive('/saved') 
                ? 'text-brand-300 bg-brand-500/10 border border-brand-500/20' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved</span>
            {savedTrips.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-brand-500 text-navy-950 font-bold text-xs flex items-center justify-center">
                {savedTrips.length}
              </span>
            )}
          </Link>

          {/* AI Advisor Trigger Button */}
          <button
            onClick={() => setIsAiChatOpen(!isAiChatOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 text-sm font-medium transition-all hover:border-brand-500/40"
            title="Open AI Travel Advisor"
          >
            <Bot className="w-4 h-4 text-teal-400" />
            <span className="hidden md:inline">AI Advisor</span>
          </button>

          {/* Quick CTA */}
          <Link
            to="/plan"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 hover:from-brand-600 hover:to-teal-500 text-navy-950 font-bold text-sm shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plane className="w-4 h-4 text-navy-950" />
            <span>Create Itinerary</span>
          </Link>
        </nav>

      </div>
    </header>
  );
};

export default Navbar;
