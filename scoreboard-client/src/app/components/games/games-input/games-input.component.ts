import {Component, Inject, OnInit} from '@angular/core';
import {Game} from '../../../models/game';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatTableDataSource} from '@angular/material';
import {Team} from '../../../models/team';
import {TeamsService} from '../../../services/teams.service';
import {AuthService} from '../../../services/auth.service';
import {Stats} from '../../../models/stats';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

@Component({
  selector: 'app-games-input',
  templateUrl: './games-input.component.html',
  styleUrls: ['./games-input.component.css']
})
export class GamesInputComponent implements OnInit {
  game: Game;
  teams: Team[] = [];
  title: string;
  buttonText: string;
  gameInputForm: FormGroup;

  constructor(private teamsService: TeamsService, private authService: AuthService, public dialog: MatDialog,
              public dialogRef: MatDialogRef<GamesInputComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.game = Object.assign({}, data.game);
      this.title = data.title;
      this.buttonText = data.buttonText;
    }
  }

  ngOnInit() {
    this.teamsService.getTeamsSize().subscribe(size => {
      this.teamsService.getTeams(0, size).subscribe(teams => {
        this.teams = teams;
      }, error => {
        console.log(error);
      });
    }, error => {
      console.log(error);
      this.authService.handleError(error);
    });
    this.gameInputForm = new FormGroup({
      'homeTeam' : new FormControl(this.game.homeTeam, [Validators.required]),
      'visitorTeam' : new FormControl(this.game.visitorTeam, [Validators.required]),
      'startDate' : new FormControl(this.game.startDate, [Validators.required]),
      'endDate' : new FormControl(this.game.endDate, [Validators.required]),
      'periodTime' : new FormControl(this.game.periodTime, [Validators.pattern('^([0-5]?[0-9]):([0-5][0-9])$')]),
      'periods' : new FormControl(this.game.periods, [Validators.max(99), Validators.min(1)]),
      'public' : new FormControl(this.game.public)
    });
    this.gameInputForm.get('homeTeam').setValidators(this.forbiddenTeamValidator('visitorTeam'));
    this.gameInputForm.get('visitorTeam').setValidators(this.forbiddenTeamValidator('homeTeam'));
    this.gameInputForm.get('endDate').setValidators(this.forbiddenDateTimeValidator('startDate'));
  }

  forbiddenTeamValidator(field: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const group = control.parent;
      const fieldToCompare = group.get(field);
      if (control.value && fieldToCompare.value) {
        const forbidden = Number(control.value.id) === Number(fieldToCompare.value.id);
        return forbidden ? {'forbiddenTeam': {value: control.value}} : null;
      }
    };
  }

  forbiddenDateTimeValidator(field: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const group = control.parent;
      const fieldToCompare = group.get(field);
      if (control.value && fieldToCompare.value) {
        const forbidden = control.value < fieldToCompare.value;
        return forbidden ? {'forbiddenDateTime': {value: control.value}} : null;
      }
    };
  }

  get homeTeam() { return this.gameInputForm.get('homeTeam'); }
  get visitorTeam() { return this.gameInputForm.get('visitorTeam'); }
  get startDate() { return this.gameInputForm.get('startDate'); }
  get endDate() { return this.gameInputForm.get('endDate'); }
  get periodTime() { return this.gameInputForm.get('periodTime'); }
  get periods() { return this.gameInputForm.get('periods'); }
  get public() { return this.gameInputForm.get('public'); }

  getHomeTeamErrorMessage() {
    return this.homeTeam.hasError('required') ? 'You must enter a home team' :
      this.homeTeam.hasError('forbiddenTeam') ? 'Choose different home team' :
        '';
  }

  getVisitorTeamErrorMessage() {
    return this.visitorTeam.hasError('required') ? 'You must enter a visitor team' :
      this.visitorTeam.hasError('forbiddenTeam') ? 'Choose different visitor team' :
        '';
  }

  getStartDateErrorMessage() {
    return this.startDate.hasError('required') ? 'You must enter a start date and time' :
      '';
  }

  getEndDateErrorMessage() {
    return this.endDate.hasError('required') ? 'You must enter a end date and time' :
      this.endDate.hasError('forbiddenDateTime') ? 'You must enter a valid date and time' :
      '';
  }

  getPeriodTimeErrorMessage() {
    return this.periodTime.hasError('pattern') ? 'You must enter a valid time (mm:ss)' :
      '';
  }

  getPeriodsErrorMessage() {
    return this.periods.hasError('max') ? 'Max value is 99' :
      this.periods.hasError('min') ? 'Min value is 1' :
        '';
  }

  changeValue(stats: AbstractControl) {
    stats.setValue(stats.value);
  }

  onButtonClick() {
    const gameResult = new Game();
    gameResult.id = this.game.id;
    gameResult.startDate = this.startDate.value;
    gameResult.endDate = this.endDate.value;
    if (this.periods.value) {
      gameResult.periods = this.periods.value;
    }
    gameResult.periodTime = this.periodTime.value;
    gameResult.homeTeam = this.homeTeam.value;
    gameResult.visitorTeam = this.visitorTeam.value;
    gameResult.homePoints = this.game.homePoints;
    gameResult.visitorPoints = this.game.visitorPoints;
    gameResult.public = this.public.value;
    this.dialogRef.close(gameResult);
  }

}

