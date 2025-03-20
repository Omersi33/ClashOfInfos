import Clan from "./Clan";

export default class Player {
  tag: string;
  name: string;
  expLevel: number;
  townHallLevel: number;
  trophies: number;
  bestTrophies: number;
  clan: Clan | null;
  clanTag: string | null;

  constructor(data: any) {
    this.tag = data.tag;
    this.name = data.name;
    this.expLevel = data.expLevel;
    this.townHallLevel = data.townHallLevel;
    this.trophies = data.trophies;
    this.bestTrophies = data.bestTrophies;
    this.clan = data.clan ? new Clan(data.clan) : null;
    this.clanTag = data.clan?.tag || null;
  }
}