import {Component, Inject, OnInit} from '@angular/core';
import {Game} from '../../../models/game';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatTableDataSource} from '@angular/material';
import {Team} from '../../../models/team';
import {TeamsService} from '../../../services/teams.service';
import {AuthService} from '../../../services/auth.service';
import {PlayersService} from '../../../services/players.service';
import {Player} from '../../../models/player';
import {Stats} from '../../../models/stats';

@Component({
  selector: 'app-games-input',
  templateUrl: './games-input.component.html',
  styleUrls: ['./games-input.component.css']
})
export class GamesInputComponent implements OnInit {
  game: Game;
  teams: Team[] = [];
  title: string;
  buttonText: string;

  displayedColumns = ['number', 'name', 'fgma', 'ftma', 'fgma3', 'pf', 'reb', 'ast', 'stl', 'blk', 'to', 'actions'];
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();

  constructor(private teamsService: TeamsService, private playersService: PlayersService, private authService: AuthService,
              public dialog: MatDialog, public dialogRef: MatDialogRef<GamesInputComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.game = Object.assign({}, data.game);
      this.title = data.title;
      this.buttonText = data.buttonText;
    }
  }

  ngOnInit() {
    this.teamsService.getTeamsSize().subscribe(size => {
      this.teamsService.getTeams(0, size).subscribe(teams => {
        this.teams = teams;
        console.log(teams);
      }, error => {
        console.log(error);
      });
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

  updateStats(player) {
    console.log(player);
    const dialogRef = this.dialog.open(StatsInputComponent, {
      data: { player: player, title: player.name + ' ' + player.surname, buttonText: 'Add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        player.fgm = result.fgm;
        player.fga = result.fga;
        player.ftm = result.ftm;
        player.fta = result.fta;
        player.fgm3 = result.fgm3;
        player.fga3 = result.fga3;
        player.fg = result.fg;
        player.ft = result.ft;
        player.fg3 = result.fg3;
        player.pf = result.pf;
        player.reb = result.reb;
        player.ast = result.ast;
        player.stl = result.stl;
        player.blk = result.blk;
        player.to = result.to;
      }
      console.log(this.dataSource.data);
    });
  }

  onChange(change) {
    this.playersService.getTeamPlayers(change.value.id).subscribe(players => {
      const newPlayers: Player[] = [];
      for (const player of players) {
        const newPlayer = new Player();
        newPlayer.id = player.id;
        newPlayer.name = player.name;
        newPlayer.surname = player.surname;
        newPlayer.number = player.number;
        newPlayers.push(newPlayer);
      }
      console.log(newPlayers);
      this.dataSource.data = newPlayers;
    }, error => {
      console.log(error);
    });
  }

  onChange2(change) {
    this.playersService.getTeamPlayers(change.value.id).subscribe(players => {
      const newPlayers: Player[] = [];
      for (const player of players) {
        const newPlayer = new Player();
        newPlayer.id = player.id;
        newPlayer.name = player.name;
        newPlayer.surname = player.surname;
        newPlayer.number = player.number;
        newPlayers.push(newPlayer);
      }
      this.dataSource2.data = newPlayers;
    }, error => {
      console.log(error);
    });
  }

  onButtonClick() {
    const gameResult = new Game();
    gameResult.id = this.game.id;
    gameResult.startDate = this.game.startDate;
    gameResult.endDate = this.game.endDate;
    gameResult.periods = this.game.periods;
    gameResult.periodTime = this.game.periodTime;
    gameResult.homeTeam = this.game.homeTeam;
    gameResult.visitorTeam = this.game.visitorTeam;
    const gameStats: Stats[] = [];
    for (const player of this.dataSource.data as Player[]) {
      const newGameStats = new Stats();
      newGameStats.fgm = player.fgm;
      newGameStats.fga = player.fga;
      newGameStats.ftm = player.ftm;
      newGameStats.fta = player.fta;
      newGameStats.fgm3 = player.fgm3;
      newGameStats.fga3 = player.fga3;
      newGameStats.fg = player.fg;
      newGameStats.ft = player.ft;
      newGameStats.fg3 = player.fg3;
      newGameStats.pf = player.pf;
      newGameStats.reb = player.reb;
      newGameStats.ast = player.ast;
      newGameStats.stl = player.stl;
      newGameStats.blk = player.blk;
      newGameStats.to = player.to;
      newGameStats.playerId = player.id;
      gameStats.push(newGameStats);
      gameResult.homePoints += player.fgm * 2 + player.ftm + player.fgm3 * 3;
    }
    for (const player of this.dataSource2.data as Player[]) {
      const newGameStats = new Stats();
      newGameStats.fgm = player.fgm;
      newGameStats.fga = player.fga;
      newGameStats.ftm = player.ftm;
      newGameStats.fta = player.fta;
      newGameStats.fgm3 = player.fgm3;
      newGameStats.fga3 = player.fga3;
      newGameStats.fg = player.fg;
      newGameStats.ft = player.ft;
      newGameStats.fg3 = player.fg3;
      newGameStats.pf = player.pf;
      newGameStats.reb = player.reb;
      newGameStats.ast = player.ast;
      newGameStats.stl = player.stl;
      newGameStats.blk = player.blk;
      newGameStats.to = player.to;
      newGameStats.playerId = player.id;
      gameStats.push(newGameStats);
      gameResult.visitorPoints += player.fgm * 2 + player.ftm + player.fgm3 * 3;
    }
    gameResult.stats = gameStats;
    this.dialogRef.close(gameResult);
  }

}

@Component({
  selector: 'app-stats-input',
  templateUrl: './stats-input.component.html',
  styleUrls: ['./games-input.component.css']
})
export class StatsInputComponent {
  stats: Stats;

  title: string;
  buttonText: string;

  constructor(public dialogRef: MatDialogRef<StatsInputComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private playersService: PlayersService, public dialog: MatDialog) {
    this.stats = Object.assign({}, data.player);
    this.stats.id = data.statsId;
    this.title = data.title;
    this.buttonText = data.buttonText;
  }

  onButtonClick() {
    const statsResult = new Stats();
    statsResult.id = this.stats.id;
    statsResult.fgm = this.stats.fgm;
    statsResult.fga = this.stats.fga;
    statsResult.ftm = this.stats.ftm;
    statsResult.fta = this.stats.fta;
    statsResult.fgm3 = this.stats.fgm3;
    statsResult.fga3 = this.stats.fga3;
    statsResult.fg = this.stats.fg;
    statsResult.ft = this.stats.ft;
    statsResult.fg3 = this.stats.fg3;
    statsResult.pf = this.stats.pf;
    statsResult.reb = this.stats.reb;
    statsResult.ast = this.stats.ast;
    statsResult.stl = this.stats.stl;
    statsResult.blk = this.stats.blk;
    statsResult.to = this.stats.to;
    this.dialogRef.close(statsResult);
  }

}
