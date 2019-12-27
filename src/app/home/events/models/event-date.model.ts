import {Event} from './event.model';

export class EventDate {
  public id: number;
  public location: string;
  public x: number;
  public y: number;
  public date: Date;
  public description: string;
  public event: Event;

  constructor(id: number, location: string, x: number, y: number, date: Date, description: string) {
    this.id = id;
    this.location = location;
    this.x = x;
    this.y = y;
    this.date = date;
    this.description = description;
  }
}
