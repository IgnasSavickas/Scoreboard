import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Player} from '../../../models/player';
import {Team} from '../../../models/team';

@Component({
  selector: 'app-players-input',
  templateUrl: './players-input.component.html',
  styleUrls: ['./players-input.component.css']
})
export class PlayersInputComponent implements OnInit {
  player: Player;
  teamId: number;
  title: string;
  buttonText: string;

  constructor(public dialogRef: MatDialogRef<PlayersInputComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data !== null) {
      this.player = data.player;
      this.teamId = data.teamId;
      this.title = data.title;
      this.buttonText = data.buttonText;
    }
  }

  ngOnInit() {
  }

  onButtonClick() {
    const playerResult = new Player();
    playerResult.id = this.player.id;
    playerResult.number = this.player.number;
    playerResult.name = this.player.name;
    playerResult.surname = this.player.surname;
    playerResult.teamId = this.teamId;
    this.dialogRef.close(playerResult);
  }
}
