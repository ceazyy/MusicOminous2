import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LogoIntro from "@/components/logo-intro";
import EnterSection from "@/components/enter-section";
import AlbumGrid from "@/components/album-grid";
import SocialLinks from "@/components/social-links";
import backgroundImage from "@assets/pic.jpg";

type AppState = "logo" | "enter" | "main";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("logo");

  useEffect(() => {
    // Logo sequence timing
    const logoTimer = setTimeout(() => {
      setAppState("enter");
    }, 6000); // 4s display + 2s fade

    return () => clearTimeout(logoTimer);
  }, []);

  const handleEnterClick = () => {
    setAppState("main");
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Static Background */}
      <div 
        className="fixed inset-0 z-0 background-static"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {appState === "logo" && (
            <motion.div
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <LogoIntro />
            </motion.div>
          )}
          
          {appState === "enter" && (
            <motion.div
              key="enter"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1 }}
            >
              <EnterSection onEnter={handleEnterClick} />
            </motion.div>
          )}
          
          {appState === "main" && (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="min-h-screen"
            >
              {/* Albums Section */}
              <section id="albums" className="min-h-screen py-20 px-4">
                <div className="max-w-6xl mx-auto">
                  <motion.h2 
                    className="font-metal text-5xl md:text-7xl text-center mb-16 text-glow"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    DARK RELEASES
                  </motion.h2>
                  
                  <AlbumGrid />
                </div>
              </section>
              
              {/* Social Media Section */}
              <section id="socials" className="min-h-screen py-20 px-4 flex flex-col justify-center">
                <div className="max-w-4xl mx-auto text-center">
                  <motion.h2 
                    className="font-metal text-5xl md:text-7xl mb-16 text-glow"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    CONNECT TO THE DARKNESS
                  </motion.h2>
                  
                  <SocialLinks />
                  
                  <motion.p 
                    className="text-gray-400 text-xl mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                  >
                    Follow the journey into electronic darkness
                  </motion.p>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
