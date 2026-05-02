import { useState } from "react";
import { motion } from "framer-motion";
import robuxIconSrc from "@assets/8ab2a18d6e954f6b10bad7c36d0ce231-removebg-preview_1777752219611.png";
import bonusCardSrc from "@assets/image_1777752547366.png";

const PREMIUM_PACKAGES = [
  { id: 1, amount: 24000, oldAmount: 22500, bonus: 1500, price: "P11.49K" },
  { id: 2, amount: 11000, oldAmount: 10000, bonus: 1000, price: "P5,700.00" },
  { id: 3, amount: 5250,  oldAmount: 4500,  bonus: 750,  price: "P2,890.00" },
  { id: 4, amount: 3625,  oldAmount: 3150,  bonus: 475,  price: "P1,990.00" },
  { id: 5, amount: 2000,  oldAmount: 1700,  bonus: 300,  price: "P1,150.00" },
];

const BASIC_PACKAGES = [
  { id: 6, amount: 1500, oldAmount: 1200, bonus: 300, price: "P799.00" },
  { id: 7, amount: 1000, oldAmount: 800,  bonus: 200, price: "P569.00" },
  { id: 8, amount: 500,  oldAmount: 400,  bonus: 100, price: "P269.00" },
];

function RobuxCoin({ size = 20 }: { size?: number }) {
  return (
    <img
      src={robuxIconSrc}
      alt="Robux"
      width={size}
      height={size}
      style={{ flexShrink: 0, display: "inline-block" }}
    />
  );
}

function PackageRow({
  pkg,
  isFirst,
  selected,
  onSelect,
}: {
  pkg: { id: number; amount: number; oldAmount: number; bonus: number; price: string };
  isFirst: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      key={pkg.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onSelect}
      data-testid={`row-package-${pkg.id}`}
      className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
      style={{
        background: "#191A1F",
        borderTop: isFirst ? "none" : "1px solid rgba(255,255,255,0.06)",
        outline: selected ? "2px solid rgba(255,255,255,0.15)" : "none",
        outlineOffset: "-2px",
      }}
    >
      <div className="flex items-center gap-3">
        <RobuxCoin size={28} />
        <span style={{ fontSize: "20px", fontWeight: 900 }}>
          {pkg.amount.toLocaleString()}
        </span>
        <span
          style={{
            fontSize: "16px",
            fontWeight: 500,
            textDecoration: "line-through",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          {pkg.oldAmount.toLocaleString()}
        </span>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.5)",
            whiteSpace: "nowrap",
          }}
        >
          + {pkg.bonus.toLocaleString()} more
        </span>
      </div>

      <span
        className="transition-all duration-150 hover:brightness-125"
        style={{
          fontSize: "16px",
          fontWeight: 700,
          padding: "8px 0",
          width: "160px",
          borderRadius: "10px",
          background: "#2a2d38",
          color: "#fff",
          flexShrink: 0,
          marginLeft: "16px",
          textAlign: "center",
          display: "inline-block",
          cursor: "pointer",
        }}
        data-testid={`text-price-${pkg.id}`}
      >
        {pkg.price}
      </span>
    </motion.button>
  );
}

