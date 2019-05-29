import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

import {GroupsService} from '../groups.service';

@Component({
  selector: 'app-group-create-modal',
  templateUrl: './group-create-modal.component.html',
  styleUrls: ['./group-create-modal.component.css']
})
export class GroupCreateModalComponent {

  sendingRequest = false;

  constructor(private groupsService: GroupsService, private dialogRef: MatDialogRef<GroupCreateModalComponent>) {
  }

  onCreate(form: NgForm) {
    const name = form.controls.name.value;
    const description = form.controls.description.value;

    console.log('addGroup: ' + name);
    console.log('addGroup: ' + description);

    const group = {
      'name': name,
      'description': description
    };

    form.controls.name.disable();
    form.controls.description.disable();

    this.sendingRequest = true;
    this.groupsService.addGroup(group).subscribe(
      (data: any) => {
        console.log(data);
        this.groupsService.fetchGroups();
        this.dialogRef.close();
      },
      (error) => {
        console.log(error);
        this.groupsService.fetchGroups();
        this.dialogRef.close();
      }
    );
  }

}
