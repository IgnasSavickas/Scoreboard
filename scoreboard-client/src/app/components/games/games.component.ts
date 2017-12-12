import { Component, OnInit } from '@angular/core';
import {Team} from '../../models/team';
import {Game} from '../../models/game';
import {GamesService} from '../../services/games.service';
import {AuthService} from '../../services/auth.service';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  games: Game[] = [];

  constructor(private authService: AuthService, private gamesService: GamesService, public dialog: MatDialog) { }

  ngOnInit() {
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
