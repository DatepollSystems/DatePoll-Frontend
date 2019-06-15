import {Component, Inject, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';

import {NotificationsService, NotificationType} from 'angular2-notifications';

import {UsersService} from '../users.service';
import {GroupsService} from '../../groups-management/groups.service';
import {PerformanceBadgesService} from '../../performance-badges-management/performance-badges.service';
import {MyUserService} from '../../../my-user.service';

import {Permissions} from '../../../../permissions';
import {PhoneNumber} from '../../../phoneNumber.model';
import {User} from '../user.model';
import {UserPerformanceBadge} from '../userPerformanceBadge.model';

@Component({
  selector: 'app-user-update-modal',
  templateUrl: './user-update-modal.component.html',
  styleUrls: ['./user-update-modal.component.css']
})
export class UserUpdateModalComponent implements OnDestroy {

  @ViewChild('successfullyUpdatedUser', {static: true}) successfullyUpdatedUser: TemplateRef<any>;

  sendingRequest = false;

  usernames: string[] = [];

  user: User;

  title: string;
  firstname: string;
  surname: string;
  usernameCopy: string;
  username: string;
  emailAddresses: string[];
  birthday: Date;
  join_date: Date;

  streetname: string;
  streetnumber: string;
  zipcode: number;
  location: string;
  activity: string;
  activated: boolean;

  phoneNumbers: PhoneNumber[] = [];

  hasPermissionToChangePermission = false;
  permissions: string[] = [];

  joinedCopy: any[] = [];
  joined: any[] = [];
  joinedSubscription: Subscription;

  freeCopy: any[] = [];
  free: any[] = [];
  freeSubscription: Subscription;

  userPerformanceBadgeCount = 0;
  userPerformanceBadgesCopy: UserPerformanceBadge[];
  userPerformanceBadges: UserPerformanceBadge[];
  userPerformanceBadgesSubscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserUpdateModalComponent>,
    private myUserService: MyUserService,
    private groupsService: GroupsService,
    private usersService: UsersService,
    private performanceBadgesService: PerformanceBadgesService,
    private notificationsService: NotificationsService) {

    this.user = data.user;
    this.title = this.user.title;
    this.username = this.user.username;
    this.usernameCopy = this.user.username;
    this.emailAddresses = this.user.getEmailAddresses();
    this.firstname = this.user.firstname;
    this.surname = this.user.surname;
    this.birthday = this.user.birthday;
    this.join_date = this.user.join_date;
    this.streetname = this.user.streetname;
    this.streetnumber = this.user.streetnumber;
    this.zipcode = this.user.zipcode;
    this.location = this.user.location;
    this.activity = this.user.activity;
    this.activated = this.user.activated;
    this.phoneNumbers = this.user.getPhoneNumbers();
    this.permissions = this.user.getPermissions();

    this.joined = this.usersService.getJoinedOfUser(this.user.id);
    this.joinedCopy = this.joined.slice();
    this.joinedSubscription = this.usersService.joinedGroupsChange.subscribe((value) => {
      this.joined = value;
      this.joinedCopy = this.joined.slice();

      setTimeout(function () {
        document.getElementById('joined-list').style.height = document.getElementById('free-list').clientHeight.toString() + 'px';
        console.log('Free height:' + document.getElementById('free-list').clientHeight);
        console.log('Joined height:' + document.getElementById('joined-list').clientHeight);
      }, 1000);
    });

    this.free = this.usersService.getFreeOfUser(this.user.id);
    this.freeCopy = this.free.slice();
    this.freeSubscription = this.usersService.freeGroupsChange.subscribe((value) => {
      this.free = value;
      this.freeCopy = this.free.slice();

      setTimeout(function () {
        document.getElementById('free-list').style.height = document.getElementById('joined-list').clientHeight.toString() + 'px';
        console.log('Free height:' + document.getElementById('free-list').clientHeight);
        console.log('Joined height:' + document.getElementById('joined-list').clientHeight);
      }, 1000);
    });

    this.userPerformanceBadges = this.performanceBadgesService.getUserPerformanceBadges(this.user.id);
    this.userPerformanceBadgesCopy = this.userPerformanceBadges.slice();
    for (let i = 0; i < this.userPerformanceBadges.length; i++) {
      if (this.userPerformanceBadgeCount <= this.userPerformanceBadges[i].id) {
        this.userPerformanceBadgeCount = this.userPerformanceBadges[i].id + 1;
      }
    }
    this.userPerformanceBadgesSubscription = this.performanceBadgesService.userPerformanceBadgesChange.subscribe((value) => {
      this.userPerformanceBadges = value;
      this.userPerformanceBadgesCopy = this.userPerformanceBadges.slice();
      for (let i = 0; i < this.userPerformanceBadges.length; i++) {
        if (this.userPerformanceBadgeCount <= this.userPerformanceBadges[i].id) {
          this.userPerformanceBadgeCount = this.userPerformanceBadges[i].id + 1;
        }
      }
    });

    this.hasPermissionToChangePermission = this.myUserService.hasPermission(Permissions.ROOT_ADMINISTRATION);

    const users = this.usersService.getUsers();
    for (let i = 0; i < users.length; i++) {
      this.usernames.push(users[i].username);
    }
  }

  ngOnDestroy() {
    this.joinedSubscription.unsubscribe();
    this.freeSubscription.unsubscribe();
    this.userPerformanceBadgesSubscription.unsubscribe();
  }

  onUsernameChange(usernameModel) {
    usernameModel.control.setErrors(null);
    for (let i = 0; i < this.usernames.length; i++) {
      if (this.usernames[i] === usernameModel.viewModel) {
        if (usernameModel.viewModel !== this.usernameCopy) {
          console.log('in | ' + this.usernames[i] + ' | ' + usernameModel.viewModel);
          usernameModel.control.setErrors({'alreadyTaken': true});
          break;
        }
      }
    }
  }

  onEmailAddressChanged(emailAddresses: string[]) {
    this.emailAddresses = emailAddresses;
  }

  onPhoneNumbersChanged(phoneNumbers: PhoneNumber[]) {
    this.phoneNumbers = phoneNumbers;
  }

  onUserPerformanceBadgesChange(userPerformanceBadges: UserPerformanceBadge[]) {
    this.userPerformanceBadges = userPerformanceBadges;
  }

  onFreeChange(free: any[]) {
    this.free = free;
  }

  onJoinedChange(joined: any[]) {
    this.joined = joined;
  }

  onPermissionsChange(permissions: string[]) {
    this.permissions = permissions;
  }

  update(form: NgForm) {
    this.sendingRequest = true;

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

    let d = new Date(this.birthday);
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    const birthdayformatted = [year, month, day].join('-');

    d = new Date(this.join_date);
    month = '' + (d.getMonth() + 1);
    day = '' + d.getDate();
    year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    const join_dateformatted = [year, month, day].join('-');

    console.log('update User | title: ' + title);
    console.log('update User | username: ' + username);
    console.log('update User | firstname: ' + firstname);
    console.log('update User | surname: ' + surname);
    console.log('update User | birthday: ' + birthdayformatted);
    console.log('update User | join_date: ' + join_dateformatted);
    console.log('update User | streetname: ' + streetname);
    console.log('update User | streetnumber: ' + streetnumber);
    console.log('update User | zipcode: ' + zipcode);
    console.log('update User | location: ' + location);
    console.log('update User | activity: ' + activity);
    console.log('update User | activated: ' + activated);

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
      'emailAddresses': this.emailAddresses,
      'phoneNumbers': phoneNumbersObject,
      'permissions': this.permissions
    };
    console.log(userObject);

    form.controls.title.disable();
    form.controls.username.disable();
    form.controls.firstname.disable();
    form.controls.surname.disable();
    form.controls.streetname.disable();
    form.controls.streetnumber.disable();
    form.controls.zipcode.disable();
    form.controls.location.disable();
    form.controls.activity.disable();
    form.controls.activated.disable();
    document.getElementById('addEmail-button').setAttribute('disabled', 'disabled');
    document.getElementById('datepicker-birthday').setAttribute('disabled', 'disabled');
    document.getElementById('datepicker-birthday-mobile').setAttribute('disabled', 'disabled');
    document.getElementById('datepicker-join_date').setAttribute('disabled', 'disabled');
    document.getElementById('datepicker-join_date-mobile').setAttribute('disabled', 'disabled');
    document.getElementById('addPhoneNumber-button').setAttribute('disabled', 'disabled');
    document.getElementById('phoneNumber').setAttribute('disabled', 'disabled');
    document.getElementById('label').setAttribute('disabled', 'disabled');
    document.getElementById('addPermission-button').setAttribute('disabled', 'disabled');
    document.getElementById('permission').setAttribute('disabled', 'disabled');
    document.getElementById('addPerformanceBadge-button').setAttribute('disabled', 'disabled');
    document.getElementById('datepicker-performanceBadge').setAttribute('disabled', 'disabled');
    document.getElementById('datepicker-performanceBadge-mobile').setAttribute('disabled', 'disabled');
    document.getElementById('performanceBadge-grade').setAttribute('disabled', 'disabled');
    document.getElementById('performanceBadge-note').setAttribute('disabled', 'disabled');

    this.dialogRef.close();

    this.usersService.updateUser(this.user.id, userObject).subscribe(
      (data: any) => {
        console.log(data);

        this.usersService.fetchUsers();
        this.notificationsService.html(this.successfullyUpdatedUser, NotificationType.Success, null, 'success');
      },
      (error) => {
        console.log(error);
        this.usersService.fetchUsers();
      }
    );

    /** Performance badges **/
    for (let i = 0; i < this.userPerformanceBadges.length; i++) {
      const userPerformanceBadge = this.userPerformanceBadges[i];

      let toUpdate = true;

      for (let j = 0; j < this.userPerformanceBadgesCopy.length; j++) {
        const userPerformanceBadgeCopy = this.userPerformanceBadgesCopy[j];
        if (userPerformanceBadge.id === userPerformanceBadgeCopy.id) {
          toUpdate = false;
          console.log('performanceBadges | toAdd | false | ' + userPerformanceBadge.performanceBadgeName + ' | '
            + userPerformanceBadge.instrumentName);
          break;
        }
      }

      if (toUpdate) {
        console.log('performanceBadges | toAdd | true | ' + userPerformanceBadge.performanceBadgeName + ' | '
          + userPerformanceBadge.instrumentName);
        this.performanceBadgesService.addUserHasPerformanceBadgeWithInstrument(this.user.id, userPerformanceBadge).subscribe(
          (data: any) => console.log(data),
          (error) => console.log(error)
        );
      }
    }

    for (let i = 0; i < this.userPerformanceBadgesCopy.length; i++) {
      const userPerformanceBadgeCopy = this.userPerformanceBadgesCopy[i];

      let toDelete = true;

      for (let j = 0; j < this.userPerformanceBadges.length; j++) {
        const userPerformanceBadge = this.userPerformanceBadges[j];
        if (userPerformanceBadgeCopy.id === userPerformanceBadge.id) {
          toDelete = false;
          console.log('performanceBadges | toDelete | false | ' + userPerformanceBadge.performanceBadgeName + ' | '
            + userPerformanceBadge.instrumentName);
          break;
        }
      }

      if (toDelete) {
        console.log('performanceBadges | toDelete | true | ' + userPerformanceBadgeCopy.performanceBadgeName + ' | '
          + userPerformanceBadgeCopy.instrumentName);
        this.performanceBadgesService.removeUserHasPerformanceBadgeWithInstrument(userPerformanceBadgeCopy.id).subscribe(
          (data: any) => console.log(data),
          (error) => console.log(error)
        );
      }
    }

    /** Groups and subgroups **/
    for (let i = 0; i < this.joined.length; i++) {
      const group = this.joined[i];

      let toUpdate = true;

      for (let j = 0; j < this.joinedCopy.length; j++) {
        if (group.type.includes(this.joinedCopy[j].type)) {
          if (group.id === this.joinedCopy[j].id) {
            toUpdate = false;
            console.log('toUpdate | joined | false | ' + group.name + ' | ' + this.joinedCopy[j].name);
            break;
          }
        }
      }

      if (toUpdate) {
        console.log('toUpdate | joined | true | ' + group.name);

        if (group.type.includes('parentgroup')) {
          this.groupsService.addUserToGroup(this.user.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        } else {
          this.groupsService.addUserToSubgroup(this.user.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        }
      }
    }

    for (let i = 0; i < this.free.length; i++) {
      const group = this.free[i];

      let toUpdate = true;

      for (let j = 0; j < this.freeCopy.length; j++) {
        if (group.type.includes(this.freeCopy[j].type)) {
          if (group.id === this.freeCopy[j].id) {
            toUpdate = false;
            console.log('toUpdate | free | false | ' + group.name + ' | ' + this.freeCopy[j].name);
            break;
          }
        }
      }

      if (toUpdate) {
        console.log('toUpdate | free | true | ' + group.name);

        if (group.type.includes('parentgroup')) {
          this.groupsService.removeUserFromGroup(this.user.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        } else {
          this.groupsService.removeUserFromSubgroup(this.user.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        }
      }
    }
  }
}
