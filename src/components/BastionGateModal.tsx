import React from 'react';
import { 
  DoorOpen, 
  Users, 
  Cpu, 
  Coins, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles,
  Crown
} from 'lucide-react';

interface BastionGateModalProps {
  onSelectDestination: (dest: 'barracks' | 'stables' | 'treasury') => void;
}

export default function BastionGateModal({ onSelectDestination }: BastionGateModalProps) {
  const waypoints = [
    {
      id: 'barracks' as const,
      title: 'The Barracks (Castra Auxilia)',
      latinSub: 'Quartiers of Armsmen, Retainers & Sacristan Enginseers',
      description: 'Review troop muster rolls, squad designations, equipment loadouts, and infantry battle readiness.',
      icon: Users,
      badge: '2 Active',
      color: '#8b1e1e'
    },
    {
      id: 'stables' as const,
      title: 'Knight Stables & Gantries (Sanctum Machina)',
      latinSub: 'Vaults of the Warmachines & Machine Spirits',
      description: 'Inspect the sacred Knight chassis, Machine Spirit temperaments, weapon loadouts, and pilot bonds.',
      icon: Cpu,
      badge: '1 Questoris • 1 Armiger',
      color: '#8b6528'
    },
    {
      id: 'treasury' as const,
      title: 'The Treasury (Fiscus Regis)',
      latinSub: 'Feudal Balance & Transaction Ledger',
      description: 'Audit the total house reserves and transaction history recorded in F%.',
      icon: Coins,
      badge: '80 F% in Vault',
      color: '#2a5a3b'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto text-[#2a1d13] font-serif">
      
      {/* ILLUMINATED WAYPOINT FOLIO CONTAINER */}
      <article className="relative bg-[#f4ecd8] border-[3px] border-[#6d4c1b] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.85)] p-6 md:p-9 space-y-6 overflow-hidden">
        
        {/* PARCHMENT TEXTURE & GOTHIC BORDERS */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#dfcfb0]/25 via-transparent to-[#bda67f]/35 pointer-events-none"></div>
        <div className="absolute inset-2 md:inset-3 border border-[#8b6528]/40 pointer-events-none rounded"></div>
        <div className="absolute inset-3 md:inset-4 border border-dashed border-[#8b6528]/25 pointer-events-none"></div>

        {/* CORNER ORNAMENTS */}
        <div className="absolute top-2 left-2 text-[#8b1e1e] text-xs select-none pointer-events-none">⚜</div>
        <div className="absolute top-2 right-2 text-[#8b1e1e] text-xs select-none pointer-events-none">⚜</div>
        <div className="absolute bottom-2 left-2 text-[#8b1e1e] text-xs select-none pointer-events-none">⚜</div>
        <div className="absolute bottom-2 right-2 text-[#8b1e1e] text-xs select-none pointer-events-none">⚜</div>

        {/* HEADER */}
        <header className="relative text-center pb-5 border-b-2 border-[#8b6528]/40 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#ebdcb8] border border-[#8b6528]/60 text-[#8b1e1e] text-xs font-bold uppercase tracking-widest shadow-xs">
            <span>☩</span>
            <span>Porta Profundis • Bastion Waypoints</span>
            <span>☩</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-wider text-[#1e130a] uppercase drop-shadow-xs">
            Bastion Sub-Wings
          </h1>

          <p className="text-xs md:text-sm text-[#8b6528] italic max-w-lg mx-auto">
            Beyond the heavy iron-bound gate lie the functional wings of the Keep. Select a destination to inspect the rolls.
          </p>
        </header>

        {/* WAYPOINT SELECTION CARDS (STACKED) */}
        <div className="relative z-10 space-y-4">
          {waypoints.map((waypoint) => {
            const Icon = waypoint.icon;
            return (
              <button
                key={waypoint.id}
                onClick={() => onSelectDestination(waypoint.id)}
                className="w-full text-left group relative p-4 md:p-5 bg-[#ede1c4]/80 hover:bg-[#faeed6] border-2 border-[#8b6528]/40 hover:border-[#8b1e1e] rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded bg-[#f6efe0] border border-[#8b6528]/60 flex items-center justify-center text-[#8b1e1e] group-hover:scale-105 transition-transform flex-shrink-0 shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base md:text-lg font-bold text-[#1e130a] group-hover:text-[#8b1e1e] transition-colors">
                        {waypoint.title}
                      </h2>
                    </div>
                    <p className="text-xs text-[#8b1e1e] font-semibold italic">
                      {waypoint.latinSub}
                    </p>
                    <p className="text-xs text-[#3a2818] leading-relaxed pt-0.5">
                      {waypoint.description}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#8b6528]/20">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#ebd9b2] border border-[#8b6528]/50 text-[10px] font-bold text-[#8b1e1e] uppercase tracking-wider">
                    {waypoint.badge}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#8b6528] group-hover:text-[#8b1e1e] transition-colors">
                    <span>Inspect</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* FOOTER */}
        <footer className="relative pt-4 border-t border-[#8b6528]/30 text-center text-xs text-[#715c47] italic">
          ☩ In Nomine Imperatoris • Bastion Command Registry ☩
        </footer>

      </article>

    </div>
  );
}
