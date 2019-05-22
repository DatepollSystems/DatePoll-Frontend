import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {Subscription} from 'rxjs';

import {PerformanceBadgesService} from './performance-badges.service';
import {NotificationsService, NotificationType} from 'angular2-notifications';

import {PerformanceBadge} from './performanceBadge.model';
import {Instrument} from './instrument.model';
import {UserUpdateModalComponent} from '../users-management/user-update-modal/user-update-modal.component';
import {PerformanceBadgeUpdateModalComponent} from './performance-badge-update-modal/performance-badge-update-modal.component';
import {InstrumentUpdateModalComponent} from './instrument-update-modal/instrument-update-modal.component';

@Component({
  selector: 'app-performance-badges-managment',
  templateUrl: './performance-badges-managment.component.html',
  styleUrls: ['./performance-badges-managment.component.css']
})
export class PerformanceBadgesManagmentComponent implements OnDestroy {

  @ViewChild('successfullyAddedPerformanceBadge') successfullyAddedPerformanceBadge: TemplateRef<any>;
  @ViewChild('successfullyRemovedPerformanceBadge') successfullyRemovedPerformanceBadge: TemplateRef<any>;

  @ViewChild('successfullyAddedInstrument') successfullyAddedInstrument: TemplateRef<any>;
  @ViewChild('successfullyRemovedInstrument') successfullyRemovedInstrument: TemplateRef<any>;

  performanceBadgesSubscription: Subscription;
  performanceBadges: PerformanceBadge[];

  instrumentsSubscription: Subscription;
  instruments: Instrument[];

  constructor(private performanceBadgesService: PerformanceBadgesService,
              private notificationsService: NotificationsService,
              private dialog: MatDialog) {
    this.performanceBadges = this.performanceBadgesService.getPerformanceBadges();
    this.performanceBadgesSubscription = this.performanceBadgesService.performanceBadgesChange.subscribe((value) => {
      this.performanceBadges = value;
    });

    this.instruments = this.performanceBadgesService.getInstruments();
    this.instrumentsSubscription = this.performanceBadgesService.instrumentsChange.subscribe((value) => {
      this.instruments = value;
    });
  }

  ngOnDestroy(): void {
    this.performanceBadgesSubscription.unsubscribe();
    this.instrumentsSubscription.unsubscribe();
  }

  onRefresh() {
    this.performanceBadges = null;
    this.instruments = null;
    this.performanceBadgesService.fetchPerformanceBadges();
    this.performanceBadgesService.fetchInstruments();
  }

  addPerformanceBadge(form: NgForm) {
    const name = form.controls.performanceBadgeName.value;

    this.performanceBadgesService.addPerformanceBadge(name).subscribe(
      (data: any) => {
        console.log(data);
        this.performanceBadgesService.fetchPerformanceBadges();
        this.notificationsService.html(this.successfullyAddedPerformanceBadge, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
    form.reset();
  }

  updatePerformanceBadge(performanceBadge: PerformanceBadge) {
    this.dialog.open(PerformanceBadgeUpdateModalComponent, {
      width: '80vh',
      data: {performanceBadge: performanceBadge}
    });
  }

  removePerformanceBadge(id: number, button: any) {
    button.disabled = true;
    this.performanceBadgesService.removePerformanceBadge(id).subscribe(
      (data: any) => {
        console.log(data);
        this.performanceBadgesService.fetchPerformanceBadges();
        this.notificationsService.html(this.successfullyRemovedPerformanceBadge, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
  }


  addInstrument(form: NgForm) {
    const name = form.controls.instrumentName.value;

    this.performanceBadgesService.addInstrument(name).subscribe(
      (data: any) => {
        console.log(data);
        this.performanceBadgesService.fetchInstruments();
        this.notificationsService.html(this.successfullyAddedInstrument, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
    form.reset();
  }

  updateInstrument(instrument: Instrument) {
    this.dialog.open(InstrumentUpdateModalComponent, {
      width: '80vh',
      data: {instrument: instrument}
    });
  }

  removeInstrument(id: number, button: any) {
    button.disabled = true;
    this.performanceBadgesService.removeInstrument(id).subscribe(
      (data: any) => {
        console.log(data);
        this.performanceBadgesService.fetchInstruments();
        this.notificationsService.html(this.successfullyRemovedInstrument, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
  }

}
