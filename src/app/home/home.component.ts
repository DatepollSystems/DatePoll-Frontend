import { Component, OnInit } from '@angular/core';
import {UserService} from '../auth/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  name: string;
  email: string;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.name = this.userService.getCompleteName();
    this.email = this.userService.getEmail();
  }

}
