import {Component, EventEmitter, Input, Output} from '@angular/core';

import {Permissions} from '../../../../permissions';

@Component({
  selector: 'app-permissions-list',
  templateUrl: './permissions-list.component.html',
  styleUrls: ['./permissions-list.component.css'],
})
export class PermissionsListComponent {
  allPermissions: string[] = [];

  @Input() permissions: string[] = [];

  @Output() permissionsChanged = new EventEmitter();

  constructor() {
    this.allPermissions = Permissions.getAll();
  }

  permissionChange(value: string[]) {
    this.permissionsChanged.emit(value.slice());
  }
}
