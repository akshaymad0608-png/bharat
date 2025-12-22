
import React, { useState, useRef, useMemo } from 'react';
import Navbar from './components/Navbar';
import FileUploader from './components/FileUploader';
import { 
  CONVERSIONS, 
  ALL_CONVERSIONS,
  FEATURES, 
  PRICING_PLANS, 
  FAQS,
  TRANSLATIONS
} from './constants';
import { 
  ChevronDown, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Upload, 
  Crown, 
  X, 
  Search,
  Mail,
  Lock,
  Loader2
} from 'lucide-react';
import { ConversionType, User } from './types';

const App: React.FC = () => {
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [user, setUser] = useState<User | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedTool, setSelectedTool] = useState<ConversionType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  
  const uploaderRef = useRef<HTMLDivElement>(null);
  
  const t = TRANSLATIONS[lang];

  // Robust scroll function using IDs
  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToolSelect = (tool: ConversionType) => {
    setSelectedTool(tool);
    setIsModalOpen(false);
    // Slight delay to ensure modal close animation doesn't jitter scroll
    setTimeout(() => {
      if (uploaderRef.current) {
        uploaderRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSigningIn(true);
    await new Promise(r => setTimeout(r, 1200));
    setUser({
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      isPremium: false
    });
    setSigningIn(false);
    setIsSignInOpen(false);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  const filteredTools = useMemo(() => {
    return ALL_CONVERSIONS.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(ALL_CONVERSIONS.map(t => t.category)));
    return cats;
  }, []);

  const isPremium = user?.isPremium || false;

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-100 selection:text-blue-900">
      <Navbar 
        onLangChange={setLang} 
        user={user} 
        onSignInClick={() => setIsSignInOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-4 overflow-hidden" id="hero">
        <div className="max-w-7xl mx-auto text-center space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100">
              <Star className="w-4 h-4 fill-blue-700" />
              Loved by 1M+ Users Globally
            </div>
            
            {user && (
              <button 
                onClick={() => setUser(u => u ? {...u, isPremium: !u.isPremium} : null)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  user.isPremium 
                    ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                <Crown className={`w-4 h-4 ${user.isPremium ? 'fill-amber-500' : ''}`} />
                {user.isPremium ? 'Premium Active' : 'Go Premium (Demo)'}
              </button>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            {t.heroTitle.split(' ').map((word, i) => (
              word === 'Seconds' || word === 'सेकंडों' ? <span key={i} className="text-blue-600"> {word} </span> : word + ' '
            ))}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            {t.heroSub}
          </p>
          
          <div ref={uploaderRef} className="scroll-mt-32">
            <FileUploader 
              lang={lang} 
              isPremium={isPremium} 
              activeTool={selectedTool} 
              onClearTool={() => setSelectedTool(null)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
            <button 
              onClick={() => uploaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
            >
              <Upload className="w-6 h-6" /> {t.ctaUpload}
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white border-2 border-slate-200 text-slate-700 px-10 py-4 rounded-2xl font-black text-lg hover:border-blue-600 hover:text-blue-600 transition-all hover:-translate-y-1 active:scale-95"
            >
              {t.ctaViewAll}
            </button>
          </div>
        </div>
      </header>

      {/* Converters Grid */}
      <section id="converters" className="py-24 bg-white relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Supported Conversions</h2>
            <p className="text-slate-500 text-lg mb-16">Fast, secure, and ready for any format.</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {CONVERSIONS.map((conv) => (
              <div 
                key={conv.id} 
                onClick={() => handleToolSelect(conv)}
                className="group p-8 rounded-[32px] border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 cursor-pointer text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-50 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  {conv.icon}
                </div>
                <span className="mt-6 font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{conv.name}</span>
                <span className="text-[10px] text-slate-400 mt-2 uppercase tracking-[0.2em] font-bold">{conv.category}</span>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white border-2 border-slate-100 text-slate-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 mx-auto hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-all group"
            >
              {t.ctaViewAll} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* AI Premium Highlights */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[200px] opacity-10 -mr-[300px] -mt-[300px]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-500/30 uppercase tracking-[0.2em]">
                <Sparkles className="w-4 h-4" /> Premium AI Features
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight">Beyond Simple Conversion</h2>
              <p className="text-slate-400 text-xl leading-relaxed">Our proprietary AI engines analyze your documents to save you hours of work.</p>
              
              <div className="space-y-6 pt-6">
                {[
                  'PDF Auto-Summary: Get the gist in seconds',
                  'Smart Renaming: AI-suggested organized naming',
                  'OCR Excellence: Turn images into editable text',
                  'Format Recommendation: Best output for your usage'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/50 group-hover:bg-blue-600 transition-colors">
                      <Zap className="w-3 h-3 text-blue-400 group-hover:text-white fill-current" />
                    </div>
                    <span className="text-slate-200 font-bold text-lg">{item}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => !user ? setIsSignInOpen(true) : scrollToId('pricing')} 
                className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-2xl shadow-blue-900 transition-all hover:-translate-y-1 active:scale-95"
              >
                {isPremium ? 'Explore AI Tools' : 'Unlock Premium AI'}
              </button>
            </div>
            
            <div 
              onClick={() => uploaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="flex-1 w-full bg-white/5 border border-white/10 p-10 rounded-[50px] backdrop-blur-xl relative group cursor-pointer hover:bg-white/10 transition-all duration-500"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[50px] blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative space-y-8">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-5 group-hover:border-blue-500/50 transition-colors">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-900/40 group-hover:scale-110 transition-transform">
                    <Sparkles className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold">AI Content Engine</div>
                    <div className="text-sm text-slate-500 font-medium group-hover:text-blue-400 transition-colors tracking-tight">Processing document snippet...</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[92%] animate-pulse"></div>
                  </div>
                  <div className="text-xs text-slate-500 flex justify-between font-bold uppercase tracking-widest">
                    <span>Identifying patterns...</span>
                    <span>92%</span>
                  </div>
                </div>
                <div className="p-6 bg-blue-600/10 rounded-[32px] border border-blue-500/20 group-hover:bg-blue-600/20 transition-all">
                  <p className="text-lg text-blue-100 italic leading-relaxed">"The document discusses Q3 fiscal growth with a 15% increase in digital exports. Suggested name: <span className="text-white font-bold font-mono">Q3_Growth_Report_2025</span>."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t.featuresTitle}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <div key={i} className="p-10 rounded-[40px] bg-white shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-white scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{t.pricingTitle}</h2>
            <p className="text-slate-500 mt-4 text-xl">{t.pricingSub}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {PRICING_PLANS.map((plan, i) => (
              <div key={i} className={`p-12 rounded-[50px] border flex flex-col h-full transition-all duration-500 hover:translate-y-[-10px] ${plan.recommended ? 'bg-white border-blue-600 ring-8 ring-blue-50 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
                {plan.recommended && (
                  <div className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] py-1.5 px-5 rounded-full w-fit mb-8 shadow-lg shadow-blue-200">Recommended</div>
                )}
                <h3 className="text-3xl font-black text-slate-900">{plan.name}</h3>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-6xl font-black text-slate-900 tracking-tight">{plan.price}</span>
                  <span className="text-slate-500 font-bold text-lg">{plan.period}</span>
                </div>
                <ul className="mt-10 space-y-6 flex-grow">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-4 text-slate-600 font-semibold text-lg">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => !user ? setIsSignInOpen(true) : (plan.recommended ? setUser(u => u ? {...u, isPremium: true} : null) : uploaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }))}
                  className={`mt-12 w-full py-5 rounded-2xl font-black text-lg transition-all ${plan.recommended ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xl shadow-blue-200 active:scale-95' : 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-95'}`}
                >
                  {isPremium && plan.recommended ? 'Current Plan' : plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16 tracking-tight">{t.faqTitle}</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div 
                key={i} 
                className={`bg-white rounded-3xl border overflow-hidden cursor-pointer transition-all duration-300 ${activeFaq === i ? 'border-blue-600 shadow-xl scale-[1.02]' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                <div className="p-8 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-lg leading-tight">{faq.question}</span>
                  <div className={`transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}>
                    <ChevronDown className="w-6 h-6" />
                  </div>
                </div>
                {activeFaq === i && (
                  <div className="px-8 pb-8 text-slate-600 leading-relaxed text-lg border-t border-slate-50 pt-6 animate-in slide-in-from-top-2">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 text-center sm:text-left">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="space-y-8">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                  <span className="text-white font-black text-xl">C</span>
                </div>
                <span className="text-2xl font-black tracking-tight text-white">Convert<span className="text-blue-600">Bharat</span></span>
              </div>
              <p className="text-lg leading-relaxed font-medium">
                {t.footerDesc}
              </p>
            </div>
            <div>
              <h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest">Links</h4>
              <ul className="space-y-4 font-semibold">
                <li><button onClick={() => scrollToId('converters')} className="hover:text-blue-500 transition-colors">Converters</button></li>
                <li><button onClick={() => scrollToId('features')} className="hover:text-blue-500 transition-colors">Features</button></li>
                <li><button onClick={() => scrollToId('pricing')} className="hover:text-blue-500 transition-colors">Pricing</button></li>
                <li><button onClick={() => scrollToId('faq')} className="hover:text-blue-500 transition-colors">Help / FAQ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest">Company</h4>
              <ul className="space-y-4 font-semibold">
                <li><a href="#" className="hover:text-blue-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest">Stay Updated</h4>
              <p className="text-lg mb-6 font-medium">New tools released monthly.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email Address" className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                <button className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-center text-sm font-bold opacity-30 uppercase tracking-[0.3em]">
            © 2025 ConvertBharat. All rights reserved. Built with Pride in India.
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
      {isSignInOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsSignInOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-10">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">C</span>
                    </div>
                    <span className="text-xl font-bold">ConvertBharat</span>
                  </div>
                  <button onClick={() => setIsSignInOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-2">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <h3 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h3>
                <p className="text-slate-500 font-bold mb-8">Sign in to sync your conversions</p>
                
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
                      <input 
                        type="email" 
                        required
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold"
                      />
                    </div>
                  </div>
                  <button 
                    disabled={signingIn}
                    type="submit"
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-2xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {signingIn ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sign In'}
                  </button>
                </form>
                
                <div className="mt-8 text-center">
                  <p className="text-slate-500 font-bold">Don't have an account? <a href="#" className="text-blue-600 hover:underline">Sign up free</a></p>
                </div>
             </div>
             <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                <button 
                  onClick={() => handleSignIn()}
                  className="w-full bg-white border border-slate-200 py-3 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95"
                >
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" /> Sign in with Google (Demo)
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Full Converters Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">All 200+ Converters</h3>
                <p className="text-slate-500 font-bold mt-1">Search or browse by category</p>
              </div>
              <div className="relative group w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search tools..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 shadow-inner"
                />
              </div>
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {searchQuery ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTools.length > 0 ? filteredTools.map(tool => (
                    <div 
                      key={tool.id}
                      onClick={() => handleToolSelect(tool)}
                      className="flex items-center gap-4 p-5 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-all group"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {tool.icon}
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{tool.name}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tool.category}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-20 text-center">
                      <div className="text-slate-400 font-bold text-xl">No tools found matching "{searchQuery}"</div>
                      <button onClick={() => setSearchQuery('')} className="mt-4 text-blue-600 font-black hover:underline">Clear Search</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-12">
                  {categories.map(category => (
                    <div key={category}>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                        {category} <div className="h-px flex-1 bg-slate-100"></div>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ALL_CONVERSIONS.filter(t => t.category === category).map(tool => (
                          <div 
                            key={tool.id}
                            onClick={() => handleToolSelect(tool)}
                            className="flex items-center gap-4 p-5 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-all group"
                          >
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all">
                              {tool.icon}
                            </div>
                            <div>
                              <div className="font-black text-slate-900">{tool.name}</div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tool.category}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-slate-500 font-bold text-sm">Can't find what you're looking for? <a href="#" className="text-blue-600 hover:underline">Request a tool</a></p>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Upload Button */}
      <div className="md:hidden fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => uploaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          className="bg-blue-600 text-white p-5 rounded-[24px] shadow-[0_20px_50px_rgba(37,99,235,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <Upload className="w-7 h-7" />
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default App;
