import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthModule, OidcSecurityService} from 'angular-auth-oidc-client';

import { AppComponent } from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthService} from './services/auth.service';
import { HomeComponent } from './components/home/home.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCheckboxModule, MatDialogModule, MatListModule, MatMenuModule, MatProgressSpinnerModule, MatTableModule,
  MatToolbarModule
} from '@angular/material';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import {IdentityService} from './services/identity.service';
import { ProfileComponent } from './components/profile/profile.component';
import {AuthInterceptor} from './auth-interceptor';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {TeamsComponent, TeamsDialogComponent} from './components/teams/teams.component';
import {TeamsService} from './services/teams.service';
import { CallbackComponent } from './components/callback/callback.component';

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'teams', component: TeamsComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'unauthorized', component: UnauthorizedComponent},
  {path: 'callback', component: CallbackComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UnauthorizedComponent,
    NavBarComponent,
    ProfileComponent,
    PageNotFoundComponent,
    CallbackComponent,
    TeamsComponent,
    TeamsDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatToolbarModule,
    MatListModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  providers: [
    OidcSecurityService,
    AuthService,
    IdentityService,
    TeamsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents : [TeamsDialogComponent]
})
export class AppModule { }
