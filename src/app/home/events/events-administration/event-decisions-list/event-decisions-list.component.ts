import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';

import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {Decision} from '../../models/decision.model';

@Component({
  selector: 'app-event-decisions-list',
  templateUrl: './event-decisions-list.component.html',
  styleUrls: ['./event-decisions-list.component.css']
})
export class EventDecisionsListComponent implements OnInit {
  @Input() decisions: Decision[];
  @Output() decisionsChanged = new EventEmitter();

  showInCalendar = false;
  color: string;

  private i: number;

  constructor(private notificationsService: NotificationsService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.i = Math.random();
  }

  showInCalendarChange(e) {
    this.showInCalendar = e.checked;
  }

  changeColor(color: string) {
    this.color = color;
  }

  addDecision(form: NgForm) {
    if (this.color == null) {
      this.notificationsService.warn(
        this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('EVENTS_ADMINISTRATION_CREATE_EVENT_FORM_COLOR_REQUIRED')
      );
      return;
    }
    const decision = new Decision(this.i, form.controls.decision.value, this.color);
    decision.showInCalendar = this.showInCalendar;
    console.log(decision);
    this.decisions.push(decision);
    form.reset();
    this.showInCalendar = false;
    console.log(this.i);
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
