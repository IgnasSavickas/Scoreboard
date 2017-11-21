import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {OidcSecurityService, OpenIDImplicitFlowConfiguration} from 'angular-auth-oidc-client';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthService implements OnInit, OnDestroy {
  private isAuthorizedSubscription: Subscription;
  private isAuthorized: boolean;

  constructor(public oidcSecurityService: OidcSecurityService) {
    const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
    openIDImplicitFlowConfiguration.stsServer = 'http://localhost:5000';
    openIDImplicitFlowConfiguration.redirect_url = 'http://localhost:4200/callback';
    openIDImplicitFlowConfiguration.client_id = 'ng';
    openIDImplicitFlowConfiguration.response_type = 'id_token token';
    openIDImplicitFlowConfiguration.scope = 'openid profile scoreboardapi';
    openIDImplicitFlowConfiguration.post_logout_redirect_uri = 'https://localhost:4200/home';
    openIDImplicitFlowConfiguration.start_checksession = true;
    openIDImplicitFlowConfiguration.silent_renew = true;
    openIDImplicitFlowConfiguration.silent_renew_offset_in_seconds = 0;
    openIDImplicitFlowConfiguration.forbidden_route = '/Forbidden';
    openIDImplicitFlowConfiguration.unauthorized_route = '/Unauthorized';
    openIDImplicitFlowConfiguration.auto_userinfo = true;
    openIDImplicitFlowConfiguration.log_console_warning_active = true;
    openIDImplicitFlowConfiguration.log_console_debug_active = false;
    openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 10;

    this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration);

    if (this.oidcSecurityService.moduleSetup) {
      this.doCallbackLogicIfRequired();
    } else {
      this.oidcSecurityService.onModuleSetup.subscribe(() => {
        this.doCallbackLogicIfRequired();
      });
    }
  }

  ngOnInit() {
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
      (isAuthorized: boolean) => {
        this.isAuthorized = isAuthorized;
      });
  }

  ngOnDestroy(): void {
    this.isAuthorizedSubscription.unsubscribe();
    this.oidcSecurityService.onModuleSetup.unsubscribe();
  }

  getIsAuthorized(): Observable<boolean> {
    return this.oidcSecurityService.getIsAuthorized();
  }

  login() {
    console.log('start login');
    this.oidcSecurityService.authorize();
  }

  refreshSession() {
    console.log('start refreshSession');
    this.oidcSecurityService.authorize();
  }

  logout() {
    console.log('start logoff');
    this.oidcSecurityService.logoff();
  }

  private doCallbackLogicIfRequired() {
    if (typeof location !== 'undefined' && window.location.hash) {
      this.oidcSecurityService.authorizedCallback();
    }
  }
}
