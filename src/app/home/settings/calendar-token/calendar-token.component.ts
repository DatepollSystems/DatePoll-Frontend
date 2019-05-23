import {Component} from '@angular/core';
import {ClipboardService} from 'ngx-clipboard';

import {HttpService} from '../../../services/http.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-calendar-token',
  templateUrl: './calendar-token.component.html',
  styleUrls: ['./calendar-token.component.css']
})
export class CalendarTokenComponent {

  apiUrl = environment.apiUrl;

  calendarToken: string = null;

  constructor(private httpService: HttpService, private clipboardService: ClipboardService) {
    this.fetchCalendarToken();
  }

  private fetchCalendarToken() {
    this.httpService.loggedInV1GETRequest('/user/myself/token/calendar', 'fetchCalendarToken').subscribe(
      (data: any) => {
        console.log(data);
        this.calendarToken = this.apiUrl + '/user/calendar/' + data.token;
      },
      (error) => console.log(error)
    );
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

  public copyTokenToClipboard() {
    this.clipboardService.copyFromContent(this.calendarToken);
  }
}
