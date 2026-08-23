import React from 'react';
import { Flag, Compass, Feather, Shield, Crown } from 'lucide-react';
import householdData from '../data/household.json';

export default function HouseholdModal() {
  const { lanceName, houseOfOrigin, householdHistory, householdColors, householdCorePrinciples } = householdData;

  return (
    <div className="w-full max-w-3xl mx-auto text-[#2a1d13]">
      
      {/* ILLUMINATED MANUSCRIPT FOLIO CONTAINER */}
      <article className="relative bg-[#f4ecd8] border-[3px] border-[#6d4c1b] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.85)] p-6 md:p-10 space-y-8 overflow-hidden font-serif">
        
        {/* PARCHMENT TEXTURE & AGED VELLUM ACCENTS */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#dfcfb0]/25 via-transparent to-[#bda67f]/35 pointer-events-none"></div>
        <div className="absolute inset-2 md:inset-3 border border-[#8b6528]/40 pointer-events-none rounded"></div>
        <div className="absolute inset-3 md:inset-4 border border-dashed border-[#8b6528]/25 pointer-events-none"></div>

        {/* CORNER ILLUMINATIONS / GOTHIC KNOTS */}
        <div className="absolute top-2 left-2 text-[#8b1e1e] text-xs select-none pointer-events-none">⚜</div>
        <div className="absolute top-2 right-2 text-[#8b1e1e] text-xs select-none pointer-events-none">⚜</div>
        <div className="absolute bottom-2 left-2 text-[#8b1e1e] text-xs select-none pointer-events-none">⚜</div>
        <div className="absolute bottom-2 right-2 text-[#8b1e1e] text-xs select-none pointer-events-none">⚜</div>

        {/* MANUSCRIPT HEADER / ILLUMINATED TOP BANNER */}
        <header className="relative text-center pb-6 border-b-2 border-[#8b6528]/40 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#ebdcb8] border border-[#8b6528]/60 text-[#8b1e1e] text-xs font-bold uppercase tracking-widest shadow-xs">
            <span>☩</span>
            <span>Cartularium Chivalricum • Household Roll</span>
            <span>☩</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-wider text-[#1e130a] uppercase drop-shadow-xs">
            {lanceName}
          </h1>

          <p className="text-sm md:text-base text-[#8b1e1e] font-semibold italic">
            {houseOfOrigin}
          </p>

          {/* Miniature Heraldic Standard Icon */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#8b6528] to-transparent"></span>
            <div className="w-9 h-9 rounded-full bg-[#ebd9b2] border-2 border-[#8b6528] flex items-center justify-center text-[#8b1e1e] shadow-inner">
              <Flag className="w-5 h-5 text-[#8b6528]" />
            </div>
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#8b6528] to-transparent"></span>
          </div>
        </header>

        {/* STACKED MANUSCRIPT BODY (Vertical single column layout) */}
        <div className="relative z-10 space-y-8 text-sm md:text-base leading-relaxed text-[#2c1d12]">
          
          {/* SECTION I: HOUSEHOLD LIVERY & COLORS */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[#8b1e1e] border-b border-[#8b6528]/40 pb-1.5">
              <span className="text-sm">⚜</span>
              <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#8b1e1e]">
                I. Household Livery & Heraldic Colors
              </h2>
            </div>

            {/* Color Swatches */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#ede1c4]/80 border border-[#8b6528]/35 rounded text-center space-y-2">
                <div 
                  className="w-full h-12 rounded border border-[#3e2f1f] shadow-inner flex items-center justify-center text-xs font-mono font-bold text-white/90"
                  style={{ backgroundColor: householdColors.primary }}
                >
                  Sable
                </div>
                <p className="text-xs font-bold text-[#1e130a]">{householdColors.primaryName}</p>
              </div>

              <div className="p-3 bg-[#ede1c4]/80 border border-[#8b6528]/35 rounded text-center space-y-2">
                <div 
                  className="w-full h-12 rounded border border-[#3e2f1f] shadow-inner flex items-center justify-center text-xs font-mono font-bold text-white/90"
                  style={{ backgroundColor: householdColors.secondary }}
                >
                  Gules
                </div>
                <p className="text-xs font-bold text-[#1e130a]">{householdColors.secondaryName}</p>
              </div>

              <div className="p-3 bg-[#ede1c4]/80 border border-[#8b6528]/35 rounded text-center space-y-2">
                <div 
                  className="w-full h-12 rounded border border-[#3e2f1f] shadow-inner flex items-center justify-center text-xs font-mono font-bold text-black/80"
                  style={{ backgroundColor: householdColors.accent }}
                >
                  Or
                </div>
                <p className="text-xs font-bold text-[#1e130a]">{householdColors.accentName}</p>
              </div>
            </div>

            {/* Heraldic Blazon */}
            <div className="p-4 bg-[#f6efe0] border-l-4 border-[#8b1e1e] rounded-r text-[#2c1d12]">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#8b1e1e] mb-1">Heraldic Blazon</span>
              <p className="italic text-xs md:text-sm">{householdColors.heraldicField}</p>
            </div>
          </section>

          {/* SECTION II: HOUSEHOLD ANNALS & HISTORY */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#8b1e1e] border-b border-[#8b6528]/40 pb-1.5">
              <Feather className="w-4 h-4 text-[#8b1e1e]" />
              <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#8b1e1e]">
                II. Household Annals & Chronicles of Antiquity
              </h2>
            </div>
            <div className="p-5 bg-[#f6efe0] border border-[#8b6528]/35 rounded shadow-xs">
              <p className="text-[#2c1d12] text-justify leading-relaxed first-letter:text-4xl first-letter:font-black first-letter:text-[#8b1e1e] first-letter:float-left first-letter:mr-2.5 first-letter:leading-none">
                {householdHistory}
              </p>
            </div>
          </section>

          {/* SECTION III: CORE PRINCIPLES & CHIVALRIC CODE (Stacked) */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[#8b1e1e] border-b border-[#8b6528]/40 pb-1.5">
              <Compass className="w-4 h-4 text-[#8b1e1e]" />
              <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#8b1e1e]">
                III. Household Core Principles & Chivalric Tenets
              </h2>
            </div>

            <div className="space-y-3 pt-1">
              {householdCorePrinciples.map((principle, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-[#ede1c4]/70 border border-[#8b6528]/35 rounded shadow-xs space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#ebd9b2] border border-[#8b6528] flex items-center justify-center text-xs font-bold text-[#8b1e1e] flex-shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-[#1e130a] text-sm uppercase tracking-wide">
                      {principle.title}
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-[#2c1d12] pl-8 leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* ILLUMINATED COLOPHON / FOOTER SEAL */}
        <footer className="relative pt-6 border-t-2 border-[#8b6528]/40 text-center space-y-2">
          <div className="text-xs text-[#8b6528] font-bold tracking-widest uppercase">
            ☩ Sigillum Domus • In Sanguine et Ferro ☩
          </div>
          <p className="text-[11px] text-[#715c47] italic">
            "No banner flies higher than an unbroken oath."
          </p>
        </footer>

      </article>

    </div>
  );
}
