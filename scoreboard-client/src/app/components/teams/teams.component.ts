import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {TeamsService} from '../../services/teams.service';
import {Team} from '../../models/team';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  teams: Team[] = [];

  constructor(private authService: AuthService, private teamsService: TeamsService, public dialog: MatDialog) { }

  ngOnInit() {
    this.teamsService.getTeams().subscribe(teams => {
      this.teams = teams;
      console.log(teams);
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

  openDialog(teamId: number): void {
    const dialogRef = this.dialog.open(TeamsDialogComponent, {
      data: { id: teamId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed!');
    });
  }

}

@Component({
  selector: 'app-teams-dialog',
  templateUrl: './teams-dialog.component.html',
})
export class TeamsDialogComponent implements OnInit{
  team: Team;

  constructor(public dialogRef: MatDialogRef<TeamsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private teamService: TeamsService) {
  }

  ngOnInit() {
    this.teamService.getTeam(this.data.id).subscribe(team => {
      this.team = team;
      console.log(team);
    }, error => {
      console.log(error);
    });
  }

}
