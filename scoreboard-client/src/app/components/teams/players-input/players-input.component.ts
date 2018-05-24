import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Player} from '../../../models/player';
import {Team} from '../../../models/team';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PlayersService} from '../../../services/players.service';

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
  playerInputForm: FormGroup;

  constructor(private playersService: PlayersService, public dialogRef: MatDialogRef<PlayersInputComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data !== null) {
      this.player = data.player;
      this.teamId = data.teamId;
      this.title = data.title;
      this.buttonText = data.buttonText;
    }
  }

  ngOnInit() {
    this.playerInputForm = new FormGroup({
      'number' : new FormControl(this.player.number, [Validators.required, Validators.max(99), Validators.min(1)]),
      'name' : new FormControl(this.player.name, [Validators.required, Validators.maxLength(100),
        Validators.pattern('[A-Za-z]+')]),
      'surname' : new FormControl(this.player.surname, [Validators.maxLength(100),
        Validators.pattern('[A-Za-z]+')])
    });
  }

  get number() { return this.playerInputForm.get('number'); }

  get name() { return this.playerInputForm.get('name'); }

  get surname() { return this.playerInputForm.get('surname'); }

  getNumberErrorMessage() {
    return this.number.hasError('required') ? 'You must enter a number' :
      'Max value is 99';
  }

  getNameErrorMessage() {
    return this.name.hasError('required') ? 'You must enter a name' :
      this.name.hasError('pattern') ? 'You must enter a valid name' :
        'Max length is 100';
  }

  getSurnameErrorMessage() {
    return this.surname.hasError('pattern') ? 'You must enter a valid surname' :
      'Max length is 100';
  }

  onButtonClick() {
    const playerResult = new Player();
    playerResult.id = this.player.id;
    playerResult.number = this.number.value;
    playerResult.name = this.name.value;
    playerResult.surname = this.surname.value;
    playerResult.teamId = this.teamId;
    this.dialogRef.close(playerResult);
  }
}
