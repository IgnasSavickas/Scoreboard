import {Component, Inject, OnInit} from '@angular/core';
import {Game} from '../../../models/game';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatTableDataSource} from '@angular/material';
import {Team} from '../../../models/team';
import {TeamsService} from '../../../services/teams.service';
import {AuthService} from '../../../services/auth.service';
import {PlayersService} from '../../../services/players.service';
import {Player} from '../../../models/player';
import {FileUploadService} from '../../../services/file-upload.service';
import {TeamsDialogComponent} from '../../teams/teams.component';
import {Stats} from '../../../models/stats';
import {PlayersInputComponent} from '../../teams/players-input/players-input.component';

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

  displayedColumns = ['number', 'name', 'actions'];
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();

  constructor(private teamsService: TeamsService, private playersService: PlayersService, private authService: AuthService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<GamesInputComponent>,
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
        this.authService.handleError(error);
      });
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

  updateStats(player) {
    const dialogRef = this.dialog.open(StatsInputComponent, {
      data: { stats: new Stats(), title: 'Add Stats', buttonText: 'Add' }
    });
    /*dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.playersService.updatePlayer(result.id, result).subscribe(() => {
        }, error => {
          console.log(error);
        });
      }
    });*/
  }

  onChange(change) {
    this.playersService.getTeamPlayers(change.value.id).subscribe(players => {
      console.log(players);
      this.dataSource.data = players;
    }, error => {
      console.log(error);
    });
  }

  onChange2(change) {
    this.playersService.getTeamPlayers(change.value.id).subscribe(players => {
      console.log(players);
      this.dataSource2.data = players;
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

  constructor(public dialogRef: MatDialogRef<TeamsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private teamsService: TeamsService,
              private playersService: PlayersService, private fileUploadService: FileUploadService, public dialog: MatDialog,
              public snackBar: MatSnackBar) {
    this.stats = data.stats;
  }

  onButtonClick() {
  }

}