@Component({
  selector: 'app-stats-input',
  templateUrl: './stats-input.component.html',
  styleUrls: ['./games-input.component.css']
})
export class StatsInputComponent {
  stats: Stats;
  title: string;
  buttonText: string;
  playerInputForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<StatsInputComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog) {
    this.stats = Object.assign({}, data.player);
    this.stats.id = data.statsId;
    this.stats.playerId = data.player.id;
    this.title = data.title;
    this.buttonText = data.buttonText;
    this.playerInputForm = new FormGroup({
      'fgm' : new FormControl(this.stats.fgm, [Validators.min(0)]),
      'fga' : new FormControl(this.stats.fga, [Validators.min(0)]),
      'ftm' : new FormControl(this.stats.ftm, [Validators.min(0)]),
      'fta' : new FormControl(this.stats.fta, [Validators.min(0)]),
      '3fgm' : new FormControl(this.stats.fgm3, [Validators.min(0)]),
      '3fga' : new FormControl(this.stats.fga3, [Validators.min(0)]),
      'pf' : new FormControl(this.stats.pf, [Validators.min(0)]),
      'reb' : new FormControl(this.stats.reb, [Validators.min(0)]),
      'ast' : new FormControl(this.stats.ast, [Validators.min(0)]),
      'stl' : new FormControl(this.stats.stl, [Validators.min(0)]),
      'blk' : new FormControl(this.stats.blk, [Validators.min(0)]),
      'to' : new FormControl(this.stats.to, [Validators.min(0)])
    });
    this.playerInputForm.get('fga').setValidators(this.forbiddenStatsAValidator('fgm'));
    this.playerInputForm.get('fta').setValidators(this.forbiddenStatsAValidator('ftm'));
    this.playerInputForm.get('3fga').setValidators(this.forbiddenStatsAValidator('3fgm'));
  }

  forbiddenStatsAValidator(field: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const group = control.parent;
      const fieldToCompare = group.get(field);
      const forbidden = Number(control.value) < Number(fieldToCompare.value);
      return forbidden ? {'forbiddenStats': {value: control.value}} : null;
    };
  }

  get fgm() { return this.playerInputForm.get('fgm'); }
  get fga() { return this.playerInputForm.get('fga'); }
  get ftm() { return this.playerInputForm.get('ftm'); }
  get fta() { return this.playerInputForm.get('fta'); }
  get fgm3() { return this.playerInputForm.get('3fgm'); }
  get fga3() { return this.playerInputForm.get('3fga'); }
  get pf() { return this.playerInputForm.get('pf'); }
  get reb() { return this.playerInputForm.get('reb'); }
  get ast() { return this.playerInputForm.get('ast'); }
  get stl() { return this.playerInputForm.get('stl'); }
  get blk() { return this.playerInputForm.get('blk'); }
  get to() { return this.playerInputForm.get('to'); }

  getStatsErrorMessage(stats: AbstractControl) {
    return stats.hasError('forbiddenStats') ? 'Invalid value' :
      stats.hasError('min') ? 'Min value is 0' :
        '';
  }

  changeValue(stats: AbstractControl) {
    stats.setValue(stats.value);
  }

  onButtonClick() {
    const statsResult = new Stats();
    statsResult.id = this.stats.id;
    statsResult.fgm = this.fgm.value;
    statsResult.fga = this.fga.value;
    statsResult.ftm = this.ftm.value;
    statsResult.fta = this.fta.value;
    statsResult.fgm3 = this.fgm3.value;
    statsResult.fga3 = this.fga3.value;
    statsResult.pf = this.pf.value;
    statsResult.reb = this.reb.value;
    statsResult.ast = this.ast.value;
    statsResult.stl = this.stl.value;
    statsResult.blk = this.blk.value;
    statsResult.to = this.to.value;
    statsResult.playerId = this.stats.playerId;
    this.dialogRef.close(statsResult);
  }

}
