import axios from "axios";
import { Clan } from "../models/Clan";

const API_KEY = "YOUR_CLASH_OF_CLANS_API_KEY";
const BASE_URL = "https://api.clashofclans.com/v1";

export const getClanInfo = async (clanTag: string): Promise<Clan> => {
  const response = await axios.get(`${BASE_URL}/clans/%23${clanTag}`, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  });
  return response.data;
};