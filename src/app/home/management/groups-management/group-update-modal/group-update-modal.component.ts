import {Component, Inject, OnInit} from '@angular/core';
import {GroupsService} from '../groups.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NgForm} from '@angular/forms';
import {Response} from '@angular/http';

@Component({
  selector: 'app-group-update-modal',
  templateUrl: './group-update-modal.component.html',
  styleUrls: ['./group-update-modal.component.css']
})
export class GroupUpdateModalComponent {

  groupID: number;
  name: string;
  description: string;

  sendingRequest = false;

  constructor(private groupsService: GroupsService,
              private dialogRef: MatDialogRef<GroupUpdateModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.groupID = data.group.id;
    this.name = data.group.name;
    this.description = data.group.description;
  }

  onUpdate(form: NgForm) {
    const name = form.controls.name.value;
    const description = form.controls.description.value;

    console.log('updateGroup: ' + name);
    console.log('updateGroup: ' + description);

    const group = {
      'name': name,
      'description': description
    };

    form.controls.name.disable();
    form.controls.description.disable();

    this.sendingRequest = true;
    this.groupsService.updateGroup(group, this.groupID).subscribe(
      (response: Response) => {
        const data = response.json();
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
