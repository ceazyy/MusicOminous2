import { motion } from "framer-motion";

interface EnterSectionProps {
  onEnter: () => void;
}

export default function EnterSection({ onEnter }: EnterSectionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <motion.button
        className="font-metal text-4xl md:text-6xl text-white bg-transparent border-2 border-white px-12 py-6 hover-glow transition-all duration-300 bg-blur"
        onClick={onEnter}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.5)",
          textShadow: "0 0 15px rgba(255, 255, 255, 1)"
        }}
        whileTap={{
          scale: 0.95
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        ENTER THE VOID
      </motion.button>
    </section>
  );
}
