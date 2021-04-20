import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';

import {UsersChangesService} from './users-changes.service';
import {MyUserService} from '../../../my-user.service';
import {Permissions} from '../../../../permissions';
import {TranslateService} from '../../../../translation/translate.service';

import {UserChange} from './userChange.model';
import {QuestionDialogComponent} from '../../../../utils/shared-components/question-dialog/question-dialog.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-users-changes-management',
  templateUrl: './users-changes-management.component.html',
  styleUrls: ['./users-changes-management.component.css'],
})
export class UsersChangesManagementComponent implements OnInit, OnDestroy {
  userChanges: UserChange[] = [];
  filteredUserChanges: UserChange[] = [];
  userChangesSubscription: Subscription;

  filterValue = '';
  ignoreEditorChangesChars = '!e';

  hasPermissionToDeleteUserChanage = false;

  constructor(
    private userChangesService: UsersChangesService,
    private myUserService: MyUserService,
    private translate: TranslateService,
    private notificationsService: NotificationsService,
    private bottomSheet: MatBottomSheet
  ) {
    this.userChanges = this.userChangesService.getUserChanges();
    this.filteredUserChanges = this.userChanges.slice();
    this.userChangesSubscription = this.userChangesService.userChangesChange.subscribe((value) => {
      this.userChanges = value;
      this.filteredUserChanges = this.userChanges.slice();
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.hasPermissionToDeleteUserChanage = this.myUserService.hasPermission(Permissions.MANAGEMENT_EXTRA_USER_DELETE);
    });
  }

  ngOnDestroy(): void {
    this.userChangesSubscription.unsubscribe();
  }

  applyFilter() {
    let filterValue = this.filterValue?.trim().toLowerCase();
    this.filteredUserChanges = [];

    let includesIgnoreEditorChars = false;
    if (filterValue.includes(this.ignoreEditorChangesChars)) {
      includesIgnoreEditorChars = true;
      filterValue = filterValue.replace(this.ignoreEditorChangesChars, '').trim();
    }

    for (const user of this.userChanges) {
      if (
        user.userName?.trim().toLowerCase().includes(filterValue) ||
        (user.editorName?.trim().toLowerCase().includes(filterValue) && !includesIgnoreEditorChars) ||
        user.editedAt?.toString().includes(filterValue) ||
        user.property?.trim().toLowerCase().includes(filterValue) ||
        user.newValue?.trim().toLowerCase().includes(filterValue) ||
        user.oldValue?.trim().toLowerCase().includes(filterValue)
      ) {
        this.filteredUserChanges.push(user);
      }
    }
  }

  deleteUserChange(userChange: UserChange) {
    if (this.hasPermissionToDeleteUserChanage) {
      const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
        data: {
          question: 'MANAGEMENT_USERS_CHANGES_DELETE_CONFIRMATION',
        },
      });

      bottomSheetRef.afterDismissed().subscribe((value: string) => {
        if (value != null) {
          if (value.includes('yes')) {
            this.userChangesService.deleteUserChange(userChange.id).subscribe(
              (response: any) => {
                console.log(response);
                this.userChangesService.getUserChanges();
                this.notificationsService.success(
                  this.translate.getTranslationFor('SUCCESSFULLY'),
                  this.translate.getTranslationFor('MANAGEMENT_USERS_CHANGES_DELETE_CONFIRMATION_SUCCESSFULLY')
                );
              },
              (error) => console.log(error)
            );
          }
        }
      });
    }
  }
}
