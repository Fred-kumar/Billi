// ════════════════════════════════════════════════════════════════════
//  ✦  BIRTHDAY TRIBUTE V3  —  Light Premium Reverie
//  Theme: Light Premium · Cream × Rose Gold × Deep Plum
//  Features: Bouquet Maker, Hinglish Typewriter, Cake Blow, Music
// ════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { X, ChevronDown, Heart, Sparkles, Music2 } from "lucide-react";

const CONFIG = {
  name:       "Maleeha",
  year:       "2000",
  city:       "Noida",
  date:       "26th April",
  musicUrl:   "/assets/happy-birthday.mp3",   
  noidaPhoto: "",   
};

const C = {
  bg:         "#FDFBF7", bgCard:     "#FFFFFF", bgDeep:     "#F5F0E6",   
  roseGold:   "#D48C95", roseLight:  "#F3D9DC", roseDark:   "#9E5B65",   
  champagne:  "#E8C99A", champLight: "#FDF5E6", lavender:   "#C4B0D4",   
  lavLight:   "#F2EBF7", cream:      "#2D1B2E", muted:      "#6E5C62",   
  faint:      "#E8DADB", fainter:    "#F5ECEE", heartGlow:  "rgba(212,140,149,0.28)",
};

const HISTORICAL_EVENTS = [
  { year: "1564", text: "Shakespeare Baptized — the universe began writing its finest stories." },
  { year: "1937", text: "Guernica Unveiled — a single canvas holding the world's emotions." },
  { year: "1986", text: "Chernobyl Disaster — altering how humanity understood raw power." },
];

const TRANSITION_LINE = `But in ${CONFIG.year}, the most important event happened…`;

const FLOWERS = [
  { id: "roses", emoji: "🌹", name: "Midnight Roses", note: "Passion, depth, and a love that burns quietly.", accentColor: C.roseGold, glowColor: "rgba(212,140,149,0.35)", bg: "#FFF" },
  { id: "lilies", emoji: "🌸", name: "Blush Lilies", note: "Innocence in full bloom — soft and forever pure.", accentColor: C.lavender, glowColor: "rgba(196,176,212,0.28)", bg: "#FFF" },
  { id: "sunflowers", emoji: "🌻", name: "Golden Sunflowers", note: "Joy that turns its face toward your light.", accentColor: "#DDA754", glowColor: "rgba(232,201,154,0.30)", bg: "#FFF" },
  { id: "orchids", emoji: "🪷", name: "Pink Orchids", note: "Rare, extraordinary — a mirror of who you are.", accentColor: C.roseLight, glowColor: "rgba(232,180,186,0.30)", bg: "#FFF" },
  { id: "lavender", emoji: "💜", name: "Wild Lavender", note: "Dreams pressed into petals, peace carried in fragrance.", accentColor: C.lavLight, glowColor: "rgba(221,208,234,0.28)", bg: "#FFF" },
  { id: "peonies", emoji: "🌺", name: "Lush Peonies", note: "Extravagant beauty — the way you fill every room.", accentColor: "#E8A0A8", glowColor: "rgba(232,160,168,0.30)", bg: "#FFF" },
];

const CHART_DATA = [
  { label: "Jan", h: 38 }, { label: "Feb", h: 42 }, { label: "Mar", h: 40 }, 
  { label: "Apr 20", h: 43 }, { label: `${CONFIG.date} ✦`, h: 999 }, { label: "May", h: 39 },
];

const HINGLISH_TEXT = "Aur is poore universe mein, Noida mein hua wo sabse bada moment... Jab tum aayi.";

function SectionLabel({ index, text }) {
  return <p style={{ fontFamily: "DM Mono, monospace", fontSize: 9, color: C.roseGold, letterSpacing: "0.34em", marginBottom: 20, fontWeight: 600 }}>0{index} — {text.toUpperCase()}</p>;
}

