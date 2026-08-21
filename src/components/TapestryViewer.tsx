import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Scroll, 
  Flame,
  ChevronDown
} from 'lucide-react';
import { TAPESTRY_PANELS } from '../data/tapestryData';
import { TapestryPanel } from '../types';

export default function TapestryViewer() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollRotation, setScrollRotation] = useState(0);
  const [fitScreen, setFitScreen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Translate vertical scroll wheel ticks into horizontal scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || fitScreen) return;

    const handleWheelScroll = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheelScroll, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheelScroll);
    };
  }, [fitScreen]);

  // Rotate sidebar rollers based on scroll coordinate
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    setScrollRotation(scrollLeft / 3);
  };

  // Observe active panel
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || fitScreen) return;

    const observerOptions = {
      root: scrollContainer,
      threshold: 0.5,
      rootMargin: "0px -100px 0px -100px"
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const panelId = entry.target.getAttribute('data-id');
          const index = TAPESTRY_PANELS.findIndex(p => p.id === panelId);
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    TAPESTRY_PANELS.forEach((panel) => {
      const el = panelRefs.current[panel.id];
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [fitScreen]);

  const scrollToPanel = (index: number) => {
    if (index < 0 || index >= TAPESTRY_PANELS.length) return;
    
    if (fitScreen) {
      setActiveIndex(index);
      return;
    }

    const panelId = TAPESTRY_PANELS[index].id;
    const panelElement = panelRefs.current[panelId];
    
    if (panelElement) {
      panelElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      setActiveIndex(index);
    }
  };

  const activePanel = TAPESTRY_PANELS[activeIndex];

  return (
    <div id="tapestry-section" className="space-y-6 w-full max-w-7xl mx-auto px-4 md:px-6">
      
      {/* 1. COMPACT DROPDOWN NAVIGATION */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#110f11] border border-[#2d2417] p-4 rounded-lg shadow-2xl relative z-40">
        
        <div className="space-y-1 text-center sm:text-left w-full sm:w-auto">
          <span className="text-[10px] text-[#a58652] uppercase tracking-widest font-semibold block font-serif">
            Chronicle Chapter Select
          </span>
          <p className="text-xs text-neutral-400 italic">Select a tapestry scroll point to smoothly wind the chronicle.</p>
        </div>

        {/* CUSTOM DROPDOWN SELECTOR */}
        <div className="relative w-full sm:w-80">
          <button
            type="button"
            id="btn-chapter-dropdown"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-3 rounded bg-[#171417] border border-[#d4af37]/40 text-[#d4af37] font-serif text-sm flex items-center justify-between transition-all hover:border-[#d4af37] focus:outline-none cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <Scroll className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span className="font-semibold truncate">{activePanel.title}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#8e8577] transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {dropdownOpen && (
              <>
                {/* Backdrop overlay */}
                <div className="fixed inset-0 z-30 cursor-default" onClick={() => setDropdownOpen(false)}></div>
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 left-0 mt-2 bg-[#171417] border-2 border-[#2d2417] rounded shadow-2xl z-40 max-h-64 overflow-y-auto custom-scrollbar"
                >
                  {TAPESTRY_PANELS.map((panel, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={panel.id}
                        id={`dropdown-item-${panel.id}`}
                        onClick={() => {
                          scrollToPanel(idx);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 font-serif text-xs md:text-sm border-b border-[#221c15] last:border-0 transition-all flex items-center justify-between ${
                          isActive 
                            ? 'bg-[#251e16] text-[#d4af37] font-bold' 
                            : 'text-[#8e8577] hover:bg-[#1f1a1f] hover:text-[#e1d5c3]'
                        }`}
                      >
                        <span className="truncate">{panel.title}</span>
                        {isActive && <Shield className="w-4 h-4 text-[#d4af37] fill-[#d4af37]/10 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* VIEW CONTROLS */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#d4af37] candle-glow" />
          <span className="text-xs text-[#a58652] tracking-wider uppercase font-serif">
            Tapestry Ribbon • {activeIndex + 1} of {TAPESTRY_PANELS.length}
          </span>
        </div>
        <button
          id="btn-toggle-fit"
          onClick={() => setFitScreen(!fitScreen)}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#131114] border border-[#2d2417] rounded text-xs text-[#8e8577] hover:text-[#d4af37] hover:border-[#d4af37] transition-all cursor-pointer"
        >
          {fitScreen ? (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Exhibition Scroll (Tile Mode)</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Fit Screen</span>
            </>
          )}
        </button>
      </div>

      {/* 2. TAPESTRY DISPLAY BOX (THE FRAME) */}
      <div className="relative">
        
        {/* Left Roller Sidebar */}
        {!fitScreen && (
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-r from-[#0a090b] via-[#201913] to-[#0c0907] border-r border-[#2d2417] z-20 flex flex-col justify-between items-center py-8 rounded-l shadow-2xl">
            <div style={{ transform: `rotate(${-scrollRotation}deg)` }} className="w-5 h-5 md:w-8 md:h-8 border-2 border-[#57452d] rounded-full flex items-center justify-center text-[#57452d] transition-transform duration-75">
              <div className="w-3 h-3 md:w-5 md:h-5 border border-dashed border-[#57452d] rounded-full animate-spin [animation-duration:20s] flex items-center justify-center">
                <span className="text-[6px] md:text-[8px]">⚙️</span>
              </div>
            </div>
            <div className="w-1 bg-gradient-to-r from-[#18120d] to-[#2b2015] flex-1 border-x border-[#3a2e1d]/50 my-4"></div>
            <div style={{ transform: `rotate(${-scrollRotation}deg)` }} className="w-5 h-5 md:w-8 md:h-8 border-2 border-[#57452d] rounded-full flex items-center justify-center text-[#57452d]">
              <div className="w-3 h-3 md:w-5 md:h-5 border border-dashed border-[#57452d] rounded-full animate-spin [animation-duration:20s] flex items-center justify-center">
                <span className="text-[6px] md:text-[8px]">⚙️</span>
              </div>
            </div>
          </div>
        )}

        {/* Right Roller Sidebar */}
        {!fitScreen && (
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-l from-[#0a090b] via-[#201913] to-[#0c0907] border-l border-[#2d2417] z-20 flex flex-col justify-between items-center py-8 rounded-r shadow-2xl">
            <div style={{ transform: `rotate(${scrollRotation}deg)` }} className="w-5 h-5 md:w-8 md:h-8 border-2 border-[#57452d] rounded-full flex items-center justify-center text-[#57452d]">
              <div className="w-3 h-3 md:w-5 md:h-5 border border-dashed border-[#57452d] rounded-full animate-spin [animation-duration:15s] flex items-center justify-center">
                <span className="text-[6px] md:text-[8px]">⚙️</span>
              </div>
            </div>
            <div className="w-1 bg-gradient-to-l from-[#18120d] to-[#2b2015] flex-1 border-x border-[#3a2e1d]/50 my-4"></div>
            <div style={{ transform: `rotate(${scrollRotation}deg)` }} className="w-5 h-5 md:w-8 md:h-8 border-2 border-[#57452d] rounded-full flex items-center justify-center text-[#57452d]">
              <div className="w-3 h-3 md:w-5 md:h-5 border border-dashed border-[#57452d] rounded-full animate-spin [animation-duration:15s] flex items-center justify-center">
                <span className="text-[6px] md:text-[8px]">⚙️</span>
              </div>
            </div>
          </div>
        )}

        {/* TAPESTRY DISPLAY STAGE */}
        <div className={`relative ${fitScreen ? 'px-0' : 'px-8 md:px-12'} overflow-hidden rounded-md border-y-8 border-x-4 border-[#1b1712] shadow-[0_20px_60px_rgba(0,0,0,0.95)]`}>
          
          {/* STATIC CONTINUOUS TOP & BOTTOM DASHED GOLD STITCHING */}
          {!fitScreen && (
            <>
              {/* Gold stitching line at top */}
              <div className="absolute top-4 left-8 md:left-12 right-8 md:right-12 h-0 border-t-2 border-dashed border-[#d4af37]/30 z-20 pointer-events-none"></div>
              {/* Gold stitching line at bottom */}
              <div className="absolute bottom-4 left-8 md:left-12 right-8 md:right-12 h-0 border-t-2 border-dashed border-[#d4af37]/30 z-20 pointer-events-none"></div>
            </>
          )}

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 left-10 md:left-14 -translate-y-1/2 z-30 pointer-events-none">
            <button
              id="btn-scroll-left"
              onClick={() => scrollToPanel(activeIndex - 1)}
              disabled={activeIndex === 0}
              className={`p-3 rounded-full bg-[#1b1712]/90 border border-[#d4af37]/30 text-[#d4af37] pointer-events-auto transition-all shadow-lg hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] cursor-pointer ${
                activeIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 right-10 md:right-14 -translate-y-1/2 z-30 pointer-events-none">
            <button
              id="btn-scroll-right"
              onClick={() => scrollToPanel(activeIndex + 1)}
              disabled={activeIndex === TAPESTRY_PANELS.length - 1}
              className={`p-3 rounded-full bg-[#1b1712]/90 border border-[#d4af37]/30 text-[#d4af37] pointer-events-auto transition-all shadow-lg hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] cursor-pointer ${
                activeIndex === TAPESTRY_PANELS.length - 1 ? 'opacity-20 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Exhibition Horizontal Scroller - Gap-0 for Seamless Continuous Tiling */}
          {!fitScreen ? (
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto gap-0 py-0 px-0 custom-scrollbar scroll-smooth bg-[#0d0a0e]"
              style={{ scrollbarWidth: 'thin' }}
            >
              {TAPESTRY_PANELS.map((panel, idx) => (
                <div
                  key={panel.id}
                  ref={(el) => { panelRefs.current[panel.id] = el; }}
                  data-id={panel.id}
                  className="shrink-0 w-[900px] h-[600px] relative overflow-hidden group select-none"
                >
                  {/* Tapestry Fabric Linen Texture Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:12px_12px] opacity-40 z-10 pointer-events-none"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#00000033] z-10 pointer-events-none"></div>

                  <img 
                    src={panel.image} 
                    alt={panel.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover select-none"
                  />
                  
                  {/* Stitched Latin Label Stamped at top of frame */}
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 px-5 py-1 bg-[#131114]/90 border border-[#d4af37]/25 rounded backdrop-blur-xs shadow-md">
                    <span className="text-xs font-serif italic text-[#d4af37] tracking-widest font-semibold uppercase">
                      * {panel.latin} *
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Fit Screen Mode */
            <div className="flex justify-center items-center bg-[#0d0a0e] py-6">
              <div className="w-full max-w-[900px] aspect-[3/2] relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activePanel.id}
                    src={activePanel.image}
                    alt={activePanel.title}
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover select-none"
                  />
                </AnimatePresence>

                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 px-5 py-1 bg-[#131114]/90 border border-[#d4af37]/25 rounded backdrop-blur-xs shadow-md">
                  <span className="text-xs font-serif italic text-[#d4af37] tracking-widest font-semibold uppercase">
                    * {activePanel.latin} *
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. WORN PARCHMENT LORE & CAPTION CONTAINER */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="worn-parchment rounded-tl-[24px] rounded-tr-[16px] rounded-bl-[14px] rounded-br-[22px] p-6 md:p-8 relative overflow-hidden">
          
          {/* Faint watermark corner decorations */}
          <div className="absolute top-4 left-4 text-[#3e2c17]/15 font-serif select-none pointer-events-none text-2xl">✠</div>
          <div className="absolute top-4 right-4 text-[#3e2c17]/15 font-serif select-none pointer-events-none text-2xl">✠</div>
          <div className="absolute bottom-4 left-4 text-[#3e2c17]/15 font-serif select-none pointer-events-none text-2xl">✠</div>
          <div className="absolute bottom-4 right-4 text-[#3e2c17]/15 font-serif select-none pointer-events-none text-2xl">✠</div>

          {/* Red ink wax seal-like decorative overlay */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-red-900/10 border-4 border-dashed border-red-900/20 rounded-full -rotate-12 pointer-events-none flex items-center justify-center text-[10px] text-red-950/20 font-serif font-bold">
            SIGILLUM SECRETI
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Latin Scroll banner */}
              <div className="text-center">
                <span className="inline-block text-[#271b0f] bg-[#fffcf5]/40 px-4 py-1 rounded border border-[#271b0f]/20 font-serif italic text-base md:text-lg tracking-widest font-black shadow-inner">
                  &ldquo;{activePanel.latin}&rdquo;
                </span>
              </div>

              {/* Panel Title */}
              <h3 className="text-xl md:text-2xl font-bold font-serif text-center text-[#211409] tracking-wide border-b border-[#211409]/10 pb-3">
                {activePanel.title}
              </h3>

              {/* Narrative Lore Text */}
              <p className="text-[#1f130a] text-base md:text-lg leading-relaxed text-justify first-letter:text-4xl first-letter:font-bold first-letter:font-serif first-letter:float-left first-letter:mr-2 first-letter:text-red-900 first-letter:mt-1 font-serif-eb select-text">
                {activePanel.lore}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Instruction alert */}
      {!fitScreen && (
        <div className="text-center text-xs text-[#8e8577]/60 italic font-serif py-1">
          💡 Scroll with your mouse wheel over the tapestry window, swipe, or use arrows to wind the woven chronicles.
        </div>
      )}
    </div>
  );
}
