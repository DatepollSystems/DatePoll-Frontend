import {Component, NgZone, OnInit} from '@angular/core';
import {MyUserService} from '../auth/my-user.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  navBarOpened = false;
  navBarMode = 'over';

  firstname: string;
  surname: string;
  email: string;

  showCinema = true;
  showPoll = false;

  private firstnameSubscription: Subscription;
  private surnameSubscription: Subscription;
  private emailSubscription: Subscription;

  constructor(private ngZone: NgZone, private myUserService: MyUserService) {
    if ((window.screen.width) > 992) {
      this.navBarOpened = true;
      this.navBarMode = 'side';
    }

    window.onresize = () => {
      this.ngZone.run(() => {
        if ((window.screen.width) > 992) {
          this.navBarOpened = true;
          this.navBarMode = 'side';
        } else {
          this.navBarOpened = false;
          this.navBarMode = 'over';
        }
      });
    };

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
