import {Component, Inject} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {GroupsService} from '../groups.service';

@Component({
  selector: 'app-subgroup-create-modal',
  templateUrl: './subgroup-create-modal.component.html',
  styleUrls: ['./subgroup-create-modal.component.css']
})
export class SubgroupCreateModalComponent {
  groupID: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupsService: GroupsService,
    private dialogRef: MatDialogRef<SubgroupCreateModalComponent>,
    private translate: TranslateService,
    private notificationsService: NotificationsService
  ) {
    this.groupID = data.groupID;
  }

  onCreate(form: NgForm) {
    this.dialogRef.close();

    const name = form.controls.name.value;
    const description = form.controls.description.value;
    const orderN = form.controls.orderN.value;

    const subgroup = {
      name,
      description,
      orderN,
      group_id: this.groupID
    };
    console.log(subgroup);

    this.groupsService.addSubgroup(subgroup).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_GROUPS_CREATE_SUBGROUP_SUCCESSFUL')
        );
      },
      error => {
        console.log(error);
        this.groupsService.fetchGroups();
      }
    );
  }
}
