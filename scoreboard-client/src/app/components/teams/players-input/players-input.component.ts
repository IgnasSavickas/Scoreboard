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
    /*playerResult.fgm = this.player.fgm;
    playerResult.fga = this.player.fga;
    playerResult.ftm = this.player.ftm;
    playerResult.fta = this.player.fta;
    playerResult.fgm3 = this.player.fgm3;
    playerResult.fga3 = this.player.fga3;
    playerResult.pf = this.player.pf;
    playerResult.reb = this.player.reb;
    playerResult.ast = this.player.ast;
    playerResult.stl = this.player.stl;
    playerResult.blk = this.player.blk;
    playerResult.to = this.player.to;*/
    playerResult.teamId = this.teamId;
    this.dialogRef.close(playerResult);
  }
}
