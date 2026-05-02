import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [gender, setGender] = useState<"female" | "male" | null>(null);

  const games = Array.from({ length: 12 }, (_, i) => `/images/game${(i % 10) + 1}.png`);

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-black font-sans text-white">
      {/* Background Wallpaper */}
      <motion.div 
        className="absolute inset-0 z-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div 
          className="absolute inset-[-20%] grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 opacity-60"
          style={{ transform: "rotate(-10deg) scale(1.2)" }}
        >
          {Array.from({ length: 60 }).map((_, i) => (
            <div 
              key={i} 
              className="aspect-square bg-gray-800 rounded-md overflow-hidden"
            >
              <img 
                src={games[i % games.length]} 
                alt={`Game ${i}`} 
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </motion.div>

      {/* Top Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="w-24"></div> {/* Spacer */}
        
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center font-black text-4xl tracking-tighter text-white"
        >
          R<span className="inline-block w-6 h-6 border-[5px] border-white transform rotate-12 mx-1 -mt-1"></span>BLOX
        </motion.div>

        <div className="w-24 flex justify-end">
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-black font-bold px-6 py-2 h-auto rounded-sm bg-transparent"
            data-testid="button-login"
          >
            Log In
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-10 pb-24 min-h-[calc(100vh-80px)]">
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="w-full max-w-md bg-black/80 backdrop-blur-md p-8 rounded-lg border border-white/10 shadow-2xl"
        >
          <h1 className="text-2xl font-bold text-center mb-6" data-testid="heading-signup">
            SIGN UP AND START HAVING FUN!
          </h1>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-300">Birthday</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select>
                  <SelectTrigger className="bg-white text-black font-bold h-10 border-0" data-testid="select-month">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Jan</SelectItem>
                    <SelectItem value="2">Feb</SelectItem>
                    <SelectItem value="3">Mar</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="bg-white text-black font-bold h-10 border-0" data-testid="select-day">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="bg-white text-black font-bold h-10 border-0" data-testid="select-year">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2010">2010</SelectItem>
                    <SelectItem value="2011">2011</SelectItem>
                    <SelectItem value="2012">2012</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-300">Username</Label>
              <Input 
                type="text" 
                placeholder="Don't use your real name" 
                className="bg-white text-black placeholder:text-gray-500 font-bold h-10 border-0"
                data-testid="input-username"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-300">Password</Label>
              <Input 
                type="password" 
                placeholder="At least 8 characters" 
                className="bg-white text-black placeholder:text-gray-500 font-bold h-10 border-0"
                data-testid="input-password"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-300">Gender (optional)</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  data-testid="button-gender-female"
                  className={`flex items-center justify-center p-3 rounded-md transition-colors ${
                    gender === "female" ? "bg-white text-black" : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15v7"/><path d="M9 19h6"/><circle cx="12" cy="9" r="6"/></svg>
                </button>
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  data-testid="button-gender-male"
                  className={`flex items-center justify-center p-3 rounded-md transition-colors ${
                    gender === "male" ? "bg-white text-black" : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 14L21 3"/><path d="M16 3h5v5"/><circle cx="10" cy="14" r="6"/></svg>
                </button>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 text-center pt-2 leading-relaxed">
              By clicking Sign Up, you are agreeing to the Terms of Use including the arbitration clause and you are acknowledging the Privacy Policy.
            </p>

            <Button 
              className="w-full bg-[#00b06f] hover:bg-[#00915a] text-white font-black text-lg py-6 mt-4 shadow-lg"
              data-testid="button-signup"
            >
              Sign Up
            </Button>
          </form>
        </motion.div>

        {/* Platform Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-col items-center gap-4 w-full max-w-4xl"
        >
          <h2 className="text-sm font-bold tracking-widest text-gray-400">ROBLOX ON YOUR DEVICE</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "App Store", testId: "badge-appstore" },
              { label: "Google Play", testId: "badge-googleplay" },
              { label: "PlayStation", testId: "badge-playstation" },
              { label: "Xbox", testId: "badge-xbox" },
              { label: "Meta Quest", testId: "badge-meta" },
              { label: "Microsoft", testId: "badge-microsoft" },
              { label: "Amazon Appstore", testId: "badge-amazon" },
              { label: "Galaxy Store", testId: "badge-samsung" },
            ].map((p) => (
              <button
                key={p.testId}
                data-testid={p.testId}
                className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-md text-xs font-bold text-white transition-colors cursor-pointer tracking-wide"
              >
                {p.label}
              </button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
