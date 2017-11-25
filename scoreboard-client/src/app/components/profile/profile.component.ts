import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {IdentityService} from '../../services/identity.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  json: string;

  constructor(private authService: AuthService, private identityService: IdentityService) { }

  ngOnInit() {
    this.identityService.getIdentity().subscribe(json => {
      this.json = JSON.stringify(json, null, 2);
      console.log(json);
    },
    error => {
      console.log(error);
      this.authService.handleError(error);
    });
  }

}
