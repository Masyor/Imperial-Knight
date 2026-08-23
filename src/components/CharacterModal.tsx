import React from 'react';
import { 
  Shield, 
  Sword, 
  Cpu, 
  Sparkles, 
  Scroll, 
  Feather, 
  Crosshair,
  Award,
  Heart,
  Crown
} from 'lucide-react';
import characterData from '../data/character.json';

export default function CharacterModal() {
  const {
    name,
    titles,
    gender,
    age,
    height,
    weight,
    physicalAppearance,
    armour,
    weaponry,
    backstory,
    personality,
    talentsAndAbilities,
    augmentations
  } = characterData;

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
            <span>Liber Nobilis • Current Lord Folio</span>
            <span>☩</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-wider text-[#1e130a] uppercase drop-shadow-xs">
            {name}
          </h1>

          <p className="text-sm md:text-base text-[#8b1e1e] font-semibold italic">
            {titles}
          </p>

          {/* Illuminated miniature crest */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#8b6528] to-transparent"></span>
            <div className="w-9 h-9 rounded-full bg-[#ebd9b2] border-2 border-[#8b6528] flex items-center justify-center text-[#8b1e1e] shadow-inner">
              <Crown className="w-5 h-5 text-[#8b6528]" />
            </div>
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#8b6528] to-transparent"></span>
          </div>
        </header>

        {/* STACKED MANUSCRIPT BODY (Vertical single column layout for flexible content length) */}
        <div className="relative z-10 space-y-8 text-sm md:text-base leading-relaxed text-[#2c1d12]">
          
          {/* SECTION: VITALS / PHYSIQUE REGISTRY */}
          <section className="bg-[#ede1c4]/70 border border-[#8b6528]/35 rounded p-4 md:p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#8b1e1e] border-b border-[#8b6528]/30 pb-2">
              <span className="font-bold text-xs uppercase tracking-widest">
                ☩ I. Stature & Vitals Registry
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-2.5 bg-[#f6efe0] border border-[#c4b392] rounded">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8b6528]">Gender</span>
                <span className="font-bold text-[#1e130a]">{gender}</span>
              </div>
              <div className="p-2.5 bg-[#f6efe0] border border-[#c4b392] rounded">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8b6528]">Age</span>
                <span className="font-bold text-[#1e130a]">{age}</span>
              </div>
              <div className="p-2.5 bg-[#f6efe0] border border-[#c4b392] rounded">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8b6528]">Height</span>
                <span className="font-bold text-[#1e130a]">{height}</span>
              </div>
              <div className="p-2.5 bg-[#f6efe0] border border-[#c4b392] rounded">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8b6528]">Weight</span>
                <span className="font-bold text-[#1e130a]">{weight}</span>
              </div>
            </div>
          </section>

          {/* SECTION: PHYSICAL APPEARANCE */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-[#8b1e1e] border-b border-[#8b6528]/40 pb-1.5">
              <span className="text-sm">⚜</span>
              <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#8b1e1e]">
                II. Physical Appearance & Countenance
              </h2>
            </div>
            <p className="text-[#2c1d12] text-justify first-letter:text-3xl first-letter:font-black first-letter:text-[#8b1e1e] first-letter:float-left first-letter:mr-2 first-letter:leading-none">
              {physicalAppearance}
            </p>
          </section>

          {/* SECTION: PERSONALITY */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-[#8b1e1e] border-b border-[#8b6528]/40 pb-1.5">
              <span className="text-sm">⚜</span>
              <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#8b1e1e]">
                III. Personality, Temperament & Vows
              </h2>
            </div>
            <p className="text-[#2c1d12] text-justify">
              {personality}
            </p>
          </section>

          {/* SECTION: ARMOUR & PROTECTIVE SUIT */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-[#8b1e1e] border-b border-[#8b6528]/40 pb-1.5">
              <Shield className="w-4 h-4 text-[#8b1e1e]" />
              <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#8b1e1e]">
                IV. Panoply of Armour & War Carapace
              </h2>
            </div>
            <div className="p-4 bg-[#ede1c4]/60 border-l-4 border-[#8b1e1e] rounded-r text-[#2c1d12]">
              <p>{armour}</p>
            </div>
          </section>

          {/* SECTION: WEAPONRY & SIDEARMS */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-[#8b1e1e] border-b border-[#8b6528]/40 pb-1.5">
              <Sword className="w-4 h-4 text-[#8b1e1e]" />
              <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#8b1e1e]">
                V. Holy Weaponry & Relic Arms
              </h2>
            </div>
            <div className="p-4 bg-[#ede1c4]/60 border-l-4 border-[#8b6528] rounded-r text-[#2c1d12]">
              <p>{weaponry}</p>
            </div>
          </section>

          {/* SECTION: BACKSTORY & LINEAGE CHRONICLE */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-[#8b1e1e] border-b border-[#8b6528]/40 pb-1.5">
              <Feather className="w-4 h-4 text-[#8b1e1e]" />
              <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#8b1e1e]">
                VI. Chronicle of Origin & The Exiled Path
              </h2>
            </div>
            <div className="p-5 bg-[#f6efe0] border border-[#8b6528]/35 rounded shadow-xs">
              <p className="text-[#2c1d12] text-justify leading-relaxed first-letter:text-4xl first-letter:font-black first-letter:text-[#8b1e1e] first-letter:float-left first-letter:mr-2.5 first-letter:leading-none">
                {backstory}
              </p>
            </div>
          </section>

          {/* SECTION: TALENTS AND MARTIAL ABILITIES */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-[#8b1e1e] border-b border-[#8b6528]/40 pb-1.5">
              <Crosshair className="w-4 h-4 text-[#8b1e1e]" />
              <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#8b1e1e]">
                VII. Martial Talents & Feats of Arms
              </h2>
            </div>
            <ul className="space-y-2 pt-1">
              {talentsAndAbilities.map((talent, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[#2c1d12]">
                  <span className="text-[#8b1e1e] font-bold">☩</span>
                  <span className="font-medium">{talent}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* SECTION: AUGMENTATIONS & CYBERNETICS */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-[#8b1e1e] border-b border-[#8b6528]/40 pb-1.5">
              <Cpu className="w-4 h-4 text-[#8b1e1e]" />
              <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#8b1e1e]">
                VIII. Throne Augmentations & Cybernetic Rites
              </h2>
            </div>
            <ul className="space-y-2 pt-1">
              {augmentations.map((aug, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[#2c1d12]">
                  <span className="text-[#8b6528] font-bold">⚜</span>
                  <span className="font-medium">{aug}</span>
                </li>
              ))}
            </ul>
          </section>

        </div>

        {/* ILLUMINATED COLOPHON / FOOTER SEAL */}
        <footer className="relative pt-6 border-t-2 border-[#8b6528]/40 text-center space-y-2">
          <div className="text-xs text-[#8b6528] font-bold tracking-widest uppercase">
            ☩ In Nomine Imperatoris • Scriptum in Sancto Registro ☩
          </div>
          <p className="text-[11px] text-[#715c47] italic">
            Thus is inscribed the living testament of the Current Lord of the Keep.
          </p>
        </footer>

      </article>

    </div>
  );
}
