// ════════════════════════════════════════════════════════════════════
//  ✦  BIRTHDAY TRIBUTE V2  —  Rose Gold Reverie
//  Theme: Feminine Luxury · Rose Gold × Deep Plum × Champagne
//  Features: Bouquet Maker · Hinglish Typewriter · Music · Heartbeat
//  Dependencies: framer-motion · recharts · lucide-react
// ════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { X, ChevronDown, Heart, Sparkles, Music2 } from "lucide-react";

// ─── ✦  PERSONALIZE HERE  ─────────────────────────────────────────
const CONFIG = {
  name:       "Nahi bataunga",
  year:       "2002",
  city:       "Noida",
  date:       "24th April",
  musicUrl:   "",   // ← paste an MP3 URL (e.g. from Google Drive direct link)
  noidaPhoto: "https://drive.google.com/file/d/1r6r2FfzKX-S6Q7abcIu8WptYEUKhMLhz/view?usp=drivesdk",   // ← paste an image URL for the Noida photo reveal
};

// ─── Rose Gold Palette (female psychology: warmth, romance, depth) ─
const C = {
  bg:         "#0B0B0F",   // slightly clear dark
  bgCard:     "#14141A",
  bgDeep:     "#050508",
  roseGold:   "#E6E4AA",   // primary accent — warm, feminine
  roseLight:  "#FFC1C7",   // hover/highlight
  roseDark:   "#B76E79",   // deep rose for contrast
  champagne:  "#FFDDAA",   // secondary gold — celebratory
  champLight: "#FFF2D6",
  lavender:   "#D8C3F0",   // tertiary — dreamy
  lavLight:   "#EEE4FF",
  cream:      "#FFFFFF",   // text primary
  muted:      "#B8B8B8",   // text secondary
  faint:      "#2A2A35",   // borders
  fainter:    "#1A1A22",   // subtle borders
  heartGlow:  "rgba(201,132,138,0.28)",
};

// ─── Historical events ────────────────────────────────────────────
const HISTORICAL_EVENTS = [
  { year: "1498", text: "Vasco da Gama reached India — a world connected forever." },
  { year: "1782", text: "Bangkok was founded, becoming the jewel of Southeast Asia." },
  { year: "1918", text: "The Red Baron flew his last flight across a war-torn sky." },
  { year: "2000", text: "She born on this day."},
];

const TRANSITION_LINE = `But in ${CONFIG.year}, the most important event happened…`;

// ─── Flowers (bouquet maker) ──────────────────────────────────────
const FLOWERS = [
  {
    id: "roses",
    emoji: "🌹",
    name: "Midnight Roses",
    note: "Passion, depth, and a love that burns quietly.",
    accentColor: C.roseGold,
    glowColor: "rgba(201,132,138,0.35)",
    bg: "#100508",
  },
  {
    id: "lilies",
    emoji: "🌸",
    name: "Blush Lilies",
    note: "Innocence in full bloom — soft and forever pure.",
    accentColor: C.lavender,
    glowColor: "rgba(196,176,212,0.28)",
    bg: "#09080F",
  },
  {
    id: "sunflowers",
    emoji: "🌻",
    name: "Golden Sunflowers",
    note: "Joy that turns its face toward your light.",
    accentColor: C.champagne,
    glowColor: "rgba(232,201,154,0.30)",
    bg: "#0A0805",
  },
  {
    id: "orchids",
    emoji: "🪷",
    name: "Pink Orchids",
    note: "Rare, extraordinary — a mirror of who you are.",
    accentColor: C.roseLight,
    glowColor: "rgba(232,180,186,0.30)",
    bg: "#100A0D",
  },
  {
    id: "lavender",
    emoji: "💜",
    name: "Wild Lavender",
    note: "Dreams pressed into petals, peace carried in fragrance.",
    accentColor: C.lavLight,
    glowColor: "rgba(221,208,234,0.28)",
    bg: "#0A0810",
  },
  {
    id: "peonies",
    emoji: "🌺",
    name: "Lush Peonies",
    note: "Extravagant beauty — the way you fill every room.",
    accentColor: "#E8A0A8",
    glowColor: "rgba(232,160,168,0.30)",
    bg: "#0E0609",
  },
];

// ─── Chart data ───────────────────────────────────────────────────
const CHART_DATA = [
  { label: "Jan",    h: 38 },
  { label: "Feb",    h: 42 },
  { label: "Mar",    h: 40 },
  { label: "Apr 18", h: 41 },
  { label: "Apr 20", h: 43 },
  { label: `${CONFIG.date} ✦`, h: 999 },
  { label: "Apr 22", h: 44 },
  { label: "May",    h: 39 },
];

// ─── Ghazal poem ──────────────────────────────────────────────────
const POEM_LINES = [
  "Woh din jab tu aayi, zameen ko mila aasmaan tha,",
  "Har phool khila, har taara chamka — yeh tera jahaan tha.",
  "Is duniya ke rang tere bina the pheke pheke,",
  "Tu jo muskurayi, toh lagaa — yahi to jahaan tha.",
];

// ─── Hinglish typewriter sentence ────────────────────────────────
const HINGLISH_TEXT =
  "Aur is poore universe mein, Noida mein hua wo sabse bada moment... Jab tum aayi.";

// ─── Romantic bouquet note ────────────────────────────────────────
const BOUQUET_NOTE =
  "Every petal in this bouquet holds a whisper meant only for you. " +
  "Like you, each flower is irreplaceable — and together, they are magnificent. " +
  "Happy Birthday. The universe bloomed the day you arrived.";

// ════════════════════════════════════════════════════════════════════
//  SHARED UTILITIES
// ════════════════════════════════════════════════════════════════════

