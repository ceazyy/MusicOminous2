import { motion } from "framer-motion";
import logoImage from "@assets/Logo_white.png";

export default function LogoIntro() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <motion.img
        src={logoImage}
        alt="CEAZY Logo"
        className="w-80 h-auto cursor-pointer transition-all duration-300"
        style={{
          filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))"
        }}
        initial={{ 
          opacity: 0, 
          scale: 0.8,
          filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))"
        }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))"
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.8,
          filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.4))"
        }}
        transition={{ 
          duration: 3,
          ease: "easeInOut"
        }}
        whileHover={{
          filter: "drop-shadow(0 0 30px rgba(0, 255, 255, 1)) drop-shadow(0 0 60px rgba(0, 255, 255, 0.8))",
          scale: 1.05,
          transition: { duration: 0.3 }
        }}
      />
    </section>
  );
}
