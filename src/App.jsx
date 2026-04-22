// ═══════════════════════════════════════════════════════════════════
//  ✦  BIRTHDAY TRIBUTE  —  Sophisticated Minimalism
//  Customize the CONFIG object below to personalize this tribute.
//  Dependencies: framer-motion, recharts, lucide-react
//  Deploy: Drop into any Vite/Next.js/CRA project → npm run dev
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { X, ChevronDown, Heart } from "lucide-react";

// ─── ✦  PERSONALIZE HERE  ────────────────────────────────────────
const CONFIG = {
  name: "Aisha",          // ← Her name
  year: "1999",           // ← Birth year
  city: "Lahore",         // ← Her city
  date: "21st April",     // ← Her birthday date
};

// ─── Historical events (edit as you like) ────────────────────────
const HISTORICAL_EVENTS = [
  {
    year: "753 BC",
    text: "Rome was founded — and an empire began its eternal march.",
  },
  {
    year: "1509",
    text: "Henry VIII ascended the throne of England.",
  },
  {
    year: "1918",
    text: "The Red Baron flew his final sortie across the Western Front.",
  },
];

const TRANSITION_LINE = `But in ${CONFIG.year}, the most important event happened…`;

// ─── Flower boutique ─────────────────────────────────────────────
const FLOWERS = [
  {
    id: "roses",
    emoji: "🌹",
    name: "Midnight Roses",
    desc: "Twelve black-velvet roses, each dusted in midnight gold.",
    accentColor: "#C41E3A",
    glowColor: "rgba(196,30,58,0.28)",
    paneBg: "#0e0205",
  },
  {
    id: "lilies",
    emoji: "🌸",
    name: "White Lilies",
    desc: "Pure alabaster lilies — carrying the scent of new beginnings.",
    accentColor: "#EDE8E0",
    glowColor: "rgba(237,232,224,0.18)",
    paneBg: "#06080f",
  },
  {
    id: "sunflowers",
    emoji: "🌻",
    name: "Sunflowers",
    desc: "A golden cascade that bends only toward your light.",
    accentColor: "#FFCC00",
    glowColor: "rgba(255,204,0,0.28)",
    paneBg: "#0a0700",
  },
];

// ─── Happiness chart data ─────────────────────────────────────────
const CHART_DATA = [
  { label: "Jan", h: 41 },
  { label: "Feb", h: 37 },
  { label: "Mar", h: 44 },
  { label: "Apr 18", h: 43 },
  { label: "Apr 20", h: 42 },
  { label: `${CONFIG.date} ✦`, h: 999 },
  { label: "Apr 22", h: 44 },
  { label: "May", h: 40 },
];

// ─── Ghazal poem (Roman Urdu) ────────────────────────────────────
const POEM_LINES = [
  "Woh din jab tu aayi, zameen ko mila aasmaan tha,",
  "Har phool khila, har taara chamka — yeh tera jahaan tha.",
  "Is duniya ke rang tere bina the pheke pheke,",
  "Tu jo muskurayi, toh lagaa — yahi to jahaan tha.",
];

// ═══════════════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════

