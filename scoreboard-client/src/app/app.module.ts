import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {AuthModule, OidcSecurityService} from 'angular-auth-oidc-client';

import { AppComponent } from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthService} from './services/auth.service';
import { HomeComponent } from './components/home/home.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatMenuModule} from '@angular/material';

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent },
  {path: 'unauthorized', component: UnauthorizedComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UnauthorizedComponent
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
  ],
  providers: [
    OidcSecurityService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
