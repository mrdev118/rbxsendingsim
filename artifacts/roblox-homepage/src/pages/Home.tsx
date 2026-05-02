import { useState } from "react";
import { motion } from "framer-motion";
import bonusGameImg from "@assets/image_1777750963069.png";

const ROBUX_PACKAGES = [
  { id: 1, amount: 24000, oldAmount: 22500, bonus: 1500, price: "P11.49K" },
  { id: 2, amount: 11000, oldAmount: 10000, bonus: 1000, price: "P5,700.00" },
  { id: 3, amount: 5250,  oldAmount: 4500,  bonus: 750,  price: "P2,890.00" },
  { id: 4, amount: 3625,  oldAmount: 3150,  bonus: 475,  price: "P1,990.00" },
  { id: 5, amount: 2200,  oldAmount: 1700,  bonus: 500,  price: "P1,090.00" },
  { id: 6, amount: 1000,  oldAmount: 800,   bonus: 200,  price: "P499.00"   },
  { id: 7, amount: 400,   oldAmount: 350,   bonus: 50,   price: "P199.00"   },
];

function RobuxIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="10" fill="#01B2AF" />
      <path
        d="M6 5h5.5a2.5 2.5 0 0 1 0 5H8.5v1H12l2 4H10.5L9 12.5H8.5V15H6V5z"
        fill="white"
      />
    </svg>
  );
}

export default function Home() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div
      className="min-h-screen w-full text-white font-sans overflow-x-hidden"
      style={{ background: "#111214" }}
      data-testid="page-robux"
    >
      {/* Subtle dot background pattern */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top bar */}
      <header
        className="relative z-10 flex items-center justify-between px-6 py-3 border-b"
        style={{ borderColor: "rgba(255,255,255,0.07)", background: "#111214" }}
        data-testid="header"
      >
        <div className="flex flex-col leading-tight">
          <span className="text-xs text-gray-400 font-medium" data-testid="text-username">
            THEDAEMON_KILLP15-1&gt;
          </span>
          <span className="text-xs text-gray-500">Balance: 257 Robux</span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.08)" }}
            data-testid="robux-balance"
          >
            <RobuxIcon size={16} />
            <span className="text-sm font-bold">257</span>
          </div>
          <button
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.06)", color: "#fff" }}
            data-testid="button-send"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Send
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 pt-10 pb-16">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-4xl sm:text-5xl font-black text-center leading-tight mb-10"
          data-testid="heading-main"
        >
          Enjoy up to 25%<br />more Robux
        </motion.h1>

        {/* Bonus item card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-6"
        >
          <p className="text-sm font-bold text-white mb-2" data-testid="text-bonus-label">
            Bonus item we picked for you
          </p>
          <div
            className="flex items-center gap-4 rounded-xl overflow-hidden"
            style={{ background: "#1e2026", border: "1px solid rgba(255,255,255,0.07)" }}
            data-testid="card-bonus-item"
          >
            {/* Icon + text */}
            <div className="flex items-center gap-3 px-4 py-4 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ background: "#2a2f3a" }}
                >
                  💰
                </div>
                <span
                  className="absolute -bottom-1 -right-1 text-[10px] font-black px-1 rounded"
                  style={{ background: "#00b06f", color: "#fff" }}
                >
                  x2
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold truncate" data-testid="text-bonus-name">
                    [🍎] Steal a Brainrot
                  </span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 flex-shrink-0" aria-label="info">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                  </svg>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">2x Money</p>
              </div>
            </div>
            {/* Game thumbnail — right side */}
            <div className="w-32 h-20 flex-shrink-0 overflow-hidden">
              <img
                src={bonusGameImg}
                alt="Bonus game"
                className="w-full h-full object-cover object-right-top"
                data-testid="img-bonus-game"
              />
            </div>
          </div>
        </motion.div>

        {/* Robux package list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="flex flex-col gap-2"
          data-testid="list-packages"
        >
          {ROBUX_PACKAGES.map((pkg, i) => (
            <motion.button
              key={pkg.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              onClick={() => setSelected(pkg.id)}
              data-testid={`row-package-${pkg.id}`}
              className="w-full flex items-center justify-between px-4 py-4 rounded-xl text-left transition-all"
              style={{
                background: selected === pkg.id ? "#2a2f3a" : "#1a1d22",
                border: selected === pkg.id
                  ? "1px solid rgba(1,178,175,0.5)"
                  : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Left: amount info */}
              <div className="flex items-center gap-3">
                <RobuxIcon size={20} />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-black" data-testid={`text-amount-${pkg.id}`}>
                    {pkg.amount.toLocaleString()}
                  </span>
                  <span
                    className="text-sm line-through"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                    data-testid={`text-old-amount-${pkg.id}`}
                  >
                    {pkg.oldAmount.toLocaleString()}
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
                    data-testid={`text-bonus-${pkg.id}`}
                  >
                    + {pkg.bonus.toLocaleString()} more
                  </span>
                </div>
              </div>

              {/* Right: price button */}
              <span
                className="text-sm font-bold px-5 py-2 rounded-lg flex-shrink-0 ml-4 transition-colors"
                style={{
                  background: selected === pkg.id ? "#01b2af" : "#2c3040",
                  color: selected === pkg.id ? "#fff" : "rgba(255,255,255,0.85)",
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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <button
              className="w-full py-4 rounded-xl text-base font-black transition-opacity hover:opacity-90"
              style={{ background: "#01b2af" }}
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
