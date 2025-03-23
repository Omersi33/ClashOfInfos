import { API_KEY, BASE_URL } from "@/config/apiConfig";
import Player from "@/models/Player";

export const getPlayerByTag = async (tag: string) => {
  const formattedTag = tag.replace("#", "");
  const response = await fetch(`${BASE_URL}/players/%23${formattedTag}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!response.ok) throw new Error("Joueur introuvable");

  const data = await response.json();
  return new Player(data);
};

export const verifyToken = async (tag: string, token: string) => {
  const formattedTag = tag.replace("#", "");
  const response = await fetch(`${BASE_URL}/players/%23${formattedTag}/verifytoken`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Erreur de vérification : ${errorMessage}`);
  }

  const data = await response.json();
  return data;
};