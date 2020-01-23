import {EventDate} from './event-date.model';

export class EventStandardLocation extends EventDate {
  public name: string;

  constructor(id: number, location: string, x: number, y: number, name: string) {
    super(id, location, x, y, new Date(), null);
    this.name = name;
  }
}
