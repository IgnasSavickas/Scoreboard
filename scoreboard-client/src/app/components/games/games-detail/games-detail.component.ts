import { Component, OnInit } from '@angular/core';
import {GamesService} from '../../../services/games.service';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Game} from '../../../models/game';
import {MatDialog, MatSnackBar, MatTableDataSource} from '@angular/material';
import {Player} from '../../../models/player';
import {PlayersService} from '../../../services/players.service';
import {GamesInputComponent, StatsInputComponent} from '../games-input/games-input.component';
import {FileUploadService} from '../../../services/file-upload.service';
import {Stats} from '../../../models/stats';

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
  userData: any;

  constructor(private authService: AuthService, private gamesService: GamesService, private playersService: PlayersService,
              private fileUploadService: FileUploadService, public dialog: MatDialog, public snackBar: MatSnackBar,
              private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.authService.getUserData().subscribe((userData: boolean) => {
      this.userData = userData;
    });
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

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 3000
    });
  }

  updatePoints(players, result) {
    let points = 0;
    for (const player of players) {
      if (player.id === result.playerId) {
        player.fgm = result.fgm;
        player.fga = result.fga;
        player.ftm = result.ftm;
        player.fta = result.fta;
        player.fgm3 = result.fgm3;
        player.fga3 = result.fga3;
        player.pf = result.pf;
        player.reb = result.reb;
        player.ast = result.ast;
        player.stl = result.stl;
        player.blk = result.blk;
        player.to = result.to;
        if (player.fga !== 0) {
          player.fg = player.fgm / player.fga * 100;
          player.fg = Math.round(player.fg * 100) / 100;
        }
        if (player.fta !== 0) {
          player.ft = player.ftm / player.fta * 100;
          player.ft = Math.round(player.ft * 100) / 100;
        }
        if (player.fga3 !== 0) {
          player.fg3 = player.fgm3 / player.fga3 * 100;
          player.fg3 = Math.round(player.fg3 * 100) / 100;
        }
      }
      points += player.fgm * 2 + player.ftm + player.fgm3 * 3;
    }
    return points;
  }

  updateGame(result) {
    let homePoints: number;
    let visitorPoints: number;
    homePoints = this.updatePoints(this.players, result);
    visitorPoints = this.updatePoints(this.players2, result);
    this.game.homePoints = homePoints;
    this.game.visitorPoints = visitorPoints;
    this.gamesService.updateGame(this.game.id, this.game).subscribe(() => {
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

  updateStats(player, statsId) {
    let surname = '';
    if (player.surname) {
      surname = player.surname;
    }
    const dialogRef = this.dialog.open(StatsInputComponent, {
      data: {player: player, statsId: statsId, title: player.name + ' ' + surname, buttonText: 'Update'}
    });
    dialogRef.afterClosed().subscribe((result: Stats) => {
      if (result) {
        if (!result.id) {
          result.gameId = this.game.id;
          this.playersService.addStats(result).subscribe(id => {
            this.updateGame(result);
            this.openSnackBar('Player\'s \'' + player.name + ' ' + player.surname + '\' stats updated');
          }, error => {
            console.log(error);
            this.authService.handleError(error);
          });
        } else {
          this.playersService.updateStats(result.id, result).subscribe(() => {
            this.updateGame(result);
            this.openSnackBar('Player\'s \'' + player.name + ' ' + player.surname + '\' stats updated');
          }, error => {
            console.log(error);
            this.authService.handleError(error);
          });
        }
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(GamesInputComponent, {
      data: {game: this.game, title: 'Update Game', buttonText: 'Update', noTables: true}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gamesService.updateGame(result.id, result).subscribe(() => {
          this.game = result;
          this.openSnackBar('Game \'' + this.game.homeTeam.name + ' - ' + this.game.visitorTeam.name + '\' updated');
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
      this.openSnackBar('Game \'' + this.game.homeTeam.name + ' - ' + this.game.visitorTeam.name + '\' deleted');
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

  getImageUrl(imageFilename: string) {
    return this.fileUploadService.getImageUrl(imageFilename);
  }

  getExcelUrl(excelFilename: string) {
    return this.fileUploadService.getExcelUrl(excelFilename);
  }

}
