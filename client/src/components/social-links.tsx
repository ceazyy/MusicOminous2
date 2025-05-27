import { motion } from "framer-motion";

const socialLinks = [
  {
    icon: "fab fa-soundcloud",
    url: "https://soundcloud.com/ceazytechno",
    label: "SoundCloud",
  },
  {
    icon: "fab fa-instagram", 
    url: "https://www.instagram.com/ceazy_techno/",
    label: "Instagram",
  },
  {
    icon: "fab fa-spotify",
    url: "https://open.spotify.com/artist/3aObXEfeeiy0gwHq8fCRxQ?si=vvXGz1_KT5yScJMslP_rIQ&nd=1&dlsi=6a68a90473b04ff5",
    label: "Spotify",
  },
];

export default function SocialLinks() {
  return (
    <div className="flex justify-center items-center space-x-16 mb-12">
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.label}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon text-6xl md:text-8xl text-white hover:text-cyan-400"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.5 + index * 0.2,
            duration: 0.8,
            ease: "easeOut"
          }}
          whileHover={{
            scale: 1.2,
            filter: "drop-shadow(0 0 20px rgba(0, 255, 255, 0.8))",
            transition: { duration: 0.3 }
          }}
          whileTap={{
            scale: 1.1
          }}
          aria-label={`Visit CEAZY on ${social.label}`}
        >
          <i className={social.icon}></i>
        </motion.a>
      ))}
    </div>
  );
}
