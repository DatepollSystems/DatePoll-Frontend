import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

import {UsersChangesService} from './users-changes.service';
import {MyUserService} from '../../../my-user.service';
import {Permissions} from '../../../../permissions';
import {TranslateService} from '../../../../translation/translate.service';

import {UserChange} from '../models/userChange.model';
import {QuestionDialogComponent} from '../../../../utils/shared-components/question-dialog/question-dialog.component';

@Component({
  selector: 'app-users-changes-management',
  templateUrl: './users-changes-management.component.html',
  styleUrls: ['./users-changes-management.component.css'],
})
export class UsersChangesManagementComponent implements OnInit, OnDestroy {
  userChanges: UserChange[] = [];
  filteredUserChanges: UserChange[] = [];
  userChangesSubscription: Subscription;
  userChangesSearchSubscription: Subscription;

  filterValue = '';

  hasPermissionToDeleteUserChanage = false;

  page = 0;

  constructor(
    private userChangesService: UsersChangesService,
    private myUserService: MyUserService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet
  ) {
    this.userChanges = this.userChangesService.getUserChanges(0);
    this.userChangesSubscription = this.userChangesService.userChangesChange.subscribe((val) => {
      if (val.length === 0) {
        this.page--;
        return;
      }

      for (const userChange of val) {
        let inn = false;
        for (const aUserChange of this.userChanges) {
          if (userChange.id === aUserChange.id) {
            inn = true;
            break;
          }
        }
        if (!inn) {
          this.userChanges.push(userChange);
        }
      }
      this.filteredUserChanges = this.userChanges.slice();
    });
    this.userChangesSearchSubscription = this.userChangesService.searchedUserChanges.subscribe((val) => {
      this.filteredUserChanges = val;
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.hasPermissionToDeleteUserChanage = this.myUserService.hasPermission(Permissions.MANAGEMENT_EXTRA_USER_DELETE);
    });
  }

  ngOnDestroy(): void {
    this.userChangesSubscription.unsubscribe();
    this.userChangesSearchSubscription.unsubscribe();
  }

  applyFilter() {
    if (!this.filterValue || this.filterValue?.length < 1) {
      this.filteredUserChanges = this.userChanges.slice();
      return;
    }
    this.userChangesService.searchUserChanges(this.filterValue);
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
                this.userChanges.splice(this.userChanges.indexOf(userChange), 1);
                this.filteredUserChanges.splice(this.filteredUserChanges.indexOf(userChange), 1);
                this.snackBar.open(this.translate.getTranslationFor('MANAGEMENT_USERS_CHANGES_DELETE_CONFIRMATION_SUCCESSFULLY'));
              },
              (error) => console.log(error)
            );
          }
        }
      });
    }
  }

  onScrollDown() {
    if (this.filterValue || this.filterValue?.length > 0) {
      return;
    }
    this.page++;
    this.userChangesService.getUserChanges(this.page);
  }
}
