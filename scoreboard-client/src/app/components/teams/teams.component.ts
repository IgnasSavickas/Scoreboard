import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {TeamsService} from '../../services/teams.service';
import {Team} from '../../models/team';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatTableDataSource, PageEvent} from '@angular/material';
import {TeamsInputComponent} from './teams-input/teams-input.component';
import {PlayersInputComponent} from './players-input/players-input.component';
import {Player} from '../../models/player';
import {PlayersService} from '../../services/players.service';
import {FileUploadService} from '../../services/file-upload.service';

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

  constructor(private authService: AuthService, private teamsService: TeamsService, private fileUploadService: FileUploadService,
              public dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.teamsService.getTeams(0, 10).subscribe(teams => {
      this.teams = teams;
      console.log(this.teams);
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

  getImageUrl(imageFilename: string) {
    return this.fileUploadService.getFileUrl(imageFilename);
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

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 3000
    });
  }

  openDialog(team: Team): void {
    const dialogRef = this.dialog.open(TeamsDialogComponent, {
      data: {team: team}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.teams.indexOf(result);
        if (index !== -1) {
          this.teams.splice(index, 1);
          this.teamsSize--;
          this.openSnackBar('Team \'' + result.name + '\' deleted');
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
      this.openSnackBar('Team \'' + team.name + '\' added');
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
export class TeamsDialogComponent implements OnInit {
  team: Team;
  players: Player[] = [];
  displayedColumns = ['number', 'name', 'fgma', 'ftma', 'fgma3', 'pf', 'reb', 'ast', 'stl', 'blk', 'to', 'actions'];
  dataSource = new MatTableDataSource();

  constructor(public dialogRef: MatDialogRef<TeamsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private teamsService: TeamsService,
              private playersService: PlayersService, private fileUploadService: FileUploadService, public dialog: MatDialog,
              public snackBar: MatSnackBar) {
    this.team = Object.assign({}, data.team);
  }

  ngOnInit() {
    this.playersService.getTeamPlayers(this.team.id).subscribe(players => {
      console.log(players);
      this.players = players;
      console.log(this.players);
      this.dataSource.data = this.players;
    }, error => {
      console.log(error);
    });
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
      if (result) {
        this.teamsService.updateTeam(result.id, result).subscribe(() => {
          this.team = result;
          this.data.team.id = result.id;
          this.data.team.name = result.name;
          this.data.team.logoPath = result.logoPath;
          this.snackBar.open('Team \'' + this.team.name + '\' updated', null, {
            duration: 3000
          });
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
      if (result) {
        this.playersService.addPlayer(result).subscribe(id => {
          result.id = id;
          this.players.push(result);
          this.dataSource.data = this.players;
        }, error => {
          console.log(error);
        });
      }
    });
  }

  removePlayer(player: Player) {
    this.playersService.deletePlayer(player.id).subscribe(() => {
      // this.dialogRef.close();
      const index = this.players.indexOf(player);
      if (index !== -1) {
        this.players.splice(index, 1);
        this.dataSource.data = this.players;
      }
    }, error => {
      console.log(error);
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
        });
      }
    });
  }

  getImageUrl(imageFilename: string) {
    return this.fileUploadService.getFileUrl(imageFilename);
  }

}
