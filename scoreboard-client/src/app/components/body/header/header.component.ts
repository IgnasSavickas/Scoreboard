import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {TeamsInputComponent} from '../../teams/teams-input/teams-input.component';
import {Team} from '../../../models/team';
import {GamesInputComponent} from '../../games/games-input/games-input.component';
import {Game} from '../../../models/game';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() titleName: string;
  @Input() addButton: boolean;
  @Output() dialogClosed = new EventEmitter<any>();

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog() {
    if (this.titleName === 'Teams') {
      const dialogRef = this.dialog.open(TeamsInputComponent, {
        data: { team: new Team(), title: 'Add a new Team', buttonText: 'Add' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.dialogClosed.emit(result);
        }
      });
    }
    if (this.titleName === 'Games') {
      const dialogRef = this.dialog.open(GamesInputComponent, {
        data: { game: new Game(), title: 'Add a new Game', buttonText: 'Add' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.dialogClosed.emit(result);
        }
      });
    }
  }

}
