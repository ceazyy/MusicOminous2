import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import AlbumCard from "./album-card";
import type { Album } from "@shared/schema";

export default function AlbumGrid() {
  const { data: albums, isLoading, error } = useQuery<Album[]>({
    queryKey: ["/api/albums"],
  });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-12">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-800 h-80 rounded-lg mb-6"></div>
            <div className="bg-gray-700 h-8 rounded mb-4"></div>
            <div className="bg-gray-700 h-6 rounded mb-4"></div>
            <div className="bg-gray-700 h-12 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 text-xl">
        Failed to load albums. The darkness consumes all...
      </div>
    );
  }

  if (!albums || albums.length === 0) {
    return (
      <div className="text-center text-gray-400 text-xl">
        No releases found in the void...
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-12">
      {albums.map((album, index) => (
        <motion.div
          key={album.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.2,
            duration: 0.8,
            ease: "easeOut"
          }}
        >
          <AlbumCard album={album} />
        </motion.div>
      ))}
    </div>
  );
}
