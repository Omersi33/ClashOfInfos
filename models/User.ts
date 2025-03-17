export interface User {
    uid: string;
    email: string;
    username: string;
    photoBase64?: string;
    linkedAccounts: string[]; // Liste des Player Tags liés
  }