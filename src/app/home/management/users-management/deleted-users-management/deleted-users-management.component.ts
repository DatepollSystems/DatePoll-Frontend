import {Component, OnDestroy} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Subscription} from 'rxjs';

import {NotificationsService} from 'angular2-notifications';

import {QuestionDialogComponent} from '../../../../utils/shared-components/question-dialog/question-dialog.component';

import {TranslateService} from '../../../../translation/translate.service';
import {UsersService} from '../users.service';

import {DeletedUser} from '../deletedUser.model';

@Component({
  selector: 'app-deleted-users-management',
  templateUrl: './deleted-users-management.component.html',
  styleUrls: ['./deleted-users-management.component.css']
})
export class DeletedUsersManagementComponent implements OnDestroy {
  sortedUsers: DeletedUser[];
  deletedUsers: DeletedUser[];
  deletedUsersSubscription: Subscription;
  deletedUsersLoaded = false;

  constructor(
    private usersSerivce: UsersService,
    private translate: TranslateService,
    private bottomSheet: MatBottomSheet,
    private notificationsService: NotificationsService
  ) {
    this.deletedUsers = this.usersSerivce.getDeletedUsers();
    this.sortedUsers = this.deletedUsers.slice();
    this.deletedUsersSubscription = this.usersSerivce.deletedUserChange.subscribe(value => {
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
        user.firstname
          ?.trim()
          .toLowerCase()
          .includes(filterValue) ||
        user.surname
          ?.trim()
          .toLowerCase()
          .includes(filterValue) ||
        user.join_date?.toString().includes(filterValue) ||
        user.deletedAt?.toString().includes(filterValue) ||
        user.internalComment
          ?.trim()
          .toLowerCase()
          .includes(filterValue)
      ) {
        this.sortedUsers.push(user);
      }
    }
  }

  deleteAll() {
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
    const question = this.translate.getTranslationFor('MANAGEMENT_USERS_DELETED_USERS_DELETE_ALL_CONFIRM');

    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        answers,
        question
      }
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value != null) {
        if (value.includes('yes')) {
          this.usersSerivce.deleteAllDeletedUsers().subscribe(
            (response: any) => {
              console.log(response);
              this.deletedUsersLoaded = false;
              this.usersSerivce.getDeletedUsers();
              this.notificationsService.success(
                this.translate.getTranslationFor('SUCCESSFULLY'),
                this.translate.getTranslationFor('MANAGEMENT_USERS_DELETED_USERS_DELETE_ALL_SUCCESSFUL')
              );
            },
            error => console.log(error)
          );
        }
      }
    });
  }
}
