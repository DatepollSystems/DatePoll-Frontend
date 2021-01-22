import {Component, Input, OnInit} from '@angular/core';
import {EventDate} from '../../models/event-date.model';
import {UIHelper} from '../../../../utils/helper/UIHelper';

@Component({
  selector: 'app-event-dates-user-list',
  templateUrl: './event-dates-user-list.component.html',
  styleUrls: ['./event-dates-user-list.component.css'],
})
export class EventDatesUserListComponent implements OnInit {
  @Input()
  public dates: EventDate[] = [];

  isOnOneDay = true;

  constructor() {}

  ngOnInit() {
    const date = this.dates[0].date.getDate().toString();
    for (const dates of this.dates) {
      if (dates.date.getDate().toString() !== date) {
        this.isOnOneDay = false;
        break;
      }
    }
  }

  isUrl(url: string) {
    return UIHelper.isStringUrl(url);
  }
}
