import { getClanInfo } from "../services/ClanService";
import { sendLocalNotification } from "../services/NotificationService";

export const fetchClanData = async (clanTag: string) => {
    try {
        const response = await fetch(`https://api.clashofclans.com/v1/clans/%23${clanTag}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer YOUR_API_KEY`,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Impossible de récupérer les données du clan.");
        }

        const clanData = await response.json();

        // Vérification de la fin d'une guerre de clan (Ajout de la notification)
        if (clanData.warWinStreak !== undefined) {
            const message = clanData.warWinStreak > 0
                ? "Félicitations ! Votre clan a remporté la guerre ! 🎉"
                : "Votre clan a perdu la guerre... 😞";

            await sendLocalNotification("Résultat de la guerre de clan", message);
        }

        return clanData;
    } catch (error) {
        console.error("Erreur API Clash of Clans :", error);
        throw error;
    }
};