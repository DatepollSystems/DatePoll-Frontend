import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {GroupsService} from '../groups.service';
import {MyUserService} from '../../../my-user.service';

import {Permissions} from '../../../../permissions';

@Component({
  selector: 'app-group-create-modal',
  templateUrl: './group-create-modal.component.html',
  styleUrls: ['./group-create-modal.component.css'],
})
export class GroupCreateModalComponent {
  permissions: string[];
  allPermissions: string[] = null;
  hasPermissionToChangePermissions = false;

  constructor(
    private groupsService: GroupsService,
    private myUserService: MyUserService,
    private dialogRef: MatDialogRef<GroupCreateModalComponent>,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {
    this.allPermissions = Permissions.getAll();
    this.hasPermissionToChangePermissions = this.myUserService.hasPermission(Permissions.MANAGEMENT_EXTRA_USER_PERMISSIONS);
  }

  permissionsChange(permisions: string[]) {
    this.permissions = permisions;
    console.log(this.permissions);
  }

  onCreate(form: NgForm) {
    this.dialogRef.close();

    const name = form.controls.name.value;
    const description = form.controls.description.value;
    const orderN = Number(form.controls.orderN.value);

    const group = {
      name,
      description,
      orderN,
      permissions: this.permissions,
    };
    console.log(group);

    this.groupsService.addGroup(group).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_GROUPS_CREATE_GROUP_SUCCESSFUL')
        );
      },
      (error) => {
        console.log(error);
        this.groupsService.fetchGroups();
      }
    );
  }
}
