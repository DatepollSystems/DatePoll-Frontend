import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {IsMobileService} from '../../../../utils/is-mobile.service';

import {Decision} from '../../models/decision.model';

@Component({
  selector: 'app-event-decisions-list',
  templateUrl: './event-decisions-list.component.html',
  styleUrls: ['./event-decisions-list.component.css']
})
export class EventDecisionsListComponent implements OnInit, OnDestroy {
  @Input() decisions: Decision[];
  @Output() decisionsChanged = new EventEmitter();

  showInCalendar = false;
  color: string;

  private i: number;

  isMobile = true;
  isMobileSubscription: Subscription;

  constructor(
    private notificationsService: NotificationsService,
    private translate: TranslateService,
    private isMobileService: IsMobileService
  ) {
    this.isMobile = this.isMobileService.getIsMobile();
    this.isMobileSubscription = this.isMobileService.isMobileChange.subscribe(value => {
      this.isMobile = value;
    });
  }

  ngOnInit(): void {
    this.i = -1;
  }

  ngOnDestroy() {
    this.isMobileSubscription.unsubscribe();
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
    this.i--;
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