function BouquetModal({ selectedFlowers, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(253,251,247,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ scale: 0.85, opacity: 0, y: 36 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}
        style={{ textAlign: "center", padding: "40px", maxWidth: 500, width: "90%", background: C.bgCard, border: `1px solid ${C.faint}`, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.08)", position: "relative" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "32px", color: C.cream, marginBottom: 10 }}>Your Bouquet</h2>
        <p style={{ fontFamily: "DM Mono, monospace", fontSize: 9, color: C.muted, letterSpacing: "0.2em", marginBottom: 24 }}>CRAFTED JUST FOR YOU</p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
          <img src="/assets/realistic-bouquet.png" alt="A beautiful bouquet" style={{ width: "100%", maxHeight: "300px", objectFit: "contain", marginBottom: "20px" }} />
        </motion.div>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "18px", fontStyle: "italic", color: C.muted, marginBottom: 30 }}>"Every petal holds a whisper meant only for you. Happy Birthday."</p>
        <button onClick={onClose} style={{ background: C.roseGold, color: "#FFF", border: "none", padding: "12px 30px", borderRadius: 30, cursor: "pointer", fontFamily: "DM Mono, monospace", fontSize: 10, letterSpacing: "0.2em" }}>ACCEPT WITH LOVE</button>
      </motion.div>
    </motion.div>
  );
}

