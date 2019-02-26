import {Component, OnInit, ViewChild} from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';

import {UsersService} from './users.service';
import {User} from './user.model';
import {ExcelService} from '../../../services/excel.service';
import {Permissions} from '../../../permissions';
import {MyUserService} from '../../my-user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit {
  displayedColumns: string[] = ['title', 'firstname', 'surname', 'email', 'birthday', 'join_date', 'streetname', 'streetnumber',
    'zipcode', 'location', 'actions'];
  filterValue: string = null;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private usersSubscription: Subscription;
  users: User[];
  dataSource: MatTableDataSource<User>;

  private permissionSubscription: Subscription;

  constructor(private bottomSheet: MatBottomSheet,
              private myUserService: MyUserService,
              private router: Router,
              private usersService: UsersService) {

    this.permissionSubscription = myUserService.permissionsChange.subscribe((value) => {
      if (!this.myUserService.hasPermission(Permissions.MANAGEMENT_ADMINISTRATION)) {
        this.router.navigate(['/home']);
      }
    });

    this.users = usersService.getUsers();
    this.usersSubscription = usersService.usersChange.subscribe((value) => {
      this.users = value;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit() {
    if (!this.myUserService.hasPermission(Permissions.MANAGEMENT_ADMINISTRATION)) {
      this.router.navigate(['/home']);
    }

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

  }

  onEdit(userID: number) {

  }

  onDelete(userID: number) {

  }

}

@Component({
  selector: 'app-users-export-bottom-sheet',
  templateUrl: 'users-export-bottom-sheet.html',
  styles: ['mat-icon { margin-right: 15px }']
})
export class UsersExportBottomSheetComponent {
  constructor(private bottomSheetRef: MatBottomSheetRef<UsersExportBottomSheetComponent>, private excelService: ExcelService,
              private usersService: UsersService) {}

  exportExcelSheet() {
    const users = this.usersService.getUsers();
    const exportUsers = [];

    for (let i = 0; i < users.length; i++) {
      const user = {
        'Titel': users[i].getTitle(),
        'Vorname': users[i].getFirstname(),
        'Nachname': users[i].getSurname(),
        'Gebrutsdatum': users[i].getBirthday().getDate() + '-' + (users[i].getBirthday().getMonth() + 1) + '-'
          + users[i].getBirthday().getFullYear(),
        'Beitrittsdatum': users[i].getJoinDate().getDate() + '-' + (users[i].getJoinDate().getMonth() + 1) + '-'
          + users[i].getJoinDate().getFullYear(),
        'Address': users[i].getStreetname() + ' ' + users[i].getStreetnumber() + ' ' + users[i].getZipcode() + ' ' + users[i].getLocation(),
        'Email-Adresse': users[i].getEmail(),
        'Telefonnummern': users[i].getPhoneNumbersAsString()
      };

      exportUsers.push(user);
    }

    this.excelService.exportAsExcelFile(exportUsers, 'Mitglieder');
    this.bottomSheetRef.dismiss();
  }
}
