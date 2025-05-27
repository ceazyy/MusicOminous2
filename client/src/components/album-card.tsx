import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CountdownTimer from "./countdown-timer";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'wouter';
import type { Album } from "@shared/schema";
import ns008Image from "@assets/NS008.jpg";
import evolutionImage from "@assets/EVOLUTION.png";

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  const { isPlaying, currentTrack, playTrack, stopTrack } = useAudioPlayer();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handlePlayClick = () => {
    if (isPlaying && currentTrack === album.id) {
      stopTrack();
    } else {
      // Simulate audio playback with track ID
      playTrack(album.id, album.previewUrl || "");
    }
  };

  const handlePurchaseClick = async () => {
    if (!album.isReleased) return;
    
    setIsProcessingPayment(true);
    
    try {
      // TODO: Implement CashFree payment flow here
      toast({
        title: "Payment System Coming Soon",
        description: "We're currently upgrading our payment system. Please check back later.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Get the correct image source
  const getImageSrc = () => {
    if (album.title === "WICKED GENERATION") return ns008Image;
    if (album.title === "EVOLUTION") return evolutionImage;
    return album.coverImage;
  };

  const isCurrentlyPlaying = isPlaying && currentTrack === album.id;

  return (
    <motion.div 
      className="album-card bg-black bg-opacity-50 border border-gray-600 rounded-lg p-8 text-center"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      {/* Album Cover */}
      <motion.img
        src={getImageSrc()}
        alt={`${album.title} Album Cover`}
        className="w-full h-80 object-contain rounded-lg mb-6 transition-transform duration-300 bg-black bg-opacity-30"
        whileHover={{ scale: 1.02 }}
        loading="lazy"
      />
      
      {/* Album Info */}
      <h3 className="font-metal text-3xl mb-4 text-glow-cyan">
        {album.title}
      </h3>
      <p className="text-gray-300 mb-4 text-lg">{album.catalog}</p>
      
      {/* Countdown or Price */}
      <div className="mb-6">
        {!album.isReleased && album.releaseDate ? (
          <div>
            <p className="text-glow-pink mb-2 text-xl">COMING SOON</p>
            <CountdownTimer targetDate={album.releaseDate} />
          </div>
        ) : (
          <div>
            <p className="text-green-400 text-3xl font-bold text-glow">
              ${album.price}
            </p>
            <p className="text-gray-400">Digital Download</p>
          </div>
        )}
      </div>
      
      {/* Play Button */}
      <Button
        className={`play-btn bg-transparent border border-cyan-400 text-cyan-400 px-8 py-3 rounded-full hover:bg-cyan-400 hover:text-black transition-all duration-300 mb-4 w-full ${
          isCurrentlyPlaying ? "glow-pulse" : ""
        }`}
        onClick={handlePlayClick}
      >
        <i className={`fas ${isCurrentlyPlaying ? "fa-pause" : "fa-play"} mr-2`}></i>
        {isCurrentlyPlaying ? "PLAYING..." : album.isReleased ? "LISTEN NOW" : "PREVIEW"}
      </Button>
      
      {/* Purchase/Pre-order Button */}
      {album.isReleased ? (
        <Button
          className="bg-cyan-400 text-black px-8 py-3 rounded-full hover:bg-white transition-all duration-300 w-full font-bold"
          onClick={handlePurchaseClick}
          disabled={isProcessingPayment}
        >
          <i className={`fas ${isProcessingPayment ? "fa-spinner fa-spin" : "fa-shopping-cart"} mr-2`}></i>
          {isProcessingPayment ? "PROCESSING..." : "BUY NOW"}
        </Button>
      ) : (
        <Button
          className="bg-gray-700 text-gray-400 px-8 py-3 rounded-full w-full cursor-not-allowed"
          disabled
        >
          PRE-ORDER - TBA
        </Button>
      )}
    </motion.div>
  );
}