function Reveal({ children, delay = 0, y = 32 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-55px" }}
      transition={{ duration: 1.15, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ index, text }) {
  return (
    <p style={{
      fontFamily: "DM Mono, monospace",
      fontSize: 9,
      color: C.roseGold,
      letterSpacing: "0.34em",
      marginBottom: 20,
      opacity: 0.75,
    }}>
      0{index} — {text.toUpperCase()}
    </p>
  );
}

function PetalRule({ style = {} }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      ...style,
    }}>
      <div style={{ flex: 1, height: "0.5px", background: `linear-gradient(90deg, transparent, ${C.roseGold}55)` }} />
      <span style={{ color: C.roseGold, fontSize: 10, opacity: 0.6 }}>✦</span>
      <div style={{ flex: 1, height: "0.5px", background: `linear-gradient(90deg, ${C.roseGold}55, transparent)` }} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  CHART TOOLTIP
// ════════════════════════════════════════════════════════════════════
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0F090E",
      border: `1px solid ${C.faint}`,
      padding: "10px 18px",
      fontFamily: "DM Mono, monospace",
      fontSize: 10,
      color: C.roseGold,
      letterSpacing: "0.1em",
    }}>
      <p style={{ margin: 0, opacity: 0.5, marginBottom: 5, fontSize: 9 }}>{label}</p>
      <p style={{ margin: 0 }}>
        {payload[0].value > 100 ? "∞ — unmeasurable" : payload[0].value}
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  BOUQUET MODAL
// ════════════════════════════════════════════════════════════════════
function BouquetModal({ selectedFlowers, onClose }) {
  // Stable particle positions
  const particles = useRef(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      emoji: FLOWERS[i % FLOWERS.length].emoji,
      left: `${((i * 3.3 + 2) % 94)}%`,
      delay: (i % 8) * 0.28,
      dur: 4.2 + (i % 6) * 0.5,
      size: 18 + (i % 5) * 8,
    }))
  ).current;

  return (
    <motion.div
      key="bouquet-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 600,
        background: "radial-gradient(ellipse at 50% 20%, #1A0510 0%, #080508 55%, #050305 100%)",
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
          aria-hidden="true"
          style={{
            position: "absolute",
            left: p.left,
            top: "-80px",
            fontSize: p.size,
            pointerEvents: "none",
            userSelect: "none",
          }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [0, p.id % 2 === 0 ? 270 : -270],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Ambient glow */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,132,138,0.12) 0%, transparent 68%)",
          pointerEvents: "none",
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Card */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 36 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          textAlign: "center",
          padding: "clamp(36px, 6vw, 56px) clamp(28px, 5vw, 56px)",
          maxWidth: 580,
          width: "90%",
          background: "rgba(15,9,14,0.92)",
          border: `1px solid ${C.roseDark}55`,
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Corners */}
        {["topLeft", "topRight", "bottomLeft", "bottomRight"].map((pos) => (
          <div key={pos} aria-hidden="true" style={{
            position: "absolute",
            width: 18, height: 18,
            borderColor: `${C.roseGold}60`,
            borderStyle: "solid",
            borderWidth: 0,
            ...(pos === "topLeft"     ? { top: 14, left: 14, borderTopWidth: 1, borderLeftWidth: 1 }    : {}),
            ...(pos === "topRight"    ? { top: 14, right: 14, borderTopWidth: 1, borderRightWidth: 1 }   : {}),
            ...(pos === "bottomLeft"  ? { bottom: 14, left: 14, borderBottomWidth: 1, borderLeftWidth: 1 } : {}),
            ...(pos === "bottomRight" ? { bottom: 14, right: 14, borderBottomWidth: 1, borderRightWidth: 1 } : {}),
          }} />
        ))}

        <motion.p
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ fontSize: 24, marginBottom: 22, letterSpacing: "0.2em", color: C.roseGold }}
        >
          ✦
        </motion.p>

        <h2 style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontSize: "clamp(28px, 6vw, 42px)",
          fontWeight: 300,
          color: C.cream,
          letterSpacing: "0.02em",
          marginBottom: 10,
          lineHeight: 1.15,
        }}>
          Your Bouquet
        </h2>
        <p style={{
          fontFamily: "DM Mono, monospace",
          fontSize: 9,
          color: C.roseGold,
          letterSpacing: "0.28em",
          opacity: 0.65,
          marginBottom: 36,
        }}>
          {selectedFlowers.length} FLOWER{selectedFlowers.length !== 1 ? "S" : ""} SELECTED
        </p>

        {/* Flower arrangement */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 16,
          marginBottom: 36,
        }}>
          {selectedFlowers.map((flower, i) => (
            <motion.div
              key={flower.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 2.8 + i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
                style={{
                  width: 70, height: 70,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${flower.glowColor} 0%, transparent 70%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  boxShadow: `0 0 28px ${flower.glowColor}`,
                }}
              >
                {flower.emoji}
              </motion.div>
              <span style={{
                fontFamily: "DM Mono, monospace",
                fontSize: 8,
                color: flower.accentColor,
                letterSpacing: "0.14em",
                opacity: 0.75,
              }}>
                {flower.name.toUpperCase().split(" ")[0]}
              </span>
            </motion.div>
          ))}
        </div>

        <PetalRule style={{ marginBottom: 28 }} />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: "clamp(14px, 2.5vw, 18px)",
            fontStyle: "italic",
            fontWeight: 300,
            color: C.muted,
            lineHeight: 1.95,
            marginBottom: 36,
          }}
        >
          "{BOUQUET_NOTE}"
        </motion.p>

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
            fontSize: 9,
            color: C.muted,
            letterSpacing: "0.22em",
          }}
        >
          <X size={11} /> CLOSE
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  HINGLISH TYPEWRITER
// ════════════════════════════════════════════════════════════════════
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
      } else {
        clearInterval(timer);
      }
    }, 48);
    return () => clearInterval(timer);
  }, [trigger, started]);

  if (!trigger) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        marginTop: 36,
        padding: "24px 28px",
        background: `linear-gradient(135deg, ${C.bgCard} 0%, #12080F 100%)`,
        border: `1px solid ${C.faint}`,
        position: "relative",
      }}
    >
      {/* Rose gold left accent bar */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, bottom: 0,
        width: 2,
        background: `linear-gradient(180deg, transparent, ${C.roseGold}, transparent)`,
      }} />
      <p style={{
        fontFamily: "Cormorant Garamond, Georgia, serif",
        fontSize: "clamp(16px, 2.8vw, 22px)",
        fontStyle: "italic",
        color: C.champLight,
        lineHeight: 1.85,
        letterSpacing: "0.02em",
        paddingLeft: 16,
      }}>
        {displayed}
        {displayed.length < HINGLISH_TEXT.length && (
          <span style={{
            display: "inline-block",
            width: 2,
            height: "1em",
            background: C.roseGold,
            verticalAlign: "text-bottom",
            marginLeft: 2,
            animation: "twBlink 1s step-end infinite",
          }} />
        )}
      </p>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PULSING HEART (Rose Gold Heartbeat)
