import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {ReplaySubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {Permissions} from '../../../../permissions';

@Component({
  selector: 'app-permissions-list',
  templateUrl: './permissions-list.component.html',
  styleUrls: ['./permissions-list.component.css']
})
export class PermissionsListComponent implements OnInit {
  /** control for the selected years */
  public permissionCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public permissionFilterCtrl: FormControl = new FormControl();

  /** list of permissions filtered by search keyword */
  public filteredPermissions: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

  allPermissions: string[] = [];
  selectedPermission: string;
  @Output() permissionChanged = new EventEmitter();
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  @Input() permissions: string[] = [];

  @Output() permissionsChanged = new EventEmitter();

  constructor() {
    this.allPermissions = Permissions.getAll();
  }

  ngOnInit(): void {
    // load the initial years list
    this.filteredPermissions.next(this.allPermissions.slice());

    // listen for search field value changes
    this.permissionFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPermissions();
      });
  }

  permissionSelectChange(value) {
    this.selectedPermission = value;
  }

  private filterPermissions() {
    if (!this.allPermissions) {
      return;
    }
    // get the search keyword
    let search = this.permissionFilterCtrl.value;
    if (!search) {
      this.filteredPermissions.next(this.allPermissions.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the permissions
    this.filteredPermissions.next(
      this.allPermissions.filter(p => p.toString().toLowerCase().indexOf(search) > -1)
    );
  }

  addPermission() {
    if (this.selectedPermission == null) {
      return;
    } else if (this.selectedPermission.length < 1) {
      return;
    }
    const permission = this.selectedPermission;
    this.permissions.push(permission);
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
