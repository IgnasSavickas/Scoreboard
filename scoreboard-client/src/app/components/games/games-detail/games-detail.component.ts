import { Component, OnInit } from '@angular/core';
import {GamesService} from '../../../services/games.service';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Game} from '../../../models/game';
import {MatTableDataSource} from '@angular/material';
import {Player} from '../../../models/player';
import {PlayersInputComponent} from '../../teams/players-input/players-input.component';

@Component({
  selector: 'app-games-detail',
  templateUrl: './games-detail.component.html',
  styleUrls: ['./games-detail.component.css']
})
export class GamesDetailComponent implements OnInit {
  game: Game;
  gameTitle: string;
  homeTeamPoints = 0;
  visitorTeamPoints = 0;
  displayedColumns = ['number', 'name', 'fgma', 'ftma', 'fgma3', 'pf', 'reb', 'ast', 'stl', 'blk', 'to', 'actions'];
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();

  constructor(private authService: AuthService, private gamesService: GamesService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.gamesService.getGame(+id).subscribe(game => {
        this.game = game;
        this.gameTitle = game.homeTeam.name + ' ' + game.homePoints + ':' + game.visitorPoints + ' ' + game.visitorTeam.name;
        console.log(game);
      }, error => {
        console.log(error);
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

  updateStats(player: Player) {
    /*const dialogRef = this.dialog.open(PlayersInputComponent, {
      data: { player: player, teamId: player.teamId, title: 'Update Player', buttonText: 'Update' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.playersService.updatePlayer(result.id, result).subscribe(() => {
        }, error => {
          console.log(error);
        });
      }
    });*/
  }

}
