import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatBottomSheet, MatBottomSheetRef, MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';

import {UsersService} from './users.service';
import {MyUserService} from '../../my-user.service';
import {ExcelService} from '../../../services/excel.service';
import {HttpService} from '../../../services/http.service';

import {User} from './user.model';
import {Permissions} from '../../../permissions';
import {UserCreateModalComponent} from './user-create-modal/user-create-modal.component';
import {UserUpdateModalComponent} from './user-update-modal/user-update-modal.component';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit, OnDestroy {
  usersLoaded = true;

  displayedColumns: string[] = ['title', 'firstname', 'surname', 'email', 'birthday', 'join_date', 'streetname', 'streetnumber',
    'zipcode', 'location', 'phoneNumbers', 'activity', 'actions'];
  filterValue: string = null;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private usersSubscription: Subscription;
  users: User[];
  dataSource: MatTableDataSource<User>;

  private permissionSubscription: Subscription;

  constructor(
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private myUserService: MyUserService,
    private usersService: UsersService) {

    this.permissionSubscription = myUserService.permissionsChange.subscribe((value) => {
      if (!this.myUserService.hasPermission(Permissions.MANAGEMENT_ADMINISTRATION)) {
        this.router.navigate(['/home']);
      }
    });

    this.usersLoaded = false;

    this.users = usersService.getUsers();

    if (this.users.length > 0) {
      this.usersLoaded = true;
    }

    this.usersSubscription = usersService.usersChange.subscribe((value) => {
      this.usersLoaded = true;

      this.users = value;
      this.refreshTable();
    });
  }

  ngOnInit() {
    if (!this.myUserService.hasPermission(Permissions.MANAGEMENT_ADMINISTRATION)) {
      this.router.navigate(['/home']);
    }

    this.refreshTable();
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
    this.permissionSubscription.unsubscribe();
  }

  refreshTable() {
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openExportUsersBottomSheet(): void {
    this.bottomSheet.open(UsersExportBottomSheetComponent);
  }

  onCreate() {
    this.dialog.open(UserCreateModalComponent, {
      width: '80vh'
    });
  }

  onEdit(user: User) {
    this.dialog.open(UserUpdateModalComponent, {
      width: '80vh',
      data: {user: user}
    });
  }

  onDelete(userID: number) {
    this.usersService.deleteUser(userID);
  }

  refreshUsers() {
    this.usersLoaded = false;
    this.users = [];
    this.refreshTable();
    this.usersService.fetchUsers();
  }

}

@Component({
  selector: 'app-users-export-bottom-sheet',
  templateUrl: 'users-export-bottom-sheet.html',
  styles: ['mat-icon { margin-right: 15px }']
})
export class UsersExportBottomSheetComponent {
  constructor(private bottomSheetRef: MatBottomSheetRef<UsersExportBottomSheetComponent>, private excelService: ExcelService,
              private usersService: UsersService) {
  }

  exportExcelSheet() {
    const users = this.usersService.getUsers();
    const exportUsers = [];

    for (let i = 0; i < users.length; i++) {
      const user = {
        'Titel': users[i].title,
        'Vorname': users[i].firstname,
        'Nachname': users[i].surname,
        'Gebrutsdatum': users[i].birthday.getDate() + '-' + (users[i].birthday.getMonth() + 1) + '-'
          + users[i].birthday.getFullYear(),
        'Beitrittsdatum': users[i].join_date.getDate() + '-' + (users[i].join_date.getMonth() + 1) + '-'
          + users[i].join_date.getFullYear(),
        'Address': users[i].streetname + ' ' + users[i].streetnumber + ' ' + users[i].zipcode + ' ' + users[i].location,
        'Email-Adresse': users[i].email,
        'Telefonnummern': users[i].getPhoneNumbersAsString()
      };

      exportUsers.push(user);
    }

    this.excelService.exportAsExcelFile(exportUsers, 'Mitglieder');
    this.bottomSheetRef.dismiss();
  }
}
