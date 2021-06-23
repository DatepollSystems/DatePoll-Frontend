import {Component, EventEmitter, Input, Output} from '@angular/core';

import {UIHelper} from '../../helper/UIHelper';
import {Converter} from '../../helper/Converter';

@Component({
  selector: 'app-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.css'],
})
export class TimeInputComponent {
  @Input()
  time: string;

  wrongTime = false;

  @Output()
  timeChange = new EventEmitter<string>();

  constructor() {}

  reset() {
    this.time = '';
    this.wrongTime = false;
  }

  onTimeChange(event) {
    if (event?.length > 1 && event?.length < 3) {
      this.time = event + ':';
    }
    if (!UIHelper.isNumeric(event?.slice(0, 2))) {
      this.wrongTime = true;
      this.timeChange.emit(null);
      return;
    }
    if (event?.length > 2 && event?.charAt(2) !== ':') {
      this.wrongTime = true;
      this.timeChange.emit(null);
      return;
    }
    if (event?.length > 3 && !UIHelper.isNumeric(event?.slice(3, 5))) {
      this.wrongTime = true;
      this.timeChange.emit(null);
      return;
    }
    if (event?.length < 5 || event?.length > 5) {
      this.wrongTime = true;
      this.timeChange.emit(null);
      return;
    }
    const hours = Converter.stringToNumber(event.split(':')[0]);
    const minutes = Converter.stringToNumber(event.split(':')[1]);
    if (hours > 24 || hours < 0 || minutes > 59 || minutes < 0) {
      this.wrongTime = true;
      this.timeChange.emit(null);
      return;
    }
    if (hours === 24 && minutes !== 0) {
      this.wrongTime = true;
      this.timeChange.emit(null);
      return;
    }

    this.wrongTime = false;
    this.time = event;
    console.log('correct time: ' + this.time);
    this.timeChange.emit(this.time);
  }
}
