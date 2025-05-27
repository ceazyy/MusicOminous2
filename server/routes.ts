import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all albums
  app.get("/api/albums", async (req, res) => {
    try {
      const albums = await storage.getAllAlbums();
      res.json(albums);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch albums" });
    }
  });

  // Get single album
  app.get("/api/albums/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const album = await storage.getAlbum(id);
      
      if (!album) {
        res.status(404).json({ error: "Album not found" });
        return;
      }
      
      res.json(album);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch album" });
    }
  });

  // Create Stripe Checkout session
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { albumId } = req.body;
      const album = await storage.getAlbum(albumId);
      
      if (!album) {
        res.status(404).json({ error: "Album not found" });
        return;
      }
      
      if (!album.isReleased) {
        res.status(400).json({ error: "Album not yet released" });
        return;
      }

      const amount = Math.round(parseFloat(album.price || "0") * 100); // Convert to cents
      
      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: album.title,
                description: `Digital download of ${album.title} by CEAZY`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin || 'http://localhost:5000'}/?success=true&album=${album.id}`,
        cancel_url: `${req.headers.origin || 'http://localhost:5000'}/?canceled=true`,
        metadata: {
          albumId: album.id.toString(),
          albumTitle: album.title,
        },
      });

      res.json({ 
        sessionId: session.id,
        url: session.url,
        album: {
          id: album.id,
          title: album.title,
          price: album.price,
          coverImage: album.coverImage
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: "Error creating checkout session: " + error.message });
    }
  });

  // Purchase completion endpoint
  app.post("/api/purchase/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const album = await storage.getAlbum(id);
      
      if (!album) {
        res.status(404).json({ error: "Album not found" });
        return;
      }
      
      if (!album.isReleased) {
        res.status(400).json({ error: "Album not yet released" });
        return;
      }
      
      // In a real implementation, you would verify the payment with Stripe
      res.json({ 
        success: true, 
        message: "Purchase successful",
        downloadUrl: `/download/${album.id}`
      });
    } catch (error) {
      res.status(500).json({ error: "Purchase failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
