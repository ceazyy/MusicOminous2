import { users, albums, type User, type InsertUser, type Album, type InsertAlbum } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllAlbums(): Promise<Album[]>;
  getAlbum(id: number): Promise<Album | undefined>;
  createAlbum(album: InsertAlbum): Promise<Album>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private albums: Map<number, Album>;
  private currentUserId: number;
  private currentAlbumId: number;
  private initialized: boolean;
  private initializationPromise: Promise<void> | null;

  constructor() {
    this.users = new Map();
    this.albums = new Map();
    this.currentUserId = 1;
    this.currentAlbumId = 1;
    this.initialized = false;
    this.initializationPromise = null;
    
    // Start initialization immediately
    this.initializationPromise = this.initializeAlbums().catch(error => {
      console.error("Failed to initialize albums:", error);
      throw error; // Re-throw to ensure initialization failure is propagated
    });
  }

  private async initializeAlbums() {
    if (this.initialized) return;

    try {
      console.log("Starting album initialization...");
      
      // Wicked Generation - Coming June 26, 2025
      await this.createAlbum({
        title: "WICKED GENERATION",
        catalog: "CEAZY",
        coverImage: "/src/assets/NS008.jpg",
        releaseDate: "2025-06-26",
        price: null,
        isReleased: false,
        previewUrl: null,
        purchaseUrl: null,
      });

      // Evolution - Already released
      await this.createAlbum({
        title: "EVOLUTION",
        catalog: "CEAZY",
        coverImage: "/src/assets/EVOLUTION.png",
        releaseDate: "2024-12-01",
        price: "5.00",
        isReleased: true,
        previewUrl: "/preview/evolution.mp3",
        purchaseUrl: "/purchase/evolution",
      });

      this.initialized = true;
      console.log("Albums initialized successfully");
    } catch (error) {
      console.error("Error initializing albums:", error);
      this.initialized = false; // Reset initialization flag on error
      throw error;
    }
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      if (!this.initializationPromise) {
        this.initializationPromise = this.initializeAlbums();
      }
      await this.initializationPromise;
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

  async getAllAlbums(): Promise<Album[]> {
    try {
      await this.ensureInitialized();
      const albums = Array.from(this.albums.values());
      console.log(`Retrieved ${albums.length} albums`);
      return albums;
    } catch (error) {
      console.error("Error in getAllAlbums:", error);
      throw error;
    }
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

// Use memory storage for now - can be switched to database storage in production
export const storage = new MemStorage();
