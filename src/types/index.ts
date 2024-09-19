export interface User {
    id: string;
    email: string;
    // Add other user properties as needed
  }
  
  export interface ShortURL {
    id: string;
    originalURL: string;
    shortCode: string;
    createdAt: Date;
    expiresAt?: Date;
    clicks: number;
  }