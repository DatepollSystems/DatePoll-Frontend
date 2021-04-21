import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';

import {GroupsService} from '../groups.service';
import {TranslateService} from '../../../../translation/translate.service';

@Component({
  selector: 'app-subgroup-delete-modal',
  templateUrl: './subgroup-delete-modal.component.html',
  styleUrls: ['./subgroup-delete-modal.component.css'],
})
export class SubgroupDeleteModalComponent {
  subgroupID: number;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<SubgroupDeleteModalComponent>,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private groupsService: GroupsService
  ) {
    this.subgroupID = data.subgroupID;
  }

  yes() {
    this.groupsService.deleteSubgroup(this.subgroupID).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
        this.snackBar.open(this.translate.getTranslationFor('MANAGEMENT_GROUPS_DELETE_SUBGROUP_MODAL_SUCCESSFUL'));
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
