import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
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
export class EventDecisionsListComponent implements OnDestroy {
  @Input() decisions: Decision[];
  @Output() decisionsChanged = new EventEmitter();

  showInCalendar = false;
  color: string;

  private i = -1;

  isMobile = true;
  isMobileSubscription: Subscription;

  decisionUpdating = false;
  decisionToUpdate: Decision;
  decisionString = '';

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

  ngOnDestroy() {
    this.isMobileSubscription.unsubscribe();
  }

  showInCalendarChange(e) {
    this.showInCalendar = e.checked;
  }

  changeColor(color: string) {
    this.color = color;
  }

  clearForm() {
    this.decisionString = '';
    this.color = '#fff';
    this.showInCalendar = false;
  }

  addDecision(form: NgForm) {
    if (this.color == null) {
      this.notificationsService.warn(
        this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('EVENTS_ADMINISTRATION_CREATE_EVENT_FORM_COLOR_REQUIRED')
      );
      return;
    }
    if (this.decisionUpdating) {
      this.updateDecision();
      return;
    }

    const decision = new Decision(this.i, form.controls.decision.value, this.color);
    decision.showInCalendar = this.showInCalendar;
    console.log(decision);
    this.decisions.push(decision);
    this.decisionsChanged.emit(this.decisions.slice());
    console.log(this.decisions);
    this.clearForm();
  }

  removeDecision(decision: Decision) {
    const i = this.decisions.indexOf(decision);
    this.decisions.splice(i, 1);
    this.decisionsChanged.emit(this.decisions.slice());
    console.log(this.decisions);
  }

  changeToUpdateDecision(decision: Decision) {
    console.log(decision);
    this.decisionUpdating = true;
    this.decisionToUpdate = decision;
    this.decisionString = decision.decision;
    this.color = decision.color;
    /**
     * Setting this.showInCalendar = decision.showInClanedar the show in calendar mat toggle is always set to true.
     * This solution works. DO NOT simplify this logic.
     */
    if (decision.showInCalendar) {
      this.showInCalendar = true;
    } else {
      this.showInCalendar = false;
    }
  }

  updateDecision() {
    const i = this.decisions.indexOf(this.decisionToUpdate);
    this.decisions.splice(i, 1);

    const decision = new Decision(this.decisionToUpdate.id, this.decisionString, this.color);
    decision.showInCalendar = this.showInCalendar;
    this.decisions.push(decision);
    this.decisionsChanged.emit(this.decisions.slice());
    console.log(this.decisions);
    this.clearForm();
  }

  cancelUpdateMode() {
    this.decisionUpdating = false;
    this.decisionString = '';
    this.color = null;
    this.showInCalendar = false;
  }
}
