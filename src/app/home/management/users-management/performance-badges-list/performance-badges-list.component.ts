import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PerformanceBadge} from '../../performance-badges-management/performanceBadge.model';
import {Instrument} from '../../performance-badges-management/instrument.model';
import {NgForm} from '@angular/forms';
import {UserPerformanceBadge} from '../userPerformanceBadge.model';

@Component({
  selector: 'app-performance-badges-list',
  templateUrl: './performance-badges-list.component.html',
  styleUrls: ['./performance-badges-list.component.css']
})
export class PerformanceBadgesListComponent {

  @Input() userPerformanceBadges: UserPerformanceBadge[] = [];

  userPerformanceBadgeCount = 0;
  selectedPerformanceBadge: PerformanceBadge;
  selectedInstrument: Instrument;
  performanceBadgeDate: Date = null;

  @Output() performanceBadgesChanged = new EventEmitter();

  constructor() { }

  onPerformanceBadgeChanged(performanceBadge: PerformanceBadge) {
    console.log('Selected performance badge: ' + performanceBadge.name);
    this.selectedPerformanceBadge = performanceBadge;
  }

  onInstrumentChanged(instrument: Instrument) {
    console.log('Selected instrument: ' + instrument.name);
    this.selectedInstrument = instrument;
  }

  addPerformanceBadge(form: NgForm) {
    if (this.selectedInstrument == null || this.selectedPerformanceBadge == null) {
      return;
    }

    let grade = form.controls.performanceBadgeGrade.value;
    let node = form.controls.performanceBadgeNote.value;
    if (grade != null) {
      if (grade.length === 0) {
        grade = null;
      }
    }
    if (node != null) {
      if (node.length === 0) {
        node = null;
      }
    }

    this.userPerformanceBadges.push(new UserPerformanceBadge(this.userPerformanceBadgeCount, this.selectedPerformanceBadge.id,
      this.selectedInstrument.id, this.selectedPerformanceBadge.name, this.selectedInstrument.name, this.performanceBadgeDate,
      grade, node));

    this.userPerformanceBadgeCount++;
    form.reset();

    this.performanceBadgesChanged.emit(this.userPerformanceBadges.slice());
  }

  removePerformanceBadge(id: number) {
    const localUserPerformanceBadges = [];
    for (let i = 0; i < this.userPerformanceBadges.length; i++) {
      if (this.userPerformanceBadges[i].id !== id) {
        localUserPerformanceBadges.push(this.userPerformanceBadges[i]);
      }
    }

    this.userPerformanceBadges = localUserPerformanceBadges;
    this.performanceBadgesChanged.emit(this.userPerformanceBadges.slice());
  }
}
