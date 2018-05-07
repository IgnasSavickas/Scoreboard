import {Team} from './team';

export class Game {
  id: number;
  dateCreated: string;
  startDate: string;
  endDate: string;
  periodTime: string;
  periods: number;
  homeTeam: Team;
  homeTeamId: number;
  visitorTeam: Team;
  visitorTeamId: number;
}
