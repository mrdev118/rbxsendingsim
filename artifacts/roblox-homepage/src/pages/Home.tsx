import { useState } from "react";
import { motion } from "framer-motion";
import robuxIconSrc from "@assets/image_1777751316017.png";

const ROBUX_PACKAGES = [
  { id: 1, amount: 24000, oldAmount: 22500, bonus: 1500, price: "P11.49K" },
  { id: 2, amount: 11000, oldAmount: 10000, bonus: 1000, price: "P5,700.00" },
  { id: 3, amount: 5250,  oldAmount: 4500,  bonus: 750,  price: "P2,890.00" },
  { id: 4, amount: 3625,  oldAmount: 3150,  bonus: 475,  price: "P1,990.00" },
  { id: 5, amount: 2200,  oldAmount: 1700,  bonus: 500,  price: "P1,090.00" },
  { id: 6, amount: 1000,  oldAmount: 800,   bonus: 200,  price: "P499.00"   },
  { id: 7, amount: 400,   oldAmount: 350,   bonus: 50,   price: "P199.00"   },
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

export default function Home() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div
      className="min-h-screen w-full text-white"
      style={{ background: "#111214", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      data-testid="page-robux"
    >
      {/* ── OS-style title bar ── */}
      <div
        className="relative flex items-center justify-between px-3"
        style={{ background: "#1a1a1a", height: "32px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        data-testid="titlebar"
      >
        {/* Left: close button */}
        <button
          className="flex items-center justify-center w-5 h-5 rounded-full transition-opacity hover:opacity-80"
          style={{ background: "#ff5f57" }}
          data-testid="button-close"
          aria-label="Close"
        >
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 2l6 6M8 2l-6 6" stroke="#7a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Center: username + balance */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-tight">
          <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.6)" }} data-testid="text-titlebar-username">
            Benxxyz
          </span>
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>Balance: 257 Robux</span>
        </div>

        {/* Right: min / max / close window controls */}
        <div className="flex items-center gap-1.5">
          <button className="flex items-center justify-center w-5 h-5 rounded-full hover:opacity-80" style={{ background: "#febc2e" }} aria-label="Minimize">
            <svg width="8" height="2" viewBox="0 0 8 2" fill="none" aria-hidden="true"><rect width="8" height="1.5" rx="0.75" fill="#7a5400"/></svg>
          </button>
          <button className="flex items-center justify-center w-5 h-5 rounded-full hover:opacity-80" style={{ background: "#28c840" }} aria-label="Maximize">
            <svg width="7" height="7" viewBox="0 0 7 7" fill="none" aria-hidden="true"><rect x="0.75" y="0.75" width="5.5" height="5.5" rx="1" stroke="#0a5a14" strokeWidth="1"/></svg>
          </button>
        </div>
      </div>

      {/* ── Roblox app bar ── */}
      <header
        className="relative flex items-center justify-end px-6 py-2.5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.07)", background: "#111214" }}
        data-testid="header"
      >
        {/* Right: balance pill + send */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.09)" }}
            data-testid="robux-balance"
          >
            <RobuxCoin size={22} />
            <span className="text-[15px] font-bold">257</span>
          </div>
          <button
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold"
            style={{ background: "rgba(255,255,255,0.09)", color: "#fff" }}
            data-testid="button-send"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            Send
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-2xl mx-auto px-6 pt-12 pb-16">

        {/* Heading — large, heavy, matching original */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center leading-[1.1] mb-12"
          style={{
            fontSize: "clamp(2.8rem, 6vw, 4rem)",
            fontWeight: 900,
            letterSpacing: "-0.01em",
          }}
          data-testid="heading-main"
        >
          Enjoy up to 25%<br />more Robux
        </motion.h1>

        {/* Bonus item */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
          className="mb-5"
        >
          <p
            className="mb-2"
            style={{ fontSize: "17px", fontWeight: 700, color: "#fff" }}
            data-testid="text-bonus-label"
          >
            Bonus item we picked for you
          </p>
          <div
            className="flex items-center rounded-xl overflow-hidden"
            style={{ background: "#1c1f26", border: "1px solid rgba(255,255,255,0.07)" }}
            data-testid="card-bonus-item"
          >
            <div className="flex items-center gap-4 px-5 py-4 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                  style={{ background: "#252a35" }}
                >
                  💰
                </div>
                <span
                  className="absolute -bottom-1 -right-2 text-[11px] font-black px-1.5 py-0.5 rounded"
                  style={{ background: "#00b06f", color: "#fff" }}
                >
                  x2
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: "15px", fontWeight: 700 }} data-testid="text-bonus-name">
                    [🍎] Steal a Brainrot
                  </span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} aria-label="info">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                  </svg>
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "3px" }}>2x Money</p>
              </div>
            </div>
            <div className="w-32 h-20 flex-shrink-0 overflow-hidden">
              <img
                src="/images/game3.png"
                alt="Steal a Brainrot"
                className="w-full h-full object-cover"
                data-testid="img-bonus-game"
              />
            </div>
          </div>
        </motion.div>

        {/* Package rows */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.14, duration: 0.3 }}
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          data-testid="list-packages"
        >
          {ROBUX_PACKAGES.map((pkg, i) => (
            <motion.button
              key={pkg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18 + i * 0.04 }}
              onClick={() => setSelected(pkg.id === selected ? null : pkg.id)}
              data-testid={`row-package-${pkg.id}`}
              className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
              style={{
                background: selected === pkg.id ? "rgba(1,178,175,0.1)" : "#1a1d22",
                borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Left: icon + amounts */}
              <div className="flex items-center gap-3">
                <RobuxCoin size={28} />
                <span
                  style={{ fontSize: "20px", fontWeight: 900 }}
                  data-testid={`text-amount-${pkg.id}`}
                >
                  {pkg.amount.toLocaleString()}
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    textDecoration: "line-through",
                    color: "rgba(255,255,255,0.3)",
                  }}
                  data-testid={`text-old-amount-${pkg.id}`}
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
                  data-testid={`text-bonus-${pkg.id}`}
                >
                  + {pkg.bonus.toLocaleString()} more
                </span>
              </div>

              {/* Right: price */}
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  padding: "8px 22px",
                  borderRadius: "10px",
                  background: selected === pkg.id ? "#01b2af" : "#2a2d38",
                  color: "#fff",
                  flexShrink: 0,
                  marginLeft: "16px",
                  minWidth: "100px",
                  textAlign: "center",
                  display: "inline-block",
                }}
                data-testid={`text-price-${pkg.id}`}
              >
                {pkg.price}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Buy button */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <button
              className="w-full py-4 rounded-xl font-black hover:opacity-90 transition-opacity"
              style={{ background: "#01b2af", fontSize: "17px" }}
              data-testid="button-buy"
              onClick={() => setSelected(null)}
            >
              Buy Robux
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
