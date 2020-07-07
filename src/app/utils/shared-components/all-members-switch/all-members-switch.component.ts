import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-all-groups-switch',
  templateUrl: './all-members-switch.component.html',
  styleUrls: ['./all-members-switch.component.css']
})
export class AllMembersSwitchComponent {
  @Input()
  disabled = false;
  @Input()
  checked = false;
  @Output()
  toggleChange = new EventEmitter<boolean>();

  constructor() {}

  change($event) {
    this.toggleChange.emit($event.checked);
  }
}
