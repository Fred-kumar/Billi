import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { X, ChevronDown, Heart, Sparkles, MapPin } from "lucide-react";

// ─── ✦ PERSONALIZATION ──────────────────────────────────────────
const CONFIG = {
  name: "Aisha",
  year: "1999",
  city: "Noida", // Updated to Noida
  date: "21st April",
  musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Yahan apna music link dalein
};

const FLOWERS = [
  { id: 1, name: "Midnight Roses", emoji: "🌹", color: "#C41E3A" },
  { id: 2, name: "Ethereal Lilies", emoji: "🌸", color: "#F8C8DC" },
  { id: 3, name: "Golden Sunflowers", emoji: "🌻", color: "#FFD700" },
  { id: 4, name: "Silk Tulips", emoji: "🌷", color: "#E0B0FF" }
];

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function BirthdayTribute() {
  const [showMain, setShowMain] = useState(false);
  const [selectedFlowers, setSelectedFlowers] = useState([]);
  const [showBouquet, setShowBouquet] = useState(false);
  const audioRef = useRef(null);

  // Music Play Logic
  const startExperience = () => {
    setShowMain(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Autoplay blocked or link broken"));
    }
  };

  const toggleFlower = (id) => {
    setSelectedFlowers(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ backgroundColor: "#1a0b2e", color: "#e5b4b2", minHeight: "100vh", fontFamily: "'Cormorant Garamond', serif" }}>
      <audio ref={audioRef} src={CONFIG.musicUrl} loop />

      <AnimatePresence>
        {!showMain ? (
          /* HERO SECTION */
          <motion.section 
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: "clamp(3rem, 10vw, 6rem)", fontWeight: 300, letterSpacing: "0.1em" }}
            >
              {CONFIG.name}
            </motion.h1>
            <button 
              onClick={startExperience}
              className="mt-12 px-8 py-3 border border-[#e5b4b2]/40 hover:bg-[#e5b4b2] hover:text-[#1a0b2e] transition-all tracking-widest text-xs"
            >
              BEGIN THE JOURNEY
            </button>
          </motion.section>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            
            {/* SECTION 1: THE NOIDA ZOOM */}
            <section className="min-h-screen flex flex-col justify-center items-center p-10">
              <h2 className="text-3xl mb-8 italic opacity-80">Tracing the stars to where you are...</h2>
              <div className="relative w-full max-w-4xl aspect-video bg-black/40 border border-[#e5b4b2]/20 rounded-lg overflow-hidden">
                {/* Yahan aap apna Video Tag dalenge baad mein */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <MapPin size={40} className="text-[#e5b4b2] animate-bounce" />
                  <p className="mt-4 tracking-widest">ZOOMING INTO {CONFIG.city.toUpperCase()}</p>
                </div>
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="mt-12 text-2xl text-center max-w-2xl font-light italic"
              >
                "Aur is poore universe mein, Noida mein hua wo sabse bada moment... Jab tum aayi."
              </motion.p>
            </section>

            {/* SECTION 2: DIGITAL BOUQUET MAKER */}
            <section className="min-h-screen flex flex-col justify-center items-center p-10 bg-[#2d1b4d]/30">
              <h2 className="text-4xl mb-4">Pick Her Flowers</h2>
              <p className="mb-12 opacity-60 tracking-widest">SELECT THE ONES THAT REMIND YOU OF HER</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {FLOWERS.map(f => (
                  <button 
                    key={f.id}
                    onClick={() => toggleFlower(f.id)}
                    className={`p-8 border transition-all ${selectedFlowers.includes(f.id) ? 'border-[#e5b4b2] bg-[#e5b4b2]/10' : 'border-[#e5b4b2]/20'}`}
                  >
                    <span className="text-4xl block mb-2">{f.emoji}</span>
                    <span className="text-xs tracking-tighter uppercase">{f.name}</span>
                  </button>
                ))}
              </div>

              {selectedFlowers.length > 0 && (
                <button 
                  onClick={() => setShowBouquet(true)}
                  className="px-10 py-4 bg-[#e5b4b2] text-[#1a0b2e] font-bold tracking-widest text-xs"
                >
                  CREATE HER BOUQUET ({selectedFlowers.length})
                </button>
              )}
            </section>

            {/* SECTION 3: THE WISH + HEART BEAT */}
            <section className="min-h-screen flex flex-col justify-center items-center text-center p-10 relative overflow-hidden">
              {/* VISUAL HEART BEAT */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center -z-10"
              >
                <Heart size={600} fill="#e5b4b2" stroke="none" />
              </motion.div>

              <Sparkles className="mb-6 opacity-50" />
              <h2 className="text-6xl md:text-8xl font-light mb-6">Happy Birthday,</h2>
              <h3 className="text-5xl md:text-7xl italic text-[#e5b4b2] mb-12">{CONFIG.name}</h3>
              <p className="max-w-xl text-xl opacity-80 leading-relaxed italic">
                May your year be as beautiful, elegant, and timeless as you are.
              </p>
              
              <div className="mt-20 flex gap-4 text-xs tracking-widest opacity-40">
                <span>{CONFIG.date.toUpperCase()}</span>
                <span>•</span>
                <span>ONLY FOR YOU</span>
              </div>
            </section>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouquet Modal Overlay */}
      <AnimatePresence>
        {showBouquet && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1a0b2e] flex flex-col items-center justify-center p-10"
          >
            <h2 className="text-3xl mb-12 italic">Your Digital Bouquet</h2>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {selectedFlowers.map(id => {
                const f = FLOWERS.find(x => x.id === id);
                return (
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    key={id} className="text-6xl"
                  >
                    {f.emoji}
                  </motion.span>
                );
              })}
            </div>
            <p className="text-center italic opacity-70 mb-12 max-w-md">"A collection of beauty for someone who outshines them all."</p>
            <button onClick={() => setShowBouquet(false)} className="text-xs tracking-[0.5em] opacity-50">CLOSE</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
         }
    
