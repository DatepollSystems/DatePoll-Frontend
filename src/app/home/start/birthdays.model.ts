import {CalendarEvent} from 'angular-calendar';
import {EventAction} from 'calendar-utils';
import {UIHelper} from '../../utils/helper/UIHelper';

export class HomeBirthdayModel implements CalendarEvent {
  public readonly name: string;
  public readonly date: Date;
  public readonly age: number;

  // Calendar specific values
  start: Date;
  title: string;
  public actions: EventAction[];
  allDay = true;
  color = {
    primary: '#d2e812',
    secondary: '#D1E8FF',
  };
  draggable: false;
  end: Date;
  meta = null;
  resizable: {beforeStart: false; afterEnd: false};

  constructor(name: string, date: Date, usersBirthday: string) {
    this.name = name;
    this.date = date;

    this.age = UIHelper.getCurrentDate().getFullYear() - this.date.getFullYear();

    this.title = this.name + usersBirthday;
    this.start = this.date;
    this.end = this.date;
  }
}
