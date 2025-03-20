export default class Clan {
  tag: string;
  name: string;
  level: number;
  description: string;
  trophies: number;
  members: number;

  constructor(data: any) {
    this.tag = data.tag;
    this.name = data.name;
    this.level = data.clanLevel;
    this.description = data.description;
    this.trophies = data.clanPoints;
    this.members = data.members;
  }
}