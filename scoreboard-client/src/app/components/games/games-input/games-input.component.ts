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

  constructor(private teamsService: TeamsService, private authService: AuthService, public dialog: MatDialog,
			  public dialogRef: MatDialogRef<GamesInputComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
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
      }, error => {
        console.log(error);
      });
    }, error => {
      console.log(error);
      this.authService.handleError(error);
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
    gameResult.public = this.game.public;
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
              @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog) {
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
