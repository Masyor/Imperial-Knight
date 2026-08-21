import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Scroll, Flame } from 'lucide-react';
import poemsData from '../data/campaignPoems.json';

interface Poem {
  id: string;
  title: string;
  body: string | string[];
}

export default function CampaignPoems() {
  const poems: Poem[] = poemsData;

  return (
    <div id="poems-section" className="space-y-8 w-full max-w-5xl mx-auto px-4 md:px-6">
      
      {/* SECTION HEADER */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold font-serif uppercase tracking-widest text-[#d4af37] gold-glow flex items-center justify-center gap-3">
          <BookOpen className="w-6 h-6 text-[#d4af37]" />
          <span>The Canticles of the March</span>
        </h2>
        <p className="text-sm text-[#8e8577] max-w-xl mx-auto font-serif italic">
          &ldquo;Let the drumbeat fade and the engine rest,<br />while we sing of the shields that withstood the test.&rdquo;
        </p>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent mx-auto"></div>
      </div>

      {/* POEMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {poems.map((poem, index) => {
          return (
            <motion.div
              key={poem.id}
              id={`poem-card-${poem.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="worn-parchment rounded-tl-[24px] rounded-tr-[16px] rounded-bl-[14px] rounded-br-[22px] p-6 md:p-8 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Faint watermark corner decorations */}
              <div className="absolute top-4 left-4 text-[#3e2c17]/15 font-serif select-none pointer-events-none text-xl">✠</div>
              <div className="absolute top-4 right-4 text-[#3e2c17]/15 font-serif select-none pointer-events-none text-xl">✠</div>
              <div className="absolute bottom-4 left-4 text-[#3e2c17]/15 font-serif select-none pointer-events-none text-xl">✠</div>
              <div className="absolute bottom-4 right-4 text-[#3e2c17]/15 font-serif select-none pointer-events-none text-xl">✠</div>

              {/* Faint Red Seal Watermark in the background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-950/5 text-7xl select-none font-bold pointer-events-none font-serif">
                 
              </div>

              <div className="space-y-4">
                {/* Scroll icon header */}
                <div className="flex items-center justify-between border-b border-[#211409]/10 pb-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#523d24] font-serif font-semibold tracking-wider">
                    <Scroll className="w-3.5 h-3.5" />
                    <span>CANTICLE {index + 1}</span>
                  </div>
                  <Flame className="w-3 h-3 text-red-800/40 candle-glow" />
                </div>

                {/* Poem Title */}
                <h3 className="text-lg md:text-xl font-bold canticle-script text-[#211409] tracking-wide text-center">
                  {poem.title}
                </h3>

                {/* Poem Body (Preserves newlines with whitespace-pre-line) */}
                <p className="text-[#1f130a] text-sm md:text-base leading-relaxed canticle-script text-center whitespace-pre-line font-medium select-text py-2">
                  {Array.isArray(poem.body) ? poem.body.join('\n') : poem.body}
                </p>
              </div>

              {/* Small scroll signature marking at bottom */}
              <div className="pt-4 border-t border-[#211409]/5 flex justify-center text-[10px] text-[#523d24]/60 font-serif tracking-widest font-bold uppercase">
                ✦ RECORDED IN EXILE ✦
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