function HinglishTypewriter({ trigger }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const idxRef = useRef(0);
  useEffect(() => {
    if (!trigger || started) return;
    setStarted(true);
    const timer = setInterval(() => {
      if (idxRef.current < HINGLISH_TEXT.length) {
        setDisplayed(HINGLISH_TEXT.slice(0, idxRef.current + 1));
        idxRef.current++;
      } else { clearInterval(timer); }
    }, 48);
    return () => clearInterval(timer);
  }, [trigger, started]);
  if (!trigger) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
      style={{ marginTop: 36, padding: "24px 28px", background: C.bgDeep, border: `1px solid ${C.faint}`, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: C.roseGold }} />
      <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "20px", fontStyle: "italic", color: C.cream, paddingLeft: 16 }}>{displayed}</p>
    </motion.div>
  );
}
export default function BirthdayTributeV3() {
  const [heroPhase, setHeroPhase]           = useState(0);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [currentLine, setCurrentLine]       = useState("");
  const [charIdx, setCharIdx]               = useState(0);
  const [eventIdx, setEventIdx]             = useState(0);
  const [transitionText, setTransitionText] = useState("");
  const [transitionChar, setTransitionChar] = useState(0);
  const [showMain, setShowMain]             = useState(false);
  const [selectedIds, setSelectedIds]       = useState(new Set());
  const [bouquetOpen, setBouquetOpen]       = useState(false);
  const [noidaTrigger, setNoidaTrigger]     = useState(false);
  const [hinglishTrigger, setHinglishTrigger] = useState(false);
  const [musicPlaying, setMusicPlaying]     = useState(false);
  const [blowStep, setBlowStep]             = useState(0);
  const [cakeSliced, setCakeSliced]         = useState(false);

  const audioRef = useRef(null);
  const noidaRef = useRef(null);

  const startMusic = useCallback(() => {
    if (audioRef.current && !musicPlaying) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {});
    }
  }, [musicPlaying]);

  useEffect(() => {
    if (heroPhase !== 0) return;
    const ev = HISTORICAL_EVENTS[eventIdx];
    const full = `${ev.year}  —  ${ev.text}`;
    if (charIdx < full.length) {
      const t = setTimeout(() => { setCurrentLine((p) => p + full[charIdx]); setCharIdx((c) => c + 1); }, 34);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setCompletedEvents((p) => [...p, full]);
        setCurrentLine(""); setCharIdx(0);
        if (eventIdx < HISTORICAL_EVENTS.length - 1) setEventIdx((p) => p + 1);
        else setHeroPhase(1);
      }, 900);
      return () => clearTimeout(t);
    }
  }, [heroPhase, eventIdx, charIdx]);

  useEffect(() => {
    if (heroPhase !== 1) return;
    if (transitionChar < TRANSITION_LINE.length) {
      const t = setTimeout(() => { setTransitionText((p) => p + TRANSITION_LINE[transitionChar]); setTransitionChar((p) => p + 1); }, 42);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setHeroPhase(2), 500); return () => clearTimeout(t);
    }
  }, [heroPhase, transitionChar]);

  useEffect(() => {
    if (heroPhase !== 2) return;
    const t = setTimeout(() => setHeroPhase(3), 1700); return () => clearTimeout(t);
  }, [heroPhase]);

  useEffect(() => {
    if (!noidaRef.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNoidaTrigger(true);
        setTimeout(() => setHinglishTrigger(true), 1800);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(noidaRef.current);
    return () => obs.disconnect();
  }, [showMain]);

  const toggleFlower = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleCakeBlow = () => {
    if (blowStep === 0) { setBlowStep(1); } 
    else if (blowStep === 1) {
      setBlowStep(2);
      setTimeout(() => { setCakeSliced(true); startMusic(); }, 800);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Mono:wght@300;400;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.bg}; color: ${C.cream}; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        @keyframes flickerNormal { 0%,100% { transform: scaleY(1) scaleX(1); opacity: 1; } 50% { transform: scaleY(1.1) scaleX(0.9); opacity: 0.9; } }
        @keyframes flickerStrong { 0%,100% { transform: scaleY(0.7) scaleX(1.3) translateX(0px); opacity: 0.6; } 50% { transform: scaleY(1.4) scaleX(0.6) translateX(-4px); opacity: 1; } }
        .flame-normal { animation: flickerNormal 0.2s infinite; }
        .flame-strong { animation: flickerStrong 0.1s infinite; }
        @keyframes sliceForward { 0% { transform: translateX(0) translateY(0) scale(1) rotate(0deg); } 100% { transform: translateX(25px) translateY(-30px) scale(1.3) rotate(-10deg); } }
        .anim-slice { animation: sliceForward 1s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }
      `}</style>
      {CONFIG.musicUrl && <audio ref={audioRef} src={CONFIG.musicUrl} loop preload="auto" />}
      <AnimatePresence>
        {!showMain && (
          <motion.section exit={{ opacity: 0, transition: { duration: 0.9 } }} style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: C.bg }}>
            <div style={{ maxWidth: 720, width: "100%", textAlign: "center" }}>
              <div style={{ marginBottom: 48 }}>
                {completedEvents.map((line, i) => ( <p key={i} style={{ fontFamily: "DM Mono, monospace", fontSize: "12px", color: C.muted, marginBottom: 10 }}>{line}</p> ))}
                {heroPhase === 0 && <p style={{ fontFamily: "DM Mono, monospace", fontSize: "12px", color: C.muted }}>{currentLine}</p>}
              </div>
              {heroPhase >= 1 && <p style={{ fontFamily: "DM Mono, monospace", fontSize: "13px", color: C.roseDark, marginBottom: 40 }}>{heroPhase === 1 ? transitionText : TRANSITION_LINE}</p>}
              <AnimatePresence>
                {heroPhase >= 2 && ( <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }} style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(50px, 10vw, 100px)", color: C.cream, marginBottom: 8 }}>{CONFIG.name}</motion.h1> )}
              </AnimatePresence>
              <AnimatePresence>
                {heroPhase >= 3 && ( <motion.button initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1.0 }} onClick={() => { setShowMain(true); }} style={{ marginTop: 40, background: C.roseGold, color: "#fff", border: "none", padding: "12px 30px", borderRadius: 30, cursor: "pointer", fontFamily: "DM Mono, monospace", fontSize: 10, letterSpacing: "0.2em" }}>BEGIN THE JOURNEY</motion.button> )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showMain && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6 }}>
            <section ref={noidaRef} style={{ minHeight: "100vh", padding: "80px 20px", display: "flex", flexDirection: "column", alignItems: "center", borderBottom: `1px solid ${C.faint}` }}>
              <div style={{ maxWidth: 740, width: "100%", textAlign: "center" }}>
                <SectionLabel index={1} text="The Space Journey" />
                <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: "40px", color: C.cream }}>From the Stars to <em style={{ color: C.roseGold }}>{CONFIG.city}</em></h2>
                <div style={{ width: "100%", aspectRatio: "16/9", background: C.bgDeep, border: `1px solid ${C.faint}`, marginTop: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p style={{ fontFamily: "DM Mono", fontSize: 10, color: C.roseDark }}>[ GOOGLE EARTH VIDEO PLACEHOLDER ]</p>
                </div>
                <HinglishTypewriter trigger={hinglishTrigger} />
              </div>
            </section>
            <section style={{ minHeight: "100vh", padding: "80px 20px", borderBottom: `1px solid ${C.faint}` }}>
              <div style={{ maxWidth: 1060, margin: "0 auto", textAlign: "center" }}>
                <SectionLabel index={2} text="The Flower Boutique" />
                <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: "40px", color: C.cream, marginBottom: 40 }}>Build Your Bouquet</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
                  {FLOWERS.map((flower) => {
                    const isSelected = selectedIds.has(flower.id);
                    return (
                      <button key={flower.id} onClick={() => toggleFlower(flower.id)} style={{ background: C.bgCard, border: `2px solid ${isSelected ? C.roseGold : C.faint}`, padding: "30px", borderRadius: 12, cursor: "pointer", textAlign: "center", transition: "all 0.3s" }}>
                        <div style={{ fontSize: 40, marginBottom: 15 }}>{flower.emoji}</div>
                        <h3 style={{ fontFamily: "Cormorant Garamond", fontSize: 22, color: C.cream }}>{flower.name}</h3>
                      </button>
                    );
                  })}
                </div>
                {selectedIds.size > 0 && ( <button onClick={() => setBouquetOpen(true)} style={{ marginTop: 40, background: C.roseGold, color: "#fff", border: "none", padding: "15px 40px", borderRadius: 30, cursor: "pointer", fontFamily: "DM Mono", fontSize: 12, letterSpacing: "0.2em" }}>CREATE MY BOUQUET</button> )}
              </div>
            </section>
            <section style={{ minHeight: "100vh", padding: "80px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${C.faint}`, background: C.bgDeep }}>
              <div style={{ textAlign: "center" }}>
                <SectionLabel index={3} text="Make a Wish" />
                <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: "40px", color: C.cream, marginBottom: 40 }}>Happy Birthday, {CONFIG.name}</h2>
                <div style={{ position: "relative", margin: "0 auto 40px", display: "inline-block" }}>
                  {blowStep < 2 && ( <div style={{ position: "absolute", top: -35, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}> <div className={blowStep === 1 ? "flame-strong" : "flame-normal"} style={{ width: 12, height: 25, background: "#FFA500", borderRadius: "50% 50% 20% 20%", boxShadow: "0 0 15px #FF8C00" }} /> <div style={{ width: 8, height: 25, background: "#FFF", border: "1px solid #CCC" }} /> </div> )}
                  <img src="/assets/birthday-cake.png" alt="Cake" className={cakeSliced ? "anim-slice" : ""} style={{ width: 200, height: "auto" }} />
                </div>
                <div>
                  {blowStep === 0 && ( <button onClick={handleCakeBlow} style={{ padding: "12px 35px", background: C.roseGold, color: "#fff", border: "none", borderRadius: 30, fontSize: 14, cursor: "pointer" }}>Blow the candle! 💨</button> )}
                  {blowStep === 1 && ( <button onClick={handleCakeBlow} style={{ padding: "12px 35px", background: C.roseDark, color: "#fff", border: "none", borderRadius: 30, fontSize: 14, cursor: "pointer" }}>Thoda aur zor se... 💪</button> )}
                  {blowStep === 2 && ( <p style={{ fontFamily: "Cormorant Garamond", fontSize: 24, color: C.roseDark, fontStyle: "italic" }}>Wish granted! 🌟 Yeh pehla piece tumhare liye!</p> )}
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence> {bouquetOpen && <BouquetModal selectedFlowers={FLOWERS.filter(f => selectedIds.has(f.id))} onClose={() => setBouquetOpen(false)} />} </AnimatePresence>
    </>
  );
                   }
  
