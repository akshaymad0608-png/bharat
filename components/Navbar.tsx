
import React, { useState } from 'react';
import { Menu, X, Globe, User as UserIcon, LogOut, Settings, Shield } from 'lucide-react';
import { User } from '../types';

interface Props {
  onLangChange: (lang: 'EN' | 'HI') => void;
  user: User | null;
  onSignInClick: () => void;
  onSignOut: () => void;
}

const Navbar: React.FC<Props> = ({ onLangChange, user, onSignInClick, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleLang = () => {
    const newLang = lang === 'EN' ? 'HI' : 'EN';
    setLang(newLang);
    onLangChange(newLang);
  };

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      // scrollIntoView with 'start' is highly reliable combined with Tailwind scroll-mt classes
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-morphism border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Convert<span className="text-blue-600">Bharat</span></span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button 
              type="button" 
              onClick={() => scrollToSection('converters')} 
              className="text-slate-600 hover:text-blue-600 font-bold transition-colors cursor-pointer"
            >
              Tools
            </button>
            <button 
              type="button" 
              onClick={() => scrollToSection('features')} 
              className="text-slate-600 hover:text-blue-600 font-bold transition-colors cursor-pointer"
            >
              Features
            </button>
            <button 
              type="button" 
              onClick={() => scrollToSection('pricing')} 
              className="text-slate-600 hover:text-blue-600 font-bold transition-colors cursor-pointer"
            >
              Pricing
            </button>
            
            <button 
              onClick={toggleLang}
              className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full text-slate-600 hover:text-blue-600 font-medium transition-all"
            >
              <Globe className="w-4 h-4" />
              {lang === 'EN' ? 'English' : 'हिंदी'}
            </button>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pr-3 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.avatar ? <img src={user.avatar} className="rounded-full" alt="User" /> : user.name[0]}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{user.name.split(' ')[0]}</span>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-slate-50 mb-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Account</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                      </div>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors text-left">
                        <UserIcon className="w-4 h-4" /> Profile
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors text-left">
                        <Settings className="w-4 h-4" /> Settings
                      </button>
                      {user.isPremium && (
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-amber-600 hover:bg-amber-50 rounded-xl transition-colors text-left">
                          <Shield className="w-4 h-4" /> Subscription
                        </button>
                      )}
                      <div className="h-px bg-slate-50 my-2"></div>
                      <button 
                        onClick={() => { onSignOut(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button 
                onClick={onSignInClick}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
             {user && (
               <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                 {user.name[0]}
               </div>
             )}
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-6 space-y-6 shadow-2xl animate-in slide-in-from-top">
          <button onClick={() => scrollToSection('converters')} className="block w-full text-left text-slate-800 font-bold py-2">Tools</button>
          <button onClick={() => scrollToSection('features')} className="block w-full text-left text-slate-800 font-bold py-2">Features</button>
          <button onClick={() => scrollToSection('pricing')} className="block w-full text-left text-slate-800 font-bold py-2">Pricing</button>
          <button 
            onClick={() => { toggleLang(); setIsOpen(false); }}
            className="flex items-center gap-2 font-bold text-blue-600 py-2"
          >
            <Globe className="w-5 h-5" />
            Switch to {lang === 'EN' ? 'हिंदी' : 'English'}
          </button>
          {user ? (
            <button 
              onClick={() => { onSignOut(); setIsOpen(false); }}
              className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-bold"
            >
              Sign Out
            </button>
          ) : (
            <button 
              onClick={() => { onSignInClick(); setIsOpen(false); }}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
