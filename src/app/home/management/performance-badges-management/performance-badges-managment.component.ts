import {Component, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';

import {NotificationsService} from 'angular2-notifications';
import {TranslateService} from '../../../translation/translate.service';
import {BadgesService} from './badges.service';
import {PerformanceBadgesService} from './performance-badges.service';

import {Badge} from './models/badge.model';
import {CurrentYearUser} from './models/currentYearUser.model';
import {Instrument} from './models/instrument.model';
import {PerformanceBadge} from './models/performanceBadge.model';

import {QuestionDialogComponent} from '../../../utils/shared-components/question-dialog/question-dialog.component';
import {InstrumentUpdateModalComponent} from './instrument-update-modal/instrument-update-modal.component';
import {PerformanceBadgeUpdateModalComponent} from './performance-badge-update-modal/performance-badge-update-modal.component';

@Component({
  selector: 'app-performance-badges-managment',
  templateUrl: './performance-badges-managment.component.html',
  styleUrls: ['./performance-badges-managment.component.css'],
})
export class PerformanceBadgesManagmentComponent implements OnDestroy {
  performanceBadgesSubscription: Subscription;
  performanceBadges: PerformanceBadge[];

  instrumentsSubscription: Subscription;
  instruments: Instrument[];

  badgesSubscription: Subscription;
  badges: Badge[];

  currentYearUsers: CurrentYearUser[];
  currentYearUsersSubscription: Subscription;

  answers = [
    {
      answer: this.translate.getTranslationFor('YES'),
      value: 'yes',
    },
    {
      answer: this.translate.getTranslationFor('NO'),
      value: 'no',
    },
  ];

  constructor(
    private performanceBadgesService: PerformanceBadgesService,
    private badgesService: BadgesService,
    private notificationsService: NotificationsService,
    private translate: TranslateService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) {
    this.performanceBadges = this.performanceBadgesService.getPerformanceBadges();
    this.performanceBadgesSubscription = this.performanceBadgesService.performanceBadgesChange.subscribe((value) => {
      this.performanceBadges = value;
    });

    this.instruments = this.performanceBadgesService.getInstruments();
    this.instrumentsSubscription = this.performanceBadgesService.instrumentsChange.subscribe((value) => {
      this.instruments = value;
    });

    this.badges = this.badgesService.getBadges();
    this.badgesSubscription = this.badgesService.badgesChange.subscribe((value) => {
      this.badges = value;
    });

    this.currentYearUsers = this.performanceBadgesService.getCurrentYearUsers();
    this.currentYearUsersSubscription = this.performanceBadgesService.currentYearUsersChange.subscribe((value) => {
      this.currentYearUsers = value;
    });
  }

  ngOnDestroy(): void {
    this.performanceBadgesSubscription.unsubscribe();
    this.instrumentsSubscription.unsubscribe();
    this.badgesSubscription.unsubscribe();
    this.currentYearUsersSubscription.unsubscribe();
  }

  onRefresh() {
    this.performanceBadges = null;
    this.instruments = null;
    this.badges = null;
    this.currentYearUsers = null;
    this.performanceBadgesService.fetchPerformanceBadges();
    this.performanceBadgesService.fetchInstruments();
    this.badgesService.fetchBadges();
    this.performanceBadgesService.fetchCurrentYearUsers();
  }

  addPerformanceBadge(form: NgForm) {
    const name = form.controls.performanceBadgeName.value;

    this.performanceBadgesService.addPerformanceBadge(name).subscribe(
      (data: any) => {
        console.log(data);
        this.performanceBadgesService.fetchPerformanceBadges();
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_PERFORMANCE_BADGES_ADD_PERFORMANCE_BADGE_SUCCESSFUL')
        );
      },
      (error) => {
        console.log(error);
        this.performanceBadgesService.fetchPerformanceBadges();
      }
    );
    form.reset();
  }

  updatePerformanceBadge(performanceBadge: PerformanceBadge) {
    this.dialog.open(PerformanceBadgeUpdateModalComponent, {
      width: '80vh',
      data: {performanceBadge},
    });
  }

  removePerformanceBadge(id: number) {
    const question = this.translate.getTranslationFor('MANAGEMENT_PERFORMANCE_BADGES_REMOVE_PERFORMANCE_BADGE_CONTROL_QUESTION');

    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        answers: this.answers,
        question,
      },
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value != null) {
        if (value.includes('yes')) {
          this.performanceBadgesService.removePerformanceBadge(id).subscribe(
            (data: any) => {
              console.log(data);
              this.performanceBadgesService.fetchPerformanceBadges();
              this.notificationsService.success(
                this.translate.getTranslationFor('SUCCESSFULLY'),
                this.translate.getTranslationFor('MANAGEMENT_PERFORMANCE_BADGES_REMOVED_PERFORMANCE_BADGE_SUCCESSFUL')
              );
            },
            (error) => {
              console.log(error);
              this.performanceBadgesService.fetchPerformanceBadges();
            }
          );
        }
      }
    });
  }

  addInstrument(form: NgForm) {
    const name = form.controls.instrumentName.value;

    this.performanceBadgesService.addInstrument(name).subscribe(
      (data: any) => {
        console.log(data);
        this.performanceBadgesService.fetchInstruments();
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_PERFORMANCE_BADGES_ADD_INSTRUMENT_SUCCESSFUL')
        );
      },
      (error) => {
        console.log(error);
        this.performanceBadgesService.fetchInstruments();
      }
    );
    form.reset();
  }

  updateInstrument(instrument: Instrument) {
    this.dialog.open(InstrumentUpdateModalComponent, {
      width: '80vh',
      data: {instrument},
    });
  }

  removeInstrument(id: number) {
    const question = this.translate.getTranslationFor('MANAGEMENT_PERFORMANCE_BADGES_REMOVE_INSTRUMENT_CONTROL_QUESTION');

    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        answers: this.answers,
        question,
      },
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value != null) {
        if (value.includes('yes')) {
          this.performanceBadgesService.removeInstrument(id).subscribe(
            (data: any) => {
              console.log(data);
              this.performanceBadgesService.fetchInstruments();
              this.notificationsService.success(
                this.translate.getTranslationFor('SUCCESSFULLY'),
                this.translate.getTranslationFor('MANAGEMENT_PERFORMANCE_BADGES_REMOVED_INSTRUMENT_SUCCESSFUL')
              );
            },
            (error) => {
              console.log(error);
              this.performanceBadgesService.fetchInstruments();
            }
          );
        }
      }
    });
  }

  addBadge(form: NgForm) {
    const description = form.controls.badgeDescription.value;
    const afterYears = form.controls.badgeAfterYears.value;

    this.badgesService.addBadge(description, afterYears).subscribe(
      (data: any) => {
        console.log(data);
        this.badgesService.fetchBadges();
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_PERFORMANCE_BADGES_BADGE_ADD_SUCCESSFULLY')
        );
      },
      (error) => {
        console.log(error);
        this.badgesService.fetchBadges();
      }
    );
    form.reset();
  }

  removeBadge(id: number) {
    const question = this.translate.getTranslationFor('MANAGEMENT_PERFORMANCE_BADGES_BADGE_REMOVE_CONTROL_QUESTION');

    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        answers: this.answers,
        question,
      },
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value != null) {
        if (value.includes('yes')) {
          this.badgesService.removeBadge(id).subscribe(
            (data: any) => {
              console.log(data);
              this.badgesService.fetchBadges();
              this.notificationsService.success(
                this.translate.getTranslationFor('SUCCESSFULLY'),
                this.translate.getTranslationFor('MANAGEMENT_PERFORMANCE_BADGES_BADGE_REMOVE_SUCCESSFULLY')
              );
            },
            (error) => {
              console.log(error);
              this.badgesService.fetchBadges();
            }
          );
        }
      }
    });
  }

  trackByFn(inde, item) {
    return item.id;
  }
}
