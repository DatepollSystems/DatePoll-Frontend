import { Component, OnInit } from '@angular/core';
import {MyUserService} from '../auth/my-user.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  firstname: string;
  surname: string;
  email: string;

  showCinema = true;
  showPoll = true;

  private firstnameSubscription: Subscription;
  private surnameSubscription: Subscription;
  private emailSubscription: Subscription;

  constructor(private myUserService: MyUserService) {
    this.firstname = this.myUserService.getFirstname();
    this.surname = this.myUserService.getSurname();
    this.email = this.myUserService.getEmail();

    this.firstnameSubscription = myUserService.firstnameChange.subscribe((value) => {
      this.firstname = value;
    });

    this.surnameSubscription = myUserService.surnameChange.subscribe((value) => {
      this.surname = value;
    });


    this.emailSubscription = myUserService.emailChange.subscribe((value) => {
      this.email = value;
    });
  }

  ngOnInit() {
  }

}
