import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {MatSlideToggleChange} from '@angular/material/slide-toggle';

import {environment} from '../../../../environments/environment';
import {HttpService} from '../../../utils/http.service';
import {SettingsService} from '../../../utils/settings.service';
import {UserSettingsService} from '../privacy-settings/userSettings.service';

@Component({
  selector: 'app-calendar-token',
  templateUrl: './calendar-token.component.html',
  styleUrls: ['./calendar-token.component.css'],
})
export class CalendarTokenComponent implements OnDestroy {
  apiUrl = environment.apiUrl;

  calendarToken: string = null;

  showMovies = false;
  showMoviesSubscription: Subscription;
  showEvents = false;
  showEventsSubscription: Subscription;
  showBirthdays = false;
  showBirthdaysSubscription: Subscription;

  public serverInfo = null;
  private serverInfoSubscription: Subscription;

  constructor(
    private httpService: HttpService,
    private settingsService: SettingsService,
    private userSettingsService: UserSettingsService
  ) {
    this.fetchCalendarToken();
    const i = this.apiUrl.indexOf('/api');
    this.apiUrl = this.apiUrl.slice(0, i) + '/calendar';

    this.serverInfo = this.settingsService.getServerInfo();
    this.serverInfoSubscription = this.settingsService.serverInfoChange.subscribe((value) => {
      this.serverInfo = value;
    });

    this.showMovies = this.userSettingsService.getShowMoviesInCalendar();
    this.showMoviesSubscription = this.userSettingsService.showMoviesInCalendarChange.subscribe((value) => {
      this.showMovies = value;
    });

    this.showEvents = this.userSettingsService.getShowEventsInCalendar();
    this.showEventsSubscription = this.userSettingsService.showEventsInCalendarChange.subscribe((value) => {
      this.showEvents = value;
    });

    this.showBirthdays = this.userSettingsService.getShowBirthdaysInCalendar();
    this.showBirthdaysSubscription = this.userSettingsService.showBirthdaysInCalendarChange.subscribe((value) => {
      this.showBirthdays = value;
    });
  }

  ngOnDestroy(): void {
    this.serverInfoSubscription.unsubscribe();
    this.showMoviesSubscription.unsubscribe();
    this.showEventsSubscription.unsubscribe();
    this.showBirthdaysSubscription.unsubscribe();
  }

  public resetCalendarToken() {
    this.calendarToken = null;
    this.httpService.loggedInV1DELETERequest('/user/myself/token/calendar', 'resetCalendarToken').subscribe(
      (data: any) => {
        console.log(data);
        this.fetchCalendarToken();
      },
      (error) => console.log(error)
    );
  }

  public copyTokenToClipboard(val) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  private fetchCalendarToken() {
    this.httpService.loggedInV1GETRequest('/user/myself/token/calendar', 'fetchCalendarToken').subscribe(
      (data: any) => {
        console.log(data);
        this.calendarToken = this.apiUrl + '/' + data.token;
      },
      (error) => console.log(error)
    );
  }

  onShowMoviesChange(ob: MatSlideToggleChange) {
    this.userSettingsService.setShowMoviesInCalendar(ob.checked, true);
  }

  onShowEventsChange(ob: MatSlideToggleChange) {
    this.userSettingsService.setShowEventsInCalendar(ob.checked, true);
  }

  onShowBirthdaysChange(ob: MatSlideToggleChange) {
    this.userSettingsService.setShowBirthdaysInCalendar(ob.checked, true);
  }
}
