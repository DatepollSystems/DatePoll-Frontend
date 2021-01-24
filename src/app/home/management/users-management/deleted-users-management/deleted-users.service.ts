import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from '../../../../utils/http.service';
import {Converter} from '../../../../utils/helper/Converter';

import {DeletedUser} from './deletedUser.model';

@Injectable({
  providedIn: 'root',
})
export class DeletedUsersService {
  private _deletedUsers: DeletedUser[] = [];
  public deletedUserChange: Subject<DeletedUser[]> = new Subject<DeletedUser[]>();

  constructor(private httpService: HttpService) {}

  public getDeletedUsers(): DeletedUser[] {
    this.fetchDeletedUsers();
    return this._deletedUsers.slice();
  }

  private fetchDeletedUsers() {
    this.httpService.loggedInV1GETRequest('/management/deleted/users', 'getDeletedUsers').subscribe(
      (response: any) => {
        console.log(response);
        const users = [];
        for (const user of response.users) {
          users.push(
            new DeletedUser(
              user.id,
              user.firstname,
              user.surname,
              Converter.getIOSDate(user.join_date),
              user.internal_comment,
              Converter.getIOSDate(user.created_at)
            )
          );
        }
        this.setDeletedUsers(users);
      },
      (error) => console.log(error)
    );
  }

  public setDeletedUsers(deletedUsers: DeletedUser[]) {
    this._deletedUsers = deletedUsers;
    this.deletedUserChange.next(this._deletedUsers.slice());
  }

  public deleteAllDeletedUsers() {
    return this.httpService.loggedInV1DELETERequest('/management/deleted/users', 'deleteAllDeletedUsers');
  }
}
