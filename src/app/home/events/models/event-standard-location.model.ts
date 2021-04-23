import {EventDate} from './event-date.model';
import {UIHelper} from '../../../utils/helper/UIHelper';

export class EventStandardLocation extends EventDate {
  public name: string;

  constructor(id: number, location: string, x: number, y: number, name: string) {
    super(id, location, x, y, UIHelper.getCurrentDate(), null);
    this.name = name;
  }
}
