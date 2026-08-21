import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Scroll, 
  BookOpen, 
  Flame, 
  Clock 
} from 'lucide-react';
import TapestryViewer from './components/TapestryViewer';
import CampaignPoems from './components/CampaignPoems';

type TabType = 'tapestry' | 'poems';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('tapestry');

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'tapestry':
        return <TapestryViewer />;
      case 'poems':
        return <CampaignPoems />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-neutral-200 flex flex-col justify-between selection:bg-[#d4af37]/30 selection:text-[#d4af37]">
      
      {/* ATMOSPHERIC BACKGROUND OVERLAYS */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,#1e160e_0%,transparent_50%)] pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-[radial-gradient(#111112_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none z-0"></div>
      
      {/* ATMOSPHERIC CANDLE LIGHTS */}
      <div className="hidden lg:flex fixed left-6 top-8 flex-col items-center gap-1 z-50 pointer-events-none select-none">
        <div className="w-4 h-6 bg-gradient-to-t from-red-600 via-[#d4af37] to-[#fffbf0] rounded-full blur-[2px] candle-glow shadow-[0_0_15px_rgba(212,175,55,0.7)]"></div>
        <div className="w-1.5 h-16 bg-gradient-to-b from-[#2d2215] to-[#130f0a] rounded-t-sm border border-[#3e301d]"></div>
        <div className="w-3 h-1 bg-[#1c140a] border border-[#2d2417] rounded-sm"></div>
        <span className="text-[9px] text-[#524431] font-serif font-bold uppercase tracking-wider mt-1">Sanctus</span>
      </div>

      <div className="hidden lg:flex fixed right-6 top-8 flex-col items-center gap-1 z-50 pointer-events-none select-none">
        <div className="w-4 h-6 bg-gradient-to-t from-red-600 via-[#d4af37] to-[#fffbf0] rounded-full blur-[2px] candle-glow shadow-[0_0_15px_rgba(212,175,55,0.7)]"></div>
        <div className="w-1.5 h-16 bg-gradient-to-b from-[#2d2215] to-[#130f0a] rounded-t-sm border border-[#3e301d]"></div>
        <div className="w-3 h-1 bg-[#1c140a] border border-[#2d2417] rounded-sm"></div>
        <span className="text-[9px] text-[#524431] font-serif font-bold uppercase tracking-wider mt-1">Lex</span>
      </div>

      {/* HEADER SECTION */}
      <header className="relative z-10 border-b border-[#2d2417] bg-[#0c0a0c]/80 backdrop-blur-md pt-8 pb-5 px-4 shadow-2xl">
        
        {/* Double lines feudal border */}
        <div className="absolute bottom-[2px] left-0 right-0 h-[1px] bg-[#d4af37]/20"></div>

        <div className="max-w-7xl mx-auto text-center space-y-3">
          
          {/* Centered Crest */}
          <div className="flex justify-center mb-1">
            <div className="relative group">
              <div className="absolute -inset-1 bg-[#d4af37] rounded-full blur-md opacity-20 group-hover:opacity-45 transition duration-1000"></div>
              <div className="relative w-12 h-12 bg-[#1c1611] border-2 border-[#d4af37] rounded-full flex items-center justify-center shadow-xl">
                <Shield className="w-6 h-6 text-[#d4af37] fill-[#d4af37]/10" />
              </div>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black font-serif tracking-widest text-[#e1d5c3] uppercase gold-glow">
              The Chronicle of [name]
            </h1>
            <p className="text-xs md:text-sm tracking-widest text-[#d4af37] font-serif uppercase flex items-center justify-center gap-2 font-semibold">
              <Flame className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
              <span>Freeblade Knight Errant</span>
              <Flame className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
            </p>
          </div>

          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent mx-auto pt-2"></div>

          {/* CORE TABS NAVIGATION */}
          <nav className="pt-4 flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {/* Tapestry Tab */}
            <button
              id="tab-btn-tapestry"
              onClick={() => setActiveTab('tapestry')}
              className={`px-5 py-2.5 text-xs md:text-sm font-serif uppercase tracking-wider rounded transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
                activeTab === 'tapestry'
                  ? 'bg-[#211a13] border-[#d4af37] text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.15)] font-semibold'
                  : 'bg-transparent border-transparent text-[#8e8577] hover:text-[#e1d5c3] hover:border-[#2d2417]'
              }`}
            >
              <Scroll className="w-4 h-4" />
              <span>Tapestry Scroll</span>
            </button>

            {/* Campaign Poems Tab */}
            <button
              id="tab-btn-poems"
              onClick={() => setActiveTab('poems')}
              className={`px-5 py-2.5 text-xs md:text-sm font-serif uppercase tracking-wider rounded transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
                activeTab === 'poems'
                  ? 'bg-[#211a13] border-[#d4af37] text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.15)] font-semibold'
                  : 'bg-transparent border-transparent text-[#8e8577] hover:text-[#e1d5c3] hover:border-[#2d2417]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Canticles of the March</span>
            </button>
          </nav>

        </div>
      </header>

      {/* MAIN DOCUMENT BODY */}
      <main className="flex-1 relative z-10 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
