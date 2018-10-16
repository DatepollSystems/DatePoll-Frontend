import { Component, OnInit } from '@angular/core';
import {UserService} from '../auth/user.service';
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

  private firstnameSubscription: Subscription;
  private surnameSubscription: Subscription;
  private emailSubscription: Subscription;

  constructor(private userService: UserService) {
    this.firstname = this.userService.getFirstname();
    this.surname = this.userService.getSurname();
    this.email = this.userService.getEmail();

    this.firstnameSubscription = userService.firstnameChange.subscribe((value) => {
      this.firstname = value;
    });

    this.surnameSubscription = userService.surnameChange.subscribe((value) => {
      this.surname = value;
    });


    this.emailSubscription = userService.emailChange.subscribe((value) => {
      this.email = value;
    });
  }

  ngOnInit() {
  }

}
