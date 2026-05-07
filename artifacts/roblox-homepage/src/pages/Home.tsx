import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { motion } from "framer-motion";
import robuxIconSrc from "@assets/8ab2a18d6e954f6b10bad7c36d0ce231-removebg-preview_1777752219611.png";
import bonusCardSrc from "@assets/image_1777752547366.png";
import robloxLogoSrc from "@assets/ODF_1777754484560.png";

const API_BASE = (import.meta as any)?.env?.VITE_API_BASE ?? "";

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

const AMOUNT_OPTIONS = [25, 50, 100, 200, 1000];

const RobuxCoin = memo(function RobuxCoin({ size = 20 }: { size?: number }) {
  return (
    <img
      src={robuxIconSrc}
      alt="Robux"
      width={size}
      height={size}
      style={{ flexShrink: 0, display: "inline-block" }}
      loading="lazy"
    />
  );
});

const PackageRow = memo(function PackageRow({
  pkg,
  isFirst,
  selected,
  onSelect,
  compact,
}: {
  pkg: { id: number; amount: number; oldAmount: number; bonus: number; price: string };
  isFirst: boolean;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
}) {
  return (
    <motion.button
      key={pkg.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onSelect}
      data-testid={`row-package-${pkg.id}`}
      className="w-full flex items-center justify-between text-left transition-colors"
      style={{
        background: "#191A1F",
        borderTop: isFirst ? "none" : "1px solid rgba(255,255,255,0.06)",
        outline: selected ? "2px solid rgba(255,255,255,0.15)" : "none",
        outlineOffset: "-2px",
        padding: compact ? "12px 14px" : "16px 20px",
      }}
    >
      <div className="flex items-center" style={{ gap: compact ? "8px" : "12px", minWidth: 0 }}>
        <RobuxCoin size={compact ? 22 : 28} />
        <span style={{ fontSize: compact ? "16px" : "20px", fontWeight: 900, flexShrink: 0 }}>
          {pkg.amount.toLocaleString()}
        </span>
        {!compact && (
          <span style={{ fontSize: "16px", fontWeight: 500, textDecoration: "line-through", color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>
            {pkg.oldAmount.toLocaleString()}
          </span>
        )}
        <span
          style={{
            fontSize: compact ? "10px" : "12px",
            fontWeight: 600,
            padding: compact ? "2px 7px" : "3px 10px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.5)",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          +{pkg.bonus.toLocaleString()}
        </span>
      </div>

      <span
        className="transition-all duration-150 hover:brightness-125"
        style={{
          fontSize: compact ? "13px" : "16px",
          fontWeight: 700,
          padding: compact ? "7px 0" : "8px 0",
          width: compact ? "110px" : "160px",
          borderRadius: "10px",
          background: "#2a2d38",
          color: "#fff",
          flexShrink: 0,
          marginLeft: compact ? "10px" : "16px",
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
});

export default function Home() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [selected, setSelected] = useState<number | null>(null);
  const [balance, setBalance] = useState(() => {
    try {
      const raw = localStorage.getItem("rbx:balance");
      return raw ? Number(raw) : 257;
    } catch {
      return 257;
    }
  });
  const [justBought, setJustBought] = useState<number | null>(null);
  const [sendOpen, setSendOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"search" | "amount" | "confirm">("search");
  const [selectedPlayer, setSelectedPlayer] = useState<{ id: number; name: string; displayName: string; avatarUrl?: string; mutualConnections: number; joinDate?: string } | null>(null);
  const [sendAmount, setSendAmount] = useState(200);
  const [sendError, setSendError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: number; name: string; displayName: string; avatarUrl?: string }[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchControllerRef = useRef<AbortController | null>(null);

  const closeModal = () => {
    setSendOpen(false);
    setModalStep("search");
    setSelectedPlayer(null);
    setSendAmount(200);
    setSearchQuery("");
    setSearchResults([]);
    if (debounceRef.current) { clearTimeout(debounceRef.current); debounceRef.current = null; }
    if (fetchControllerRef.current) { fetchControllerRef.current.abort(); fetchControllerRef.current = null; }
  };

  const pickPlayer = async (user: { id: number; name: string; displayName: string; avatarUrl?: string }) => {
    // determine mutual connections heuristically
    const rand = Math.random();
    const mutual = rand < 0.85 ? 0 : rand < 0.95 ? 1 : 2;

    // fetch official user details (created/join date)
    try {
      // try up to 3 times to fetch official user details (some upstream calls may intermittently omit fields)
      let created: string | undefined = undefined;
      for (let attempt = 0; attempt < 3; attempt++) {
        const res = await fetch(`${API_BASE}/api/roblox/user?id=${encodeURIComponent(String(user.id))}`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json() as { data?: { created?: string } };
          if (json.data && json.data.created) {
            created = json.data.created;
            break;
          }
        }
        // small backoff
        await new Promise(r => setTimeout(r, 150 * (attempt + 1)));
      }
      setSelectedPlayer({ ...user, mutualConnections: mutual, joinDate: created });
    } catch {
      setSelectedPlayer({ ...user, mutualConnections: mutual });
    }

    setModalStep("amount");
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      // abort any in-flight fetch
      if (fetchControllerRef.current) { fetchControllerRef.current.abort(); fetchControllerRef.current = null; }
      const controller = new AbortController();
      fetchControllerRef.current = controller;
      try {
        const res = await fetch(`${API_BASE}/api/roblox/search?q=${encodeURIComponent(searchQuery)}`, { cache: "no-store", signal: controller.signal });
        if (!res.ok) { setSearchResults([]); setSearchLoading(false); return; }
        const json = await res.json() as { data: { id: number; name: string; displayName: string }[] };
        const users = (json.data ?? []).slice(0, 3);
        if (users.length === 0) { setSearchResults([]); setSearchLoading(false); return; }
        const ids = users.map(u => u.id).join(",");
        const avatarRes = await fetch(`${API_BASE}/api/roblox/avatars?userIds=${encodeURIComponent(ids)}`, { cache: "no-store", signal: controller.signal });
        let avatarJson: { data: { targetId: number; imageUrl: string }[] } = { data: [] };
        if (avatarRes.ok) {
          avatarJson = await avatarRes.json() as { data: { targetId: number; imageUrl: string }[] };
        }
        const avatarMap = Object.fromEntries((avatarJson.data ?? []).map(a => [a.targetId, a.imageUrl]));
        setSearchResults(users.map(u => ({ ...u, avatarUrl: avatarMap[u.id] })));
      } catch (err) {
        if ((err as any)?.name === 'AbortError') {
          // aborted - do nothing
        } else {
          setSearchResults([]);
        }
      } finally {
        setSearchLoading(false);
        if (fetchControllerRef.current === controller) fetchControllerRef.current = null;
      }
    }, 350);
  }, [searchQuery]);

  const ALL_PACKAGES = useMemo(() => [...PREMIUM_PACKAGES, ...BASIC_PACKAGES], []);

  const onPickAmount = useCallback((amt: number) => setSendAmount(amt), []);

  const handleSelect = useCallback((id: number) => {
    setSelected(prev => (prev === id ? null : id));
  }, []);

  const handleBuy = useCallback(() => {
    if (selected === null) return;
    const pkg = ALL_PACKAGES.find(p => p.id === selected);
    if (!pkg) return;
    setBalance(prev => prev + pkg.amount);
    setJustBought(pkg.id);
    setSelected(null);
    setTimeout(() => setJustBought(null), 1500);
  }, [selected, ALL_PACKAGES]);

  

  // persist balance to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("rbx:balance", String(balance));
    } catch {
      // ignore
    }
  }, [balance]);

  return (
    <div
      className="min-h-screen w-full text-white"
      style={{ background: "#121215", fontFamily: "'Plus Jakarta Sans', sans-serif", position: "relative" }}
      data-testid="page-robux"
    >
      <style>{`.amount-scrollbar { scrollbar-color: rgba(255,255,255,0.06) transparent; }
    .amount-scrollbar::-webkit-scrollbar { height: 8px; }
    .amount-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .amount-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 999px; }
    .amount-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.12); }`}</style>

      {/* ── Windows title bar ── (desktop only) */}
      <div
        className="flex items-center justify-between select-none"
        style={{ background: "#1f1f1f", height: "30px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: isMobile ? "none" : "flex" }}
        data-testid="titlebar"
      >
        <div className="flex items-center gap-1.5 px-3 h-full">
          <img src={robloxLogoSrc} alt="Roblox" className="w-4 h-4 flex-shrink-0 rounded-sm" aria-hidden="true" />
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
      <div className="select-none" style={{ position: "absolute", top: isMobile ? "48px" : "78px", right: isMobile ? "12px" : "60px", zIndex: 10 }}>
        <div
          className="flex items-center gap-2 rounded-full px-3 py-2"
          style={{ background: "#1e1f23", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center gap-2 pl-1 pr-1">
            <RobuxCoin size={isMobile ? 18 : 24} />
            <span style={{ fontSize: isMobile ? "14px" : "18px", fontWeight: 800, letterSpacing: "-0.02em" }}>{balance.toLocaleString()}</span>
          </div>
          <button
            className="flex items-center gap-1.5 hover:brightness-125 transition-all"
            style={{ borderRadius: "10px", background: "#2e3039", color: "#fff", fontSize: isMobile ? "12px" : "14px", fontWeight: 700, padding: isMobile ? "6px 12px" : "6px 16px" }}
            onClick={() => { setSendOpen(true); setSearchQuery(""); }}
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
      <main className="max-w-2xl mx-auto pb-16" style={{ paddingLeft: isMobile ? "16px" : "24px", paddingRight: isMobile ? "16px" : "24px", paddingTop: isMobile ? "8px" : "16px" }}>

        {/* Faded curvy mesh background */}
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
            maskImage: `radial-gradient(ellipse 75% 55% at 50% 0%, black 0%, black 35%, rgba(0,0,0,0.4) 60%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(ellipse 75% 55% at 50% 0%, black 0%, black 35%, rgba(0,0,0,0.4) 60%, transparent 100%)`,
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 560 320" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 26 }, (_, i) => {
              const y = i * 13;
              const amp = 7 + (i % 3) * 4;
              const phase = (i % 2 === 0 ? 1 : -1);
              return <path key={`h${i}`} d={`M -20 ${y} C 100 ${y + amp * phase} 220 ${y - amp * phase} 340 ${y + amp * phase} C 460 ${y - amp * phase} 540 ${y} 580 ${y}`} stroke="rgba(255,255,255,0.045)" strokeWidth="0.6" fill="none" />;
            })}
            {Array.from({ length: 30 }, (_, i) => {
              const x = i * 20;
              const amp = 6 + (i % 3) * 3;
              const phase = (i % 2 === 0 ? 1 : -1);
              return <path key={`v${i}`} d={`M ${x} -10 C ${x + amp * phase} 70 ${x - amp * phase} 150 ${x + amp * phase} 230 C ${x - amp * phase} 290 ${x} 320 ${x} 340`} stroke="rgba(255,255,255,0.045)" strokeWidth="0.6" fill="none" />;
            })}
          </svg>
        </div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center leading-[1.1]"
          style={{ fontSize: isMobile ? "clamp(2rem, 9vw, 2.8rem)" : "clamp(2.8rem, 6vw, 4rem)", fontWeight: 900, letterSpacing: "-0.01em", marginTop: isMobile ? "52px" : "40px", marginBottom: isMobile ? "32px" : "64px" }}
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
                compact={isMobile}
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
                compact={isMobile}
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

      {/* Send Robux modal */}
      {sendOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 100, background: "rgba(0,0,0,0.72)" }}
          onClick={closeModal}
        >
          <motion.div
            key={modalStep}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: "#1a1b20",
              borderRadius: "14px",
              width: "min(320px, 90vw)",
              padding: "20px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Shared header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <RobuxCoin size={18} />
                <span style={{ fontSize: "16px", fontWeight: 800 }}>Send Robux</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <RobuxCoin size={15} />
                  <span style={{ fontSize: "13px", fontWeight: 700 }}>{balance.toLocaleString()}</span>
                </div>
                <button
                  onClick={closeModal}
                  className="flex items-center justify-center hover:opacity-70 transition-opacity"
                  style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", lineHeight: 1 }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ── STEP: search ── */}
            {modalStep === "search" && (
              <>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
                  Search by username
                </p>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search username"
                  autoFocus
                  style={{
                    width: "100%",
                    background: "#25262d",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    color: "#fff",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
                <div style={{ minHeight: "120px", marginTop: "6px" }}>
                  {searchLoading && (
                    <div style={{ padding: "20px 0", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>Searching...</div>
                  )}
                  {!searchLoading && searchQuery.trim() && searchResults.length === 0 && (
                    <div style={{ padding: "20px 0", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>No players found</div>
                  )}
                  {!searchLoading && searchResults.map((user, i) => (
                    <div
                      key={user.id}
                      onClick={() => pickPlayer(user)}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                      style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                    >
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: "#2a2d38" }} />
                      ) : (
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#2a2d38", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700 }}>
                          {user.displayName[0]}
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 700, lineHeight: 1.3 }}>{user.displayName}</div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", lineHeight: 1.3 }}>@{user.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── STEP: amount picker ── */}
            {modalStep === "amount" && selectedPlayer && (
              <div style={{ textAlign: "center" }}>
                {/* Avatar */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                  {selectedPlayer.avatarUrl ? (
                    <img src={selectedPlayer.avatarUrl} alt={selectedPlayer.name} style={{ width: 72, height: 72, borderRadius: "50%", background: "#2a2d38" }} />
                  ) : (
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#2a2d38", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 700 }}>
                      {selectedPlayer.displayName[0]}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, marginBottom: "16px" }}>{selectedPlayer.displayName}</div>

                {/* Big amount display */}
                <div className="flex items-center justify-center gap-2" style={{ marginBottom: "20px" }}>
                  <RobuxCoin size={32} />
                  <span style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "-1px" }}>{sendAmount}</span>
                </div>

                {/* Amount pills (horizontally scrollable to fit larger options) */}
                <div className="amount-scrollbar" style={{ marginBottom: "20px", overflowX: "auto", paddingBottom: 6 }}>
                  <div className="flex gap-2" style={{ minWidth: 0, padding: "4px 6px" }}>
                    {AMOUNT_OPTIONS.map(amt => (
                      <button
                        key={amt}
                        onClick={() => onPickAmount(amt)}
                        className="flex items-center gap-1 transition-all"
                        style={{
                          flex: "0 0 auto",
                          padding: "8px 12px",
                          minWidth: 64,
                          borderRadius: "10px",
                          background: sendAmount === amt ? "#2a2d38" : "#25262d",
                          border: sendAmount === amt ? "2px solid rgba(255,255,255,0.06)" : "2px solid transparent",
                          color: "#fff",
                          fontSize: "13px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        <RobuxCoin size={13} />
                        {amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Next button */}
                <button
                  onClick={() => setModalStep("confirm")}
                  style={{
                    width: "100%",
                    padding: "13px",
                    borderRadius: "8px",
                    background: "#2563eb",
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: 800,
                    cursor: "pointer",
                    border: "none",
                    marginBottom: "10px",
                  }}
                >
                  Next
                </button>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Robux are sent instantly with no fees</div>
              </div>
            )}

            {/* ── STEP: confirm ── */}
            {modalStep === "confirm" && selectedPlayer && (
              <div style={{ textAlign: "center" }}>
                {/* Avatar */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                  {selectedPlayer.avatarUrl ? (
                    <img src={selectedPlayer.avatarUrl} alt={selectedPlayer.name} style={{ width: 72, height: 72, borderRadius: "50%", background: "#2a2d38" }} />
                  ) : (
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#2a2d38", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 700 }}>
                      {selectedPlayer.displayName[0]}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: "15px", fontWeight: 800, marginBottom: "2px" }}>{selectedPlayer.displayName}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "14px" }}>@{selectedPlayer.name}</div>

                {/* Meta info */}
                <div style={{ marginBottom: "18px" }}>
                  <div className="flex items-center justify-center gap-1.5" style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "5px" }}>
                    <span>👥</span>
                    <span>{selectedPlayer.mutualConnections} mutual Connection{selectedPlayer.mutualConnections !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5" style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                    <span>🕐</span>
                    <span>Joined in {selectedPlayer.joinDate ? new Date(selectedPlayer.joinDate).getFullYear() : "unknown"}</span>
                  </div>
                </div>

                {/* Big amount */}
                <div className="flex items-center justify-center gap-2" style={{ marginBottom: "20px" }}>
                  <RobuxCoin size={28} />
                  <span style={{ fontSize: "38px", fontWeight: 900, letterSpacing: "-1px" }}>{sendAmount}</span>
                </div>

                {/* Send + Edit buttons */}
                <div className="flex gap-2" style={{ marginBottom: "10px" }}>
                  <button
                    onClick={() => {
                      // perform send: simple client-side deduction + basic validation
                      setSendError(null);
                      if (sendAmount <= 0) return;
                      if (sendAmount > balance) {
                        setSendError("Insufficient balance");
                        return;
                      }
                      setBalance(prev => prev - sendAmount);
                      // reset modal state
                      setSelectedPlayer(null);
                      setSendAmount(200);
                      setSearchQuery("");
                      setSearchResults([]);
                      setSendOpen(false);
                    }}
                    style={{
                      flex: 2,
                      padding: "12px",
                      borderRadius: "8px",
                      background: "#2563eb",
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: 800,
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    Send
                  </button>
                  {sendError && (
                    <div style={{ color: "#ff6b6b", fontSize: "12px", marginLeft: "8px", alignSelf: "center" }}>{sendError}</div>
                  )}
                  <button
                    onClick={() => setModalStep("amount")}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "8px",
                      background: "#25262d",
                      color: "rgba(255,255,255,0.75)",
                      fontSize: "14px",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    Edit
                  </button>
                </div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", lineHeight: 1.5 }}>
                  You may need an age check in games/an account to send Robux. Once you send, you cannot get it back.
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
