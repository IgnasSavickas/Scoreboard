import { Component, OnInit } from '@angular/core';
import {GamesService} from '../../../services/games.service';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Game} from '../../../models/game';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {Player} from '../../../models/player';
import {PlayersService} from '../../../services/players.service';
import {GamesInputComponent, StatsInputComponent} from '../games-input/games-input.component';
import {FileUploadService} from '../../../services/file-upload.service';

@Component({
  selector: 'app-games-detail',
  templateUrl: './games-detail.component.html',
  styleUrls: ['./games-detail.component.css']
})
export class GamesDetailComponent implements OnInit {
  game: Game;
  players: Player[] = [];
  players2: Player[] = [];
  displayedColumns = ['number', 'name', 'fgma', 'ftma', 'fgma3', 'pf', 'reb', 'ast', 'stl', 'blk', 'to', 'actions'];
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();

  constructor(private authService: AuthService, private gamesService: GamesService, private playersService: PlayersService,
              private fileUploadService: FileUploadService, public dialog: MatDialog, private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.gamesService.getGame(+id).subscribe(game => {
        this.game = game;
        this.playersService.getTeamPlayers(game.homeTeamId).subscribe(players => {
          const data = [];
          for (const player of players) {
            const newPlayer = new Player();
            let statsId: number;
            newPlayer.id = player.id;
            newPlayer.name = player.name;
            newPlayer.surname = player.surname;
            newPlayer.number = player.number;
            for (const stats of player.stats) {
              if (stats.gameId === game.id) {
                statsId = stats.id;
                newPlayer.fgm = stats.fgm;
                newPlayer.fga = stats.fga;
                newPlayer.ftm = stats.ftm;
                newPlayer.fta = stats.fta;
                newPlayer.fgm3 = stats.fgm3;
                newPlayer.fga3 = stats.fga3;
                newPlayer.fg = stats.fg;
                newPlayer.ft = stats.ft;
                newPlayer.fg3 = stats.fg3;
                newPlayer.pf = stats.pf;
                newPlayer.reb = stats.reb;
                newPlayer.ast = stats.ast;
                newPlayer.stl = stats.stl;
                newPlayer.blk = stats.blk;
                newPlayer.to = stats.to;
                break;
              }
            }
            data.push({newPlayer, statsId});
            this.players.push(newPlayer);
          }
          console.log(data);
          this.dataSource.data = data;
        }, error => {
          console.log(error);
        });
        this.playersService.getTeamPlayers(game.visitorTeamId).subscribe(players => {
          const data = [];
          for (const player of players) {
            const newPlayer = new Player();
            let statsId: number;
            newPlayer.id = player.id;
            newPlayer.name = player.name;
            newPlayer.surname = player.surname;
            newPlayer.number = player.number;
            for (const stats of player.stats) {
              if (stats.gameId === game.id) {
                statsId = stats.id;
                newPlayer.fgm = stats.fgm;
                newPlayer.fga = stats.fga;
                newPlayer.ftm = stats.ftm;
                newPlayer.fta = stats.fta;
                newPlayer.fgm3 = stats.fgm3;
                newPlayer.fga3 = stats.fga3;
                newPlayer.fg = stats.fg;
                newPlayer.ft = stats.ft;
                newPlayer.fg3 = stats.fg3;
                newPlayer.pf = stats.pf;
                newPlayer.reb = stats.reb;
                newPlayer.ast = stats.ast;
                newPlayer.stl = stats.stl;
                newPlayer.blk = stats.blk;
                newPlayer.to = stats.to;
                break;
              }
            }
            data.push({newPlayer, statsId});
            this.players2.push(newPlayer);
          }
          console.log(data);
          this.dataSource2.data = data;
        }, error => {
          console.log(error);
        });
      }, error => {
        console.log(error);
        this.router.navigate(['/page-not-found']);
        this.authService.handleError(error);
      });
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  applyFilter2(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource2.filter = filterValue;
  }

  updateStats(player, statsId, team) {
    const dialogRef = this.dialog.open(StatsInputComponent, {
      data: { player: player, statsId: statsId, title: player.name + ' ' + player.surname, buttonText: 'Update' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.playersService.updateStats(result.id, result).subscribe(() => {
          let homePoints = 0;
          let visitorPoints = 0;
          for (const player2 of this.players) {
            if (player2.id === result.id && team === 'home') {
              player2.fgm = result.fgm;
              player2.fga = result.fga;
              player2.ftm = result.ftm;
              player2.fta = result.fta;
              player2.fgm3 = result.fgm3;
              player2.fga3 = result.fga3;
              player2.pf = result.pf;
              player2.reb = result.reb;
              player2.ast = result.ast;
              player2.stl = result.stl;
              player2.blk = result.blk;
              player2.to = result.to;
              if (player2.fga !== 0) {
                player2.fg = player2.fgm / player2.fga * 100;
                player2.fg = Math.round(player2.fg * 100) / 100;
              }
              if (player2.fta !== 0) {
                player2.ft = player2.ftm / player2.fta * 100;
                player2.ft = Math.round(player2.ft * 100) / 100;
              }
              if (player2.fga3 !== 0) {
                player2.fg3 = player2.fgm3 / player2.fga3 * 100;
                player2.fg3 = Math.round(player2.fg3 * 100) / 100;
              }
            }
            homePoints += player2.fgm * 2 + player2.ftm + player2.fgm3 * 3;
          }
          for (const player2 of this.players2) {
            if (player2.id === result.id && team === 'visitor') {
              player2.fgm = result.fgm;
              player2.fga = result.fga;
              player2.ftm = result.ftm;
              player2.fta = result.fta;
              player2.fgm3 = result.fgm3;
              player2.fga3 = result.fga3;
              player2.pf = result.pf;
              player2.reb = result.reb;
              player2.ast = result.ast;
              player2.stl = result.stl;
              player2.blk = result.blk;
              player2.to = result.to;
              if (player2.fga !== 0) {
                player2.fg = player2.fgm / player2.fga * 100;
                player2.fg = Math.round(player2.fg * 100) / 100;
              }
              if (player2.fta !== 0) {
                player2.ft = player2.ftm / player2.fta * 100;
                player2.ft = Math.round(player2.ft * 100) / 100;
              }
              if (player2.fga3 !== 0) {
                player2.fg3 = player2.fgm3 / player2.fga3 * 100;
                player2.fg3 = Math.round(player2.fg3 * 100) / 100;
              }
            }
            visitorPoints += player2.fgm * 2 + player2.ftm + player2.fgm3 * 3;
          }
          this.game.homePoints = homePoints;
          this.game.visitorPoints = visitorPoints;
          this.gamesService.updateGame(this.game.id, this.game).subscribe( () => {
          }, error => {
            console.log(error);
          });
        }, error => {
          console.log(error);
          this.authService.handleError(error);
        });
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(GamesInputComponent, {
      data: { game: this.game, title: 'Update Game', buttonText: 'Update', noTables: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gamesService.updateGame(result.id, result).subscribe(() => {
          this.game = result;
        }, error => {
          console.log(error);
          this.authService.handleError(error);
        });
      }
    });
  }

  deleteGame() {
    this.gamesService.deleteGame(this.game.id).subscribe(() => {
      this.router.navigate(['/games']);
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

  getImageUrl(imageFilename: string) {
    return this.fileUploadService.getFileUrl(imageFilename);
  }

}
