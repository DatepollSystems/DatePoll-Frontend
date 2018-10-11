import { Component, OnInit } from '@angular/core';
import {UserService} from '../../auth/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  name: string;
  location: string;
  joindate: string;
  birthday: string;

  constructor(private userService: UserService) {
    this.name = this.userService.getCompleteName();
    this.location = this.userService.getCompleteLocation();
    this.joindate = this.userService.getJoindate();
    this.birthday = this.userService.getBirthdate();
  }

  ngOnInit() { }

}
