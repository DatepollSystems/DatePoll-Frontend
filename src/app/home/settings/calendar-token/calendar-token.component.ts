import {Component} from '@angular/core';

import {environment} from '../../../../environments/environment';
import {HttpService} from '../../../utils/http.service';

@Component({
  selector: 'app-calendar-token',
  templateUrl: './calendar-token.component.html',
  styleUrls: ['./calendar-token.component.css']
})
export class CalendarTokenComponent {
  apiUrl = environment.apiUrl;

  calendarToken: string = null;

  constructor(private httpService: HttpService) {
    this.fetchCalendarToken();
    const i = this.apiUrl.indexOf('/api');
    this.apiUrl = this.apiUrl.slice(0, i) + '/calendar';
  }

  public resetCalendarToken() {
    this.calendarToken = null;
    this.httpService.loggedInV1DELETERequest('/user/myself/token/calendar', 'resetCalendarToken').subscribe(
      (data: any) => {
        console.log(data);
        this.fetchCalendarToken();
      },
      error => console.log(error)
    );
  }

  public copyTokenToClipboard(val) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val + '.ics';
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
      error => console.log(error)
    );
  }
}
