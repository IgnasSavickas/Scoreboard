import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Team} from '../models/team';

@Injectable()
export class TeamsService {
  private readonly backendUrl = 'http://localhost:5001';
  private readonly webApiUrl = `${this.backendUrl}/api`;
  private readonly teamsApiUrl = `${this.webApiUrl}/teams`;

  constructor(private http: HttpClient) { }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.teamsApiUrl);
  }

  getTeam(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.teamsApiUrl}/${id}`);
  }

}
