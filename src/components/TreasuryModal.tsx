import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowLeft,
  Scroll,
  Coins
} from 'lucide-react';
import treasuryData from '../data/treasury.json';

interface TreasuryModalProps {
  onBackToGate?: () => void;
}

export default function TreasuryModal({ onBackToGate }: TreasuryModalProps) {
  const { total, ledger } = treasuryData;

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
            <span className="text-[11px] text-[#8b6528] italic">Wing: Fiscus Regis</span>
          </div>
        )}

        {/* HEADER */}
        <header className="relative text-center pb-5 border-b-2 border-[#8b6528]/40 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#ebdcb8] border border-[#8b6528]/60 text-[#8b1e1e] text-xs font-bold uppercase tracking-widest shadow-xs">
            <span>☩</span>
            <span>Fiscus Regis • Feudal Treasury</span>
            <span>☩</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-wider text-[#1e130a] uppercase drop-shadow-xs">
            The Treasury
          </h1>

          <p className="text-xs md:text-sm text-[#8b1e1e] font-semibold italic max-w-lg mx-auto">
            Official Balance & Transaction Chronicle of the House
          </p>

          {/* Grand Total Vault Balance Display */}
          <div className="p-5 bg-[#ede1c4]/95 border-2 border-[#8b6528]/50 rounded-lg shadow-sm max-w-md mx-auto space-y-1 mt-2">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8b6528]">
              Total Treasury Balance
            </span>
            <div className="text-3xl md:text-4xl font-black text-[#1e130a] tracking-tight">
              {total}
            </div>
            <p className="text-[11px] text-[#5c4938] italic">
              Denominated in F%
            </p>
          </div>
        </header>

        {/* LEDGER SECTION */}
        <div className="relative z-10 space-y-4 text-xs md:text-sm text-[#2c1d12] leading-relaxed">
          <div className="flex items-center justify-between text-xs text-[#8b6528] pb-1 border-b border-[#8b6528]/30">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#8b1e1e]">
              <Scroll className="w-3.5 h-3.5" />
              <span>☩ The Feudal Ledger</span>
            </span>
            <span className="italic">{ledger.length} Recorded Entries</span>
          </div>

          <div className="space-y-3 pt-1">
            {ledger.map((entry) => {
              const isPositive = entry.type === 'positive' || entry.amount.startsWith('+');

              return (
                <div
                  key={entry.id}
                  className="p-3.5 md:p-4 bg-[#ede1c4]/75 border border-[#8b6528]/35 rounded-lg shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#ebd9b2] border border-[#8b6528]/40 text-[10px] font-bold uppercase tracking-wider text-[#8b6528]">
                        {entry.date}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-[#1e130a] font-medium leading-snug">
                      {entry.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                    <div className={`flex items-center gap-1 font-bold text-sm md:text-base px-3 py-1 rounded border font-mono ${
                      isPositive 
                        ? 'bg-[#e4edd8] border-[#6b8c4c] text-[#2c521a]' 
                        : 'bg-[#f4dede] border-[#a85c5c] text-[#8b1e1e]'
                    }`}>
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4 text-[#2c521a]" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-[#8b1e1e]" />
                      )}
                      <span>{entry.amount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="relative pt-6 border-t-2 border-[#8b6528]/40 text-center space-y-1">
          <div className="text-xs text-[#8b6528] font-bold tracking-widest uppercase">
            ☩ Aurum et Ferrum • Scriptum Fiscus Regis ☩
          </div>
        </footer>

      </article>

    </div>
  );
}
