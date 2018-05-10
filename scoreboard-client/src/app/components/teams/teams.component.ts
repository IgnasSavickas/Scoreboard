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
import {Game} from '../../models/game';
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

  constructor(private authService: AuthService, private teamsService: TeamsService, private fileUploadService: FileUploadService,
              public dialog: MatDialog, public snackBar: MatSnackBar, private router: Router) { }

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

  onTeamClick(team: Team) {
    this.router.navigate(['/teams', team.id]);
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
