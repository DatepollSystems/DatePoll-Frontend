import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';

import {GroupsService} from '../groups.service';
import {TranslateService} from '../../../../translation/translate.service';

@Component({
  selector: 'app-subgroup-create-modal',
  templateUrl: './subgroup-create-modal.component.html',
  styleUrls: ['./subgroup-create-modal.component.css']
})
export class SubgroupCreateModalComponent {
  groupID: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private groupsService: GroupsService,
              private dialogRef: MatDialogRef<SubgroupCreateModalComponent>,
              private translate: TranslateService,
              private notificationsService: NotificationsService) {
    this.groupID = data.groupID;
  }

  onCreate(form: NgForm) {
    this.dialogRef.close();

    const name = form.controls.name.value;
    const description = form.controls.description.value;

    console.log('addSubgroup: ' + name);
    console.log('addSubgroup: ' + description);
    console.log('addSubgroup: ' + this.groupID);

    const subgroup = {
      'name': name,
      'description': description,
      'group_id': this.groupID
    };

    this.groupsService.addSubgroup(subgroup).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
        this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_GROUPS_CREATE_SUBGROUP_SUCCESSFUL'));
      },
      (error) => {
        console.log(error);
        this.groupsService.fetchGroups();
      }
    );
  }

}
