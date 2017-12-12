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
  MatButtonModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule, MatSelectModule,
  MatTableModule,
  MatToolbarModule, MatTooltipModule
} from '@angular/material';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import {IdentityService} from './services/identity.service';
import {AuthInterceptor} from './auth-interceptor';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {TeamsComponent, TeamsDialogComponent} from './components/teams/teams.component';
import {TeamsService} from './services/teams.service';
import { CallbackComponent } from './components/callback/callback.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { TeamsInputComponent } from './components/teams/teams-input/teams-input.component';
import {FormsModule} from '@angular/forms';
import { PlayersInputComponent } from './components/teams/players-input/players-input.component';
import {PlayersService} from './services/players.service';
import { GamesComponent } from './components/games/games.component';
import {GamesService} from './services/games.service';
import { GamesInputComponent } from './components/games/games-input/games-input.component';

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'teams', component: TeamsComponent},
  {path: 'games', component: GamesComponent},
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
    PageNotFoundComponent,
    CallbackComponent,
    TeamsComponent,
    TeamsDialogComponent,
    FooterComponent,
    HeaderComponent,
    TeamsInputComponent,
    PlayersInputComponent,
    GamesComponent,
    GamesInputComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatToolbarModule,
    MatListModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule
  ],
  providers: [
    OidcSecurityService,
    AuthService,
    IdentityService,
    TeamsService,
    PlayersService,
    GamesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents : [
    TeamsDialogComponent,
    TeamsInputComponent,
    PlayersInputComponent,
    GamesInputComponent
  ]
})
export class AppModule { }
