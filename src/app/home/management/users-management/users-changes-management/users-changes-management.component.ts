import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserChange} from './userChange.model';
import {UsersChangesService} from './users-changes.service';

@Component({
  selector: 'app-users-changes-management',
  templateUrl: './users-changes-management.component.html',
  styleUrls: ['./users-changes-management.component.css'],
})
export class UsersChangesManagementComponent implements OnDestroy {
  userChanges: UserChange[] = [];
  filteredUserChanges: UserChange[] = [];
  userChangesSubscription: Subscription;

  ignoreEditorChangesChars = '!e';

  constructor(private userChangesService: UsersChangesService) {
    this.userChanges = this.userChangesService.getUserChanges();
    this.filteredUserChanges = this.userChanges.slice();
    this.userChangesSubscription = this.userChangesService.userChangesChange.subscribe((value) => {
      this.userChanges = value;
      this.filteredUserChanges = this.userChanges.slice();
    });
  }

  ngOnDestroy(): void {
    this.userChangesSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue?.trim().toLowerCase();
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
}
