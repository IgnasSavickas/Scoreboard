import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
