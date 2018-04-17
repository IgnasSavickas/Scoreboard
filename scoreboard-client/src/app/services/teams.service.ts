import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Team} from '../models/team';

@Injectable()
export class TeamsService {
  private readonly backendUrl = 'http://localhost:5001';
  private readonly webApiUrl = `${this.backendUrl}/api`;
  private readonly teamsApiUrl = `${this.webApiUrl}/teams`;

  constructor(private http: HttpClient) { }

  getTeams(offset?: number, limit?: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.teamsApiUrl}?offset=${offset}&limit=${limit}`);
  }

  getTeam(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.teamsApiUrl}/${id}`);
  }

  getTeamsSize(): Observable<number> {
    return this.http.get<number>(`${this.teamsApiUrl}/size`);
  }

  addTeam(team: Team): Observable<number> {
    const body = JSON.stringify(team);
    return this.http.post<number>(this.teamsApiUrl, body, {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  deleteTeam(id: number): Observable<string> {
    return this.http.delete(`${this.teamsApiUrl}/${id}`, {responseType: 'text'});
  }

  updateTeam(id: number, team: Team): Observable<string> {
    const body = JSON.stringify(team);
    return this.http.put(`${this.teamsApiUrl}/${id}`, body, {headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'});
  }

}
