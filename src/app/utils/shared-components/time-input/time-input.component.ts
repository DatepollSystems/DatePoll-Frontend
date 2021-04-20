import {Component, EventEmitter, Input, Output} from '@angular/core';

import {UIHelper} from '../../helper/UIHelper';

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
      return;
    }
    if (event?.length > 2 && event?.charAt(2) !== ':') {
      this.wrongTime = true;
      return;
    }
    if (event?.length > 3 && !UIHelper.isNumeric(event?.slice(3, 5))) {
      this.wrongTime = true;
      return;
    }
    if (event?.length < 5 || event?.length > 5) {
      this.wrongTime = true;
      return;
    }

    this.wrongTime = false;
    this.time = event;
    console.log('wrong time: ' + this.wrongTime + ' time: ' + this.time);
    this.timeChange.emit(this.time);
  }
}
