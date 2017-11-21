import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private isAuthorizedSubscription: Subscription;
  private isAuthorized: boolean;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.isAuthorizedSubscription = this.authService.getIsAuthorized().subscribe(
      (isAuthorized: boolean) => {
        this.isAuthorized = isAuthorized;
      });
  }

  ngOnDestroy(): void {
    this.isAuthorizedSubscription.unsubscribe();
  }

  login() {
    this.authService.login();
  }

  refreshSession() {
    this.authService.refreshSession();
  }

  logout() {
    this.authService.logout();
  }

}
