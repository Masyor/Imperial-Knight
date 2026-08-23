import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  Shield,
  Zap,
  Gauge,
  Crosshair,
  Scroll,
  Cpu
} from 'lucide-react';
import stablesData from '../data/stables.json';

interface StablesModalProps {
  onBackToGate?: () => void;
}

export default function StablesModal({ onBackToGate }: StablesModalProps) {
  // State for expanded cards - default first card open
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    knight_umbra_draconis: true
  });

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-[#2a1d13] font-serif">
      
      {/* ILLUMINATED MANUSCRIPT FOLIO CONTAINER */}
      <article className="relative bg-[#f4ecd8] border-[3px] border-[#6d4c1b] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.85)] p-6 md:p-10 space-y-7 overflow-hidden">
        
        {/* PARCHMENT TEXTURE & AGED VELLUM ACCENTS */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#dfcfb0]/25 via-transparent to-[#bda67f]/35 pointer-events-none"></div>
        <div className="absolute inset-2 md:inset-3 border border-[#8b6528]/40 pointer-events-none rounded"></div>
        <div className="absolute inset-3 md:inset-4 border border-dashed border-[#8b6528]/25 pointer-events-none"></div>

        {/* CORNER ILLUMINATIONS */}
        <div className="absolute top-2 left-2 text-[#8b1e1e] text-xs select-none pointer-events-none">⚜</div>
        <div className="absolute top-2 right-2 text-[#8b1e1e] text-xs select-none pointer-events-none">⚜</div>
        <div className="absolute bottom-2 left-2 text-[#8b1e1e] text-xs select-none pointer-events-none">⚜</div>
        <div className="absolute bottom-2 right-2 text-[#8b1e1e] text-xs select-none pointer-events-none">⚜</div>

        {/* TOP BAR / BACK BUTTON */}
        {onBackToGate && (
          <div className="relative z-10 flex items-center justify-between pb-2 border-b border-[#8b6528]/30">
            <button
              onClick={onBackToGate}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#ede1c4] border border-[#8b6528]/50 text-xs font-bold text-[#8b1e1e] hover:bg-[#faeed6] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Waypoints Menu</span>
            </button>
            <span className="text-[11px] text-[#8b6528] italic">Wing: Sanctum Machina</span>
          </div>
        )}

        {/* HEADER */}
        <header className="relative text-center pb-5 border-b-2 border-[#8b6528]/40 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#ebdcb8] border border-[#8b6528]/60 text-[#8b1e1e] text-xs font-bold uppercase tracking-widest shadow-xs">
            <span>☩</span>
            <span>Sanctum Machina • Knight Stables</span>
            <span>☩</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-wider text-[#1e130a] uppercase drop-shadow-xs">
            Knight Stables & Gantries
          </h1>

          <p className="text-xs md:text-sm text-[#8b1e1e] font-semibold italic max-w-lg mx-auto">
            Registry of Warmachine Engines, Scion Pilots, Throne Attunement, and Relic Armaments
          </p>
        </header>

        {/* STACKED EXPANDABLE KNIGHT CARDS */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#8b6528] pb-1 border-b border-[#8b6528]/30">
            <span className="font-bold uppercase tracking-wider">☩ Consecrated Knights of the Household</span>
            <span className="italic">Click card header to expand / collapse</span>
          </div>

          {stablesData.map((knight) => {
            const isExpanded = !!expandedIds[knight.id];

            return (
              <div 
                key={knight.id}
                className="bg-[#ede1c4]/75 border-2 border-[#8b6528]/40 rounded-lg overflow-hidden shadow-xs transition-all duration-200"
              >
                {/* CARD HEADER (CLICKABLE TO TOGGLE) */}
                <button
                  type="button"
                  onClick={() => toggleExpand(knight.id)}
                  className="w-full p-4 md:p-5 flex items-start sm:items-center justify-between gap-3 text-left hover:bg-[#faeed6] transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded bg-[#ebd9b2] border border-[#8b6528] flex items-center justify-center text-[#8b1e1e] flex-shrink-0 mt-0.5 sm:mt-0 shadow-inner">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold text-base md:text-lg text-[#1e130a] leading-snug">
                          {knight.engineName}
                        </h2>
                        <span className="px-2 py-0.5 rounded bg-[#f6efe0] border border-[#8b6528]/40 text-[10px] font-bold text-[#8b1e1e] uppercase">
                          {knight.className}
                        </span>
                      </div>
                      <p className="text-xs text-[#8b6528] font-semibold italic">
                        Pilot: <span className="text-[#1e130a] font-bold">{knight.pilotName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-7 h-7 rounded-full bg-[#ebd9b2] border border-[#8b6528]/50 flex items-center justify-center text-[#8b6528]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {/* EXPANDABLE BODY */}
                {isExpanded && (
                  <div className="p-4 md:p-6 border-t border-[#8b6528]/35 bg-[#f6efe0]/80 space-y-5 text-xs md:text-sm text-[#2c1d12] leading-relaxed">
                    
                    {/* PILOT, ENGINE & CLASS INFO */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="p-3 bg-[#ede1c4]/70 border border-[#8b6528]/30 rounded space-y-1">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8b1e1e]">Pilot Name</span>
                        <p className="font-bold text-[#1e130a] leading-snug">{knight.pilotName}</p>
                      </div>
                      <div className="p-3 bg-[#ede1c4]/70 border border-[#8b6528]/30 rounded space-y-1">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8b6528]">Engine Name</span>
                        <p className="font-bold text-[#1e130a] leading-snug">{knight.engineName}</p>
                      </div>
                      <div className="p-3 bg-[#ede1c4]/70 border border-[#8b6528]/30 rounded space-y-1">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8b6528]">Class</span>
                        <p className="font-bold text-[#1e130a] leading-snug">{knight.className}</p>
                      </div>
                    </div>

                    {/* STATS SECTION */}
                    <div className="p-4 bg-[#ede1c4]/60 border-2 border-[#8b6528]/35 rounded-lg space-y-3">
                      <div className="flex items-center gap-1.5 text-[#8b1e1e] font-bold text-xs uppercase tracking-wider border-b border-[#8b6528]/30 pb-1">
                        <Gauge className="w-3.5 h-3.5" />
                        <span>Chassis Stats & Performance Matrix</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <strong className="text-[#8b1e1e]">Attunement:</strong>{' '}
                          <span className="text-[#1e130a] font-medium">{knight.stats.attunement}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[#8b6528]/20">
                          <div>
                            <strong className="text-[#8b6528]">Overclocks:</strong>{' '}
                            <span className="text-[#1e130a] font-medium">{knight.stats.overclocks}</span>
                          </div>
                          <div>
                            <strong className="text-[#8b6528]">Shield Strength:</strong>{' '}
                            <span className="text-[#1e130a] font-medium">{knight.stats.shieldStrength}</span>
                          </div>
                          <div>
                            <strong className="text-[#8b6528]">Speed:</strong>{' '}
                            <span className="text-[#1e130a] font-medium">{knight.stats.speed}</span>
                          </div>
                          <div>
                            <strong className="text-[#8b6528]">Armour:</strong>{' '}
                            <span className="text-[#1e130a] font-medium">{knight.stats.armour}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* WEAPONS */}
                    <div className="p-3.5 bg-[#ede1c4]/50 border-l-4 border-[#8b6528] rounded-r space-y-1.5">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8b1e1e]">
                        ⚔ Weapons & Relic Systems
                      </span>
                      <p className="whitespace-pre-line text-xs md:text-sm text-[#1e130a] font-medium leading-relaxed font-mono">
                        {knight.weapons}
                      </p>
                    </div>

                    {/* NOTES */}
                    <div className="p-3.5 bg-[#ede1c4]/40 border border-[#8b6528]/25 rounded space-y-1">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8b6528]">
                        📜 Notes (Quirks, Lineage, RP Events)
                      </span>
                      <p className="whitespace-pre-line text-xs md:text-sm text-[#2c1d12] text-justify leading-relaxed">
                        {knight.notes}
                      </p>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <footer className="relative pt-6 border-t-2 border-[#8b6528]/40 text-center space-y-1">
          <div className="text-xs text-[#8b6528] font-bold tracking-widest uppercase">
            ☩ Sanctum Machina • In Nomine Machinae ☩
          </div>
        </footer>

      </article>

    </div>
  );
}
