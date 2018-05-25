import {Team} from './team';
import {Stats} from './stats';

export class Game {
  id: number;
  dateCreated: string;
  startDate: string;
  endDate: string;
  periodTime: string;
  periods: number;
  homeTeam: Team;
  homeTeamId: number;
  homePoints = 0;
  visitorTeam: Team;
  visitorTeamId: number;
  visitorPoints = 0;
  stats: Stats[];
  public: boolean;
  applicationUserId: string;
}
