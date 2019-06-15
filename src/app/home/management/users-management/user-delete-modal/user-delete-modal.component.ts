import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {UsersService} from '../users.service';

@Component({
  selector: 'app-user-delete-modal',
  templateUrl: './user-delete-modal.component.html',
  styleUrls: ['./user-delete-modal.component.css']
})
export class UserDeleteModalComponent {

  userID: number;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private bottomSheetRef: MatBottomSheetRef<UserDeleteModalComponent>,
              private usersService: UsersService) {
    this.userID = data.userID;
  }

  yes() {
    this.usersService.deleteUser(this.userID);
    this.no();
  }

  no() {
    this.bottomSheetRef.dismiss();
  }

}
