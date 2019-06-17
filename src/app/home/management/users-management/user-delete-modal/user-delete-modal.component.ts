import {Component, Inject, TemplateRef, ViewChild} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {UsersService} from '../users.service';
import {NotificationsService, NotificationType} from 'angular2-notifications';

@Component({
  selector: 'app-user-delete-modal',
  templateUrl: './user-delete-modal.component.html',
  styleUrls: ['./user-delete-modal.component.css']
})
export class UserDeleteModalComponent {
  @ViewChild('successfullyDeletedUser', {static: true}) successfullyDeletedUser: TemplateRef<any>;
  userID: number;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private bottomSheetRef: MatBottomSheetRef<UserDeleteModalComponent>,
              private notificationsService: NotificationsService,
              private usersService: UsersService) {
    this.userID = data.userID;
  }

  yes() {
    this.usersService.deleteUser(this.userID).subscribe(
      (data: any) => {
        console.log(data);
        this.usersService.fetchUsers();
        this.notificationsService.html(this.successfullyDeletedUser, NotificationType.Success, null, 'success');
      },
      (error) => console.log(error)
    );
    this.no();
  }

  no() {
    this.bottomSheetRef.dismiss();
  }
}
