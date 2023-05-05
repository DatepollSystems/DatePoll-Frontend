import {Component, Inject, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';

import {Converter} from '../../../../utils/helper/Converter';
import {MyUserService} from '../../../my-user.service';
import {GroupsService} from '../../groups-management/groups.service';
import {BadgesService} from '../../performance-badges-management/badges.service';
import {PerformanceBadgesService} from '../../performance-badges-management/performance-badges.service';
import {IsMobileService} from '../../../../utils/is-mobile.service';
import {UsersService} from '../users.service';

import {Permissions} from '../../../../permissions';
import {
  GroupAndSubgroupModel,
  GroupType
} from '../../../../utils/shared-components/group-and-subgroup-type-input-select/groupAndSubgroup.model';
import {PhoneNumber} from '../models/phoneNumber.model';
import {UserBadge} from '../models/userBadge.model';
import {User} from '../models/user.model';
import {UserPerformanceBadge} from '../models/userPerformanceBadge.model';
import {NotificationService} from '../../../../utils/notification.service';

@Component({
  selector: 'app-user-update-modal',
  templateUrl: './user-update-modal.component.html',
  styleUrls: ['./user-update-modal.component.css'],
})
export class UserUpdateModalComponent implements OnDestroy {
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
  govMember: string;
  bvUser?: string;
  bvPassword?: string;
  memberNumber: string;
  activated: boolean;
  internalComment: string;
  informationDenied: boolean;

  phoneNumbers: PhoneNumber[] = [];

  hasPermissionToChangePermission = false;
  permissions: string[] = [];

  joinedCopy: GroupAndSubgroupModel[] = [];
  joined: GroupAndSubgroupModel[] = [];
  joinedSubscription: Subscription;

  freeCopy: GroupAndSubgroupModel[] = [];
  free: GroupAndSubgroupModel[] = [];
  freeSubscription: Subscription;

  userPerformanceBadgeCount = 0;
  userPerformanceBadgesCopy: UserPerformanceBadge[];
  userPerformanceBadges: UserPerformanceBadge[];
  userPerformanceBadgesSubscription: Subscription;

  userBadges: UserBadge[];
  userBadgesCopy: UserBadge[];
  userBadgesSubscription: Subscription;

  isMobile = false;
  isMobileSubscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserUpdateModalComponent>,
    private myUserService: MyUserService,
    private groupsService: GroupsService,
    private usersService: UsersService,
    private performanceBadgesService: PerformanceBadgesService,
    private badgesService: BadgesService,
    private notificationService: NotificationService,
    private isMobileService: IsMobileService
  ) {
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
    this.memberNumber = this.user.memberNumber;
    this.activated = this.user.activated;
    this.govMember = this.user.govMember;
    this.bvUser = this.user.bvUser;
    this.bvPassword = this.user.bvPassword;
    this.internalComment = this.user.internalComment;
    this.informationDenied = this.user.informationDenied;
    this.phoneNumbers = this.user.getPhoneNumbers();
    this.permissions = this.user.getPermissions();

    this.joined = this.usersService.getJoinedOfUser(this.user.id);
    this.joinedCopy = this.joined.slice();
    this.joinedSubscription = this.usersService.joinedGroupsChange.subscribe((value) => {
      this.joined = value;
      this.joinedCopy = this.joined.slice();
    });

    this.free = this.usersService.getFreeOfUser(this.user.id);
    this.freeCopy = this.free.slice();
    this.freeSubscription = this.usersService.freeGroupsChange.subscribe((value) => {
      this.free = value;
      this.freeCopy = this.free.slice();
    });

    this.userPerformanceBadges = this.performanceBadgesService.getUserPerformanceBadges(this.user.id);
    this.userPerformanceBadgesCopy = this.userPerformanceBadges.slice();
    for (const performanceBadge of this.userPerformanceBadges) {
      if (this.userPerformanceBadgeCount <= performanceBadge.id) {
        this.userPerformanceBadgeCount = performanceBadge.id + 1;
      }
    }
    this.userPerformanceBadgesSubscription = this.performanceBadgesService.userPerformanceBadgesChange.subscribe((value) => {
      this.userPerformanceBadges = value;
      this.userPerformanceBadgesCopy = this.userPerformanceBadges.slice();
      for (const performanceBadge of this.userPerformanceBadges) {
        if (this.userPerformanceBadgeCount <= performanceBadge.id) {
          this.userPerformanceBadgeCount = performanceBadge.id + 1;
        }
      }
    });

    this.hasPermissionToChangePermission = this.myUserService.hasPermission(Permissions.MANAGEMENT_EXTRA_USER_PERMISSIONS);

    const users = this.usersService.getUsersWithoutFetch();
    for (const user of users) {
      this.usernames.push(user.username);
    }

    this.userBadges = this.badgesService.getUserBadges(this.user.id);
    this.userBadgesCopy = this.userBadges.slice();
    this.userBadgesSubscription = this.badgesService.userBadgesChange.subscribe((value) => {
      this.userBadges = value;
      this.userBadgesCopy = this.userBadges.slice();
    });

    this.isMobile = this.isMobileService.getIsMobile();
    this.isMobileSubscription = this.isMobileService.isMobileChange.subscribe((value) => {
      this.isMobile = value;
    });
  }

  ngOnDestroy() {
    this.joinedSubscription.unsubscribe();
    this.freeSubscription.unsubscribe();
    this.userPerformanceBadgesSubscription.unsubscribe();
    this.isMobileSubscription.unsubscribe();
  }

  changePassword(form: NgForm) {
    const password = form.controls.password.value;
    const passwordRepeat = form.controls.password_repeat.value;

    if (password !== passwordRepeat) {
      this.notificationService.info('SIGNIN_PASSWORD_ARE_NOT_EQUAL');
      return;
    }

    form.reset();
    this.usersService.changePasswordForUser(this.user.id, password).subscribe(
      (response: any) => {
        console.log(response);
        this.notificationService.info('MANAGEMENT_USERS_UPDATE_USER_MODAL_PASSWORD_CHANGE_SUCCESSFUL');
      },
      (error) => console.log(error)
    );
  }

  onUsernameChange(usernameModel) {
    usernameModel.control.setErrors(null);
    for (const username of this.usernames) {
      if (username === usernameModel.viewModel) {
        if (usernameModel.viewModel !== this.usernameCopy) {
          console.log('in | ' + username + ' | ' + usernameModel.viewModel);
          usernameModel.control.setErrors({alreadyTaken: true});
          break;
        }
      }
    }
    if (usernameModel.viewModel.length === 0) {
      usernameModel.control.setErrors({null: true});
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

  onUserBadgesChange(badges: UserBadge[]) {
    this.userBadges = badges;
  }

  async update(form: NgForm) {
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
    const internalComment = form.controls.internalComment.value;
    const memberNumber = form.controls.memberNumber.value;
    const bvUser = form.controls.bvUser.value;
    const bvPassword = form.controls.bvPassword.value;
    let activated = form.controls.activated.value;
    const informationDenied = form.controls.informationDenied.value;

    if (activated.toString().length === 0) {
      activated = false;
    }

    const birthdayformatted = Converter.getDateFormatted(this.birthday);
    const join_dateformatted = Converter.getDateFormatted(this.join_date);

    const phoneNumbersObject = [];
    for (const phoneNumber of this.phoneNumbers) {
      const phoneNumberObject = {
        label: phoneNumber.label,
        number: phoneNumber.phoneNumber,
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
      bv_member: this.govMember,
      bv_user: bvUser,
      bv_password: bvPassword,
      information_denied: informationDenied,
      member_number: memberNumber,
      internal_comment: internalComment,
      email_addresses: this.emailAddresses,
      phone_numbers: phoneNumbersObject,
      permissions: this.permissions,
    };
    console.log(userObject);

    this.usersService.updateUser(this.user.id, userObject).subscribe(
      (data: any) => {
        console.log(data);

        const users = this.usersService.getUsersWithoutFetch();

        const index = users.indexOf(this.user);
        if (index > -1) {
          users.splice(index, 1);
        }
        this.user = this.usersService.fetchUserCreateLocalUser(data.user);
        users.splice(index, 0, this.user);

        this.usersService.setUsers(users);

        this.notificationService.info('MANAGEMENT_USERS_UPDATE_USER_MODAL_SUCCESSFULLY_UPDATED_USER');
      },
      (error) => {
        console.log(error);
        this.usersService.fetchUsers();
      }
    );

    /* Performance badges **/
    for (const userPerformanceBadge of this.userPerformanceBadges) {
      let toUpdate = true;

      for (const userPerformanceBadgeCopy of this.userPerformanceBadgesCopy) {
        if (userPerformanceBadge.id === userPerformanceBadgeCopy.id) {
          toUpdate = false;
          console.log(
            'performanceBadges | toAdd | false | ' + userPerformanceBadge.performanceBadgeName + ' | ' + userPerformanceBadge.instrumentName
          );
          break;
        }
      }

      if (toUpdate) {
        console.log(
          'performanceBadges | toAdd | true | ' + userPerformanceBadge.performanceBadgeName + ' | ' + userPerformanceBadge.instrumentName
        );
        this.performanceBadgesService.addUserHasPerformanceBadgeWithInstrument(this.user.id, userPerformanceBadge).subscribe(
          (data: any) => console.log(data),
          (error) => console.log(error)
        );
      }
    }

    for (const userPerformanceBadgeCopy of this.userPerformanceBadgesCopy) {
      let toDelete = true;

      for (const userPerformanceBadge of this.userPerformanceBadges) {
        if (userPerformanceBadgeCopy.id === userPerformanceBadge.id) {
          toDelete = false;
          console.log(
            'performanceBadges | toDelete | false | ' +
              userPerformanceBadge.performanceBadgeName +
              ' | ' +
              userPerformanceBadge.instrumentName
          );
          break;
        }
      }

      if (toDelete) {
        console.log(
          'performanceBadges | toDelete | true | ' +
            userPerformanceBadgeCopy.performanceBadgeName +
            ' | ' +
            userPerformanceBadgeCopy.instrumentName
        );
        this.performanceBadgesService.removeUserHasPerformanceBadgeWithInstrument(userPerformanceBadgeCopy.id).subscribe(
          (data: any) => console.log(data),
          (error) => console.log(error)
        );
      }
    }

    /* Badges **/
    for (const badge of this.userBadges) {
      let toUpdate = true;

      for (const badgeCopy of this.userBadgesCopy) {
        if (badge.id === badgeCopy.id) {
          toUpdate = false;
          console.log('badge | toAdd | false | ' + badge.description + ' | ' + badge.getDate + ' | ' + badge.reason);
          break;
        }
      }

      if (toUpdate) {
        console.log('badge | toAdd | true | ' + badge.description + ' | ' + badge.getDate + ' | ' + badge.reason);
        this.badgesService.addBadgeToUser(badge.description, badge.getDate, badge.reason, this.user.id).subscribe(
          (data: any) => console.log(data),
          (error) => console.log(error)
        );
      }
    }

    for (const badgeCopy of this.userBadgesCopy) {
      let toDelete = true;

      for (const badge of this.userBadges) {
        if (badgeCopy.id === badge.id) {
          toDelete = false;
          console.log('performanceBadges | toDelete | false | ' + badge.description + ' | ' + badge.getDate + ' | ' + badge.reason);
          break;
        }
      }

      if (toDelete) {
        console.log(
          'performanceBadges | toDelete | true | ' + badgeCopy.description + ' | ' + badgeCopy.getDate + ' | ' + badgeCopy.reason
        );
        this.badgesService.removeBadgeFromUser(badgeCopy.id).subscribe(
          (data: any) => console.log(data),
          (error) => console.log(error)
        );
      }
    }

    /* Groups and subgroups **/
    for (const group of this.joined) {
      if (group.type === GroupType.PARENTGROUP) {
        let toUpdate = true;

        for (const joinedCopy of this.joinedCopy) {
          if (group.type === joinedCopy.type) {
            if (group.id === joinedCopy.id) {
              toUpdate = false;
              console.log('toUpdate | joined | false | ' + group.name + ' | ' + joinedCopy.name);
              break;
            }
          }
        }

        if (toUpdate) {
          console.log('toUpdate | joined | true | ' + group.name);

          this.groupsService.addUserToGroup(this.user.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        }
      }
    }

    await sleep(200);

    for (const group of this.joined) {
      if (group.type === GroupType.SUBGROUP) {
        let toUpdate = true;

        for (const joinedCopy of this.joinedCopy) {
          if (group.type === joinedCopy.type) {
            if (group.id === joinedCopy.id) {
              toUpdate = false;
              console.log('toUpdate | joined | false | ' + group.name + ' | ' + joinedCopy.name);
              break;
            }
          }
        }

        if (toUpdate) {
          console.log('toUpdate | joined | true | ' + group.name);

          this.groupsService.addUserToSubgroup(this.user.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        }
      }
    }

    for (const group of this.free) {
      if (group.type === GroupType.PARENTGROUP) {
        let toUpdate = true;

        for (const freeCopy of this.freeCopy) {
          if (group.type === freeCopy.type) {
            if (group.id === freeCopy.id) {
              toUpdate = false;
              console.log('toUpdate | free | false | ' + group.name + ' | ' + freeCopy.name);
              break;
            }
          }
        }

        if (toUpdate) {
          console.log('toUpdate | free | true | ' + group.name);

          this.groupsService.removeUserFromGroup(this.user.id, group.id).subscribe(
            (data: any) => {
              console.log(data);
            },
            (error) => console.log(error)
          );
        }
      }
    }

    await sleep(200);

    for (const group of this.free) {
      if (group.type === GroupType.SUBGROUP) {
        let toUpdate = true;

        for (const freeCopy of this.freeCopy) {
          if (group.type === freeCopy.type) {
            if (group.id === freeCopy.id) {
              toUpdate = false;
              console.log('toUpdate | free | false | ' + group.name + ' | ' + freeCopy.name);
              break;
            }
          }
        }

        if (toUpdate) {
          console.log('toUpdate | free | true | ' + group.name);
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

async function sleep(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec * 2));
}
