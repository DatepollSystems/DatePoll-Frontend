import {Component, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';

import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {Converter} from '../../../../utils/converter';
import {MyUserService} from '../../../my-user.service';
import {GroupsService} from '../../groups-management/groups.service';
import {BadgesService} from '../../performance-badges-management/badges.service';
import {PerformanceBadgesService} from '../../performance-badges-management/performance-badges.service';
import {UsersService} from '../users.service';

import {Permissions} from '../../../../permissions';
import {GroupAndSubgroupModel, GroupType} from '../../../../utils/models/groupAndSubgroup.model';
import {PhoneNumber} from '../../../phoneNumber.model';
import {UserBadge} from '../badges-list/userBadge.model';
import {UserPerformanceBadge} from '../userPerformanceBadge.model';

@Component({
  selector: 'app-user-create-modal',
  templateUrl: './user-create-modal.component.html',
  styleUrls: ['./user-create-modal.component.css']
})
export class UserCreateModalComponent implements OnDestroy {
  usernames: string[] = [];

  emailAddresses: string[] = [];
  birthday: Date;
  join_date: Date;
  phoneNumbers: PhoneNumber[] = [];

  groupsSubscription: Subscription;
  joined: GroupAndSubgroupModel[] = [];
  free: GroupAndSubgroupModel[] = [];

  hasPermissionToChangePermission = false;
  permissions: string[] = [];

  userPerformanceBadges: UserPerformanceBadge[] = [];
  userBadges: UserBadge[] = [];

  constructor(
    private usersService: UsersService,
    private myUserService: MyUserService,
    private dialogRef: MatDialogRef<UserCreateModalComponent>,
    private groupsService: GroupsService,
    private badgesService: BadgesService,
    private notificationsService: NotificationsService,
    private translate: TranslateService,
    private performanceBadgesService: PerformanceBadgesService
  ) {
    this.free = this.groupsService.getGroupsAndSubgroups();
    this.joined = [];
    this.groupsSubscription = this.groupsService.groupsAndSubgroupsChange.subscribe(value => {
      this.free = value;
      this.joined = [];
    });

    this.hasPermissionToChangePermission = this.myUserService.hasPermission(Permissions.PERMISSION_ADMINISTRATION);

    const users = this.usersService.getUsersWithoutFetch();
    for (const user of users) {
      this.usernames.push(user.username);
    }
  }

  ngOnDestroy() {
    this.groupsSubscription.unsubscribe();
  }

  onUsernameChange(usernameModel) {
    usernameModel.control.setErrors(null);
    for (const username of this.usernames) {
      if (username === usernameModel.viewModel) {
        console.log('in | ' + username + ' | ' + usernameModel.viewModel);
        usernameModel.control.setErrors({alreadyTaken: true});
        break;
      }
    }
    if (usernameModel.viewModel.length === 0) {
      usernameModel.control.setErrors({null: true});
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

  onUserBadgesChange(badges: UserBadge[]) {
    this.userBadges = badges;
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
    const memberNumber = form.controls.memberNumber.value;
    const internalComment = form.controls.internalComment.value;
    let activated = form.controls.activated.value;
    const informationDenied = form.controls.informationDenied.value;
    const bvMember = form.controls.bvMember.value;

    if (activated.toString().length === 0) {
      activated = false;
    }

    const birthdayformatted = Converter.getDateFormatted(this.birthday);
    const join_dateformatted = Converter.getDateFormatted(this.join_date);

    const phoneNumbersObject = [];
    for (const phoneNumber of this.phoneNumbers) {
      const phoneNumberObject = {
        label: phoneNumber.label,
        number: phoneNumber.phoneNumber
      };
      phoneNumbersObject.push(phoneNumberObject);
    }

    const userObject = {
      title,
      username,
      firstname,
      surname,
      birthday: birthdayformatted,
      join_date: join_dateformatted,
      streetname,
      streetnumber,
      zipcode,
      location,
      activated,
      activity,
      bv_member: bvMember,
      information_denied: informationDenied,
      member_number: memberNumber,
      internal_comment: internalComment,
      email_addresses: this.emailAddresses,
      phone_numbers: phoneNumbersObject,
      permissions: this.permissions
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

          for (const group of this.joined) {
            if (group.type === GroupType.PARENTGROUP) {
              this.groupsService.addUserToGroup(userID, group.id).subscribe(
                (sdata: any) => {
                  console.log(sdata);
                },
                error => console.log(error)
              );
            }
          }

          for (const group of this.joined) {
            if (group.type === GroupType.SUBGROUP) {
              this.groupsService.addUserToSubgroup(userID, group.id).subscribe(
                (sdata: any) => {
                  console.log(sdata);
                },
                error => console.log(error)
              );
            }
          }
        }

        if (this.userPerformanceBadges.length > 0) {
          console.log('create User | Adding performance badges');

          for (const userPerformanceBadge of this.userPerformanceBadges) {
            this.performanceBadgesService.addUserHasPerformanceBadgeWithInstrument(userID, userPerformanceBadge).subscribe(
              (sdata: any) => console.log(sdata),
              error => console.log(error)
            );
          }
        }

        if (this.userBadges.length > 0) {
          console.log('create User | Adding badges');

          for (const badge of this.userBadges) {
            this.badgesService.addBadgeToUser(badge.description, badge.getDate, badge.reason, userID).subscribe(
              (sdata: any) => console.log(sdata),
              error => console.log(error)
            );
          }
        }
        const users = this.usersService.getUsersWithoutFetch();
        users.push(this.usersService.fetchUserCreateLocalUser(data.user));
        this.usersService.setUsers(users);
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('MANAGEMENT_USERS_CREATE_USER_MODAL_SUCCESSFULLY_CREATED_USER')
        );
      },
      error => {
        console.log(error);
        this.usersService.fetchUsers();
      }
    );
  }
}
