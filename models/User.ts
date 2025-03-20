export interface User {
    uid: string;
    email: string;
    username: string;
    photoBase64?: string;
    linkedAccounts: string[];
  }