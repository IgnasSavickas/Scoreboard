import {Component, Inject, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Team} from '../../../models/team';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-teams-input',
  templateUrl: './teams-input.component.html',
  styleUrls: ['./teams-input.component.css']
})
export class TeamsInputComponent implements OnInit {
  team: Team;
  title: string;
  buttonText: string;

  constructor(public dialogRef: MatDialogRef<TeamsInputComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data !== null) {
      this.team = data.team;
      this.title = data.title;
      this.buttonText = data.buttonText;
    }
  }

  ngOnInit() {
  }

  onButtonClick() {
    const teamResult = new Team();
    teamResult.id = this.team.id;
    teamResult.name = this.team.name;
    this.dialogRef.close(teamResult);
  }

}
