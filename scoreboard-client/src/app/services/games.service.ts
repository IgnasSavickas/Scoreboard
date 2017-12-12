import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Team} from '../models/team';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Game} from '../models/game';

@Injectable()
export class GamesService {
  private readonly backendUrl = 'http://localhost:5001';
  private readonly webApiUrl = `${this.backendUrl}/api`;
  private readonly gamesApiUrl = `${this.webApiUrl}/games`;

  constructor(private http: HttpClient) { }

  addGame(game: Game): Observable<number> {
    const body = JSON.stringify(game);
    return this.http.post<number>(this.gamesApiUrl, body, {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

}
