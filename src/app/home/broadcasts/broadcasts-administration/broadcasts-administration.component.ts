import {Component, OnDestroy, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {Subscription} from 'rxjs';

import {BroadcastsAdministrationService} from './broadcasts-administration.service';
import {TranslateService} from '../../../translation/translate.service';

import {QuestionDialogComponent} from '../../../utils/shared-components/question-dialog/question-dialog.component';
import {Broadcast} from '../models/broadcast.model';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-broadcasts-administration',
  templateUrl: './broadcasts-administration.component.html',
  styleUrls: ['./broadcasts-administration.component.css']
})
export class BroadcastsAdministrationComponent implements OnDestroy {
  displayedColumns: string[] = ['subject', 'date', 'writer', 'body', 'action'];
  filterValue: string = null;
  dataSource: MatTableDataSource<Broadcast>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  broadcasts: Broadcast[] = [];
  broadcastsSubscription: Subscription;

  loading = true;

  constructor(
    private broadcastsService: BroadcastsAdministrationService,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {
    this.broadcasts = this.broadcastsService.getBroadcasts();
    if (this.broadcasts.length !== 0) {
      this.loading = false;
    }
    this.dataSource = new MatTableDataSource(this.broadcasts);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.broadcastsSubscription = this.broadcastsService.broadcastsChange.subscribe(value => {
      this.broadcasts = value;
      this.loading = false;
      this.dataSource = new MatTableDataSource(this.broadcasts);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnDestroy(): void {
    this.broadcastsSubscription.unsubscribe();
  }

  refresh() {
    this.loading = true;
    this.broadcastsService.fetchBroadcasts();
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openBroadcastAdminInfo(broadcast: Broadcast) {
    this.router.navigateByUrl('/home/broadcasts/administration/' + broadcast.id, {state: broadcast});
  }

  removeBroadcast(id: number) {
    const answers = [
      {
        answer: this.translate.getTranslationFor('YES'),
        value: 'yes'
      },
      {
        answer: this.translate.getTranslationFor('NO'),
        value: 'no'
      }
    ];
    const question = this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_DELETE_CONFIRMATION_QUESTION');

    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        answers,
        question
      }
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value != null) {
        if (value.includes('yes')) {
          this.broadcastsService.deleteBroadcast(id).subscribe(
            (response: any) => {
              console.log(response);
              this.broadcastsService.fetchBroadcasts();
              this.notificationsService.success(
                this.translate.getTranslationFor('SUCCESSFULLY'),
                this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_DELETE_SUCCESSFULLY')
              );
            },
            error => console.log(error)
          );
        }
      }
    });
  }
}
