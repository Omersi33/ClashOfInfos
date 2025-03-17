export interface Notification {
    userId: string;
    type: "trophies" | "clanWar";
    message: string;
    timestamp: number;
  }