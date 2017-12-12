import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {TeamsService} from '../../services/teams.service';
import {Team} from '../../models/team';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatTableDataSource, PageEvent} from '@angular/material';
import {TeamsInputComponent} from './teams-input/teams-input.component';
import {PlayersInputComponent} from './players-input/players-input.component';
import {Player} from '../../models/player';
import {PlayersService} from '../../services/players.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  teams: Team[] = [];
  teamsSize: number;
  pageSize = 10;
  pageIndex: number;

  constructor(private authService: AuthService, private teamsService: TeamsService, public dialog: MatDialog) { }

  ngOnInit() {
    this.teamsService.getTeams(0, 10).subscribe(teams => {
      this.teams = teams;
      console.log(teams);
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
    this.teamsService.getTeamsSize().subscribe(size => {
      this.teamsSize = size;
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

  onPageEvent(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.teamsService.getTeams(pageEvent.pageIndex * pageEvent.pageSize, pageEvent.pageSize).subscribe(teams => {
      this.teams = teams;
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

  openDialog(team: Team): void {
    const dialogRef = this.dialog.open(TeamsDialogComponent, {
      data: { team: team }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const index = this.teams.indexOf(result);
        if (index !== -1) {
          this.teams.splice(index, 1);
          this.teamsSize--;
          console.log('team deleted!');
        }
      }
    });
  }

  addNewTeam(team: Team) {
    this.teamsService.addTeam(team).subscribe(id => {
      if (this.teams.length < this.pageSize) {
        team.id = id;
        this.teams.push(team);
      }
      this.teamsSize++;
      console.log('team added!');
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

}

@Component({
  selector: 'app-teams-dialog',
  templateUrl: './teams-dialog.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsDialogComponent {
  team: Team;
  displayedColumns = ['number', 'name', 'fgma', 'ftma', 'fgma3', 'pf', 'reb', 'ast', 'stl', 'blk', 'to', 'actions'];
  dataSource = new MatTableDataSource();

  constructor(public dialogRef: MatDialogRef<TeamsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private teamsService: TeamsService,
              private playersService: PlayersService, public dialog: MatDialog, private router: Router) {
    this.team = data.team;
    this.dataSource.data = this.team.players;
  }

  deleteTeam() {
    this.teamsService.deleteTeam(this.team.id).subscribe(() => {
      this.dialogRef.close(this.team);
    }, error => {
      console.log(error);
    });
  }

  updateTeam() {
    const dialogRef = this.dialog.open(TeamsInputComponent, {
      data: { team: this.team, title: 'Update Team', buttonText: 'Update' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.teamsService.updateTeam(result.id, result).subscribe(() => {
          console.log('updated team!');
        }, error => {
          console.log(error);
        });
      }
    });
  }

  addPlayer() {
    const dialogRef = this.dialog.open(PlayersInputComponent, {
      data: { player: new Player(), teamId: this.team.id, title: 'Add Player', buttonText: 'Add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.playersService.addPlayer(result).subscribe(() => {
          this.dialogRef.close();
        }, error => {
          console.log(error);
        });
      }
    });
  }

  removePlayer(id: number) {
    this.playersService.deletePlayer(id).subscribe(() => {
      this.dialogRef.close();
    }, error => {
      console.log(error);
    });
  }

  updatePlayer(player: Player) {
    const dialogRef = this.dialog.open(PlayersInputComponent, {
      data: { player: player, teamId: player.teamId, title: 'Update Player', buttonText: 'Update' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.playersService.updateTeam(result.id, result).subscribe(() => {
        }, error => {
          console.log(error);
        });
      }
    });
  }

}
