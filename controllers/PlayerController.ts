import { getPlayerInfo } from "../services/PlayerService";
import { getClanInfo } from "../services/ClanService";
import { updateUserClan } from "../repositories/UserRepository";
import { sendLocalNotification } from "../services/NotificationService";

export const fetchPlayerData = async (playerTag: string) => {
    try {
        const response = await fetch(`https://api.clashofclans.com/v1/players/%23${playerTag}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer YOUR_API_KEY`,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Impossible de récupérer les données du joueur.");
        }

        const playerData = await response.json();

        // Vérification du changement de trophées (Ajout de la notification)
        const previousTrophies = playerData.previousTrophies ?? playerData.trophies;
        const trophyChange = playerData.trophies - previousTrophies;

        if (trophyChange !== 0) {
            const message = trophyChange > 0
                ? `Bravo ! Vous avez gagné ${trophyChange} trophées ! 🏆`
                : `Ouch... Vous avez perdu ${Math.abs(trophyChange)} trophées 😢`;

            await sendLocalNotification("Changement de trophées", message);
        }

        return playerData;
    } catch (error) {
        console.error("Erreur API Clash of Clans :", error);
        throw error;
    }
};