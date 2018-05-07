import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Team} from '../models/team';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Player} from '../models/player';

@Injectable()
export class PlayersService {
  private readonly backendUrl = 'http://localhost:5001';
  private readonly webApiUrl = `${this.backendUrl}/api`;
  private readonly playersApiUrl = `${this.webApiUrl}/players`;

  constructor(private http: HttpClient) { }

  addPlayer(player: Player): Observable<number> {
    const body = JSON.stringify(player);
    return this.http.post<number>(this.playersApiUrl, body, {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  deletePlayer(id: number): Observable<string> {
    return this.http.delete(`${this.playersApiUrl}/${id}`, {responseType: 'text'});
  }

  updatePlayer(id: number, player: Player): Observable<string> {
    const body = JSON.stringify(player);
    return this.http.put(`${this.playersApiUrl}/${id}`, body, {headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'});
  }

  getTeamPlayers(teamId: number): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.playersApiUrl}/team/${teamId}`);
  }

}
