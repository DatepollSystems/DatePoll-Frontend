import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

import {TranslateService} from '../../../../translation/translate.service';
import {IsMobileService} from '../../../../utils/is-mobile.service';

import {EventDecision} from '../../models/event-decision.model';

@Component({
  selector: 'app-event-decisions-list',
  templateUrl: './event-decisions-list.component.html',
  styleUrls: ['./event-decisions-list.component.css'],
})
export class EventDecisionsListComponent implements OnDestroy {
  @Input() decisions: EventDecision[];
  @Output() decisionsChanged = new EventEmitter();

  showInCalendar = false;
  color: string;

  private i = -1;

  isMobile = true;
  isMobileSubscription: Subscription;

  decisionUpdating = false;
  decisionToUpdate: EventDecision;
  decisionString = '';

  constructor(private snackBar: MatSnackBar, private translate: TranslateService, private isMobileService: IsMobileService) {
    this.isMobile = this.isMobileService.getIsMobile();
    this.isMobileSubscription = this.isMobileService.isMobileChange.subscribe((value) => {
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
      this.snackBar.open(this.translate.getTranslationFor('EVENTS_ADMINISTRATION_CREATE_EVENT_FORM_COLOR_REQUIRED'));
      return;
    }
    if (this.decisionUpdating) {
      this.updateDecision();
      return;
    }

    const decision = new EventDecision(this.i, form.controls.decision.value, this.color, this.showInCalendar);
    console.log(decision);
    this.decisions.push(decision);
    this.decisionsChanged.emit(this.decisions.slice());
    console.log(this.decisions);
    this.clearForm();
  }

  removeDecision(decision: EventDecision) {
    const i = this.decisions.indexOf(decision);
    this.decisions.splice(i, 1);
    this.decisionsChanged.emit(this.decisions.slice());
    console.log(this.decisions);
  }

  changeToUpdateDecision(decision: EventDecision) {
    console.log(decision);
    this.decisionUpdating = true;
    this.decisionToUpdate = decision;
    this.decisionString = decision.decision;
    this.color = decision.color;
    /**
     * Setting this.showInCalendar = decision.showInClanedar sets the mat toggle is always to true.
     * This solution works. DO NOT simplify this logic.
     */
    // noinspection RedundantIfStatementJS
    if (decision.showInCalendar) {
      this.showInCalendar = true;
    } else {
      this.showInCalendar = false;
    }
  }

  updateDecision() {
    const i = this.decisions.indexOf(this.decisionToUpdate);
    this.decisions.splice(i, 1);

    this.decisions.push(new EventDecision(this.decisionToUpdate.id, this.decisionString, this.color, this.showInCalendar));
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