// Scroll-reveal wrapper
function Reveal({ children, delay = 0, y = 30 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Thin gold rule
function GoldRule({ style = {} }) {
  return (
    <div
      style={{
        width: 40,
        height: 1,
        background: "#C9A84C",
        opacity: 0.55,
        ...style,
      }}
    />
  );
}

// Section eyebrow label
function SectionLabel({ index, text }) {
  return (
    <p
      style={{
        fontFamily: "DM Mono, monospace",
        fontSize: 10,
        color: "#C9A84C",
        letterSpacing: "0.30em",
        marginBottom: 22,
        opacity: 0.85,
      }}
    >
      0{index} — {text.toUpperCase()}
    </p>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  FLOWER MODAL — Full-screen cinematic presentation
// ═══════════════════════════════════════════════════════════════════
function FlowerModal({ flower, onClose }) {
  // Stable deterministic particles (no random → no re-render jitter)
  const particles = useRef(
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: `${((i * 4.54 + 5) % 96)}%`,
      delay: (i % 7) * 0.38,
      duration: 3.4 + (i % 5) * 0.55,
      size: 24 + (i % 4) * 10,
    }))
  ).current;

  return (
    <motion.div
      key="flower-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: flower.paneBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={onClose}
    >
      {/* Falling petals */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: p.left,
            top: "-70px",
            fontSize: p.size,
            pointerEvents: "none",
            userSelect: "none",
          }}
          animate={{
            y: ["0vh", "108vh"],
            rotate: [0, 360 * (p.id % 2 === 0 ? 1 : -1)],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {flower.emoji}
        </motion.div>
      ))}

      {/* Center card */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 28 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.95, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: "center", padding: "0 40px", zIndex: 10 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing orb */}
        <motion.div
          style={{
            width: 168,
            height: 168,
            borderRadius: "50%",
            margin: "0 auto 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `radial-gradient(circle, ${flower.glowColor} 0%, transparent 68%)`,
            boxShadow: `0 0 110px ${flower.glowColor}`,
          }}
          animate={{ scale: [1, 1.09, 1] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span style={{ fontSize: 76 }}>{flower.emoji}</span>
        </motion.div>

        <h2
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: "clamp(36px, 8vw, 52px)",
            fontWeight: 300,
            color: flower.accentColor,
            letterSpacing: "0.03em",
            marginBottom: 14,
          }}
        >
          {flower.name}
        </h2>

        <p
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: 11,
            color: "#8A8070",
            letterSpacing: "0.12em",
            lineHeight: 1.9,
            maxWidth: 320,
            margin: "0 auto 36px",
          }}
        >
          {flower.desc}
        </p>

        <p
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: 21,
            fontStyle: "italic",
            color: "#C9A84C",
            opacity: 0.9,
            marginBottom: 44,
          }}
        >
          "For you, and only for you."
        </p>

        <motion.button
          whileHover={{ opacity: 0.6 }}
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontFamily: "DM Mono, monospace",
            fontSize: 10,
            color: "#8A8070",
            letterSpacing: "0.2em",
          }}
        >
          <X size={12} /> CLOSE
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  CUSTOM RECHARTS TOOLTIP
// ═══════════════════════════════════════════════════════════════════
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#050810",
        border: "1px solid #1c2535",
        padding: "10px 18px",
        fontFamily: "DM Mono, monospace",
        fontSize: 11,
        color: "#C9A84C",
        letterSpacing: "0.1em",
      }}
    >
      <p style={{ margin: 0, opacity: 0.55, marginBottom: 5, fontSize: 10 }}>
        {label}
      </p>
      <p style={{ margin: 0 }}>
        {payload[0].value > 100 ? "∞ — unmeasurable" : payload[0].value}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function BirthdayTribute() {
  // ── Hero typewriter machine ──────────────────────────────────
  //  Phase 0: typing events
  //  Phase 1: typing transition line
  //  Phase 2: name fade-in
  //  Phase 3: enter button visible
  const [heroPhase, setHeroPhase] = useState(0);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [charIdx, setCharIdx] = useState(0);
  const [eventIdx, setEventIdx] = useState(0);
  const [transitionText, setTransitionText] = useState("");
  const [transitionCharIdx, setTransitionCharIdx] = useState(0);

  // ── App-level state ──────────────────────────────────────────
  const [showMain, setShowMain] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [finalMode, setFinalMode] = useState(false);
  const [siteGone, setSiteGone] = useState(false);

  // ── Phase 0: type out historical events ──────────────────────
  useEffect(() => {
    if (heroPhase !== 0) return;
    const ev = HISTORICAL_EVENTS[eventIdx];
    const full = `${ev.year}  —  ${ev.text}`;

    if (charIdx < full.length) {
      const t = setTimeout(() => {
        setCurrentLine((p) => p + full[charIdx]);
        setCharIdx((c) => c + 1);
      }, 36);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setCompletedEvents((p) => [...p, full]);
        setCurrentLine("");
        setCharIdx(0);
        if (eventIdx < HISTORICAL_EVENTS.length - 1) {
          setEventIdx((p) => p + 1);
        } else {
          setHeroPhase(1);
        }
      }, 960);
      return () => clearTimeout(t);
    }
  }, [heroPhase, eventIdx, charIdx]);

  // ── Phase 1: type the transition sentence ─────────────────────
  useEffect(() => {
    if (heroPhase !== 1) return;
    if (transitionCharIdx < TRANSITION_LINE.length) {
      const t = setTimeout(() => {
        setTransitionText((p) => p + TRANSITION_LINE[transitionCharIdx]);
        setTransitionCharIdx((p) => p + 1);
      }, 44);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setHeroPhase(2), 520);
      return () => clearTimeout(t);
    }
  }, [heroPhase, transitionCharIdx]);

  // ── Phase 2 → 3: show enter button after name reveals ────────
  useEffect(() => {
    if (heroPhase !== 2) return;
    const t = setTimeout(() => setHeroPhase(3), 1700);
    return () => clearTimeout(t);
  }, [heroPhase]);

  // ── Final farewell handler ────────────────────────────────────
  const handleClose = () => {
    setFinalMode(true);
    setTimeout(() => setSiteGone(true), 5000);
  };

  // ─── Outro glow screen ────────────────────────────────────────
  if (siteGone) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400&display=swap');
          body { background: #050810; margin: 0; }
        `}</style>
        <div
          style={{
            background: "#050810",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0.35, 0.65, 0.35] }}
            transition={{
              duration: 5,
              times: [0, 0.2, 0.45, 0.7, 1],
              repeat: Infinity,
            }}
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: 12,
              color: "#C9A84C",
              letterSpacing: "0.38em",
              textAlign: "center",
            }}
          >
            ✦ &nbsp;&nbsp; HAPPY BIRTHDAY &nbsp;&nbsp; ✦
          </motion.p>
        </div>
      </>
    );
  }

  // ─── Main render ──────────────────────────────────────────────
  return (
    <>
      {/* ── Google Fonts + global styles ───────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Mono:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #050810; color: #F0EDE8; overflow-x: hidden; }

        ::-webkit-scrollbar { width: 2px; background: transparent; }
        ::-webkit-scrollbar-thumb { background: #C9A84C44; }

        /* Typewriter blinking cursor */
        .tw-cursor::after {
          content: '|';
          color: #C9A84C;
          font-weight: 300;
          animation: blink 1.05s step-end infinite;
          margin-left: 1px;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }

        /* Subtle film-grain overlay */
        .grain-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.024;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E");
        }

        /* Smooth flower card transitions */
        .flower-card { transition: border-color 0.35s ease; }
        .flower-card:hover { border-color: var(--flower-accent) !important; }
      `}</style>

      {/* ── Film grain ──────────────────────────────────────────── */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* ── Final farewell overlay ──────────────────────────────── */}
      <AnimatePresence>
        {finalMode && !siteGone && (
          <motion.div
            key="farewell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.3 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 800,
              background: "rgba(5, 8, 16, 0.97)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 32px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ textAlign: "center", maxWidth: 560 }}
            >
              <motion.span
                animate={{ opacity: [0.25, 0.85, 0.25] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                style={{
                  display: "block",
                  fontSize: 30,
                  color: "#C9A84C",
                  marginBottom: 36,
                }}
              >
                ✦
              </motion.span>

              <p
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "clamp(18px, 3.5vw, 24px)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "#F0EDE8",
                  lineHeight: 2,
                  marginBottom: 40,
                }}
              >
                Every year, the stars realign — but only once did they arrange
                themselves perfectly enough to bring you into this world.
                <br />
                <br />
                That was{" "}
                <span style={{ color: "#C9A84C" }}>
                  {CONFIG.date}, {CONFIG.year}
                </span>
                .
              </p>

              <GoldRule style={{ margin: "0 auto 28px" }} />

              <p
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: 11,
                  color: "#C9A84C",
                  letterSpacing: "0.26em",
                  opacity: 0.85,
                }}
              >
                HAPPY BIRTHDAY, {CONFIG.name.toUpperCase()}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main wrapper (fades out as finalMode runs) ───────────── */}
      <motion.div
        style={{ background: "#050810", minHeight: "100vh" }}
        animate={{ opacity: finalMode ? 0 : 1 }}
        transition={{ duration: 2.2, delay: finalMode ? 2 : 0 }}
      >
        {/* ════════════════════════════════════════════════════════
            HERO SECTION — The Time Traveler
        ════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {!showMain && (
            <motion.section
              key="hero"
              exit={{ opacity: 0, transition: { duration: 0.9, ease: "easeOut" } }}
              style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 clamp(28px, 7vw, 100px)",
                background: "#050810",
              }}
            >
              {/* Date watermark top-right */}
              <div
                style={{
                  position: "absolute",
                  top: 28,
                  right: 32,
                  fontFamily: "DM Mono, monospace",
                  fontSize: 9,
                  color: "#C9A84C",
                  letterSpacing: "0.28em",
                  opacity: 0.4,
                }}
              >
                {CONFIG.date.toUpperCase()} · {CONFIG.year}
              </div>

              {/* Corner ornament */}
              <div
                style={{
                  position: "absolute",
                  bottom: 28,
                  left: 32,
                  fontFamily: "DM Mono, monospace",
                  fontSize: 9,
                  color: "#C9A84C",
                  letterSpacing: "0.28em",
                  opacity: 0.3,
                }}
              >
                ✦
              </div>

              <div style={{ maxWidth: 700, width: "100%" }}>
                {/* Completed historical events */}
                <div style={{ marginBottom: 52 }}>
                  {completedEvents.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.38 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        fontFamily: "DM Mono, monospace",
                        fontSize: "clamp(11px, 1.6vw, 13px)",
                        color: "#F0EDE8",
                        lineHeight: 1.85,
                        marginBottom: 12,
                      }}
                    >
                      {line}
                    </motion.p>
                  ))}
                  {/* Current typing line */}
                  {heroPhase === 0 && (
                    <p
                      className="tw-cursor"
                      style={{
                        fontFamily: "DM Mono, monospace",
                        fontSize: "clamp(11px, 1.6vw, 13px)",
                        color: "#F0EDE8",
                        lineHeight: 1.85,
                        opacity: 0.38,
                        minHeight: "1.85em",
                      }}
                    >
                      {currentLine}
                    </p>
                  )}
                </div>

                {/* Transition sentence */}
                {heroPhase >= 1 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className={heroPhase === 1 ? "tw-cursor" : ""}
                    style={{
                      fontFamily: "DM Mono, monospace",
                      fontSize: "clamp(12px, 2vw, 14px)",
                      color: "#C9A84C",
                      letterSpacing: "0.04em",
                      lineHeight: 1.8,
                      marginBottom: 44,
                      minHeight: "1.8em",
                    }}
                  >
                    {heroPhase === 1 ? transitionText : TRANSITION_LINE}
                  </motion.p>
                )}

                {/* Name — elegant serif fade-in */}
                <AnimatePresence>
                  {heroPhase >= 2 && (
                    <motion.h1
                      key="name-reveal"
                      initial={{ opacity: 0, y: 28, filter: "blur(14px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontSize: "clamp(68px, 13vw, 120px)",
                        fontWeight: 300,
                        color: "#F0EDE8",
                        lineHeight: 0.93,
                        letterSpacing: "-0.025em",
                        marginBottom: 6,
                      }}
                    >
                      {CONFIG.name}
                    </motion.h1>
                  )}
                </AnimatePresence>

                {/* Enter CTA */}
                <AnimatePresence>
                  {heroPhase >= 3 && (
                    <motion.button
                      key="enter-btn"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45, duration: 0.95 }}
                      whileHover={{ x: 8 }}
                      onClick={() => setShowMain(true)}
                      style={{
                        marginTop: 60,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        fontFamily: "DM Mono, monospace",
                        fontSize: 11,
                        color: "#C9A84C",
                        letterSpacing: "0.26em",
                        padding: 0,
                      }}
                    >
                      BEGIN THE JOURNEY
                      <ChevronDown size={13} strokeWidth={1.5} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════════════════════
            MAIN CONTENT SECTIONS
        ════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {showMain && (
            <motion.div
              key="main-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              {/* ──────────────────────────────────────────────────
                  §1 — THE SPACE JOURNEY
              ─────────────────────────────────────────────────── */}
              <section
                style={{
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "100px clamp(24px, 6vw, 100px)",
                  borderBottom: "1px solid #0d1422",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Ambient pulse behind video */}
                <motion.div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 700,
                    height: 700,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)",
                    pointerEvents: "none",
                  }}
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />

                <div style={{ maxWidth: 720, width: "100%", textAlign: "center" }}>
                  <Reveal>
                    <SectionLabel index={1} text="The Space Journey" />
                    <h2
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontSize: "clamp(34px, 6.5vw, 66px)",
                        fontWeight: 300,
                        color: "#F0EDE8",
                        lineHeight: 1.12,
                        letterSpacing: "-0.015em",
                        marginBottom: 18,
                      }}
                    >
                      From the Stars to{" "}
                      <em style={{ color: "#C9A84C", fontStyle: "italic" }}>
                        {CONFIG.city}
                      </em>
                    </h2>
                    <p
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontSize: "clamp(16px, 2.2vw, 19px)",
                        fontStyle: "italic",
                        color: "#8A8070",
                        marginBottom: 60,
                        lineHeight: 1.75,
                      }}
                    >
                      The universe had one destination in mind.
                    </p>
                  </Reveal>

                  <Reveal delay={0.2}>
                    {/* ── Replace this div with a <video> tag ── */}
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16 / 9",
                        background: "#060a12",
                        border: "1px solid #1c2535",
                        borderRadius: 2,
                        position: "relative",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* Animated starfield */}
                      {Array.from({ length: 55 }, (_, i) => (
                        <motion.div
                          key={i}
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            width: i % 8 === 0 ? 2.5 : i % 3 === 0 ? 2 : 1.5,
                            height: i % 8 === 0 ? 2.5 : i % 3 === 0 ? 2 : 1.5,
                            borderRadius: "50%",
                            background: "#F0EDE8",
                            left: `${(i * 18.2 + 3) % 96}%`,
                            top: `${(i * 13.7 + 7) % 92}%`,
                          }}
                          animate={{ opacity: [0.12, 0.88, 0.12] }}
                          transition={{
                            duration: 2.2 + (i % 5) * 0.65,
                            repeat: Infinity,
                            delay: (i * 0.09) % 2.2,
                          }}
                        />
                      ))}

                      {/* Video placeholder UI */}
                      <div style={{ textAlign: "center", zIndex: 2, position: "relative" }}>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1], opacity: [0.55, 1, 0.55] }}
                          transition={{ duration: 3.2, repeat: Infinity }}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            border: "1px solid rgba(201,168,76,0.6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 18px",
                          }}
                        >
                          <div
                            style={{
                              width: 0,
                              height: 0,
                              borderTop: "9px solid transparent",
                              borderBottom: "9px solid transparent",
                              borderLeft: "16px solid #C9A84C",
                              marginLeft: 4,
                            }}
                          />
                        </motion.div>
                        <p
                          style={{
                            fontFamily: "DM Mono, monospace",
                            fontSize: 10,
                            color: "#C9A84C",
                            letterSpacing: "0.22em",
                            opacity: 0.75,
                            marginBottom: 7,
                          }}
                        >
                          PLACE VIDEO HERE
                        </p>
                        <p
                          style={{
                            fontFamily: "DM Mono, monospace",
                            fontSize: 9,
                            color: "#8A8070",
                            letterSpacing: "0.12em",
                            opacity: 0.55,
                          }}
                        >
                          Google Earth Zoom → {CONFIG.city}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </section>

              {/* ──────────────────────────────────────────────────
                  §2 — THE INTERACTIVE FLOWER BOUTIQUE
              ─────────────────────────────────────────────────── */}
              <section
                style={{
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "100px clamp(24px, 6vw, 100px)",
                  borderBottom: "1px solid #0d1422",
                }}
              >
                <div style={{ maxWidth: 1000, margin: "0 auto", width: "100%" }}>
                  <Reveal>
                    <SectionLabel index={2} text="The Boutique" />
                    <h2
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontSize: "clamp(34px, 6.5vw, 66px)",
                        fontWeight: 300,
                        color: "#F0EDE8",
                        lineHeight: 1.12,
                        letterSpacing: "-0.015em",
                        marginBottom: 14,
                      }}
                    >
                      Choose Her Flowers
                    </h2>
                    <p
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontSize: "clamp(16px, 2.2vw, 19px)",
                        fontStyle: "italic",
                        color: "#8A8070",
                        marginBottom: 60,
                      }}
                    >
                      A moment. A choice. A gift that speaks louder than words.
                    </p>
                  </Reveal>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                      gap: 20,
                    }}
                  >
                    {FLOWERS.map((flower, i) => (
                      <Reveal key={flower.id} delay={i * 0.15}>
                        <motion.button
                          className="flower-card"
                          whileHover={{ y: -10 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedFlower(flower)}
                          style={{
                            width: "100%",
                            background: "#060a12",
                            border: "1px solid #1c2535",
                            borderRadius: 2,
                            padding: "44px 32px 38px",
                            cursor: "pointer",
                            textAlign: "left",
                            position: "relative",
                            overflow: "hidden",
                            transition: "border-color 0.4s ease, transform 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor =
                              flower.accentColor + "66";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#1c2535";
                          }}
                        >
                          {/* Subtle color wash on hover */}
                          <motion.div
                            aria-hidden="true"
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: `radial-gradient(ellipse at 30% 30%, ${flower.accentColor}08, transparent 65%)`,
                              pointerEvents: "none",
                            }}
                          />

                          <div
                            style={{ fontSize: 46, marginBottom: 28, lineHeight: 1 }}
                          >
                            {flower.emoji}
                          </div>

                          <h3
                            style={{
                              fontFamily: "Cormorant Garamond, Georgia, serif",
                              fontSize: 28,
                              fontWeight: 400,
                              color: "#F0EDE8",
                              marginBottom: 12,
                              lineHeight: 1.15,
                            }}
                          >
                            {flower.name}
                          </h3>

                          <p
                            style={{
                              fontFamily: "DM Mono, monospace",
                              fontSize: 11,
                              color: "#8A8070",
                              lineHeight: 1.8,
                              marginBottom: 32,
                            }}
                          >
                            {flower.desc}
                          </p>

                          <div
                            style={{
                              fontFamily: "DM Mono, monospace",
                              fontSize: 10,
                              color: "#C9A84C",
                              letterSpacing: "0.2em",
                              opacity: 0.75,
                            }}
                          >
                            PRESENT →
                          </div>
                        </motion.button>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>

              {/* ──────────────────────────────────────────────────
                  §3 — THE ECONOMICS OF HER
              ─────────────────────────────────────────────────── */}
              <section
                style={{
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "100px clamp(24px, 6vw, 100px)",
                  borderBottom: "1px solid #0d1422",
                }}
              >
                <div style={{ maxWidth: 800, margin: "0 auto", width: "100%" }}>
                  <Reveal>
                    <SectionLabel index={3} text="The Economics" />
                    <h2
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontSize: "clamp(34px, 6.5vw, 66px)",
                        fontWeight: 300,
                        color: "#F0EDE8",
                        lineHeight: 1.12,
                        letterSpacing: "-0.015em",
                        marginBottom: 14,
                      }}
                    >
                      The Economics of Her
                    </h2>
                    <p
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontSize: "clamp(16px, 2.2vw, 19px)",
                        fontStyle: "italic",
                        color: "#8A8070",
                        marginBottom: 58,
                      }}
                    >
                      Global Happiness Index — observed over April
                    </p>
                  </Reveal>

                  <Reveal delay={0.18}>
                    <div
                      style={{
                        background: "#060a12",
                        border: "1px solid #1c2535",
                        padding: "32px 12px 24px",
                        borderRadius: 2,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "DM Mono, monospace",
                          fontSize: 9,
                          color: "#8A8070",
                          letterSpacing: "0.2em",
                          textAlign: "right",
                          paddingRight: 20,
                          marginBottom: 10,
                          opacity: 0.6,
                        }}
                      >
                        HAPPINESS INDEX (ARBITRARY UNITS)
                      </p>
                      <ResponsiveContainer width="100%" height={290}>
                        <LineChart
                          data={CHART_DATA}
                          margin={{ top: 8, right: 24, left: -14, bottom: 0 }}
                        >
                          <XAxis
                            dataKey="label"
                            tick={{
                              fill: "#8A8070",
                              fontFamily: "DM Mono, monospace",
                              fontSize: 10,
                            }}
                            axisLine={{ stroke: "#1c2535" }}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{
                              fill: "#8A8070",
                              fontFamily: "DM Mono, monospace",
                              fontSize: 10,
                            }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => (v > 100 ? "∞" : v)}
                            domain={[0, 580]}
                          />
                          <Tooltip content={<ChartTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="h"
                            stroke="#C9A84C"
                            strokeWidth={1.5}
                            dot={{ fill: "#C9A84C", r: 3, strokeWidth: 0 }}
                            activeDot={{ r: 5.5, fill: "#E8D48B", strokeWidth: 0 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Reveal>

                  <Reveal delay={0.36}>
                    <p
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontSize: "clamp(16px, 2.2vw, 20px)",
                        fontStyle: "italic",
                        color: "#8A8070",
                        marginTop: 40,
                        lineHeight: 1.95,
                      }}
                    >
                      In a world of variables, constants, and predictable
                      distributions — she remains the ultimate outlier. The
                      anomaly that shatters every model, every regression, every
                      carefully-drawn curve back to the mean.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "12px 28px",
                        marginTop: 22,
                      }}
                    >
                      {[
                        "p-value: 0.0000",
                        "R²: undefined",
                        "n: 1 (irreplaceable)",
                        "σ: ∞",
                      ].map((s) => (
                        <span
                          key={s}
                          style={{
                            fontFamily: "DM Mono, monospace",
                            fontSize: 10,
                            color: "#C9A84C",
                            letterSpacing: "0.14em",
                            opacity: 0.65,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </Reveal>
                </div>
              </section>

              {/* ──────────────────────────────────────────────────
                  §4 — THE POETRY ROOM
              ─────────────────────────────────────────────────── */}
              <section
                style={{
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "100px clamp(24px, 6vw, 100px)",
                  borderBottom: "1px solid #0d1422",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Watermark name */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(-12deg)",
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                    fontSize: "clamp(80px, 18vw, 180px)",
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "#C9A84C",
                    opacity: 0.028,
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.04em",
                    userSelect: "none",
                  }}
                >
                  {CONFIG.name}
                </div>

                <div
                  style={{
                    maxWidth: 660,
                    textAlign: "center",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Reveal>
                    <SectionLabel index={4} text="The Poetry Room" />
                    <GoldRule style={{ margin: "0 auto 60px" }} />
                  </Reveal>

                  {POEM_LINES.map((line, i) => (
                    <Reveal key={i} delay={i * 0.3} y={14}>
                      <p
                        style={{
                          fontFamily: "Cormorant Garamond, Georgia, serif",
                          fontSize: "clamp(17px, 3vw, 26px)",
                          fontStyle: "italic",
                          fontWeight: 300,
                          color: i % 2 === 0 ? "#F0EDE8" : "#C9A84C",
                          lineHeight: 1.95,
                          marginBottom: 8,
                          letterSpacing: "0.015em",
                        }}
                      >
                        {line}
                      </p>
                    </Reveal>
                  ))}

                  <Reveal delay={1.5}>
                    <GoldRule style={{ margin: "56px auto 22px" }} />
                    <p
                      style={{
                        fontFamily: "DM Mono, monospace",
                        fontSize: 9,
                        color: "#8A8070",
                        letterSpacing: "0.28em",
                        opacity: 0.5,
                      }}
                    >
                      GHAZAL · ROMAN URDU · {CONFIG.date.toUpperCase()}
                    </p>
                  </Reveal>
                </div>
              </section>

              {/* ──────────────────────────────────────────────────
                  §5 — THE EPHEMERAL WISH
              ─────────────────────────────────────────────────── */}
              <section
                style={{
                  minHeight: "88vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "80px clamp(24px, 6vw, 100px)",
                }}
              >
                <Reveal>
                  <div style={{ textAlign: "center" }}>
                    <motion.span
                      animate={{ opacity: [0.25, 0.75, 0.25] }}
                      transition={{ duration: 4.5, repeat: Infinity }}
                      style={{
                        display: "block",
                        fontSize: 28,
                        color: "#C9A84C",
                        marginBottom: 38,
                      }}
                    >
                      ✦
                    </motion.span>

                    <h2
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontSize: "clamp(42px, 8vw, 80px)",
                        fontWeight: 300,
                        color: "#F0EDE8",
                        lineHeight: 1.08,
                        letterSpacing: "-0.02em",
                        marginBottom: 22,
                      }}
                    >
                      Happy Birthday,
                      <br />
                      <em style={{ fontStyle: "italic", color: "#C9A84C" }}>
                        {CONFIG.name}
                      </em>
                    </h2>

                    <p
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontSize: "clamp(16px, 2.2vw, 20px)",
                        fontStyle: "italic",
                        color: "#8A8070",
                        maxWidth: 460,
                        margin: "0 auto 60px",
                        lineHeight: 1.9,
                      }}
                    >
                      May this year hold every wish you've whispered to the stars
                      — and a few they haven't heard yet.
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleClose}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#C9A84C";
                        e.currentTarget.style.background = "rgba(201,168,76,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
                        e.currentTarget.style.background = "none";
                      }}
                      style={{
                        background: "none",
                        border: "1px solid rgba(201,168,76,0.4)",
                        color: "#C9A84C",
                        fontFamily: "DM Mono, monospace",
                        fontSize: 11,
                        letterSpacing: "0.22em",
                        padding: "17px 40px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 9,
                        borderRadius: 0,
                        transition: "border-color 0.3s ease, background 0.3s ease",
                      }}
                    >
                      <Heart size={13} fill="#C9A84C" strokeWidth={0} />
                      CLOSE WITH LOVE
                    </motion.button>
                  </div>
                </Reveal>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Flower Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedFlower && (
          <FlowerModal
            key={selectedFlower.id}
            flower={selectedFlower}
            onClose={() => setSelectedFlower(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
