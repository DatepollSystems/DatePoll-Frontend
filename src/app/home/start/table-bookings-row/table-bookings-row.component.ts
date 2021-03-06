import {Component, Input} from '@angular/core';

import {CinemaUserService} from '../../cinema/cinema-user.service';
import {MyUserService} from '../../my-user.service';
import {HomepageService} from '../homepage.service';

import {HomeBookingsModel} from '../bookings.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-table-bookings-row]',
  templateUrl: './table-bookings-row.component.html',
  styleUrls: ['./table-bookings-row.component.css', './../start.component.css'],
})
export class TableBookingsRowComponent {
  @Input()
  booking: HomeBookingsModel;

  sendingApplyForWorkerRequest = false;
  sendingSignOutForWorkerRequest = false;
  sendingApplyForEmergencyWorkerRequest = false;
  sendingSignOutForEmergencyWorkerRequest = false;

  public myUserService: MyUserService;

  constructor(private cinemaService: CinemaUserService, private homePageService: HomepageService, myUserService: MyUserService) {
    this.myUserService = myUserService;
  }

  applyForWorker() {
    this.sendingApplyForWorkerRequest = true;
    this.cinemaService.applyForWorker(this.booking.movieID).subscribe(
      (response: any) => {
        console.log(response);
        this.booking.workerName = this.myUserService.getFirstname() + ' ' + this.myUserService.getSurname();
        this.booking.workerID = this.myUserService.getID();
        this.sendingApplyForWorkerRequest = false;
      },
      (error) => {
        console.log(error);
        this.homePageService.fetchData(true);
      }
    );
  }

  signOutForWorker() {
    this.sendingSignOutForWorkerRequest = true;
    this.cinemaService.signOutForWorker(this.booking.movieID).subscribe(
      (response: any) => {
        console.log(response);
        this.booking.workerName = null;
        this.booking.workerID = -1;
        this.sendingSignOutForWorkerRequest = false;
      },
      (error) => {
        console.log(error);
        this.homePageService.fetchData(true);
      }
    );
  }

  applyForEmergencyWorker() {
    this.sendingApplyForEmergencyWorkerRequest = true;
    this.cinemaService.applyForEmergencyWorker(this.booking.movieID).subscribe(
      (response: any) => {
        console.log(response);
        this.booking.emergencyWorkerName = this.myUserService.getFirstname() + ' ' + this.myUserService.getSurname();
        this.booking.emergencyWorkerID = this.myUserService.getID();
        this.sendingApplyForEmergencyWorkerRequest = false;
      },
      (error) => {
        console.log(error);
        this.homePageService.fetchData(true);
      }
    );
  }

  signOutForEmergencyWorker() {
    this.sendingSignOutForEmergencyWorkerRequest = true;
    this.cinemaService.signOutForEmergencyWorker(this.booking.movieID).subscribe(
      (response: any) => {
        console.log(response);
        this.booking.emergencyWorkerName = null;
        this.booking.emergencyWorkerID = -1;
        this.sendingSignOutForEmergencyWorkerRequest = false;
      },
      (error) => {
        console.log(error);
        this.homePageService.fetchData(true);
      }
    );
  }
}
