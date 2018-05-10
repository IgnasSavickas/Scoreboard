import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {PlayersService} from '../../../services/players.service';
import {FileUploadService} from '../../../services/file-upload.service';
import {MatDialog, MatSnackBar, MatTableDataSource} from '@angular/material';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {TeamsService} from '../../../services/teams.service';
import {Team} from '../../../models/team';
import {Player} from '../../../models/player';
import {TeamsInputComponent} from '../teams-input/teams-input.component';
import {PlayersInputComponent} from '../players-input/players-input.component';
import {GamesService} from '../../../services/games.service';
import {Game} from '../../../models/game';

@Component({
  selector: 'app-teams-detail',
  templateUrl: './teams-detail.component.html',
  styleUrls: ['./teams-detail.component.css']
})
export class TeamsDetailComponent implements OnInit {
  team: Team;
  players: Player[] = [];
  games: Game[] = [];
  displayedColumns = ['number', 'name', 'fgma', 'ftma', 'fgma3', 'pf', 'reb', 'ast', 'stl', 'blk', 'to', 'actions'];
  displayedColumns2 = ['teams', 'scores', 'dates'];
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();

  constructor(private authService: AuthService, private teamsService: TeamsService, private playersService: PlayersService,
              private gamesService: GamesService, private fileUploadService: FileUploadService, public dialog: MatDialog,
              public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.teamsService.getTeam(+id).subscribe(team => {
        this.team = team;
        this.playersService.getTeamPlayers(team.id).subscribe(players => {
          // this.players = players;
          const newPlayers: Player[] = [];
          for (const player of players) {
            const newPlayer = new Player();
            newPlayer.id = player.id;
            newPlayer.name = player.name;
            newPlayer.surname = player.surname;
            newPlayer.number = player.number;
            for (const stats of player.stats) {
              newPlayer.fgm += stats.fgm;
              newPlayer.fga += stats.fga;
              newPlayer.ftm += stats.ftm;
              newPlayer.fta += stats.fta;
              newPlayer.fgm3 += stats.fgm3;
              newPlayer.fga3 += stats.fga3;
              newPlayer.pf += stats.pf;
              newPlayer.reb += stats.reb;
              newPlayer.ast += stats.ast;
              newPlayer.stl += stats.stl;
              newPlayer.blk += stats.blk;
              newPlayer.to += stats.to;
            }
            if (newPlayer.fga !== 0) {
              newPlayer.fg = newPlayer.fgm / newPlayer.fga * 100;
              newPlayer.fg = Math.round(newPlayer.fg * 100) / 100;
            }
            if (newPlayer.fta !== 0) {
              newPlayer.ft = newPlayer.ftm / newPlayer.fta * 100;
              newPlayer.ft = Math.round(newPlayer.ft * 100) / 100;
            }
            if (newPlayer.fga3 !== 0) {
              newPlayer.fg3 = newPlayer.fgm3 / newPlayer.fga3 * 100;
              newPlayer.fg3 = Math.round(newPlayer.fg3 * 100) / 100;
            }
            this.players.push(newPlayer);
          }
          this.dataSource.data = this.players;
        }, error => {
          console.log(error);
          this.authService.handleError(error);
        });
      });
      this.gamesService.getTeamGames(+id).subscribe(games => {
        this.games = games;
        this.dataSource2.data = games;
      }, error => {
        console.log(error);
        this.authService.handleError(error);
      });
    });
  }

  deleteTeam() {
    this.teamsService.deleteTeam(this.team.id).subscribe(() => {
      this.router.navigate(['/teams']);
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

  updateTeam() {
    const dialogRef = this.dialog.open(TeamsInputComponent, {
      data: {team: this.team, title: 'Update Team', buttonText: 'Update'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teamsService.updateTeam(result.id, result).subscribe(() => {
          this.team = result;
          this.snackBar.open('Team \'' + this.team.name + '\' updated', null, {
            duration: 3000
          });
          console.log('updated team!');
        }, error => {
          console.log(error);
          this.authService.handleError(error);
        });
      }
    });
  }

  addPlayer() {
    const dialogRef = this.dialog.open(PlayersInputComponent, {
      data: { player: new Player(), teamId: this.team.id, title: 'Add Player', buttonText: 'Add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.playersService.addPlayer(result).subscribe(id => {
          result.id = id;
          const newPlayer = new Player();
          newPlayer.id = result.id;
          newPlayer.name = result.name;
          newPlayer.surname = result.surname;
          newPlayer.number = result.number;
          this.players.push(newPlayer);
          this.dataSource.data = this.players;
        }, error => {
          console.log(error);
          this.authService.handleError(error);
        });
      }
    });
  }

  removePlayer(player: Player) {
    this.playersService.deletePlayer(player.id).subscribe(() => {
      const index = this.players.indexOf(player);
      if (index !== -1) {
        this.players.splice(index, 1);
        this.dataSource.data = this.players;
      }
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

  updatePlayer(player: Player) {
    const dialogRef = this.dialog.open(PlayersInputComponent, {
      data: { player: player, teamId: player.teamId, title: 'Update Player', buttonText: 'Update' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.playersService.updatePlayer(result.id, result).subscribe(() => {
        }, error => {
          console.log(error);
          this.authService.handleError(error);
        });
      }
    });
  }

  getImageUrl(imageFilename: string) {
    return this.fileUploadService.getFileUrl(imageFilename);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onRowClick(row) {
    this.router.navigate(['/games/', row.id]);
  }

}
