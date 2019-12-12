import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';

import {NotificationsService, NotificationType} from 'angular2-notifications';

import {UsersService} from '../users.service';
import {GroupsService} from '../../groups-management/groups.service';
import {PerformanceBadgesService} from '../../performance-badges-management/performance-badges.service';
import {MyUserService} from '../../../my-user.service';
import {Converter} from '../../../../services/converter';

import {PhoneNumber} from '../../../phoneNumber.model';
import {Group} from '../../groups-management/models/group.model';
import {UserPerformanceBadge} from '../userPerformanceBadge.model';
import {Permissions} from '../../../../permissions';

@Component({
  selector: 'app-user-create-modal',
  templateUrl: './user-create-modal.component.html',
  styleUrls: ['./user-create-modal.component.css']
})
export class UserCreateModalComponent implements OnDestroy {

  @ViewChild('successfullyCreatedUser', {static: true}) successfullyCreatedUser: TemplateRef<any>;

  displayedColumns: string[] = ['label', 'phonenumber', 'action'];
  dataSource: MatTableDataSource<PhoneNumber>;

  usernames: string[] = [];

  emailAddresses: string[] = [];
  birthday: Date;
  join_date: Date;
  phoneNumbers: PhoneNumber[] = [];

  groups: Group[] = [];
  groupsSubscription: Subscription;

  joined: any[] = [];
  free: any[] = [];

  hasPermissionToChangePermission = false;
  permissions: string[] = [];

  userPerformanceBadges: UserPerformanceBadge[] = [];

  constructor(private usersService: UsersService,
              private myUserService: MyUserService,
              private dialogRef: MatDialogRef<UserCreateModalComponent>,
              private groupsService: GroupsService,
              private notificationsService: NotificationsService,
              private performanceBadgesService: PerformanceBadgesService) {
    this.dataSource = new MatTableDataSource(this.phoneNumbers);

    this.groups = this.groupsService.getGroups();
    this.remakeFreeAndJoinedList();
    this.groupsSubscription = this.groupsService.groupsChange.subscribe((value) => {
      this.groups = value;
      this.remakeFreeAndJoinedList();
    });

    this.hasPermissionToChangePermission = this.myUserService.hasPermission(Permissions.PERMISSION_ADMINISTRATION);

    const users = this.usersService.getUsersWithoutFetch();
    for (let i = 0; i < users.length; i++) {
      this.usernames.push(users[i].username);
    }
  }

  ngOnDestroy() {
    this.groupsSubscription.unsubscribe();
  }

  remakeFreeAndJoinedList() {
    this.free = [];
    this.joined = [];

    for (let i = 0; i < this.groups.length; i++) {
      const group = this.groups[i];

      const groupObject = {
        'id': group.id,
        'name': group.name,
        'type': 'parentgroup'
      };

      this.free.push(groupObject);

      for (let j = 0; j < group.getSubgroups().length; j++) {
        const subgroup = group.getSubgroups()[j];

        const subgroupObject = {
          'id': subgroup.id,
          'name': subgroup.name,
          'type': 'subgroup',
          'group_id': group.id,
          'group_name': group.name
        };

        this.free.push(subgroupObject);
      }
    }

    setTimeout(function () {
      // Check if elements are not null because if the user close the modal before the timeout, there will be thrown an error
      if (document.getElementById('joined-list') != null && document.getElementById('free-list') != null) {
        document.getElementById('joined-list').style.height = document.getElementById('free-list').clientHeight.toString() + 'px';
        console.log('Free height:' + document.getElementById('free-list').clientHeight);
        console.log('Joined height:' + document.getElementById('joined-list').clientHeight);
      }
    }, 1000);
  }

  onUsernameChange(usernameModel) {
    usernameModel.control.setErrors(null);
    for (let i = 0; i < this.usernames.length; i++) {
      if (this.usernames[i] === usernameModel.viewModel) {
        console.log('in | ' + this.usernames[i] + ' | ' + usernameModel.viewModel);
        usernameModel.control.setErrors({'alreadyTaken': true});
        break;
      }
    }
    if (usernameModel.viewModel.length === 0) {
      usernameModel.control.setErrors({'null': true});
    }
  }

