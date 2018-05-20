import {Component, OnInit} from '@angular/core';
import {Game} from '../../models/game';
import {GamesService} from '../../services/games.service';
import {MatDialog, MatSnackBar, PageEvent} from '@angular/material';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {FileUploadService} from '../../services/file-upload.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  games: Game[] = [];
  gamesSize: number;
  pageSize = 10;
  pageIndex = 0;

  constructor(private gamesService: GamesService, private fileUploadService: FileUploadService, private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: ParamMap) => {
      const page = params['page'];
      const pageSize = params['pageSize'];
      if (page !== undefined) {
        this.pageIndex = page;
        this.pageSize = pageSize;
      }
      this.gamesService.getPublicGames(this.pageIndex * this.pageSize, this.pageSize).subscribe(games => {
        this.games = games;
      }, error => {
        console.log(error);
      });
    });
    this.gamesService.getPublicGamesSize().subscribe(size => {
      this.gamesSize = size;
    }, error => {
      console.log(error);
    });
  }

  onPageEvent(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.gamesService.getGames(pageEvent.pageIndex * pageEvent.pageSize, pageEvent.pageSize).subscribe(games => {
      this.games = games;
      this.router.navigate(['/home'], {queryParams: { page: pageEvent.pageIndex, pageSize: pageEvent.pageSize }});
    }, error => {
      console.log(error);
    });
  }

  onGameClick(game: Game) {
    this.router.navigate(['/games', game.id]);
  }

  getImageUrl(imageFilename: string) {
    return this.fileUploadService.getFileUrl(imageFilename);
  }

}
