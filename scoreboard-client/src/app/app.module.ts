import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthModule, OidcSecurityService} from 'angular-auth-oidc-client';

import { AppComponent } from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthService} from './services/auth.service';
import { HomeComponent } from './components/home/home.component';
import { UnauthorizedComponent } from './components/auth/unauthorized/unauthorized.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule, MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTableModule, MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { NavBarComponent } from './components/body/nav-bar/nav-bar.component';
import {IdentityService} from './services/identity.service';
import {AuthInterceptor} from './auth-interceptor';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {TeamsComponent} from './components/teams/teams.component';
import {TeamsService} from './services/teams.service';
import { CallbackComponent } from './components/auth/callback/callback.component';
import { FooterComponent } from './components/body/footer/footer.component';
import { HeaderComponent } from './components/body/header/header.component';
import { TeamsInputComponent } from './components/teams/teams-input/teams-input.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PlayersInputComponent } from './components/teams/players-input/players-input.component';
import {PlayersService} from './services/players.service';
import { GamesComponent } from './components/games/games.component';
import {GamesService} from './services/games.service';
import {GamesInputComponent, StatsInputComponent} from './components/games/games-input/games-input.component';
import {FileUploadService} from './services/file-upload.service';
import { GamesDetailComponent } from './components/games/games-detail/games-detail.component';
import { TeamsDetailComponent } from './components/teams/teams-detail/teams-detail.component';

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'teams', component: TeamsComponent},
  {path: 'teams/:id', component: TeamsDetailComponent},
  {path: 'games', component: GamesComponent},
  {path: 'games/:id', component: GamesDetailComponent},
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
    FooterComponent,
    HeaderComponent,
    TeamsInputComponent,
    PlayersInputComponent,
    GamesComponent,
    GamesInputComponent,
    GamesDetailComponent,
    StatsInputComponent,
    TeamsDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatPaginatorModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCardModule,
    MatTabsModule
  ],
  providers: [
    OidcSecurityService,
    AuthService,
    IdentityService,
    TeamsService,
    PlayersService,
    GamesService,
    FileUploadService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents : [
    TeamsInputComponent,
    PlayersInputComponent,
    GamesInputComponent,
    StatsInputComponent
  ]
})
export class AppModule { }
