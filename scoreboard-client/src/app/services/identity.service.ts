import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class IdentityService {
  private readonly backendUrl = 'http://localhost:5001';
  private readonly webApiUrl = `${this.backendUrl}/api`;
  private readonly identityApiUrl = `${this.webApiUrl}/identity`;

  constructor(private http: HttpClient) { }

  getIdentity(): Observable<string> {
    return this.http.get<string>(this.identityApiUrl);
  }

}
