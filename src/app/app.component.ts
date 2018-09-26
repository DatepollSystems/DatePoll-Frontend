import {Component, OnInit} from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'DatePoll-Frontend';

  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyD0ft0dGHWO2oJkFDSfbCyc6KqofnwVbh0",
      authDomain: "udemy-test-4965a.firebaseapp.com"
    });
  }

}
