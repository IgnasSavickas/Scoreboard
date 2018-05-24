import { Component, OnInit } from '@angular/core';
import {Game} from '../../models/game';
import {GamesService} from '../../services/games.service';
import {AuthService} from '../../services/auth.service';
import {MatDialog, MatSnackBar, PageEvent} from '@angular/material';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {FileUploadService} from '../../services/file-upload.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  games: Game[] = [];
  gamesSize: number;
  pageSize = 10;
  pageIndex = 0;

  constructor(private authService: AuthService, private gamesService: GamesService, private fileUploadService: FileUploadService,
              private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: ParamMap) => {
      const page = params['page'];
      const pageSize = params['pageSize'];
      if (page !== undefined) {
        this.pageIndex = page;
        this.pageSize = pageSize;
      }
      this.gamesService.getGames(this.pageIndex * this.pageSize, this.pageSize).subscribe(games => {
        this.games = games;
      }, error => {
        console.log(error);
        this.authService.handleError(error);
      });
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
    this.gamesService.getGames(pageEvent.pageIndex * pageEvent.pageSize, pageEvent.pageSize).subscribe(games => {
      this.games = games;
      this.router.navigate(['/games'], {queryParams: { page: pageEvent.pageIndex, pageSize: pageEvent.pageSize }});
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
      this.openSnackBar('Game \'' + game.homeTeam.name + ' - ' + game.visitorTeam.name + '\' added');
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

  onGameClick(game: Game) {
    this.router.navigate(['/games', game.id]);
  }

  getImageUrl(imageFilename: string) {
    return this.fileUploadService.getFileUrl(imageFilename);
  }
}
