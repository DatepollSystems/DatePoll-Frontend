import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';

import {GroupsService} from '../../groups.service';

@Component({
  selector: 'app-group-user-role-update-modal',
  templateUrl: './group-user-role-update-modal.component.html',
  styleUrls: ['./group-user-role-update-modal.component.css']
})
export class GroupUserRoleUpdateModalComponent {

  public user: any;
  public sendingRequest = false;
  private readonly groupID: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<GroupUserRoleUpdateModalComponent>,
              private groupsService: GroupsService) {
    this.user = data.user;
    this.groupID = data.groupID;
  }

  onUpdate(form: NgForm) {
    const role = form.controls.role.value;
    form.controls.role.disable();

    this.sendingRequest = true;

    this.groupsService.updateUserInGroup(this.user.id, this.groupID, role).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroup(this.groupID);
        this.dialogRef.close();
      },
      (error) => console.log(error)
    );
  }
}
