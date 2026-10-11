import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Globe, Sparkles, ShieldCheck } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-navy-950/90 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-300 p-0.5 shadow-glow flex items-center justify-center">
                <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                  <Compass className="w-5 h-5 text-brand-400" />
                </div>
              </div>
              <span className="font-display font-bold text-xl text-white">
                Travel<span className="text-brand-400">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm mb-4 leading-relaxed">
              Empowering travelers worldwide with intelligent, bespoke day-by-day itineraries, realistic cost budgeting, and real-time conversational itinerary modifications.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" /> Enterprise-grade AI
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-teal-400" /> Global Coverage
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider font-display">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-300 transition-colors">
                  Explore Destinations
                </Link>
              </li>
              <li>
                <Link to="/plan" className="hover:text-brand-300 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Plan New Trip
                </Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-brand-300 transition-colors">
                  Saved Itineraries
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider font-display">
              Architecture & Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-300">
                React + Vite
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-300">
                Tailwind CSS
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-300">
                FastAPI Python
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-300">
                MongoDB
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-300">
                Pydantic V2
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-brand-400 font-medium">
                Gemini & OpenAI AI
              </span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {CURRENT_YEAR} TravelAI. Built with precision for intelligent exploration.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for passionate explorers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
