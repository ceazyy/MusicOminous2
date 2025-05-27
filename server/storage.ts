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

  constructor() {
    this.users = new Map();
    this.albums = new Map();
    this.currentUserId = 1;
    this.currentAlbumId = 1;
    this.initialized = false;
    
    // Initialize with CEAZY albums
    this.initializeAlbums().catch(error => {
      console.error("Failed to initialize albums:", error);
    });
  }

  private async initializeAlbums() {
    if (this.initialized) return;

    try {
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
      throw error;
    }
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeAlbums();
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
    await this.ensureInitialized();
    return Array.from(this.albums.values());
  }

  async getAlbum(id: number): Promise<Album | undefined> {
    await this.ensureInitialized();
    return this.albums.get(id);
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
