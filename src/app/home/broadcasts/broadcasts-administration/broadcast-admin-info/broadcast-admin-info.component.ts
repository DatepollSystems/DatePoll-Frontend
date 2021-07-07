import {Component, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {BroadcastsAdministrationService} from '../broadcasts-administration.service';

import {Broadcast, UserBroadcastInfo} from '../../models/broadcast.model';
import {UIHelper} from '../../../../utils/helper/UIHelper';
import {QuestionDialogComponent} from '../../../../utils/shared-components/question-dialog/question-dialog.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {NotificationService} from '../../../../utils/notification.service';

@Component({
  selector: 'app-broadcast-admin-info',
  templateUrl: './broadcast-admin-info.component.html',
  styleUrls: ['./broadcast-admin-info.component.css'],
})
export class BroadcastAdminInfoComponent implements OnDestroy {
  displayedColumns: string[] = ['userName', 'sent', 'queuedAt', 'sentAt'];
  filterValue: string = null;
  dataSource: MatTableDataSource<UserBroadcastInfo>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  broadcast: Broadcast;
  broadcastSubscription: Subscription;

  loaded = false;

  constructor(
    private route: ActivatedRoute,
    private broadcastSerivce: BroadcastsAdministrationService,
    private bottomSheet: MatBottomSheet,
    private notificationService: NotificationService
  ) {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id != null) {
        console.log('Broadcast to open: ' + id);

        this.broadcast = new Broadcast(Number(id), 'Loading', UIHelper.getCurrentDate(), 'Loading', 'Loading');

        this.broadcast = this.broadcastSerivce.getSentReceiptBroadcast(Number(id));
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.sort = this.sort;
        this.broadcastSubscription = this.broadcastSerivce.broadcastChange.subscribe((value) => {
          this.broadcast = value;
          this.loaded = true;
          this.dataSource = new MatTableDataSource(this.broadcast.userInfos);
          this.dataSource.sort = this.sort;
        });
      } else {
        console.log('No broadcast to open');
      }
    });
  }

  ngOnDestroy(): void {
    this.broadcastSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }

  requeBroadcast(id: number) {
    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        question: 'BROADCASTS_ADMINISTRATION_ADMIN_INFO_REQUEUE_CONFIRM',
      },
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value?.includes(QuestionDialogComponent.YES_VALUE)) {
        this.broadcastSerivce.requeueNotSentBroadcastMails(id).subscribe(
          (data: any) => {
            console.log(data);
            this.notificationService.info('BROADCASTS_ADMINISTRATION_ADMIN_INFO_REQUEUE_SUCCESSFUL');
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }
}