export default function Home() {
  const [selected, setSelected] = useState<number | null>(null);
  const [balance, setBalance] = useState(257);
  const [justBought, setJustBought] = useState<number | null>(null);

  const ALL_PACKAGES = [...PREMIUM_PACKAGES, ...BASIC_PACKAGES];

  const handleSelect = (id: number) => {
    setSelected(prev => (prev === id ? null : id));
  };

  const handleBuy = () => {
    if (selected === null) return;
    const pkg = ALL_PACKAGES.find(p => p.id === selected);
    if (!pkg) return;
    setBalance(prev => prev + pkg.amount);
    setJustBought(pkg.id);
    setSelected(null);
    setTimeout(() => setJustBought(null), 1500);
  };

  return (
    <div
      className="min-h-screen w-full text-white"
      style={{ background: "#121215", fontFamily: "'Plus Jakarta Sans', sans-serif", position: "relative" }}
      data-testid="page-robux"
    >
      {/* ── Windows title bar ── */}
      <div
        className="flex items-center justify-between select-none"
        style={{ background: "#1f1f1f", height: "30px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        data-testid="titlebar"
      >
        <div className="flex items-center gap-1.5 px-3 h-full">
          <div className="w-3.5 h-3.5 rounded-sm flex-shrink-0" style={{ background: "#e2231a" }} aria-hidden="true" />
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>Roblox</span>
        </div>

        <div className="flex items-stretch h-full">
          <button className="flex items-center justify-center hover:bg-white/10 transition-colors" style={{ width: "46px", color: "rgba(255,255,255,0.7)", fontSize: "16px" }} aria-label="Minimize">&#8211;</button>
          <button className="flex items-center justify-center hover:bg-white/10 transition-colors" style={{ width: "46px", color: "rgba(255,255,255,0.7)" }} aria-label="Restore">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><rect x="0.6" y="0.6" width="8.8" height="8.8"/></svg>
          </button>
          <button className="flex items-center justify-center hover:bg-red-600 transition-colors" style={{ width: "46px", color: "rgba(255,255,255,0.7)", fontSize: "14px" }} aria-label="Close" data-testid="button-close">✕</button>
        </div>
      </div>

      {/* ── App bar: × left | username+balance centered | pill right ── */}
      <div
        className="relative flex items-center justify-between px-3 select-none"
        style={{ background: "#1a1a1d", height: "40px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Left: × */}
        <button className="flex items-center justify-center hover:text-white/60 transition-colors" style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", width: "24px", height: "24px" }} aria-label="Back">✕</button>

        {/* Center: username + balance */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ lineHeight: 1.3 }}>
          <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>Benxxyz: 13+</span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Balance: {balance.toLocaleString()} Robux</span>
        </div>

        {/* Right spacer to balance the × on the left */}
        <div style={{ width: "24px" }} />
      </div>

      {/* Balance + Send pill — absolute on page, scrolls with content */}
      <div className="select-none" style={{ position: "absolute", top: "78px", right: "60px", zIndex: 10 }}>
        <div
          className="flex items-center gap-2 rounded-full px-3 py-2"
          style={{ background: "#1e1f23", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center gap-2 pl-1 pr-1">
            <RobuxCoin size={24} />
            <span style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.02em" }}>{balance.toLocaleString()}</span>
          </div>
          <button
            className="flex items-center gap-1.5 px-4 py-1.5 hover:brightness-125 transition-all"
            style={{ borderRadius: "10px", background: "#2e3039", color: "#fff", fontSize: "14px", fontWeight: 700 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Send
          </button>
        </div>
      </div>

      {/* Page content */}
      <main className="max-w-2xl mx-auto px-6 pt-4 pb-16">

        {/* Faded curvy mesh background — upper-right */}
        <div
          style={{
            position: "absolute",
            top: "70px",
            left: 0,
            right: 0,
            width: "100%",
            height: "320px",
            pointerEvents: "none",
            overflow: "hidden",
            maskImage: "radial-gradient(ellipse 70% 75% at 50% 0%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 75% at 50% 0%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 560 320"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Horizontal wavy lines */}
            {Array.from({ length: 26 }, (_, i) => {
              const y = i * 13;
              const w = 2.5;
              return (
                <path
                  key={`h${i}`}
                  d={`M -20 ${y} C 140 ${y + w} 280 ${y - w} 420 ${y + w} S 560 ${y} 580 ${y}`}
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="0.6"
                  fill="none"
                />
              );
            })}
            {/* Vertical wavy lines */}
            {Array.from({ length: 30 }, (_, i) => {
              const x = i * 20;
              const w = 2.5;
              return (
                <path
                  key={`v${i}`}
                  d={`M ${x} -10 C ${x + w} 80 ${x - w} 160 ${x + w} 240 S ${x} 320 ${x} 340`}
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="0.6"
                  fill="none"
                />
              );
            })}
          </svg>
        </div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center leading-[1.1] mt-10 mb-16"
          style={{ fontSize: "clamp(2.8rem, 6vw, 4rem)", fontWeight: 900, letterSpacing: "-0.01em" }}
          data-testid="heading-main"
        >
          Enjoy up to 25%<br />more Robux
        </motion.h1>

        {/* ── Bonus section: card wraps bonus item + premium packages ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.35 }} className="mb-3">
          <p className="mb-2" style={{ fontSize: "17px", fontWeight: 700 }} data-testid="text-bonus-label">
            Bonus item we picked for you
          </p>

          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>

            {/* Bonus item card — full image */}
            <img
              src={bonusCardSrc}
              alt="Steal a Brainrot — 2x Money bonus"
              data-testid="card-bonus-item"
              className="w-full block"
              style={{ display: "block", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            />

            {/* Premium package rows */}
            {PREMIUM_PACKAGES.map((pkg, i) => (
              <PackageRow
                key={pkg.id}
                pkg={pkg}
                isFirst={i === 0}
                selected={selected === pkg.id}
                onSelect={() => handleSelect(pkg.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Robux packages section ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }} className="mt-8">
          <p className="mb-2" style={{ fontSize: "17px", fontWeight: 700 }} data-testid="text-basic-label">
            Robux packages
          </p>

          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            {BASIC_PACKAGES.map((pkg, i) => (
              <PackageRow
                key={pkg.id}
                pkg={pkg}
                isFirst={i === 0}
                selected={selected === pkg.id}
                onSelect={() => handleSelect(pkg.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* Buy button */}
        {selected && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <button
              className="w-full py-4 rounded-xl font-black hover:opacity-90 transition-opacity"
              style={{ background: "#2a2d38", fontSize: "17px" }}
              data-testid="button-buy"
              onClick={handleBuy}
            >
              Buy Robux
            </button>
          </motion.div>
        )}

        {/* Purchase flash */}
        {justBought !== null && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-center rounded-xl py-3"
            style={{ background: "rgba(1,178,175,0.15)", border: "1px solid rgba(1,178,175,0.3)", fontSize: "14px", fontWeight: 700, color: "#01d9d5" }}
          >
            ✓ Robux added to your balance!
          </motion.div>
        )}
      </main>
    </div>
  );
}
