import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-permissions-list',
  templateUrl: './permissions-list.component.html',
  styleUrls: ['./permissions-list.component.css']
})
export class PermissionsListComponent {

  @Input() permissions: string[] = [];

  @Output() permissionsChanged = new EventEmitter();

  constructor() {
  }

  addPermission(form: NgForm) {
    const permission = form.controls.permission.value;
    this.permissions.push(permission);
    form.reset();
    this.permissionsChanged.emit(this.permissions.slice());
  }

  removePermission(permission: string) {
    const permissions = [];
    for (let i = 0; i < this.permissions.length; i++) {
      if (!this.permissions[i].includes(permission)) {
        permissions.push(this.permissions[i]);
      }
    }
    this.permissions = permissions;
    this.permissionsChanged.emit(this.permissions.slice());
  }

}
