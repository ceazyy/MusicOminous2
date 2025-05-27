// In-memory storage for albums (same as other API files)
let albumsStore = null;
let initialized = false;

function initializeAlbums() {
  if (initialized) {
    return albumsStore;
  }

  console.log("Initializing albums store...");
  
  albumsStore = [
    {
      id: 1,
      title: "WICKED GENERATION",
      catalog: "CEAZY",
      coverImage: "/src/assets/NS008.jpg",
      releaseDate: "2025-06-26",
      price: null,
      isReleased: false,
      previewUrl: null,
      purchaseUrl: null,
    },
    {
      id: 2,
      title: "EVOLUTION",
      catalog: "CEAZY",
      coverImage: "/src/assets/EVOLUTION.png",
      releaseDate: "2024-12-01",
      price: "5.00",
      isReleased: true,
      previewUrl: "/preview/evolution.mp3",
      purchaseUrl: "/purchase/evolution",
    }
  ];
  
  initialized = true;
  console.log(`Albums initialized: ${albumsStore.length} albums loaded`);
  return albumsStore;
}

export default function handler(req, res) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    console.log(`[${requestId}] Handling ${req.method} ${req.url}`, {
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage()
    });

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const albums = initializeAlbums();
    const { id } = req.query;
    const albumId = parseInt(id);
    
    if (isNaN(albumId)) {
      res.status(400).json({ error: 'Invalid album ID' });
      return;
    }

    const album = albums.find(a => a.id === albumId);
    
    if (!album) {
      res.status(404).json({ error: 'Album not found' });
      return;
    }

    if (!album.isReleased) {
      res.status(400).json({ error: 'Album not yet released' });
      return;
    }
    
    console.log(`[${requestId}] Processing purchase for album ${albumId}: ${album.title}`);
    
    // TODO: Implement CashFree payment flow
    res.status(200).json({ 
      success: true, 
      message: "Payment system upgrade in progress",
      album: {
        id: album.id,
        title: album.title,
        price: album.price,
        coverImage: album.coverImage
      }
    });
    
  } catch (error) {
    console.error(`[${requestId}] Purchase API error:`, {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      error: "Purchase failed",
      requestId
    });
  }
} 