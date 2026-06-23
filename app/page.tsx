"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { HeroLanding } from "@/components/hero-landing";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [showWorkspace, setShowWorkspace] = useState(false);

  return (
    <div className="w-full min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {!showWorkspace ? (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full min-h-screen"
          >
            <HeroLanding onStartBuilding={() => setShowWorkspace(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full min-h-screen"
          >
            <AppShell onBackToHome={() => setShowWorkspace(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
