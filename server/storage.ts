// Use dynamic imports for better serverless compatibility
import type { User, InsertUser, Album, InsertAlbum } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllAlbums(): Promise<Album[]>;
  getAlbum(id: number): Promise<Album | undefined>;
  createAlbum(album: InsertAlbum): Promise<Album>;
}

// In-memory storage implementation
class MemStorage implements IStorage {
  private static instance: MemStorage | null = null;
  private users: Map<number, User>;
  private albums: Map<number, Album>;
  private currentUserId: number;
  private currentAlbumId: number;
  private initialized: boolean;
  private initializationPromise: Promise<void> | null;

  private constructor() {
    this.users = new Map();
    this.albums = new Map();
    this.currentUserId = 1;
    this.currentAlbumId = 1;
    this.initialized = false;
    this.initializationPromise = null;
  }

  public static getInstance(): MemStorage {
    if (!MemStorage.instance) {
      console.log("Creating new MemStorage instance");
      MemStorage.instance = new MemStorage();
    }
    return MemStorage.instance;
  }

  private async initializeAlbums() {
    if (this.initialized) {
      console.log("Storage already initialized");
      return;
    }

    try {
      console.log("Starting album initialization...");
      
      // Clear any existing albums to prevent duplicates
      this.albums.clear();
      this.currentAlbumId = 1;
      
      // Wicked Generation - Coming June 26, 2025
      const wickedGen = await this.createAlbum({
        title: "WICKED GENERATION",
        catalog: "CEAZY",
        coverImage: "/src/assets/NS008.jpg",
        releaseDate: "2025-06-26",
        price: null,
        isReleased: false,
        previewUrl: null,
        purchaseUrl: null,
      });
      console.log("Created album:", wickedGen.title);

      // Evolution - Already released
      const evolution = await this.createAlbum({
        title: "EVOLUTION",
        catalog: "CEAZY",
        coverImage: "/src/assets/EVOLUTION.png",
        releaseDate: "2024-12-01",
        price: "5.00",
        isReleased: true,
        previewUrl: "/preview/evolution.mp3",
        purchaseUrl: "/purchase/evolution",
      });
      console.log("Created album:", evolution.title);

      this.initialized = true;
      console.log("Albums initialized successfully");
    } catch (error) {
      console.error("Error initializing albums:", error);
      this.initialized = false;
      throw error;
    }
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      if (!this.initializationPromise) {
        console.log("Starting initialization promise");
        this.initializationPromise = this.initializeAlbums();
      }
      try {
        await this.initializationPromise;
      } catch (error) {
        console.error("Initialization failed:", error);
        this.initializationPromise = null;
        throw error;
      }
    }
  }

  async getAllAlbums(): Promise<Album[]> {
    try {
      console.log("Getting all albums...");
      await this.ensureInitialized();
      const albums = Array.from(this.albums.values());
      console.log(`Retrieved ${albums.length} albums:`, albums.map(a => a.title));
      return albums;
    } catch (error) {
      console.error("Error in getAllAlbums:", error);
      throw error;
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAlbum(id: number): Promise<Album | undefined> {
    try {
      await this.ensureInitialized();
      const album = this.albums.get(id);
      console.log(`Retrieved album ${id}:`, album ? "found" : "not found");
      return album;
    } catch (error) {
      console.error(`Error in getAlbum(${id}):`, error);
      throw error;
    }
  }

  async createAlbum(insertAlbum: InsertAlbum): Promise<Album> {
    const id = this.currentAlbumId++;
    const album: Album = {
      id,
      title: insertAlbum.title,
      catalog: insertAlbum.catalog,
      coverImage: insertAlbum.coverImage,
      releaseDate: insertAlbum.releaseDate ?? null,
      price: insertAlbum.price ?? null,
      isReleased: insertAlbum.isReleased ?? null,
      previewUrl: insertAlbum.previewUrl ?? null,
      purchaseUrl: insertAlbum.purchaseUrl ?? null
    };
    this.albums.set(id, album);
    return album;
  }
}

// Export a singleton instance
const storage = MemStorage.getInstance();

// Start initialization immediately
storage.getAllAlbums().catch(error => {
  console.error("Initial storage initialization failed:", error);
});

export { storage };
