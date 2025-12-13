// src/types/express.d.ts

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string | number;
        email: string;
        role: string;
      };
    }
  }
}

export {};
