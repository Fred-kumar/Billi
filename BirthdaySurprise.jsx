import { useState, useEffect, useRef, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES (injected via <style> tag)
// ─────────────────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; overflow: hidden; }
    ::-webkit-scrollbar { display: none; }

    .font-display { font-family: 'Cormorant Garamond', serif; }
    .font-body    { font-family: 'DM Sans', sans-serif; }

    /* ── Section Transition ── */
    @keyframes sectionFade {
      from { opacity: 0; transform: scale(1.02); }
      to   { opacity: 1; transform: scale(1); }
    }
    .section-enter { animation: sectionFade 0.7s cubic-bezier(0.4,0,0.2,1) forwards; }

    /* ── Fade Up ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .anim-fadeUp { animation: fadeUp 0.8s ease forwards; }

    /* ── Scale In (bouquet / prank) ── */
    @keyframes scaleIn {
      from { opacity: 0; transform: translateY(60px) scale(0.6); }
      to   { opacity: 1; transform: translateY(0)   scale(1); }
    }
    .anim-scaleIn { animation: scaleIn 0.9s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }

    /* ── Prank Pop ── */
    @keyframes prankPop {
      0%   { opacity: 0; transform: translateY(40px) scale(0.4) rotate(-6deg); }
      65%  { opacity: 1; transform: translateY(-12px) scale(1.08) rotate(2deg); }
      82%  { transform: translateY(4px) scale(0.97) rotate(-1deg); }
      100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
    }
    .anim-prankPop { animation: prankPop 0.75s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }

    /* ── Float ── */
    @keyframes float {
      0%,100% { transform: translateY(0px) rotate(0deg); }
      50%     { transform: translateY(-12px) rotate(1deg); }
    }
    .anim-float { animation: float 3.5s ease-in-out infinite; }

    /* ── Glow Pulse ── */
    @keyframes glowPulse {
      0%,100% { text-shadow: 0 0 18px rgba(255,205,90,0.5), 0 0 40px rgba(255,180,50,0.3); }
      50%     { text-shadow: 0 0 40px rgba(255,205,90,0.9), 0 0 80px rgba(255,180,50,0.6); }
    }
    .anim-glow { animation: glowPulse 2.5s ease-in-out infinite; }

    /* ── Shimmer text ── */
    @keyframes shimmer {
      0%   { background-position: -300% center; }
      100% { background-position:  300% center; }
    }
    .shimmer-gold {
      background: linear-gradient(90deg, #ffd700 0%, #fffacd 40%, #ffc200 60%, #ffd700 100%);
      background-size: 300% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    /* ── Candle Flicker Normal ── */
    @keyframes flickerNormal {
      0%,100% { transform: scaleY(1)   scaleX(1);   opacity: 1;   }
      20%     { transform: scaleY(1.07) scaleX(0.94); opacity: 0.95; }
      40%     { transform: scaleY(0.94) scaleX(1.05); opacity: 1;   }
      60%     { transform: scaleY(1.05) scaleX(0.97); opacity: 0.9; }
      80%     { transform: scaleY(0.97) scaleX(1.03); opacity: 1;   }
    }
    .flame-normal { animation: flickerNormal 0.25s ease-in-out infinite; }

    /* ── Candle Flicker Strong (blow step 1) ── */
    @keyframes flickerStrong {
      0%,100% { transform: scaleY(0.7) scaleX(1.3) translateX(0px);   opacity: 0.6; }
      25%     { transform: scaleY(1.4) scaleX(0.6) translateX(-4px);  opacity: 1;   }
      50%     { transform: scaleY(0.5) scaleX(1.5) translateX(5px);   opacity: 0.5; }
      75%     { transform: scaleY(1.3) scaleX(0.7) translateX(-3px);  opacity: 0.9; }
    }
    .flame-strong { animation: flickerStrong 0.1s ease-in-out infinite; }

    /* ── Cake Slice forward ── */
    @keyframes sliceForward {
      0%   { transform: translateX(0)    translateY(0)   scale(1)    rotate(0deg); }
      50%  { transform: translateX(20px) translateY(-60px) scale(1.25) rotate(-18deg); }
      100% { transform: translateX(35px) translateY(-50px) scale(1.2)  rotate(-12deg); }
    }
    .anim-slice { animation: sliceForward 0.9s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }

    /* ── Confetti fall ── */
    @keyframes confettiFall {
      0%   { transform: translateY(-8vh)  rotate(0deg);   opacity: 1; }
      100% { transform: translateY(108vh) rotate(640deg); opacity: 0; }
    }

    /* ── Button glow ring ── */
    @keyframes ringPulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(236,72,153,0.35), 0 6px 24px rgba(236,72,153,0.2); }
      50%     { box-shadow: 0 0 0 8px rgba(236,72,153,0),   0 6px 36px rgba(236,72,153,0.35); }
    }
    .btn-pulse { animation: ringPulse 2s ease-in-out infinite; }

    /* ── Gift lid flip ── */
    @keyframes lidFlip {
      from { transform: rotateX(0deg) translateY(0); }
      to   { transform: rotateX(-110deg) translateY(-20px); }
    }
    .anim-lid-flip { transform-origin: top center; animation: lidFlip 0.5s cubic-bezier(0.4,0,0.2,1) forwards; }

    /* Room brightness transition */
    .room-dark   { transition: background 2s ease; }
    .room-bright { transition: background 2s ease; }
  `}</style>
);

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const HISTORICAL_EVENTS = [
  {
    year: "1564",
    title: "Shakespeare Baptized",
    body: "The greatest storyteller in history was welcomed into this world — and the universe began writing its finest stories in ink and metaphor.",
  },
  {
    year: "1937",
    title: "Guernica Unveiled",
    body: "Picasso's Guernica debuted in Paris — a single canvas that held the entire anguish of the world, frozen into colour forever.",
  },
  {
    year: "1954",
    title: "Salk Vaccine Trials Begin",
    body: "Jonas Salk's polio vaccine trials launched — a day that would quietly save millions of lives across generations yet unborn.",
  },
  {
    year: "1986",
    title: "Chernobyl Disaster",
    body: "The reactor at Chernobyl failed — forever altering how humanity understood the raw, terrifying power it held in its hands.",
  },
];

const FLOWERS = [
  { id: 1, name: "Rose",          emoji: "🌹", accent: "#ff4d6d", bg: "rgba(255,77,109,0.12)"   },
  { id: 2, name: "Sunflower",     emoji: "🌻", accent: "#f59e0b", bg: "rgba(245,158,11,0.12)"   },
  { id: 3, name: "Tulip",         emoji: "🌷", accent: "#f472b6", bg: "rgba(244,114,182,0.12)"  },
  { id: 4, name: "Cherry Blossom",emoji: "🌸", accent: "#fb7185", bg: "rgba(251,113,133,0.12)"  },
  { id: 5, name: "Lily",          emoji: "💐", accent: "#a78bfa", bg: "rgba(167,139,250,0.12)"  },
  { id: 6, name: "Lavender",      emoji: "🪻", accent: "#7c3aed", bg: "rgba(124,58,237,0.12)"   },
];

const CHART_DATA = [
  { date: "Jan",    value: 10 },
  { date: "Feb",    value: 7  },
  { date: "Mar",    value: 14 },
  { date: "Apr 1",  value: 19 },
  { date: "Apr 10", value: 28 },
  { date: "Apr 20", value: 42 },
  { date: "Apr 26", value: 980 },
  { date: "May",    value: 22 },
  { date: "Jun",    value: 15 },
  { date: "Jul",    value: 11 },
  { date: "Aug",    value: 8  },
  { date: "Sep",    value: 13 },
  { date: "Oct",    value: 7  },
  { date: "Nov",    value: 5  },
  { date: "Dec",    value: 9  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CONFETTI  (pre-computed so Math.random() isn't called on every render)
// ─────────────────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ["#ff6b9d","#ffd700","#7c3aed","#06b6d4","#10b981","#f97316","#fb923c","#a3e635"];
const CONFETTI_PIECES = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  left:     Math.random() * 100,
  color:    CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  duration: 2.5 + Math.random() * 3.5,
  delay:    Math.random() * 6,
  size:     6 + Math.random() * 8,
  circle:   Math.random() > 0.5,
  rotate:   Math.random() * 360,
}));

const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {CONFETTI_PIECES.map((p) => (
      <div
        key={p.id}
        style={{
          position: "absolute",
          left: `${p.left}%`,
          top: 0,
          width:  p.size,
          height: p.size * 1.4,
          background: p.color,
          borderRadius: p.circle ? "50%" : "2px",
          transform: `rotate(${p.rotate}deg)`,
          animation: `confettiFall ${p.duration}s linear ${p.delay}s infinite`,
          opacity: 0.85,
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM TOOLTIP (Recharts)
// ─────────────────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const isSpecial = label === "Apr 26";
  return (
    <div
      className="px-4 py-3 rounded-2xl shadow-2xl border text-sm font-body"
      style={{
        background: isSpecial ? "rgba(30,0,20,0.95)" : "rgba(15,15,25,0.92)",
        border:     isSpecial ? "1px solid rgba(236,72,153,0.6)" : "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      <p className="text-white font-semibold mb-1">{label}</p>
      {isSpecial ? (
        <p style={{ color:"#f9a8d4", fontSize:"0.8rem", fontStyle:"italic" }}>
          Value: ∞ &nbsp;<span style={{ color:"#fda4af" }}>(Immeasurable)</span> ✨
        </p>
      ) : (
        <p style={{ color:"#6ee7b7" }}>Index: {payload[0].value}</p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CANDLE FLAME
// ─────────────────────────────────────────────────────────────────────────────
const Flame = ({ state }) => {
  if (state === "gone") return null;
  const cls = state === "strong" ? "flame-strong" : "flame-normal";
  return (
    <div className={`flex flex-col items-center ${cls}`} style={{ marginBottom: -2 }}>
      {/* Outer glow */}
      <div style={{
        width: 18, height: 36,
        background: "radial-gradient(ellipse at 50% 70%, rgba(255,120,0,0.6) 0%, transparent 75%)",
        position: "absolute",
        filter: "blur(6px)",
        top: -8,
      }} />
      {/* Core flame */}
      <div style={{
        width: 10, height: 28,
        background: "radial-gradient(ellipse at 50% 80%, #fff 0%, #ffe066 25%, #ff9800 60%, transparent 100%)",
        borderRadius: "60% 40% 40% 60% / 70% 70% 30% 30%",
        filter: "blur(0.5px)",
      }} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// NAV DOTS
// ─────────────────────────────────────────────────────────────────────────────
const NavDots = ({ section, go }) => (
  <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5">
    {[0,1,2,3,4].map((i) => (
      <button
        key={i}
        onClick={() => go(i)}
        aria-label={`Go to section ${i + 1}`}
        style={{
          width: 10, height: 10,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.6)",
          background: section === i ? "rgba(255,255,255,1)" : "transparent",
          transform: section === i ? "scale(1.25)" : "scale(1)",
          transition: "all 0.3s",
          cursor: "pointer",
          padding: 0,
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function BirthdaySurprise() {
  const [section, setSection]  = useState(0);
  const go = (s) => setSection(s);

  // ── Section 1 state ──
  const [visibleEvents, setVisibleEvents] = useState(0);
  const [showRevealBanner, setShowRevealBanner] = useState(false);
  const [showBirthText,    setShowBirthText]    = useState(false);
  const [showS1Btn,        setShowS1Btn]        = useState(false);

  // ── Section 2 state ──
  const [flowerCounts, setFlowerCounts] = useState(Array(6).fill(0)); // counts per flower type
  const [bouquetShown,  setBouquetShown]  = useState(false);

  // ── Section 4 state ──
  const [blowStep,   setBlowStep]   = useState(0);          // 0 unblown, 1 flickering, 2 out
  const [cakeSliced, setCakeSliced] = useState(false);
  const [roomBright, setRoomBright] = useState(false);

  // ── Section 5 state ──
  const [giftOpened,  setGiftOpened]  = useState(false);
  const [prankShown,  setPrankShown]  = useState(false);

  const audioRef = useRef(null);

  const totalFlowers = useMemo(() => flowerCounts.reduce((a,b) => a+b, 0), [flowerCounts]);

  // ── Section 1 animation sequence ──
  useEffect(() => {
    if (section !== 0) return;
    // reset
    setVisibleEvents(0); setShowRevealBanner(false); setShowBirthText(false); setShowS1Btn(false);
    const t = [];
    for (let i = 0; i < 4; i++) t.push(setTimeout(() => setVisibleEvents(i+1), 800 + i * 1700));
    t.push(setTimeout(() => setShowRevealBanner(true), 800 + 4 * 1700));
    t.push(setTimeout(() => setShowBirthText(true),    800 + 4 * 1700 + 1200));
    t.push(setTimeout(() => setShowS1Btn(true),        800 + 4 * 1700 + 3200));
    return () => t.forEach(clearTimeout);
  }, [section]);

  // ── Flower picker ──
  const addFlower = (idx) => {
    if (totalFlowers >= 15) return;
    setFlowerCounts(prev => { const n=[...prev]; n[idx]++; return n; });
  };

  // ── Blow candle ──
  const handleBlow = () => {
    if (blowStep === 0) { setBlowStep(1); }
    else if (blowStep === 1) {
      setBlowStep(2);
      setTimeout(() => { setRoomBright(true); setCakeSliced(true); }, 500);
      setTimeout(() => { if (audioRef.current) audioRef.current.play().catch(()=>{}); }, 900);
    }
  };

  // ── Gift open ──
  const openGift = () => {
    setGiftOpened(true);
    setTimeout(() => setPrankShown(true), 700);
  };

  // ── Derive candle flame state ──
  const flameState = blowStep === 0 ? "normal" : blowStep === 1 ? "strong" : "gone";

  return (
    <div style={{ width:"100vw", height:"100vh", overflow:"hidden", position:"relative" }}>
      <GlobalStyles />
      <NavDots section={section} go={go} />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — THE HISTORICAL PROLOGUE
      ══════════════════════════════════════════════════════════════ */}
      {section === 0 && (
        <div
          className="section-enter"
          style={{
            width:"100%", height:"100vh",
            background: "linear-gradient(160deg, #03000a 0%, #0d0118 50%, #060010 100%)",
            position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column", justifyContent: "center",
          }}
        >
          {/* Background video – only visible after reveal */}
          {showBirthText && (
            // 🔁 REPLACE src="/assets/earth-zoom.mp4" with your Google Earth Studio video
            <video
              src="/assets/earth-zoom.mp4"
              autoPlay muted loop playsInline
              style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.35 }}
            />
          )}

          {/* Starfield overlay */}
          <div style={{
            position:"absolute", inset:0, zIndex:1,
            background: "radial-gradient(ellipse at 70% 30%, rgba(100,40,200,0.18) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(180,90,0,0.12) 0%, transparent 50%)",
            pointerEvents:"none",
          }} />

          {/* Dark gradient base */}
          <div style={{
            position:"absolute", inset:0, zIndex:2,
            background: showBirthText
              ? "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 100%)"
              : "linear-gradient(to bottom, rgba(3,0,10,0.9) 0%, rgba(3,0,10,0.75) 100%)",
            transition: "background 2s ease",
          }} />

          <div style={{ position:"relative", zIndex:10, maxWidth: 740, margin:"0 auto", padding:"0 1.5rem", width:"100%" }}>

            {/* ── Events View ── */}
            {!showRevealBanner && (
              <>
                <p className="font-body" style={{ color:"rgba(255,200,80,0.55)", fontSize:"0.65rem", letterSpacing:"0.45em", textTransform:"uppercase", marginBottom:"2.5rem" }}>
                  April 26th — A Day the Cosmos Chose
                </p>

                <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
                  {HISTORICAL_EVENTS.map((ev, i) => (
                    <div
                      key={i}
                      style={{
                        display:"flex", alignItems:"flex-start", gap:"1.2rem",
                        opacity: visibleEvents > i ? 1 : 0,
                        transform: visibleEvents > i ? "translateY(0)" : "translateY(24px)",
                        transition: "opacity 0.8s ease, transform 0.8s ease",
                      }}
                    >
                      {/* Year pill */}
                      <div style={{ flexShrink:0, marginTop:2 }}>
                        <span className="font-display" style={{ color:"#fbbf24", fontSize:"clamp(1.3rem,4vw,2rem)", fontWeight:700 }}>{ev.year}</span>
                      </div>
                      {/* Divider */}
                      <div style={{ flexShrink:0, width:1, alignSelf:"stretch", background:"rgba(251,191,36,0.2)", margin:"4px 0" }} />
                      {/* Text */}
                      <div>
                        <p className="font-display" style={{ color:"rgba(255,230,140,0.9)", fontSize:"0.72rem", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"0.3rem" }}>{ev.title}</p>
                        <p className="font-display" style={{ color:"rgba(255,255,255,0.78)", fontSize:"clamp(0.95rem,2.8vw,1.15rem)", fontStyle:"italic", lineHeight:1.65 }}>{ev.body}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* And last but not the least */}
                {visibleEvents >= 4 && (
                  <div className="anim-fadeUp" style={{ marginTop:"2.5rem" }}>
                    <p className="font-display anim-glow" style={{ color:"#fde68a", fontSize:"clamp(1.3rem,5vw,2.1rem)", fontStyle:"italic" }}>
                      "And last but not the least..."
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ── Birth Reveal View ── */}
            {showRevealBanner && (
              <div style={{ textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:"1.5rem" }}>
                {showBirthText && (
                  <>
                    <div className="anim-scaleIn" style={{ lineHeight:1.2 }}>
                      <p className="font-display" style={{ color:"rgba(255,255,255,0.95)", fontSize:"clamp(2.2rem,10vw,5.5rem)", fontWeight:300 }}>
                        She was born
                      </p>
                      <p className="font-display anim-glow shimmer-gold" style={{ fontSize:"clamp(2.4rem,11vw,6rem)", fontStyle:"italic", fontWeight:600 }}>
                        on this very day
                      </p>
                      <p className="font-display" style={{ color:"rgba(255,255,255,0.7)", fontSize:"clamp(1.5rem,6vw,3rem)", fontWeight:300, marginTop:"0.5rem" }}>
                        in the year <span style={{ color:"#fcd34d" }}>2000</span>
                      </p>
                    </div>

                    {showS1Btn && (
                      <div className="anim-fadeUp" style={{ marginTop:"1rem" }}>
                        <button
                          onClick={() => go(1)}
                          className="font-body btn-pulse"
                          style={{
                            padding:"0.9rem 2.8rem",
                            background:"linear-gradient(135deg, #b45309, #d97706, #fbbf24)",
                            color:"#0a0000", fontWeight:700, borderRadius:999,
                            fontSize:"0.7rem", letterSpacing:"0.35em", textTransform:"uppercase",
                            border:"none", cursor:"pointer",
                          }}
                        >
                          Celebrate Her →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — CUSTOM BOUQUET BUILDER
      ══════════════════════════════════════════════════════════════ */}
      {section === 1 && (
        <div
          className="section-enter"
          style={{
            width:"100%", height:"100vh", overflow:"hidden",
            background: "linear-gradient(135deg, #fff0f5 0%, #fce7f3 45%, #fdf2ff 100%)",
            position:"relative", display:"flex", flexDirection:"column",
          }}
        >
          {/* Soft blobs */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
            background: "radial-gradient(circle at 15% 20%, rgba(251,207,232,0.5) 0%, transparent 45%), radial-gradient(circle at 85% 75%, rgba(216,180,254,0.35) 0%, transparent 45%)"
          }} />

          <div style={{ position:"relative", zIndex:10, flex:1, display:"flex", flexDirection:"column", maxWidth:620, margin:"0 auto", padding:"1.25rem 1rem", width:"100%", overflow:"auto" }}>

            {!bouquetShown ? (
              <>
                {/* Header */}
                <div style={{ textAlign:"center", marginBottom:"1rem" }}>
                  <p className="font-body" style={{ color:"#ec4899", fontSize:"0.62rem", letterSpacing:"0.4em", textTransform:"uppercase", marginBottom:"0.4rem" }}>For Maleeha 🌸</p>
                  <h2 className="font-display" style={{ color:"#4a0020", fontSize:"clamp(1.7rem,7vw,2.8rem)", lineHeight:1.1 }}>Build Her Bouquet</h2>
                  <p className="font-body" style={{ color:"#9d4b7a", fontSize:"0.78rem", marginTop:"0.4rem" }}>Tap flowers to add · Max 15</p>

                  {/* Count pill */}
                  <div style={{
                    display:"inline-flex", alignItems:"center", gap:8, marginTop:"0.75rem",
                    background:"rgba(255,255,255,0.75)", backdropFilter:"blur(8px)",
                    padding:"0.45rem 1.2rem", borderRadius:999, boxShadow:"0 2px 12px rgba(236,72,153,0.15)",
                  }}>
                    <span style={{ fontSize:"1.1rem" }}>💐</span>
                    <span className="font-body" style={{ color:"#be185d", fontWeight:600, fontSize:"0.82rem" }}>{totalFlowers} / 15 flowers selected</span>
                  </div>
                </div>

                {/* Flower grid */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.7rem", flex:1, overflow:"auto" }}>
                  {FLOWERS.map((fl, idx) => {
                    const cnt  = flowerCounts[idx];
                    const full = totalFlowers >= 15 && !cnt;
                    return (
                      <button
                        key={fl.id}
                        onClick={() => addFlower(idx)}
                        disabled={full}
                        style={{
                          position:"relative", display:"flex", flexDirection:"column",
                          alignItems:"center", justifyContent:"center",
                          padding:"clamp(0.7rem,3vw,1.3rem) 0.5rem",
                          borderRadius:20,
                          background: cnt ? fl.bg : "rgba(255,255,255,0.72)",
                          border: `2px solid ${cnt ? fl.accent : "rgba(236,72,153,0.15)"}`,
                          boxShadow: cnt ? `0 4px 20px ${fl.accent}30` : "0 2px 8px rgba(0,0,0,0.06)",
                          cursor: full ? "not-allowed" : "pointer",
                          opacity: full ? 0.38 : 1,
                          transition: "all 0.22s ease",
                          transform: "scale(1)",
                        }}
                        onMouseEnter={e => { if (!full) e.currentTarget.style.transform="scale(1.05)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}
                        onMouseDown={e  => { e.currentTarget.style.transform="scale(0.94)"; }}
                        onMouseUp={e    => { e.currentTarget.style.transform="scale(1.05)"; }}
                      >
                        {/* Count badge */}
                        {cnt > 0 && (
                          <div style={{
                            position:"absolute", top:8, right:8, width:22, height:22,
                            background: fl.accent, color:"#fff", borderRadius:"50%",
                            fontSize:"0.68rem", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center",
                            fontFamily:"'DM Sans',sans-serif", boxShadow:"0 2px 6px rgba(0,0,0,0.2)",
                          }}>{cnt}</div>
                        )}
                        {/*
                          🖼️ REPLACE the emoji below with:
                          <img src={`/assets/flowers/${fl.name.toLowerCase().replace(/ /g,'-')}.png`}
                               alt={fl.name} style={{ width:60, height:60, objectFit:"contain" }} />
                        */}
                        <span style={{ fontSize:"clamp(2.2rem,8vw,3rem)", lineHeight:1 }}>{fl.emoji}</span>
                        <span className="font-body" style={{ color:"#6b3a5a", fontSize:"0.7rem", fontWeight:500, marginTop:"0.45rem" }}>{fl.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Proceed button (floating) */}
                {totalFlowers > 0 && (
                  <div className="anim-fadeUp" style={{ textAlign:"center", paddingTop:"1rem" }}>
                    <button
                      onClick={() => setBouquetShown(true)}
                      className="btn-pulse"
                      style={{
                        padding:"0.9rem 3rem",
                        background:"linear-gradient(135deg, #ec4899, #f97316)",
                        color:"#fff", fontWeight:600, borderRadius:999,
                        fontSize:"0.72rem", letterSpacing:"0.35em", textTransform:"uppercase",
                        border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                        boxShadow:"0 8px 28px rgba(236,72,153,0.4)",
                      }}
                    >
                      💝 Present Bouquet
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* ── Bouquet Reveal ── */
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1.5rem", textAlign:"center" }}>
                <div className="anim-scaleIn">
                  <p className="font-display" style={{ color:"#9d174d", fontSize:"clamp(2rem,8vw,3.5rem)", fontStyle:"italic" }}>For You, Maleeha</p>
                  <p className="font-body" style={{ color:"#ec4899", fontSize:"0.65rem", letterSpacing:"0.4em", textTransform:"uppercase", marginTop:"0.3rem" }}>with all the love 💕</p>
                </div>

                {/* Assembled bouquet */}
                <div className="anim-float" style={{ fontSize:"clamp(4rem,20vw,7rem)", lineHeight:1 }}>
                  {/*
                    🖼️ REPLACE below with:
                    <img src="/assets/bouquet-assembled.png" alt="Bouquet"
                         style={{ width:"clamp(200px,55vw,320px)", margin:"0 auto", display:"block" }} />
                  */}
                  {"🌹🌷🌸🌻🪻💐".split("").slice(0, Math.max(3, FLOWERS.filter((_,i)=>flowerCounts[i]>0).length)).join("")}
                  <br/><span style={{ fontSize:"60%" }}>🎀</span>
                </div>

                <p className="font-display" style={{ color:"#6b3a5a", fontSize:"clamp(1rem,4vw,1.3rem)", fontStyle:"italic", maxWidth:340, lineHeight:1.6 }}>
                  "{totalFlowers} flowers — one for every reason you make this world more beautiful."
                </p>

                <button
                  onClick={() => go(2)}
                  style={{
                    padding:"0.85rem 2.5rem",
                    background:"#ec4899", color:"#fff", fontWeight:600, borderRadius:999,
                    fontSize:"0.7rem", letterSpacing:"0.35em", textTransform:"uppercase",
                    border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                    boxShadow:"0 6px 22px rgba(236,72,153,0.4)",
                  }}
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — WORLD HAPPINESS INDEX
      ══════════════════════════════════════════════════════════════ */}
      {section === 2 && (
        <div
          className="section-enter"
          style={{
            width:"100%", height:"100vh", overflow:"hidden",
            background:"linear-gradient(160deg,#04000f 0%,#0c0021 50%,#070016 100%)",
            position:"relative", display:"flex", flexDirection:"column",
          }}
        >
          <div style={{ position:"absolute", inset:0, pointerEvents:"none",
            background:"radial-gradient(ellipse at 50% -10%, rgba(236,72,153,0.18) 0%, transparent 55%)",
          }} />

          <div style={{ position:"relative", zIndex:10, flex:1, display:"flex", flexDirection:"column", maxWidth:860, margin:"0 auto", padding:"1.25rem 1rem 0.75rem", width:"100%" }}>
            {/* Header */}
            <div style={{ textAlign:"center", marginBottom:"1rem" }}>
              <p className="font-body" style={{ color:"rgba(236,72,153,0.7)", fontSize:"0.62rem", letterSpacing:"0.45em", textTransform:"uppercase", marginBottom:"0.4rem" }}>
                Peer-Reviewed Data · Peer-Approved Facts
              </p>
              <h2 className="font-display" style={{ color:"#fff", fontSize:"clamp(1.6rem,6vw,2.8rem)" }}>World Happiness Index</h2>
              <p className="font-body" style={{ color:"rgba(255,255,255,0.35)", fontSize:"0.75rem", marginTop:"0.3rem" }}>
                Global Emotional Wellbeing — Annual Trend Analysis
              </p>
            </div>

            {/* Chart */}
            <div style={{ flex:1, width:"100%", minHeight:0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CHART_DATA} margin={{ top:24, right:20, left:-10, bottom:16 }}>
                  <defs>
                    <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%"  stopColor="#6366f1" />
                      <stop offset="72%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill:"rgba(255,255,255,0.35)", fontSize:10, fontFamily:"DM Sans" }}
                    tickLine={false} axisLine={{ stroke:"rgba(255,255,255,0.08)" }}
                  />
                  <YAxis
                    tick={{ fill:"rgba(255,255,255,0.35)", fontSize:10, fontFamily:"DM Sans" }}
                    tickLine={false} axisLine={{ stroke:"rgba(255,255,255,0.08)" }}
                    domain={[0, 1080]}
                    tickFormatter={(v) => v >= 900 ? "∞" : v}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke:"rgba(255,255,255,0.1)" }} />
                  <ReferenceLine
                    x="Apr 26"
                    stroke="rgba(236,72,153,0.5)"
                    strokeDasharray="5 4"
                    label={{ value:"Her Birthday ✨", fill:"#f9a8d4", fontSize:10, fontFamily:"DM Sans", position:"insideTopLeft" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="url(#chartLine)"
                    strokeWidth={2.5}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      const special = payload.date === "Apr 26";
                      return (
                        <circle
                          key={`dot-${payload.date}`}
                          cx={cx} cy={cy}
                          r={special ? 9 : 3}
                          fill={special ? "#ec4899" : "#6366f1"}
                          stroke={special ? "#fff" : "none"}
                          strokeWidth={special ? 2 : 0}
                        />
                      );
                    }}
                    activeDot={{ r:5, fill:"#f97316", stroke:"#fff", strokeWidth:2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Caption + CTA */}
            <div style={{ textAlign:"center", padding:"0.75rem 0 1rem" }}>
              <p className="font-display" style={{ color:"rgba(249,168,212,0.9)", fontSize:"clamp(0.95rem,3.5vw,1.25rem)", fontStyle:"italic", marginBottom:"1rem" }}>
                "April 26th registers off every known scale of measurable human happiness."
              </p>
              <button
                onClick={() => go(3)}
                style={{
                  padding:"0.85rem 2.5rem",
                  background:"linear-gradient(135deg,#9333ea,#ec4899)",
                  color:"#fff", fontWeight:600, borderRadius:999,
                  fontSize:"0.7rem", letterSpacing:"0.35em", textTransform:"uppercase",
                  border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                  boxShadow:"0 6px 24px rgba(147,51,234,0.4)",
                }}
              >
                Time for Cake 🎂
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4 — THE CAKE & THE BREATH
      ══════════════════════════════════════════════════════════════ */}
      {section === 3 && (
        <div
          className="section-enter room-dark"
          style={{
            width:"100%", height:"100vh", overflow:"hidden",
            background: roomBright
              ? "linear-gradient(135deg,#fff8f0 0%,#ffe4e1 50%,#fef9ee 100%)"
              : "linear-gradient(160deg,#030008 0%,#110018 50%,#060010 100%)",
            transition:"background 2s ease",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            position:"relative",
          }}
        >
          {/* Candle glow ambient */}
          {!roomBright && (
            <div style={{
              position:"absolute", inset:0, pointerEvents:"none",
              background:"radial-gradient(ellipse at 50% 58%, rgba(255,130,0,0.18) 0%, transparent 55%)",
            }} />
          )}

          {/* Audio — 🎵 REPLACE src with your Happy Birthday .mp3 */}
          <audio ref={audioRef} src="/assets/happy-birthday.mp3" preload="auto" />

          <div style={{ position:"relative", zIndex:10, display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem", padding:"0 1.25rem", maxWidth:400, width:"100%", textAlign:"center" }}>

            {/* Label */}
            <p className="font-body" style={{ fontSize:"0.62rem", letterSpacing:"0.45em", textTransform:"uppercase", color: roomBright ? "#ec4899" : "rgba(251,191,36,0.55)", transition:"color 1.5s" }}>
              🎂 Happy Birthday, Maleeha
            </p>

            {/* Candle + Flame */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
              <Flame state={flameState} />
              {/* Candle stick */}
              <div style={{
                width:14, height:36, borderRadius:4,
                background:"linear-gradient(to bottom, #fffde7, #f0e68c)",
                border:"1px solid #c9a800", marginBottom:-2,
              }} />
            </div>

            {/* The Cake */}
            {/*
              🖼️ REPLACE the CSS cake below with:
              <img src="/assets/birthday-cake.png" alt="Maleeha's Birthday Cake"
                   className={cakeSliced ? "anim-slice" : ""}
                   style={{ width:"clamp(200px,55vw,280px)" }} />
            */}
            <div className={cakeSliced ? "anim-slice" : ""} style={{ position:"relative", display:"inline-block" }}>
              {/* Tier 3 – top */}
              <div style={{ margin:"0 auto", width:"clamp(120px,40vw,160px)", height:36, borderRadius:"24px 24px 0 0",
                background:"linear-gradient(to bottom,#fff,#fce4ec)", border:"2px solid #f48fb1",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span className="font-body" style={{ fontSize:"0.7rem", fontWeight:700, color:"#c2185b" }}>Maleeha 🎂</span>
              </div>
              {/* Tier 2 – middle */}
              <div style={{ margin:"0 auto", width:"clamp(140px,46vw,185px)", height:44, marginTop:-2,
                background:"linear-gradient(to bottom,#ce93d8,#ab47bc)", border:"2px solid #7b1fa2",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                {["🌸","🌹","🌸"].map((e,i)=><span key={i} style={{ fontSize:"1rem" }}>{e}</span>)}
              </div>
              {/* Tier 1 – bottom */}
              <div style={{ margin:"0 auto", width:"clamp(160px,52vw,210px)", height:52, marginTop:-2,
                background:"linear-gradient(to bottom,#ef9a9a,#e57373)", border:"2px solid #b71c1c",
                borderRadius:"0 0 14px 14px",
                display:"flex", alignItems:"center", justifyContent:"center", gap:6, paddingBottom:4 }}>
                {"♥♥♥♥♥".split("").map((s,i)=><span key={i} style={{ color:"#fff", fontSize:"0.9rem" }}>{s}</span>)}
              </div>

              {/* "23 Years" badge */}
              <div style={{
                position:"absolute", top:-8, right:-14,
                width:46, height:46, borderRadius:"50%",
                background:"linear-gradient(135deg,#ffd700,#ff8c00)",
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                boxShadow:"0 4px 14px rgba(255,140,0,0.45)",
              }}>
                <span className="font-body" style={{ color:"#fff", fontWeight:800, fontSize:"0.9rem", lineHeight:1 }}>23</span>
                <span className="font-body" style={{ color:"#fff", fontSize:"0.5rem", lineHeight:1 }}>Years</span>
              </div>

              {/* Slice triangle (when cut) */}
              {cakeSliced && (
                <div style={{
                  position:"absolute", bottom:-4, left:"38%",
                  width:0, height:0,
                  borderLeft:"22px solid transparent",
                  borderRight:"22px solid transparent",
                  borderTop:"48px solid #f48fb1",
                  filter:"drop-shadow(2px 4px 8px rgba(0,0,0,0.3))",
                }} />
              )}
            </div>

            {/* Blow controls */}
            <div style={{ color: roomBright ? "#4a0020" : "#fff", transition:"color 1.5s" }}>
              {blowStep === 0 && (
                <div className="anim-fadeUp" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.9rem" }}>
                  <p className="font-display" style={{ fontSize:"clamp(1.3rem,5.5vw,1.9rem)", fontStyle:"italic" }}>Blow the candle! 🕯️</p>
                  <button
                    onClick={handleBlow}
                    style={{
                      padding:"0.8rem 2.5rem", background:"#d97706", color:"#fff", fontWeight:600,
                      borderRadius:999, fontSize:"0.72rem", letterSpacing:"0.3em", textTransform:"uppercase",
                      border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                      boxShadow:"0 4px 20px rgba(217,119,6,0.45)",
                    }}
                  >
                    💨 Blow!
                  </button>
                </div>
              )}
              {blowStep === 1 && (
                <div className="anim-fadeUp" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.9rem" }}>
                  <p className="font-display" style={{ fontSize:"clamp(1.3rem,5.5vw,1.9rem)", fontStyle:"italic", color:"#fbbf24" }}>
                    Thoda aur zor se... 💪
                  </p>
                  <button
                    onClick={handleBlow}
                    style={{
                      padding:"0.8rem 2.5rem", background:"#ea580c", color:"#fff", fontWeight:600,
                      borderRadius:999, fontSize:"0.72rem", letterSpacing:"0.3em", textTransform:"uppercase",
                      border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                      boxShadow:"0 4px 20px rgba(234,88,12,0.45)",
                    }}
                  >
                    💨💨 Harder!
                  </button>
                </div>
              )}
              {blowStep === 2 && (
                <div className="anim-fadeUp" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.9rem" }}>
                  <p className="font-display" style={{ fontSize:"clamp(1.3rem,5.5vw,1.9rem)", fontStyle:"italic" }}>✨ Make a wish, Maleeha!</p>
                  <p className="font-body" style={{ fontSize:"0.82rem", opacity:0.65 }}>May every dream you hold come true 🌟</p>
                  <button
                    onClick={() => go(4)}
                    style={{
                      padding:"0.85rem 2.5rem",
                      background:"linear-gradient(135deg,#ec4899,#8b5cf6)",
                      color:"#fff", fontWeight:600, borderRadius:999,
                      fontSize:"0.72rem", letterSpacing:"0.3em", textTransform:"uppercase",
                      border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                      boxShadow:"0 6px 24px rgba(139,92,246,0.4)",
                    }}
                  >
                    Open Your Gift 🎁
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 5 — THE GIFT & THE PRANK (Grand Finale)
      ══════════════════════════════════════════════════════════════ */}
      {section === 4 && (
        <div
          className="section-enter"
          style={{
            width:"100%", height:"100vh", overflow:"hidden",
            background:"linear-gradient(135deg,#fdf2f8 0%,#fce7f3 45%,#ede9fe 100%)",
            position:"relative", display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center",
          }}
        >
          <Confetti />

          <div style={{ position:"relative", zIndex:10, display:"flex", flexDirection:"column", alignItems:"center", gap:"1.5rem", padding:"1rem", textAlign:"center", width:"100%", maxWidth:420 }}>

            {/* Header */}
            <div>
              <p className="font-body" style={{ color:"#a855f7", fontSize:"0.62rem", letterSpacing:"0.45em", textTransform:"uppercase", marginBottom:"0.4rem" }}>
                Grand Finale 🎊
              </p>
              <h2 className="font-display" style={{ color:"#3b0764", fontSize:"clamp(1.8rem,7vw,2.8rem)" }}>Your Gift Awaits</h2>
              <p className="font-body" style={{ color:"rgba(107,33,168,0.5)", fontSize:"0.78rem", marginTop:"0.3rem" }}>
                {!giftOpened ? "Tap the box to reveal ✨" : "🎉"}
              </p>
            </div>

            {/* Gift Box */}
            {!prankShown && (
              <button
                onClick={openGift}
                className={giftOpened ? "" : "anim-float"}
                style={{
                  background:"none", border:"none", cursor: giftOpened ? "default" : "pointer",
                  padding:0, lineHeight:1,
                  transition:"transform 0.3s",
                }}
                onMouseEnter={e => { if (!giftOpened) e.currentTarget.style.transform="scale(1.07)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}
              >
                {/*
                  🖼️ REPLACE the CSS gift box below with:
                  <img src="/assets/gift-box.png" alt="Your Gift"
                       style={{ width:"clamp(180px,48vw,240px)" }} />
                */}
                <div style={{ position:"relative", width:"clamp(170px,46vw,230px)", margin:"0 auto" }}>
                  {/* Lid */}
                  <div
                    className={giftOpened ? "anim-lid-flip" : ""}
                    style={{
                      width:"110%", marginLeft:"-5%", height:52,
                      background:"linear-gradient(135deg,#a855f7,#7c3aed)",
                      borderRadius:"12px 12px 0 0",
                      position:"relative", zIndex:2,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:"0 -4px 14px rgba(124,58,237,0.3)",
                    }}
                  >
                    {/* Bow */}
                    <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", display:"flex", alignItems:"center", gap:4 }}>
                      <div style={{ width:28, height:22, background:"radial-gradient(ellipse,#fbbf24,#d97706)", borderRadius:"50%", transform:"rotate(-35deg)" }} />
                      <div style={{ width:14, height:14, background:"#fbbf24", borderRadius:"50%", boxShadow:"0 2px 6px rgba(0,0,0,0.2)" }} />
                      <div style={{ width:28, height:22, background:"radial-gradient(ellipse,#fbbf24,#d97706)", borderRadius:"50%", transform:"rotate(35deg)" }} />
                    </div>
                    {/* Lid ribbon */}
                    <div style={{ position:"absolute", inset:"0 calc(50% - 8px)", background:"rgba(251,191,36,0.6)" }} />
                    <div style={{ position:"absolute", inset:"calc(50% - 8px) 0", background:"rgba(251,191,36,0.6)" }} />
                  </div>

                  {/* Box body */}
                  <div style={{
                    width:"100%", height:"clamp(100px,28vw,140px)",
                    background:"linear-gradient(135deg,#7c3aed,#6d28d9)",
                    borderRadius:"0 0 16px 16px",
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                    boxShadow:"0 12px 36px rgba(109,40,217,0.35)",
                    position:"relative",
                  }}>
                    {/* Ribbon vertical */}
                    <div style={{ position:"absolute", inset:"0 calc(50% - 8px)", background:"rgba(251,191,36,0.45)" }} />
                    {/* Stars */}
                    <div style={{ display:"flex", justifyContent:"space-around", width:"80%", marginBottom:8 }}>
                      {["⭐","✨","🌟","✨","⭐"].map((s,i)=><span key={i} style={{ fontSize:"0.9rem", opacity:0.7 }}>{s}</span>)}
                    </div>
                    <p className="font-display" style={{ color:"rgba(255,255,255,0.85)", fontSize:"1.3rem", fontStyle:"italic" }}>Your Gift</p>
                  </div>
                </div>
              </button>
            )}

            {/* Prank Card — bounces out */}
            {prankShown && (
              <div className="anim-prankPop" style={{ width:"100%", maxWidth:380 }}>
                <div style={{
                  background:"#fff",
                  borderRadius:28, border:"3px solid #f9a8d4",
                  padding:"2rem 1.75rem",
                  boxShadow:"0 28px 64px rgba(236,72,153,0.28), 0 8px 24px rgba(0,0,0,0.08)",
                  position:"relative",
                }}>
                  {/* Corner confetti icons */}
                  {[["🎊","top:-16px","left:-12px"],["🎉","top:-16px","right:-12px"],["🥳","bottom:-16px","left:-12px"],["🎈","bottom:-16px","right:-12px"]].map(([e,t,s],i)=>
                    <span key={i} style={{ position:"absolute", fontSize:"1.6rem", [t.split(":")[0]]:t.split(":")[1], [s.split(":")[0]]:s.split(":")[1] }}>{e}</span>
                  )}

                  <p className="font-display" style={{ fontSize:"clamp(2rem,10vw,3rem)", color:"#1f2937", marginBottom:"0.25rem" }}>Hahaha!</p>
                  <div style={{ fontSize:"2rem", marginBottom:"0.75rem" }}>😂</div>

                  <p className="font-display" style={{ fontSize:"clamp(1.3rem,6vw,2rem)", color:"#374151", fontStyle:"italic", lineHeight:1.5, marginBottom:"0.75rem" }}>
                    "Pehle party do..."
                  </p>
                  <p style={{ fontSize:"2rem", marginBottom:"1rem" }}>😒🍕</p>

                  <div style={{ height:1, background:"#fce7f3", marginBottom:"0.85rem" }} />

                  <p className="font-body" style={{ color:"#9ca3af", fontSize:"0.78rem", lineHeight:1.6 }}>
                    No but seriously — Happy Birthday, Maleeha! 🎂<br/>
                    <span style={{ color:"#f9a8d4" }}>Wishing you infinite joy, laughter & cake forever! 🌟</span>
                  </p>
                </div>
              </div>
            )}

            {/* Replay */}
            {prankShown && (
              <button
                onClick={() => { go(0); setBouquetShown(false); setFlowerCounts(Array(6).fill(0)); setBlowStep(0); setCakeSliced(false); setRoomBright(false); setGiftOpened(false); setPrankShown(false); }}
                className="font-body"
                style={{
                  background:"none", border:"none", cursor:"pointer",
                  color:"#a855f7", fontSize:"0.68rem", letterSpacing:"0.35em",
                  textTransform:"uppercase", textDecoration:"underline",
                  textUnderlineOffset:4, fontFamily:"'DM Sans',sans-serif",
                }}
              >
                ↺ Replay from the beginning
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
