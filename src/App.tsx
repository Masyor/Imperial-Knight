import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Scroll, 
  BookOpen, 
  Flame, 
  X,
  Compass,
  Flag,
  User,
  Maximize2,
  DoorOpen,
  Users,
  Cpu,
  Coins
} from 'lucide-react';
import TapestryViewer from './components/TapestryViewer';
import CampaignPoems from './components/CampaignPoems';
import CastleGreatHall from './components/CastleGreatHall';
import HouseholdModal from './components/HouseholdModal';
import CharacterModal from './components/CharacterModal';
import BastionGateModal from './components/BastionGateModal';
import BarracksModal from './components/BarracksModal';
import StablesModal from './components/StablesModal';
import TreasuryModal from './components/TreasuryModal';

type ModalView = 'none' | 'tapestry' | 'poems' | 'household' | 'oc' | 'gate_hub' | 'barracks' | 'stables' | 'treasury';

export default function App() {
  const [activeModal, setActiveModal] = useState<ModalView>('none');

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal !== 'none') {
        setActiveModal('none');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

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
      <header className="relative z-10 border-b border-[#2d2417] bg-[#0c0a0c]/85 backdrop-blur-md pt-6 pb-4 px-4 shadow-2xl">
        
        {/* Double lines feudal border */}
        <div className="absolute bottom-[2px] left-0 right-0 h-[1px] bg-[#d4af37]/20"></div>

        <div className="max-w-7xl mx-auto text-center space-y-2">
          
          {/* Centered Crest */}
          <div className="flex justify-center mb-1">
            <div className="relative group">
              <div className="absolute -inset-1 bg-[#d4af37] rounded-full blur-md opacity-20 group-hover:opacity-45 transition duration-1000"></div>
              <div className="relative w-10 h-10 bg-[#1c1611] border-2 border-[#d4af37] rounded-full flex items-center justify-center shadow-xl">
                <Shield className="w-5 h-5 text-[#d4af37] fill-[#d4af37]/10" />
              </div>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black font-serif tracking-widest text-[#e1d5c3] uppercase gold-glow">
              The Chronicle of the Blank Shield
            </h1>
            <p className="text-[11px] md:text-xs tracking-widest text-[#d4af37] font-serif uppercase flex items-center justify-center gap-2 font-semibold">
              <Flame className="w-3 h-3 text-[#d4af37] animate-pulse" />
              <span>Freeblade Knight Errant • Sanctus Drusus Keep</span>
              <Flame className="w-3 h-3 text-[#d4af37] animate-pulse" />
            </p>
          </div>

          {/* QUICK TRAVEL / SHORTCUT HUD BUTTONS */}
          <nav className="pt-2 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            <button
              id="quick-hall-btn"
              onClick={() => setActiveModal('none')}
              className={`px-3.5 py-1.5 text-xs font-serif uppercase tracking-wider rounded transition-all duration-300 flex items-center gap-1.5 border cursor-pointer ${
                activeModal === 'none'
                  ? 'bg-[#211a13] border-[#d4af37] text-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.2)] font-bold'
                  : 'bg-[#120e0b]/60 border-[#2d2417] text-[#8e8577] hover:text-[#e1d5c3]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Great Hall</span>
            </button>

            <button
              id="quick-oc-btn"
              onClick={() => setActiveModal('oc')}
              className={`px-3.5 py-1.5 text-xs font-serif uppercase tracking-wider rounded transition-all duration-300 flex items-center gap-1.5 border cursor-pointer ${
                activeModal === 'oc'
                  ? 'bg-[#211a13] border-[#d4af37] text-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.2)] font-bold'
                  : 'bg-[#120e0b]/60 border-[#2d2417] text-[#8e8577] hover:text-[#e1d5c3]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Current Lord</span>
            </button>

            <button
              id="quick-household-btn"
              onClick={() => setActiveModal('household')}
              className={`px-3.5 py-1.5 text-xs font-serif uppercase tracking-wider rounded transition-all duration-300 flex items-center gap-1.5 border cursor-pointer ${
                activeModal === 'household'
                  ? 'bg-[#211a13] border-[#d4af37] text-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.2)] font-bold'
                  : 'bg-[#120e0b]/60 border-[#2d2417] text-[#8e8577] hover:text-[#e1d5c3]'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Household</span>
            </button>

            <button
              id="quick-tapestry-btn"
              onClick={() => setActiveModal('tapestry')}
              className={`px-3.5 py-1.5 text-xs font-serif uppercase tracking-wider rounded transition-all duration-300 flex items-center gap-1.5 border cursor-pointer ${
                activeModal === 'tapestry'
                  ? 'bg-[#211a13] border-[#d4af37] text-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.2)] font-bold'
                  : 'bg-[#120e0b]/60 border-[#2d2417] text-[#8e8577] hover:text-[#e1d5c3]'
              }`}
            >
              <Scroll className="w-3.5 h-3.5" />
              <span>Tapestry</span>
            </button>

            <button
              id="quick-poems-btn"
              onClick={() => setActiveModal('poems')}
              className={`px-3.5 py-1.5 text-xs font-serif uppercase tracking-wider rounded transition-all duration-300 flex items-center gap-1.5 border cursor-pointer ${
                activeModal === 'poems'
                  ? 'bg-[#211a13] border-[#d4af37] text-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.2)] font-bold'
                  : 'bg-[#120e0b]/60 border-[#2d2417] text-[#8e8577] hover:text-[#e1d5c3]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Canticles</span>
            </button>

            <button
              id="quick-gate-btn"
              onClick={() => setActiveModal('gate_hub')}
              className={`px-3.5 py-1.5 text-xs font-serif uppercase tracking-wider rounded transition-all duration-300 flex items-center gap-1.5 border cursor-pointer ${
                ['gate_hub', 'barracks', 'stables', 'treasury'].includes(activeModal)
                  ? 'bg-[#211a13] border-[#d4af37] text-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.2)] font-bold'
                  : 'bg-[#120e0b]/60 border-[#2d2417] text-[#8e8577] hover:text-[#e1d5c3]'
              }`}
            >
              <DoorOpen className="w-3.5 h-3.5" />
              <span>Bastion Wings</span>
            </button>
          </nav>

        </div>
      </header>

      {/* MAIN VIEWPORT: CASTLE GREAT HALL CANVAS */}
      <main className="flex-1 relative z-10 p-2 md:p-4 max-w-7xl mx-auto w-full flex items-center justify-center">
        <CastleGreatHall 
          onOpenTapestry={() => setActiveModal('tapestry')}
          onOpenPoems={() => setActiveModal('poems')}
          onOpenHousehold={() => setActiveModal('household')}
          onOpenOC={() => setActiveModal('oc')}
          onOpenBastionGate={() => setActiveModal('gate_hub')}
        />
      </main>

      {/* MODAL OVERLAY: OC / CHARACTER FOLIO */}
      <AnimatePresence>
        {activeModal === 'oc' && (
          <motion.div
            key="oc-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto flex flex-col items-center justify-start p-3 md:p-6"
          >
            {/* Modal Header Controls */}
            <div className="w-full max-w-5xl flex items-center justify-between py-3 mb-4 border-b border-[#3e301d]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e150d] border border-[#d4af37] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-serif font-bold text-[#d4af37] uppercase tracking-widest">
                    The Current Lord
                  </h2>
                  <p className="text-[10px] text-[#8e8577] font-serif">
                    Illuminated manuscript and personal registry of the Lord of the Keep
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                id="close-oc-modal-btn"
                onClick={() => setActiveModal('none')}
                className="bg-[#241710] hover:bg-[#3d2417] text-[#d4af37] border border-[#d4af37]/60 px-3.5 py-1.5 rounded text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition shadow-lg"
              >
                <span>Return to Hall</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* OC Content */}
            <div className="w-full max-w-5xl my-auto py-2">
              <CharacterModal />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL OVERLAY: HOUSEHOLD BANNER */}
      <AnimatePresence>
        {activeModal === 'household' && (
          <motion.div
            key="household-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto flex flex-col items-center justify-start p-3 md:p-6"
          >
            {/* Modal Header Controls */}
            <div className="w-full max-w-4xl flex items-center justify-between py-3 mb-4 border-b border-[#3e301d]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e150d] border border-[#d4af37] flex items-center justify-center">
                  <Flag className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-serif font-bold text-[#d4af37] uppercase tracking-widest">
                    Household Lineage & Standards
                  </h2>
                  <p className="text-[10px] text-[#8e8577] font-serif">
                    Heraldry, House History, and Chivalric Code
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                id="close-household-modal-btn"
                onClick={() => setActiveModal('none')}
                className="bg-[#241710] hover:bg-[#3d2417] text-[#d4af37] border border-[#d4af37]/60 px-3.5 py-1.5 rounded text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition shadow-lg"
              >
                <span>Return to Hall</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Household Content */}
            <div className="w-full max-w-4xl my-auto py-2">
              <HouseholdModal />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL OVERLAY: TAPESTRY SCROLL */}
      <AnimatePresence>
        {activeModal === 'tapestry' && (
          <motion.div
            key="tapestry-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto flex flex-col items-center justify-start p-3 md:p-6"
          >
            {/* Modal Header Controls */}
            <div className="w-full max-w-7xl flex items-center justify-between py-3 mb-2 border-b border-[#3e301d]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e150d] border border-[#d4af37] flex items-center justify-center">
                  <Scroll className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-serif font-bold text-[#d4af37] uppercase tracking-widest">
                    The Tapestry of the Exile
                  </h2>
                  <p className="text-[10px] text-[#8e8577] font-serif">
                    Embroidered records from the Great Hall of Sanctus Drusus
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                id="close-tapestry-modal-btn"
                onClick={() => setActiveModal('none')}
                className="bg-[#241710] hover:bg-[#3d2417] text-[#d4af37] border border-[#d4af37]/60 px-3.5 py-1.5 rounded text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition shadow-lg"
              >
                <span>Return to Hall</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tapestry Viewer Content */}
            <div className="w-full max-w-7xl my-auto py-2">
              <TapestryViewer />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL OVERLAY: CANTICLES / POEMS */}
      <AnimatePresence>
        {activeModal === 'poems' && (
          <motion.div
            key="poems-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto flex flex-col items-center justify-start p-3 md:p-6"
          >
            {/* Modal Header Controls */}
            <div className="w-full max-w-5xl flex items-center justify-between py-3 mb-4 border-b border-[#3e301d]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e150d] border border-[#d4af37] flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-serif font-bold text-[#d4af37] uppercase tracking-widest">
                    Scriptorum Canticles of the March
                  </h2>
                  <p className="text-[10px] text-[#8e8577] font-serif">
                    Manuscripts retrieved from the Great Hall Archive
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                id="close-poems-modal-btn"
                onClick={() => setActiveModal('none')}
                className="bg-[#241710] hover:bg-[#3d2417] text-[#d4af37] border border-[#d4af37]/60 px-3.5 py-1.5 rounded text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition shadow-lg"
              >
                <span>Return to Hall</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Campaign Poems Content */}
            <div className="w-full max-w-5xl my-auto py-2">
              <CampaignPoems />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL OVERLAY: BASTION GATE HUB */}
      <AnimatePresence>
        {activeModal === 'gate_hub' && (
          <motion.div
            key="gate-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto flex flex-col items-center justify-start p-3 md:p-6"
          >
            {/* Modal Header Controls */}
            <div className="w-full max-w-2xl flex items-center justify-between py-3 mb-4 border-b border-[#3e301d]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e150d] border border-[#d4af37] flex items-center justify-center">
                  <DoorOpen className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-serif font-bold text-[#d4af37] uppercase tracking-widest">
                    Porta Profundis Waypoints
                  </h2>
                  <p className="text-[10px] text-[#8e8577] font-serif">
                    Access sub-wings of the Bastion
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                id="close-gate-modal-btn"
                onClick={() => setActiveModal('none')}
                className="bg-[#241710] hover:bg-[#3d2417] text-[#d4af37] border border-[#d4af37]/60 px-3.5 py-1.5 rounded text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition shadow-lg"
              >
                <span>Return to Hall</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bastion Hub Content */}
            <div className="w-full max-w-2xl my-auto py-2">
              <BastionGateModal onSelectDestination={(dest) => setActiveModal(dest)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL OVERLAY: BARRACKS */}
      <AnimatePresence>
        {activeModal === 'barracks' && (
          <motion.div
            key="barracks-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto flex flex-col items-center justify-start p-3 md:p-6"
          >
            {/* Modal Header Controls */}
            <div className="w-full max-w-3xl flex items-center justify-between py-3 mb-4 border-b border-[#3e301d]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e150d] border border-[#d4af37] flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-serif font-bold text-[#d4af37] uppercase tracking-widest">
                    Castra Auxilia • The Barracks
                  </h2>
                  <p className="text-[10px] text-[#8e8577] font-serif">
                    Armsmen, Retainers & Sacristan muster rolls
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                id="close-barracks-modal-btn"
                onClick={() => setActiveModal('none')}
                className="bg-[#241710] hover:bg-[#3d2417] text-[#d4af37] border border-[#d4af37]/60 px-3.5 py-1.5 rounded text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition shadow-lg"
              >
                <span>Return to Hall</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Barracks Content */}
            <div className="w-full max-w-3xl my-auto py-2">
              <BarracksModal onBackToGate={() => setActiveModal('gate_hub')} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL OVERLAY: STABLES */}
      <AnimatePresence>
        {activeModal === 'stables' && (
          <motion.div
            key="stables-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto flex flex-col items-center justify-start p-3 md:p-6"
          >
            {/* Modal Header Controls */}
            <div className="w-full max-w-3xl flex items-center justify-between py-3 mb-4 border-b border-[#3e301d]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e150d] border border-[#d4af37] flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-serif font-bold text-[#d4af37] uppercase tracking-widest">
                    Sanctum Machina • Knight Stables
                  </h2>
                  <p className="text-[10px] text-[#8e8577] font-serif">
                    Knight Chassis, Machine Spirits, and Pilot bonds
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                id="close-stables-modal-btn"
                onClick={() => setActiveModal('none')}
                className="bg-[#241710] hover:bg-[#3d2417] text-[#d4af37] border border-[#d4af37]/60 px-3.5 py-1.5 rounded text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition shadow-lg"
              >
                <span>Return to Hall</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stables Content */}
            <div className="w-full max-w-3xl my-auto py-2">
              <StablesModal onBackToGate={() => setActiveModal('gate_hub')} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL OVERLAY: TREASURY */}
      <AnimatePresence>
        {activeModal === 'treasury' && (
          <motion.div
            key="treasury-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto flex flex-col items-center justify-start p-3 md:p-6"
          >
            {/* Modal Header Controls */}
            <div className="w-full max-w-3xl flex items-center justify-between py-3 mb-4 border-b border-[#3e301d]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e150d] border border-[#d4af37] flex items-center justify-center">
                  <Coins className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-serif font-bold text-[#d4af37] uppercase tracking-widest">
                    Fiscus Regis • The Iron Treasury
                  </h2>
                  <p className="text-[10px] text-[#8e8577] font-serif">
                    Feudal revenues, solars, tithes, and forge upkeep
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                id="close-treasury-modal-btn"
                onClick={() => setActiveModal('none')}
                className="bg-[#241710] hover:bg-[#3d2417] text-[#d4af37] border border-[#d4af37]/60 px-3.5 py-1.5 rounded text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition shadow-lg"
              >
                <span>Return to Hall</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Treasury Content */}
            <div className="w-full max-w-3xl my-auto py-2">
              <TreasuryModal onBackToGate={() => setActiveModal('gate_hub')} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
