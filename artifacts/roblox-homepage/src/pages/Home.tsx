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

function RobuxCoin({ size = 18 }: { size?: number }) {
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
      className="min-h-screen w-full text-white font-sans"
      style={{ background: "#111214" }}
      data-testid="page-robux"
    >
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "#111214" }}
        data-testid="header"
      >
        {/* Left: username + balance */}
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold text-white/80" data-testid="text-username">
            THEDAEMON_KILLP15-1&gt;
          </span>
          <span className="text-[11px] text-white/40">Balance: 257 Robux</span>
        </div>

        {/* Right: balance pill + send */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.09)" }}
            data-testid="robux-balance"
          >
            <RobuxCoin size={22} />
            <span className="text-sm font-bold">257</span>
          </div>
          <button
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{ background: "rgba(255,255,255,0.09)", color: "#fff" }}
            data-testid="button-send"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            Send
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-xl mx-auto px-5 pt-10 pb-16">

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl sm:text-5xl font-black text-center leading-[1.15] mb-10"
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
          <p className="text-sm font-bold text-white mb-2" data-testid="text-bonus-label">
            Bonus item we picked for you
          </p>
          <div
            className="flex items-center rounded-xl overflow-hidden"
            style={{ background: "#1c1f26", border: "1px solid rgba(255,255,255,0.07)" }}
            data-testid="card-bonus-item"
          >
            {/* Icon + text */}
            <div className="flex items-center gap-3 px-4 py-4 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ background: "#252a35" }}
                >
                  💰
                </div>
                <span
                  className="absolute -bottom-1 -right-2 text-[10px] font-black px-1.5 py-0.5 rounded"
                  style={{ background: "#00b06f", color: "#fff" }}
                >
                  x2
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[13px] font-bold" data-testid="text-bonus-name">
                    [🍎] Steal a Brainrot
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30 flex-shrink-0" aria-label="info">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                  </svg>
                </div>
                <p className="text-xs text-white/40 mt-0.5">2x Money</p>
              </div>
            </div>

            {/* Game thumbnail from public images */}
            <div className="w-28 h-[72px] flex-shrink-0 overflow-hidden">
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
          transition={{ delay: 0.15, duration: 0.3 }}
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
              className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors"
              style={{
                background: selected === pkg.id ? "rgba(1,178,175,0.1)" : "#1a1d22",
                borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Robux amount info */}
              <div className="flex items-center gap-2.5">
                <RobuxCoin size={26} />
                <span className="text-[15px] font-black" data-testid={`text-amount-${pkg.id}`}>
                  {pkg.amount.toLocaleString()}
                </span>
                <span
                  className="text-sm line-through"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                  data-testid={`text-old-amount-${pkg.id}`}
                >
                  {pkg.oldAmount.toLocaleString()}
                </span>
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)" }}
                  data-testid={`text-bonus-${pkg.id}`}
                >
                  + {pkg.bonus.toLocaleString()} more
                </span>
              </div>

              {/* Price */}
              <span
                className="text-sm font-bold px-5 py-2 rounded-lg flex-shrink-0 ml-3 min-w-[90px] text-center"
                style={{
                  background: selected === pkg.id ? "#01b2af" : "#2a2d38",
                  color: "#fff",
                }}
                data-testid={`text-price-${pkg.id}`}
              >
                {pkg.price}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Buy button (appears when a package is selected) */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <button
              className="w-full py-3.5 rounded-xl text-base font-black hover:opacity-90 transition-opacity"
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
