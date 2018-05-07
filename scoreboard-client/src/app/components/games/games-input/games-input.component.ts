import {Component, Inject, OnInit} from '@angular/core';
import {Game} from '../../../models/game';
import {TeamsInputComponent} from '../../teams/teams-input/teams-input.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Team} from '../../../models/team';
import {TeamsService} from '../../../services/teams.service';
import {AuthService} from '../../../services/auth.service';

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

  constructor(private teamService: TeamsService, private authService: AuthService, public dialogRef: MatDialogRef<TeamsInputComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.game = Object.assign({}, data.game);
      this.title = data.title;
      this.buttonText = data.buttonText;
    }
  }

  ngOnInit() {
    this.teamService.getTeamsSize().subscribe(size => {
      this.teamService.getTeams(0, size).subscribe(teams => {
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
