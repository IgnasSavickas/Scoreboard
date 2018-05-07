import { Component, OnInit } from '@angular/core';
import {Game} from '../../models/game';
import {GamesService} from '../../services/games.service';
import {AuthService} from '../../services/auth.service';
import {MatDialog, MatSnackBar, PageEvent} from '@angular/material';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  games: Game[] = [];
  gamesSize: number;
  pageSize = 10;
  pageIndex: number;

  constructor(private authService: AuthService, private gamesService: GamesService, public dialog: MatDialog,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.gamesService.getGames(0, 10).subscribe(games => {
      this.games = games;
      console.log(games);
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

  onPageEvent(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.gamesService.getGames(pageEvent.pageIndex * pageEvent.pageSize, pageEvent.pageSize).subscribe(teams => {
      this.games = teams;
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 3000
    });
  }

  addNewGame(game: Game) {
    let newGame = new Game();
    newGame = Object.assign({}, game);
    newGame.homeTeamId = game.homeTeam.id;
    newGame.visitorTeamId = game.visitorTeam.id;
    newGame.homeTeam = undefined;
    newGame.visitorTeam = undefined;
    this.gamesService.addGame(newGame).subscribe(id => {
      game.id = id;
      this.games.push(game);
      console.log('game added!');
      this.openSnackBar('Game \'' + game.homeTeam.name + 'vs' + game.visitorTeam.name + '\' added');
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

  openDialog() {}

}
