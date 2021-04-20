import {Component, OnDestroy} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Subscription} from 'rxjs';

import {NotificationsService} from 'angular2-notifications';

import {QuestionDialogComponent} from '../../../../utils/shared-components/question-dialog/question-dialog.component';

import {TranslateService} from '../../../../translation/translate.service';
import {DeletedUsersService} from './deleted-users.service';

import {DeletedUser} from './deletedUser.model';

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
    private translate: TranslateService,
    private bottomSheet: MatBottomSheet,
    private notificationsService: NotificationsService
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
            this.notificationsService.success(
              this.translate.getTranslationFor('SUCCESSFULLY'),
              this.translate.getTranslationFor('MANAGEMENT_USERS_DELETED_USERS_DELETE_ALL_SUCCESSFUL')
            );
          },
          (error) => console.log(error)
        );
      }
    });
  }
}
