import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Game} from '../models/game';

@Injectable()
export class GamesService {
  private readonly backendUrl = 'http://localhost:5001';
  private readonly webApiUrl = `${this.backendUrl}/api`;
  private readonly gamesApiUrl = `${this.webApiUrl}/games`;

  constructor(private http: HttpClient) { }

  getGames(offset?: number, limit?: number): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.gamesApiUrl}?offset=${offset}&limit=${limit}`);
  }

  getGame(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.gamesApiUrl}/${id}`);
  }

  getGamesSize(): Observable<number> {
    return this.http.get<number>(`${this.gamesApiUrl}/size`);
  }

  addGame(game: Game): Observable<number> {
    const body = JSON.stringify(game);
    return this.http.post<number>(this.gamesApiUrl, body, {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  deleteGame(id: number): Observable<string> {
    return this.http.delete(`${this.gamesApiUrl}/${id}`, {responseType: 'text'});
  }

  updateGame(id: number, game: Game): Observable<string> {
    const body = JSON.stringify(game);
    return this.http.put(`${this.gamesApiUrl}/${id}`, body, {headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'});
  }

}