  onEmailAddressChanged(emailAddresses: string[]) {
    this.emailAddresses = emailAddresses;
  }

  onFreeChange(free: any[]) {
    this.free = free;
  }

  onJoinedChange(joined: any[]) {
    this.joined = joined;
  }

  onUserPerformanceBadgesChange(userPerformanceBadges: UserPerformanceBadge[]) {
    this.userPerformanceBadges = userPerformanceBadges;
  }

  onPhoneNumbersChanged(phoneNumbers: PhoneNumber[]) {
    this.phoneNumbers = phoneNumbers;
  }

  onPermissionsChange(permissions: string[]) {
    this.permissions = permissions;
  }

  create(form: NgForm) {
    this.dialogRef.close();

    const title = form.controls.title.value;
    const username = form.controls.username.value;
    const firstname = form.controls.firstname.value;
    const surname = form.controls.surname.value;
    const streetname = form.controls.streetname.value;
    const streetnumber = form.controls.streetnumber.value;
    const zipcode = form.controls.zipcode.value;
    const location = form.controls.location.value;
    const activity = form.controls.activity.value;
    let activated = form.controls.activated.value;

    if (activated.toString().length === 0) {
      activated = false;
    }

    const birthdayformatted = Converter.getDateFormatted(this.birthday);

    const join_dateformatted = Converter.getDateFormatted(this.join_date);

    console.log('create User | title: ' + title);
    console.log('create User | username: ' + username);
    console.log('create User | firstname: ' + firstname);
    console.log('create User | surname: ' + surname);
    console.log('create User | birthday: ' + birthdayformatted);
    console.log('create User | join_date: ' + join_dateformatted);
    console.log('create User | streetname: ' + streetname);
    console.log('create User | streetnumber: ' + streetnumber);
    console.log('create User | zipcode: ' + zipcode);
    console.log('create User | location: ' + location);
    console.log('create User | activity: ' + activity);
    console.log('create User | activated: ' + activated);

    const phoneNumbersObject = [];

    for (let i = 0; i < this.phoneNumbers.length; i++) {
      const phoneNumberObject = {
        'label': this.phoneNumbers[i].label,
        'number': this.phoneNumbers[i].phoneNumber
      };
      phoneNumbersObject.push(phoneNumberObject);
    }

    const userObject = {
      'title': title,
      'username': username,
      'firstname': firstname,
      'surname': surname,
      'birthday': birthdayformatted,
      'join_date': join_dateformatted,
      'streetname': streetname,
      'streetnumber': streetnumber,
      'zipcode': zipcode,
      'location': location,
      'activated': activated,
      'activity': activity,
      'email_addresses': this.emailAddresses,
      'phone_numbers': phoneNumbersObject,
      'permissions': this.permissions
    };
    console.log(userObject);

    this.usersService.addUser(userObject).subscribe(
      (data: any) => {
        console.log(data);

        console.log('create User | User created!');
        const userID = data.user.id;
        console.log('create User | Userid: ' + userID);

        if (this.joined.length > 0) {
          console.log('create User | Adding user to groups and subgroups');

          for (let i = 0; i < this.joined.length; i++) {
            const group = this.joined[i];

            if (group.type.includes('parentgroup')) {
              this.groupsService.addUserToGroup(userID, group.id).subscribe(
                (sdata: any) => {
                  console.log(sdata);
                },
                (error) => console.log(error)
              );
            } else {
              this.groupsService.addUserToSubgroup(userID, group.id).subscribe(
                (sdata: any) => {
                  console.log(sdata);
                },
                (error) => console.log(error)
              );
            }
          }
        }

        if (this.userPerformanceBadges.length > 0) {
          console.log('create User | Adding performance badges');

          for (let i = 0; i < this.userPerformanceBadges.length; i++) {
            this.performanceBadgesService.addUserHasPerformanceBadgeWithInstrument(userID, this.userPerformanceBadges[i]).subscribe(
              (sdata: any) => {
                console.log(sdata);
              },
              (error) => console.log(error)
            );
          }
        }

        this.usersService.fetchUsers();
        this.notificationsService.html(this.successfullyCreatedUser, NotificationType.Success, null, 'success');
      },
      (error) => {
        console.log(error);
        this.usersService.fetchUsers();
      }
    );
  }
}
