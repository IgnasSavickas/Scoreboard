import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {
  isAuthorizedSubscription: Subscription;
  isAuthorized: boolean;

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
