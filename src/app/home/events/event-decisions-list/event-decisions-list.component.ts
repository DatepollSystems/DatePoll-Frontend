import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-event-decisions-list',
  templateUrl: './event-decisions-list.component.html',
  styleUrls: ['./event-decisions-list.component.css']
})
export class EventDecisionsListComponent {
  @Input() decisions: string[];
  @Output() decisionsChanged = new EventEmitter();

  constructor() {
  }

  addDecision(form: NgForm) {
    this.decisions.push(form.controls.decision.value);
    form.reset();
    this.decisionsChanged.emit(this.decisions.slice());
  }

  removeDecision(decision: string) {
    const localDecisions = [];
    for (let i = 0; i < this.decisions.length; i++) {
      if (!(this.decisions[i] === decision)) {
        localDecisions.push(this.decisions[i]);
      }
    }

    this.decisions = localDecisions;
    this.decisionsChanged.emit(this.decisions.slice());
  }
}
