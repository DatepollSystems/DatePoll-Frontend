import {Component, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import {NavigationEnd, Router} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import {TranslateService} from './translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    });

    firebase.initializeApp({
      apiKey: "AIzaSyD0ft0dGHWO2oJkFDSfbCyc6KqofnwVbh0",
      authDomain: "udemy-test-4965a.firebaseapp.com"
    });
  }

}
