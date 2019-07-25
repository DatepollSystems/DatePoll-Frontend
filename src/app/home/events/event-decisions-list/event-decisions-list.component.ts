import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Decision} from '../models/decision.model';

@Component({
  selector: 'app-event-decisions-list',
  templateUrl: './event-decisions-list.component.html',
  styleUrls: ['./event-decisions-list.component.css']
})
export class EventDecisionsListComponent {
  @Input() decisions: Decision[];
  @Output() decisionsChanged = new EventEmitter();

  showInCalendar = false;

  constructor() {
  }

  showInCalendarChange(e) {
    this.showInCalendar = e.checked;
  }

  addDecision(form: NgForm) {
    const decision = new Decision(Math.random(), form.controls.decision.value);
    decision.showInCalendar = this.showInCalendar;
    this.decisions.push(decision);
    form.reset();
    this.showInCalendar = false;
    this.decisionsChanged.emit(this.decisions.slice());
  }

  removeDecision(decision: Decision) {
    const localDecisions = [];
    for (let i = 0; i < this.decisions.length; i++) {
      if (!(this.decisions[i].id === decision.id)) {
        localDecisions.push(this.decisions[i]);
      }
    }

    this.decisions = localDecisions;
    this.decisionsChanged.emit(this.decisions.slice());
  }
}
