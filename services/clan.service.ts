import { BASE_URL, API_KEY } from "@/config/apiConfig";
import Clan from "@/models/Clan";
import ClanMember from "@/models/ClanMember";

export const getClanByTag = async (tag: string): Promise<Clan> => {
  const formattedTag = tag.replace("#", "");
  const response = await fetch(`${BASE_URL}/clans/%23${formattedTag}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!response.ok) throw new Error("Clan introuvable.");

  const data = await response.json();
  return new Clan(data);
};

export const getClanMembers = async (tag: string): Promise<ClanMember[]> => {
  const formattedTag = tag.replace("#", "");
  const response = await fetch(`${BASE_URL}/clans/%23${formattedTag}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!response.ok) throw new Error("Impossible de récupérer les membres du clan.");

  const data = await response.json();
  if (!data.memberList) throw new Error("Aucun membre trouvé.");

  return data.memberList;
};