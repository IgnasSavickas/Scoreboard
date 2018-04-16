import { Component, OnInit } from '@angular/core';
import {Game} from '../../models/game';
import {GamesService} from '../../services/games.service';
import {AuthService} from '../../services/auth.service';
import {MatDialog, PageEvent} from '@angular/material';

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

  constructor(private authService: AuthService, private gamesService: GamesService, public dialog: MatDialog) { }

  ngOnInit() {
    this.gamesService.getGames(0, 10).subscribe(games => {
      this.games = games;
      console.log(games);
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
    this.gamesService.getGamesSize().subscribe(size => {
      this.gamesSize = size;
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

  addNewGame(game: Game) {
    this.gamesService.addGame(game).subscribe(id => {
      game.id = id;
      this.games.push(game);
      console.log('game added!');
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

}
