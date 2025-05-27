import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useLocation } from 'wouter';
import backgroundImage from "@assets/pic.jpg";

interface CheckoutData {
  album: {
    id: number;
    title: string;
    price: string;
    coverImage: string;
  };
}

const CheckoutForm = ({ album }: { album: CheckoutData['album'] }) => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // TODO: Implement CashFree payment flow here
      toast({
        title: "Payment System Coming Soon",
        description: "We're currently upgrading our payment system. Please check back later.",
        variant: "default",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred during payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Static Background */}
      <div 
        className="fixed inset-0 z-0 background-static"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="bg-black bg-opacity-80 border border-cyan-400 rounded-lg p-8 max-w-md w-full backdrop-blur-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <h1 className="font-metal text-3xl mb-4 text-glow-cyan">
              COMPLETE YOUR PURCHASE
            </h1>
            <div className="mb-6">
              <h2 className="font-metal text-xl text-white mb-2">{album.title}</h2>
              <p className="text-cyan-400 text-2xl font-bold">${album.price}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center text-gray-400 mb-6">
              <p>Payment system upgrade in progress</p>
              <p className="text-sm mt-2">We're currently upgrading our payment system to provide you with a better experience.</p>
            </div>
            
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-cyan-400 text-black font-bold py-3 hover:bg-white transition-all duration-300"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  PROCESSING...
                </>
              ) : (
                <>
                  <i className="fas fa-credit-card mr-2"></i>
                  PAY ${album.price}
                </>
              )}
            </Button>
            
            <Button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-transparent border border-gray-600 text-white hover:border-cyan-400 transition-all duration-300"
            >
              CANCEL
            </Button>
          </form>

          <div className="text-center mt-6 text-gray-400 text-sm">
            <i className="fas fa-lock mr-2"></i>
            Secure Payment Coming Soon
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default function Checkout() {
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    // Get album ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const albumId = urlParams.get('album');
    
    if (!albumId) {
      navigate("/");
      return;
    }

    // Get album details
    apiRequest("GET", `/api/albums/${albumId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((album) => {
        if (!album) {
          throw new Error("Album not found");
        }
        setCheckoutData({ album });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching album:", error);
        navigate("/");
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white font-metal">LOADING...</p>
        </div>
      </div>
    );
  }

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="font-metal text-xl">ALBUM NOT FOUND</p>
        </div>
      </div>
    );
  }

  return <CheckoutForm album={checkoutData.album} />;
}