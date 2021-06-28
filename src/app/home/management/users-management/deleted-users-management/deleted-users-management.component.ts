import {Component, OnDestroy} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Subscription} from 'rxjs';

import {QuestionDialogComponent} from '../../../../utils/shared-components/question-dialog/question-dialog.component';

import {DeletedUsersService} from './deleted-users.service';

import {DeletedUser} from '../models/deletedUser.model';
import {NotificationService} from '../../../../utils/notification.service';

@Component({
  selector: 'app-deleted-users-management',
  templateUrl: './deleted-users-management.component.html',
  styleUrls: ['./deleted-users-management.component.css'],
})
export class DeletedUsersManagementComponent implements OnDestroy {
  sortedUsers: DeletedUser[];
  deletedUsers: DeletedUser[];
  deletedUsersSubscription: Subscription;
  deletedUsersLoaded = false;

  constructor(
    private deletedUsersService: DeletedUsersService,
    private notificationService: NotificationService,
    private bottomSheet: MatBottomSheet
  ) {
    this.deletedUsers = this.deletedUsersService.getDeletedUsers();
    this.sortedUsers = this.deletedUsers.slice();
    this.deletedUsersSubscription = this.deletedUsersService.deletedUserChange.subscribe((value) => {
      this.deletedUsersLoaded = true;
      this.deletedUsers = value;
      this.sortedUsers = this.deletedUsers.slice();
    });
  }

  ngOnDestroy(): void {
    this.deletedUsersSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue?.trim().toLowerCase();
    this.sortedUsers = [];

    for (const user of this.deletedUsers) {
      if (
        user.firstname?.trim().toLowerCase().includes(filterValue) ||
        user.surname?.trim().toLowerCase().includes(filterValue) ||
        user.join_date?.toString().includes(filterValue) ||
        user.deletedAt?.toString().includes(filterValue) ||
        user.internalComment?.trim().toLowerCase().includes(filterValue)
      ) {
        this.sortedUsers.push(user);
      }
    }
  }

  delete(user: DeletedUser) {
    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        question: 'MANAGEMENT_USERS_DELETED_USERS_DELETE_SINGLE_CONFIRM',
      },
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value != null) {
        if (value.includes('yes')) {
          this.deletedUsersService.delete(user.id).subscribe(
            (response: any) => {
              console.log(response);
              this.deletedUsers.splice(this.deletedUsers.indexOf(user), 1);
              this.sortedUsers.splice(this.sortedUsers.indexOf(user), 1);
              this.notificationService.info('MANAGEMENT_USERS_DELETED_USERS_DELETE_SUCCESSFUL');
            },
            (error) => console.log(error)
          );
        }
      }
    });
  }

  deleteAll() {
    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        question: 'MANAGEMENT_USERS_DELETED_USERS_DELETE_ALL_CONFIRM',
      },
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value?.includes(QuestionDialogComponent.YES_VALUE)) {
        this.deletedUsersService.deleteAllDeletedUsers().subscribe(
          (response: any) => {
            console.log(response);
            this.deletedUsersLoaded = false;
            this.deletedUsersService.getDeletedUsers();
            this.notificationService.info('MANAGEMENT_USERS_DELETED_USERS_DELETE_ALL_SUCCESSFUL');
          },
          (error) => console.log(error)
        );
      }
    });
  }
}
