import axios from "axios";
import { Player } from "../models/Player";

const API_KEY = "YOUR_CLASH_OF_CLANS_API_KEY";
const BASE_URL = "https://api.clashofclans.com/v1";

export const getPlayerInfo = async (playerTag: string): Promise<Player> => {
  const response = await axios.get(`${BASE_URL}/players/%23${playerTag}`, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  });
  return response.data;
};