// ════════════════════════════════════════════════════════════════════
function HeartbeatBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Outer soft aura */}
      <motion.div
        style={{
          position: "absolute",
          width: "min(70vw, 520px)",
          height: "min(70vw, 520px)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.heartGlow} 0%, rgba(201,132,138,0.07) 40%, transparent 72%)`,
        }}
        animate={{ scale: [1, 1.22, 1, 1.22, 1], opacity: [0.45, 0.8, 0.45, 0.8, 0.45] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
      />

      {/* Heart SVG — rose gold, large and soft */}
      <motion.svg
        viewBox="0 0 200 185"
        style={{
          width: "min(55vw, 420px)",
          height: "auto",
          position: "absolute",
          opacity: 0.085,
        }}
        animate={{
          scale: [1, 1.09, 0.97, 1.09, 1],
          opacity: [0.07, 0.13, 0.07, 0.13, 0.07],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      >
        <defs>
          <radialGradient id="heartGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={C.roseLight} />
            <stop offset="55%" stopColor={C.roseGold} />
            <stop offset="100%" stopColor={C.roseDark} />
          </radialGradient>
        </defs>
        <path
          d="M100 170 C40 130 0 100 0 55 C0 25 22 5 50 5 C67 5 83 14 100 30 C117 14 133 5 150 5 C178 5 200 25 200 55 C200 100 160 130 100 170 Z"
          fill="url(#heartGrad)"
        />
      </motion.svg>

      {/* Secondary smaller beating heart */}
      <motion.svg
        viewBox="0 0 200 185"
        style={{
          width: "min(28vw, 210px)",
          height: "auto",
          position: "absolute",
          opacity: 0.06,
        }}
        animate={{
          scale: [0.98, 1.13, 0.98, 1.13, 0.98],
          opacity: [0.04, 0.10, 0.04, 0.10, 0.04],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.08,
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      >
        <path
          d="M100 170 C40 130 0 100 0 55 C0 25 22 5 50 5 C67 5 83 14 100 30 C117 14 133 5 150 5 C178 5 200 25 200 55 C200 100 160 130 100 170 Z"
          fill={C.roseLight}
        />
      </motion.svg>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════
export default function BirthdayTributeV2() {
  // ── Hero typewriter state ────────────────────────────────────
  const [heroPhase, setHeroPhase]           = useState(0);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [currentLine, setCurrentLine]       = useState("");
  const [charIdx, setCharIdx]               = useState(0);
  const [eventIdx, setEventIdx]             = useState(0);
  const [transitionText, setTransitionText] = useState("");
  const [transitionChar, setTransitionChar] = useState(0);

  // ── App-level state ──────────────────────────────────────────
  const [showMain, setShowMain]             = useState(false);
  const [selectedIds, setSelectedIds]       = useState(new Set());
  const [bouquetOpen, setBouquetOpen]       = useState(false);
  const [noidaTrigger, setNoidaTrigger]     = useState(false);
  const [hinglishTrigger, setHinglishTrigger] = useState(false);
  const [finalMode, setFinalMode]           = useState(false);
  const [siteGone, setSiteGone]             = useState(false);
  const [musicPlaying, setMusicPlaying]     = useState(false);

  // ── Refs ─────────────────────────────────────────────────────
  const audioRef    = useRef(null);
  const noidaRef    = useRef(null);

  // ── Audio helpers ────────────────────────────────────────────
  const startMusic = useCallback(() => {
    if (audioRef.current && !musicPlaying) {
      audioRef.current.volume = 0;
      audioRef.current.play().then(() => {
        setMusicPlaying(true);
        // Fade in volume over 3s
        let vol = 0;
        const fade = setInterval(() => {
          vol = Math.min(vol + 0.04, 0.55);
          if (audioRef.current) audioRef.current.volume = vol;
          if (vol >= 0.55) clearInterval(fade);
        }, 120);
      }).catch(() => {});
    }
  }, [musicPlaying]);

  // ── Phase 0: type historical events ─────────────────────────
  useEffect(() => {
    if (heroPhase !== 0) return;
    const ev   = HISTORICAL_EVENTS[eventIdx];
    const full = `${ev.year}  —  ${ev.text}`;
    if (charIdx < full.length) {
      const t = setTimeout(() => {
        setCurrentLine((p) => p + full[charIdx]);
        setCharIdx((c) => c + 1);
      }, 34);
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

  // ── Phase 1: type transition sentence ───────────────────────
  useEffect(() => {
    if (heroPhase !== 1) return;
    if (transitionChar < TRANSITION_LINE.length) {
      const t = setTimeout(() => {
        setTransitionText((p) => p + TRANSITION_LINE[transitionChar]);
        setTransitionChar((p) => p + 1);
      }, 42);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setHeroPhase(2), 500);
      return () => clearTimeout(t);
    }
  }, [heroPhase, transitionChar]);

  // ── Phase 2 → 3 ─────────────────────────────────────────────
  useEffect(() => {
    if (heroPhase !== 2) return;
    const t = setTimeout(() => setHeroPhase(3), 1700);
    return () => clearTimeout(t);
  }, [heroPhase]);

  // ── Noida section intersection observer ──────────────────────
  useEffect(() => {
    if (!noidaRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNoidaTrigger(true);
          setTimeout(() => setHinglishTrigger(true), 1800);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(noidaRef.current);
    return () => obs.disconnect();
  }, [showMain]);

  // ── Bouquet derived state ────────────────────────────────────
  const selectedFlowers = FLOWERS.filter((f) => selectedIds.has(f.id));

  const toggleFlower = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Final farewell ───────────────────────────────────────────
  const handleClose = () => {
    setFinalMode(true);
    setTimeout(() => setSiteGone(true), 5200);
  };

  // ─── Outro glow screen ───────────────────────────────────────
  if (siteGone) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400&display=swap');
          body { background: #080508; margin: 0; }
        `}</style>
        <div style={{
          background: C.bg, minHeight: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            style={{ textAlign: "center" }}
          >
            <motion.p
              animate={{ opacity: [0, 0.8, 0.3, 0.7, 0.3] }}
              transition={{ duration: 5, times: [0,0.2,0.5,0.7,1], repeat: Infinity }}
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: 12,
                color: C.roseGold,
                letterSpacing: "0.38em",
              }}
            >
              ✦ &nbsp;&nbsp; HAPPY BIRTHDAY &nbsp;&nbsp; ✦
            </motion.p>
          </motion.div>
        </div>
      </>
    );
  }

  // ════════════════════════════════════════════════════════════
  //  MAIN RENDER
  // ════════════════════════════════════════════════════════════
  return (
    <>
      {/* ── Google Fonts + Global Styles ───────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Mono:wght@300;400&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: ${C.bg};
          color: ${C.cream};
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        ::-webkit-scrollbar { width: 2px; background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.roseDark}88; }

        @keyframes twBlink { 50% { opacity: 0; } }

        .tw-cursor::after {
          content: '|';
          color: ${C.roseGold};
          font-weight: 300;
          animation: twBlink 1.05s step-end infinite;
          margin-left: 1px;
        }

        /* Film grain */
        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 9999;
          opacity: 0.022;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* Petal float animation for background */
        @keyframes floatPetal {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.18; }
          90%  { opacity: 0.18; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>

      {/* Film grain overlay */}
      <div className="grain" aria-hidden="true" />

      {/* Audio element */}
      {CONFIG.musicUrl && (
        <audio ref={audioRef} src={CONFIG.musicUrl} loop preload="auto" />
      )}

      {/* Music status indicator */}
      <AnimatePresence>
        {showMain && CONFIG.musicUrl && (
          <motion.div
            key="music-indicator"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 22,
              right: 22,
              zIndex: 400,
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontFamily: "DM Mono, monospace",
              fontSize: 9,
              color: musicPlaying ? C.roseGold : C.muted,
              letterSpacing: "0.18em",
              opacity: 0.7,
              cursor: "pointer",
            }}
            onClick={() => {
              if (audioRef.current) {
                if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false); }
                else { audioRef.current.play(); setMusicPlaying(true); }
              }
            }}
          >
            <Music2 size={11} />
            {musicPlaying ? "PLAYING" : "PAUSED"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Farewell Overlay ────────────────────────────────────── */}
      <AnimatePresence>
        {finalMode && !siteGone && (
          <motion.div
            key="farewell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4 }}
            style={{
              position: "fixed", inset: 0, zIndex: 800,
              background: "rgba(8,5,8,0.97)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 32px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ textAlign: "center", maxWidth: 560 }}
            >
              <motion.div
                animate={{ scale: [1, 1.12, 0.98, 1.12, 1], opacity: [0.3, 0.8, 0.3, 0.8, 0.3] }}
                transition={{ duration: 1.6, repeat: Infinity, times: [0, 0.25, 0.5, 0.75, 1] }}
                style={{ fontSize: 38, marginBottom: 34 }}
              >
                🌹
              </motion.div>
              <p style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: "clamp(18px, 3.5vw, 24px)",
                fontStyle: "italic",
                fontWeight: 300,
                color: C.cream,
                lineHeight: 2.1,
                marginBottom: 36,
              }}>
                Every year the stars realign —<br />
                but only once did they arrange themselves<br />
                perfectly enough to bring you into this world.<br /><br />
                <span style={{ color: C.roseGold }}>
                  {CONFIG.date}, {CONFIG.year}
                </span>
                . That was the day everything changed.
              </p>
              <PetalRule style={{ marginBottom: 28 }} />
              <p style={{
                fontFamily: "DM Mono, monospace",
                fontSize: 10,
                color: C.roseGold,
                letterSpacing: "0.28em",
                opacity: 0.85,
              }}>
                HAPPY BIRTHDAY, {CONFIG.name.toUpperCase()}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main wrapper */}
      <motion.div
        style={{ background: C.bg, minHeight: "100vh" }}
        animate={{ opacity: finalMode ? 0 : 1 }}
        transition={{ duration: 2.4, delay: finalMode ? 2.2 : 0 }}
      >
        {/* ══════════════════════════════════════════════════════
            HERO SECTION — The Time Traveler
        ══════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {!showMain && (
            <motion.section
              key="hero"
              exit={{ opacity: 0, transition: { duration: 0.9 } }}
              style={{
                position: "fixed", inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 clamp(28px, 7vw, 110px)",
                background: `radial-gradient(ellipse at 30% 60%, #1A080F 0%, ${C.bg} 55%)`,
              }}
            >
              {/* Corner decorations */}
              <div style={{ position: "absolute", top: 24, left: 28 }}>
                <p style={{
                  fontFamily: "DM Mono, monospace", fontSize: 8,
                  color: C.roseGold, letterSpacing: "0.32em", opacity: 0.4,
                }}>
                  ✦ {CONFIG.date.toUpperCase()} · {CONFIG.year}
                </p>
              </div>
              <div style={{ position: "absolute", bottom: 28, right: 28 }}>
                <p style={{
                  fontFamily: "DM Mono, monospace", fontSize: 8,
                  color: C.roseGold, letterSpacing: "0.32em", opacity: 0.28,
                }}>
                  FOR {CONFIG.name.toUpperCase()}
                </p>
              </div>

              {/* Ambient rose glow */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: 600, height: 600, borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(140,74,82,0.07) 0%, transparent 70%)",
                  top: "50%", left: "20%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ maxWidth: 720, width: "100%" }}>
                {/* Completed events */}
                <div style={{ marginBottom: 48 }}>
                  {completedEvents.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.32 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        fontFamily: "DM Mono, monospace",
                        fontSize: "clamp(10px, 1.5vw, 12px)",
                        color: C.cream,
                        lineHeight: 1.9,
                        marginBottom: 10,
                      }}
                    >
                      {line}
                    </motion.p>
                  ))}
                  {heroPhase === 0 && (
                    <p
                      className="tw-cursor"
                      style={{
                        fontFamily: "DM Mono, monospace",
                        fontSize: "clamp(10px, 1.5vw, 12px)",
                        color: C.cream,
                        lineHeight: 1.9,
                        opacity: 0.32,
                        minHeight: "1.9em",
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
                      fontSize: "clamp(11px, 1.8vw, 13px)",
                      color: C.champagne,
                      letterSpacing: "0.04em",
                      lineHeight: 1.8,
                      marginBottom: 40,
                      minHeight: "1.8em",
                    }}
                  >
                    {heroPhase === 1 ? transitionText : TRANSITION_LINE}
                  </motion.p>
                )}

                {/* Name */}
                <AnimatePresence>
                  {heroPhase >= 2 && (
                    <motion.h1
                      key="name"
                      initial={{ opacity: 0, y: 36, filter: "blur(18px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontSize: "clamp(72px, 14vw, 128px)",
                        fontWeight: 300,
                        color: C.cream,
                        lineHeight: 0.9,
                        letterSpacing: "-0.03em",
                        marginBottom: 8,
                      }}
                    >
                      {CONFIG.name}
                    </motion.h1>
                  )}
                </AnimatePresence>

                {/* Decorative underline */}
                {heroPhase >= 2 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.2, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      height: 1,
                      width: "clamp(120px, 25vw, 240px)",
                      background: `linear-gradient(90deg, ${C.roseGold}, ${C.champagne}44, transparent)`,
                      transformOrigin: "left",
                      marginBottom: 0,
                    }}
                  />
                )}

                {/* BEGIN button */}
                <AnimatePresence>
                  {heroPhase >= 3 && (
                    <motion.button
                      key="begin"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 1.0 }}
                      whileHover={{ x: 10 }}
                      onClick={() => {
                        setShowMain(true);
                        startMusic();
                      }}
                      style={{
                        marginTop: 58,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        fontFamily: "DM Mono, monospace",
                        fontSize: 10,
                        color: C.roseGold,
                        letterSpacing: "0.28em",
                        padding: 0,
                      }}
                    >
                      BEGIN THE JOURNEY
                      <ChevronDown size={12} strokeWidth={1.5} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {showMain && (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6 }}
            >
              {/* ──────────────────────────────────────────────────
                  §1 — THE SPACE JOURNEY (Noida)
              ─────────────────────────────────────────────────── */}
              <section
                ref={noidaRef}
                style={{
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "100px clamp(24px, 6vw, 100px)",
                  borderBottom: `1px solid ${C.fainter}`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Ambient */}
                <motion.div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "40%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 700, height: 700, borderRadius: "50%",
                    background: `radial-gradient(circle, rgba(140,74,82,0.04) 0%, transparent 70%)`,
                    pointerEvents: "none",
                  }}
                  animate={{ scale: [1, 1.14, 1] }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                />

                <div style={{ maxWidth: 740, width: "100%", textAlign: "center" }}>
                  <Reveal>
                    <SectionLabel index={1} text="The Space Journey" />
                    <h2 style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontSize: "clamp(34px, 6.5vw, 64px)",
                      fontWeight: 300,
                      color: C.cream,
                      lineHeight: 1.12,
                      letterSpacing: "-0.015em",
                      marginBottom: 16,
                    }}>
                      From the Stars to{" "}
                      <em style={{ color: C.roseGold, fontStyle: "italic" }}>
                        {CONFIG.city}
                      </em>
                    </h2>
                    <p style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontSize: "clamp(16px, 2.2vw, 19px)",
                      fontStyle: "italic",
                      color: C.muted,
                      marginBottom: 52,
                      lineHeight: 1.8,
                    }}>
                      The universe had one destination in mind.
                    </p>
                  </Reveal>

                  {/* Video Placeholder */}
                  <Reveal delay={0.18}>
                    <div style={{
                      width: "100%",
                      aspectRatio: "16 / 9",
                      background: C.bgDeep,
                      border: `1px solid ${C.faint}`,
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 0,
                    }}>
                      {/* Animated stars */}
                      {Array.from({ length: 60 }, (_, i) => (
                        <motion.div
                          key={i}
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            width: i % 9 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
                            height: i % 9 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
                            borderRadius: "50%",
                            background: i % 7 === 0 ? C.roseLight : C.cream,
                            left: `${(i * 16.7 + 2) % 97}%`,
                            top:  `${(i * 11.3 + 5) % 95}%`,
                          }}
                          animate={{ opacity: [0.1, 0.9, 0.1] }}
                          transition={{
                            duration: 2 + (i % 5) * 0.6,
                            repeat: Infinity,
                            delay: (i * 0.08) % 2.5,
                          }}
                        />
                      ))}

                      {/* Placeholder label */}
                      <div style={{ textAlign: "center", zIndex: 2, position: "relative" }}>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          style={{
                            width: 56, height: 56,
                            borderRadius: "50%",
                            border: `1px solid ${C.roseGold}88`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                          }}
                        >
                          <div style={{
                            width: 0, height: 0,
                            borderTop: "8px solid transparent",
                            borderBottom: "8px solid transparent",
                            borderLeft: `15px solid ${C.roseGold}`,
                            marginLeft: 4,
                          }} />
                        </motion.div>
                        <p style={{
                          fontFamily: "DM Mono, monospace",
                          fontSize: 9,
                          color: C.roseGold,
                          letterSpacing: "0.24em",
                          opacity: 0.7,
                          marginBottom: 6,
                        }}>
                          PLACE GOOGLE EARTH VIDEO HERE
                        </p>
                        <p style={{
                          fontFamily: "DM Mono, monospace",
                          fontSize: 8,
                          color: C.muted,
                          letterSpacing: "0.14em",
                          opacity: 0.45,
                        }}>
                          Zoom: Stars → {CONFIG.city}
                        </p>
                      </div>
                    </div>
                  </Reveal>

                  {/* Noida Photo Reveal */}
                  <AnimatePresence>
                    {noidaTrigger && (
                      <motion.div
                        key="noida-photo"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          marginTop: 24,
                          width: "100%",
                          aspectRatio: "16 / 7",
                          background: CONFIG.noidaPhoto
                            ? `url(${CONFIG.noidaPhoto}) center/cover`
                            : `linear-gradient(135deg, #12060E 0%, #1A0812 40%, #0D060A 100%)`,
                          border: `1px solid ${C.faint}`,
                          position: "relative",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* Vignette */}
                        <div style={{
                          position: "absolute", inset: 0,
                          background: "radial-gradient(ellipse at center, transparent 30%, rgba(8,5,8,0.7) 100%)",
                        }} />

                        {!CONFIG.noidaPhoto && (
                          <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                            <p style={{
                              fontFamily: "Cormorant Garamond, Georgia, serif",
                              fontSize: "clamp(22px, 4vw, 38px)",
                              fontStyle: "italic",
                              color: C.roseGold,
                              opacity: 0.6,
                              marginBottom: 8,
                            }}>
                              {CONFIG.city}
                            </p>
                            <p style={{
                              fontFamily: "DM Mono, monospace",
                              fontSize: 9,
                              color: C.muted,
                              letterSpacing: "0.2em",
                              opacity: 0.45,
                            }}>
                              PLACE CITY PHOTO HERE
                            </p>
                          </div>
                        )}

                        {/* Bottom text tag */}
                        <div style={{
                          position: "absolute",
                          bottom: 0, left: 0, right: 0,
                          padding: "20px 24px 18px",
                          background: "linear-gradient(0deg, rgba(8,5,8,0.88) 0%, transparent 100%)",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}>
                          <div style={{ width: 1, height: 28, background: `${C.roseGold}80` }} />
                          <p style={{
                            fontFamily: "DM Mono, monospace",
                            fontSize: 9,
                            color: C.roseGold,
                            letterSpacing: "0.22em",
                            opacity: 0.7,
                          }}>
                            {CONFIG.city.toUpperCase()} · WHERE IT ALL BEGAN
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hinglish Typewriter */}
                  <HinglishTypewriter trigger={hinglishTrigger} />
                </div>
              </section>

              {/* ──────────────────────────────────────────────────
                  §2 — INTERACTIVE FLOWER BOUTIQUE
              ─────────────────────────────────────────────────── */}
              <section style={{
                minHeight: "100vh",
                padding: "100px clamp(24px, 6vw, 100px) 60px",
                borderBottom: `1px solid ${C.fainter}`,
                position: "relative",
              }}>
                {/* Background petal watermarks */}
                <div aria-hidden="true" style={{
                  position: "absolute", inset: 0,
                  pointerEvents: "none", overflow: "hidden",
                }}>
                  {["🌹","🌸","🌺","💜","🌻","🪷"].map((em, i) => (
                    <div key={i} style={{
                      position: "absolute",
                      fontSize: 14 + (i % 3) * 4,
                      opacity: 0.035,
                      left: `${(i * 16 + 3) % 90}%`,
                      top:  `${(i * 13 + 7) % 85}%`,
                    }}>
                      {em}
                    </div>
                  ))}
                </div>

                <div style={{ maxWidth: 1060, margin: "0 auto", width: "100%" }}>
                  <Reveal>
                    <SectionLabel index={2} text="The Flower Boutique" />
                    <h2 style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontSize: "clamp(34px, 6.5vw, 64px)",
                      fontWeight: 300,
                      color: C.cream,
                      lineHeight: 1.12,
                      letterSpacing: "-0.015em",
                      marginBottom: 12,
                    }}>
                      Build Your Bouquet
                    </h2>
                    <p style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontSize: "clamp(16px, 2.2vw, 19px)",
                      fontStyle: "italic",
                      color: C.muted,
                      marginBottom: 18,
                    }}>
                      Choose the flowers that speak your heart. Select many, select freely.
                    </p>
                    {/* Counter */}
                    <motion.p
                      layout
                      style={{
                        fontFamily: "DM Mono, monospace",
                        fontSize: 10,
                        color: selectedIds.size > 0 ? C.roseGold : C.muted,
                        letterSpacing: "0.2em",
                        marginBottom: 52,
                        transition: "color 0.3s ease",
                      }}
                    >
                      Added to Bouquet:{" "}
                      <motion.span
                        key={selectedIds.size}
                        initial={{ scale: 1.6, color: C.roseLight }}
                        animate={{ scale: 1, color: selectedIds.size > 0 ? C.roseGold : C.muted }}
                        transition={{ duration: 0.4 }}
                        style={{ display: "inline-block" }}
                      >
                        {selectedIds.size}
                      </motion.span>{" "}
                      flower{selectedIds.size !== 1 ? "s" : ""}
                    </motion.p>
                  </Reveal>

                  {/* Flower grid */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 18,
                    marginBottom: 48,
                  }}>
                    {FLOWERS.map((flower, i) => {
                      const isSelected = selectedIds.has(flower.id);
                      return (
                        <Reveal key={flower.id} delay={i * 0.09}>
                          <motion.button
                            whileHover={{ y: -8 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleFlower(flower.id)}
                            animate={{
                              borderColor: isSelected
                                ? flower.accentColor
                                : C.fainter,
                              boxShadow: isSelected
                                ? `0 0 32px ${flower.glowColor}, 0 0 80px ${flower.glowColor}44`
                                : "none",
                            }}
                            transition={{ duration: 0.35 }}
                            style={{
                              width: "100%",
                              background: isSelected
                                ? `linear-gradient(145deg, ${flower.bg} 0%, ${flower.bg}EE 100%)`
                                : C.bgCard,
                              border: `1px solid ${C.fainter}`,
                              padding: "38px 28px 32px",
                              cursor: "pointer",
                              textAlign: "left",
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            {/* Selection checkmark */}
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{
                                scale: isSelected ? 1 : 0,
                                opacity: isSelected ? 1 : 0,
                              }}
                              transition={{ duration: 0.3, ease: "backOut" }}
                              style={{
                                position: "absolute",
                                top: 14, right: 14,
                                width: 22, height: 22,
                                borderRadius: "50%",
                                background: flower.accentColor,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                                <path d="M1 4.5L4 7.5L10 1" stroke="#080508" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </motion.div>

                            {/* Glow wash when selected */}
                            <div style={{
                              position: "absolute", inset: 0,
                              background: isSelected
                                ? `radial-gradient(ellipse at 25% 25%, ${flower.glowColor} 0%, transparent 65%)`
                                : "transparent",
                              transition: "background 0.5s ease",
                              pointerEvents: "none",
                            }} />

                            <div style={{ fontSize: 44, marginBottom: 22, lineHeight: 1 }}>
                              {flower.emoji}
                            </div>
                            <h3 style={{
                              fontFamily: "Cormorant Garamond, Georgia, serif",
                              fontSize: 26,
                              fontWeight: 400,
                              color: isSelected ? flower.accentColor : C.cream,
                              marginBottom: 10,
                              lineHeight: 1.2,
                              transition: "color 0.3s ease",
                            }}>
                              {flower.name}
                            </h3>
                            <p style={{
                              fontFamily: "DM Mono, monospace",
                              fontSize: 10,
                              color: C.muted,
                              lineHeight: 1.85,
                              marginBottom: 0,
                            }}>
                              {flower.note}
                            </p>
                          </motion.button>
                        </Reveal>
                      );
                    })}
                  </div>

                  {/* Create Bouquet CTA */}
                  <AnimatePresence>
                    {selectedIds.size > 0 && (
                      <motion.div
                        key="bouquet-cta"
                        initial={{ opacity: 0, y: 18, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        style={{ textAlign: "center" }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.03, boxShadow: `0 0 50px ${C.heartGlow}` }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setBouquetOpen(true)}
                          style={{
                            background: `linear-gradient(135deg, ${C.roseDark} 0%, ${C.roseGold} 50%, ${C.champagne}BB 100%)`,
                            border: "none",
                            padding: "18px 52px",
                            cursor: "pointer",
                            fontFamily: "DM Mono, monospace",
                            fontSize: 10,
                            color: C.bg,
                            letterSpacing: "0.24em",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Sparkles size={13} />
                          CREATE MY BOUQUET
                          <Sparkles size={13} />
                        </motion.button>
                        <p style={{
                          fontFamily: "DM Mono, monospace",
                          fontSize: 9,
                          color: C.muted,
                          letterSpacing: "0.16em",
                          marginTop: 14,
                          opacity: 0.55,
                        }}>
                          {selectedIds.size} flower{selectedIds.size !== 1 ? "s" : ""} ready to present
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>

              {/* ──────────────────────────────────────────────────
                  §3 — THE ECONOMICS OF HER
              ─────────────────────────────────────────────────── */}
              <section style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "100px clamp(24px, 6vw, 100px)",
                borderBottom: `1px solid ${C.fainter}`,
              }}>
                <div style={{ maxWidth: 820, margin: "0 auto", width: "100%" }}>
                  <Reveal>
                    <SectionLabel index={3} text="The Economics" />
                    <h2 style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontSize: "clamp(34px, 6.5vw, 64px)",
                      fontWeight: 300,
                      color: C.cream,
                      lineHeight: 1.12,
                      letterSpacing: "-0.015em",
                      marginBottom: 14,
                    }}>
                      The Economics of Her
                    </h2>
                    <p style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontSize: "clamp(16px, 2.2vw, 19px)",
                      fontStyle: "italic",
                      color: C.muted,
                      marginBottom: 50,
                    }}>
                      Global Happiness Index — observed over April
                    </p>
                  </Reveal>

                  <Reveal delay={0.18}>
                    <div style={{
                      background: C.bgCard,
                      border: `1px solid ${C.faint}`,
                      padding: "28px 12px 22px",
                    }}>
                      <p style={{
                        fontFamily: "DM Mono, monospace",
                        fontSize: 8,
                        color: C.muted,
                        letterSpacing: "0.2em",
                        textAlign: "right",
                        paddingRight: 18,
                        marginBottom: 10,
                        opacity: 0.5,
                      }}>
                        HAPPINESS INDEX (ARBITRARY UNITS)
                      </p>
                      <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={CHART_DATA} margin={{ top: 8, right: 24, left: -16, bottom: 0 }}>
                          <XAxis
                            dataKey="label"
                            tick={{ fill: C.muted, fontFamily: "DM Mono, monospace", fontSize: 9 }}
                            axisLine={{ stroke: C.faint }}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fill: C.muted, fontFamily: "DM Mono, monospace", fontSize: 9 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => v > 100 ? "∞" : v}
                            domain={[0, 580]}
                          />
                          <Tooltip content={<ChartTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="h"
                            stroke={C.roseGold}
                            strokeWidth={1.5}
                            dot={{ fill: C.roseGold, r: 3, strokeWidth: 0 }}
                            activeDot={{ r: 5.5, fill: C.roseLight, strokeWidth: 0 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Reveal>

                  <Reveal delay={0.34}>
                    <p style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontSize: "clamp(16px, 2.2vw, 20px)",
                      fontStyle: "italic",
                      color: C.muted,
                      marginTop: 40,
                      lineHeight: 1.95,
                    }}>
                      In a world of variables, constants, and predictable distributions —
                      she remains the ultimate outlier. The anomaly that shatters every model,
                      every regression, every carefully-drawn curve back to the mean.
                    </p>
                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px 26px",
                      marginTop: 22,
                    }}>
                      {["p-value: 0.0000","R²: undefined","n: 1 (irreplaceable)","σ: ∞"].map((s) => (
                        <span key={s} style={{
                          fontFamily: "DM Mono, monospace",
                          fontSize: 9,
                          color: C.roseGold,
                          letterSpacing: "0.14em",
                          opacity: 0.6,
                        }}>
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
              <section style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "100px clamp(24px, 6vw, 100px)",
                borderBottom: `1px solid ${C.fainter}`,
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Watermark */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -50%) rotate(-10deg)",
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                    fontSize: "clamp(80px, 20vw, 200px)",
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: C.roseGold,
                    opacity: 0.025,
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.04em",
                    userSelect: "none",
                  }}
                >
                  {CONFIG.name}
                </div>

                <div style={{
                  maxWidth: 680,
                  textAlign: "center",
                  position: "relative",
                  zIndex: 1,
                }}>
                  <Reveal>
                    <SectionLabel index={4} text="The Poetry Room" />
                    <PetalRule style={{ marginBottom: 56 }} />
                  </Reveal>

                  {POEM_LINES.map((line, i) => (
                    <Reveal key={i} delay={i * 0.28} y={12}>
                      <p style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontSize: "clamp(17px, 3vw, 26px)",
                        fontStyle: "italic",
                        fontWeight: 300,
                        color: i % 2 === 0 ? C.cream : C.roseGold,
                        lineHeight: 1.95,
                        marginBottom: 8,
                        letterSpacing: "0.015em",
                      }}>
                        {line}
                      </p>
                    </Reveal>
                  ))}

                  <Reveal delay={1.4}>
                    <PetalRule style={{ margin: "52px 0 20px" }} />
                    <p style={{
                      fontFamily: "DM Mono, monospace",
                      fontSize: 8,
                      color: C.muted,
                      letterSpacing: "0.28em",
                      opacity: 0.45,
                    }}>
                      GHAZAL · ROMAN URDU · {CONFIG.date.toUpperCase()}
                    </p>
                  </Reveal>
                </div>
              </section>

              {/* ──────────────────────────────────────────────────
                  §5 — THE EPHEMERAL WISH (with Heartbeat)
              ─────────────────────────────────────────────────── */}
              <section style={{
                minHeight: "92vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "80px clamp(24px, 6vw, 100px)",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Rose Gold Heartbeat Background */}
                <HeartbeatBackground />

                {/* Ambient warm glow */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(ellipse at 50% 50%, rgba(140,74,82,0.06) 0%, transparent 68%)",
                    pointerEvents: "none",
                  }}
                />

                <Reveal>
                  <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                    <motion.span
                      animate={{ opacity: [0.2, 0.75, 0.2], scale: [1, 1.12, 0.98, 1.12, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity, times: [0, 0.25, 0.5, 0.75, 1] }}
                      style={{
                        display: "block",
                        fontSize: 28,
                        marginBottom: 38,
                      }}
                    >
                      🌹
                    </motion.span>

                    <h2 style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontSize: "clamp(46px, 9vw, 88px)",
                      fontWeight: 300,
                      color: C.cream,
                      lineHeight: 1.06,
                      letterSpacing: "-0.025em",
                      marginBottom: 18,
                    }}>
                      Happy Birthday,
                      <br />
                      <em style={{ fontStyle: "italic", color: C.roseGold }}>
                        {CONFIG.name}
                      </em>
                    </h2>

                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        height: 1,
                        width: "clamp(100px, 22vw, 200px)",
                        background: `linear-gradient(90deg, transparent, ${C.roseGold}, transparent)`,
                        margin: "0 auto 28px",
                        transformOrigin: "center",
                      }}
                    />

                    <p style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontSize: "clamp(16px, 2.2vw, 20px)",
                      fontStyle: "italic",
                      color: C.muted,
                      maxWidth: 480,
                      margin: "0 auto 60px",
                      lineHeight: 1.95,
                    }}>
                      May this year hold every wish you've whispered to the stars —
                      and a few they haven't heard yet.
                    </p>

                    <motion.button
                      whileHover={{
                        scale: 1.04,
                        borderColor: C.roseGold,
                        background: "rgba(201,132,138,0.08)",
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleClose}
                      style={{
                        background: "none",
                        border: `1px solid ${C.roseGold}66`,
                        color: C.roseGold,
                        fontFamily: "DM Mono, monospace",
                        fontSize: 10,
                        letterSpacing: "0.24em",
                        padding: "17px 44px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        transition: "border-color 0.3s ease, background 0.3s ease",
                      }}
                    >
                      <Heart size={13} fill={C.roseGold} strokeWidth={0} />
                      CLOSE WITH LOVE
                    </motion.button>
                  </div>
                </Reveal>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bouquet Modal */}
      <AnimatePresence>
        {bouquetOpen && selectedFlowers.length > 0 && (
          <BouquetModal
            key="bouquet"
            selectedFlowers={selectedFlowers}
            onClose={() => setBouquetOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
