import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';

import {GroupsService} from '../groups.service';
import {TranslateService} from '../../../../translation/translate.service';

@Component({
  selector: 'app-group-delete-modal',
  templateUrl: './group-delete-modal.component.html',
  styleUrls: ['./group-delete-modal.component.css'],
})
export class GroupDeleteModalComponent {
  groupID: number;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<GroupDeleteModalComponent>,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private groupsService: GroupsService
  ) {
    this.groupID = data.groupID;
  }

  yes() {
    this.groupsService.deleteGroup(this.groupID).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
        this.snackBar.open(this.translate.getTranslationFor('MANAGEMENT_GROUPS_DELETE_GROUP_MODAL_SUCCESSFUL'));
      },
      (error) => {
        console.log(error);
        this.groupsService.fetchGroups();
      }
    );
    this.no();
  }

  no() {
    this.bottomSheetRef.dismiss();
  }
}
