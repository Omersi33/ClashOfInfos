import { verifyToken } from "@/services/player.service";
import { updateLinkedAccounts } from "@/services/auth.service";

export const linkPlayerTag = async (userId: string, playerTag: string, token: string) => {
  const result = await verifyToken(playerTag, token);
  if (result.status !== "ok") throw new Error("Token invalide");
  await updateLinkedAccounts(userId, (prev: any) => [...prev, playerTag]);
};

export const unlinkPlayerTag = async (userId: string, currentTags: string[], playerTag: string) => {
  const updatedTags = currentTags.filter(tag => tag !== playerTag);
  await updateLinkedAccounts(userId, updatedTags);
};