import {Stats} from './stats';

export class Player {
  id: number;
  number: number;
  name: string;
  surname: string;
  fgm = 0;
  fga = 0;
  ftm = 0;
  fta = 0;
  fgm3 = 0;
  fga3 = 0;
  fg = 0;
  ft = 0;
  fg3 = 0;
  pf = 0;
  reb = 0;
  ast = 0;
  stl = 0;
  blk = 0;
  to = 0;
  stats: Stats[];
  teamId: number;
}
