import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from '../../../../utils/http.service';
import {Converter} from '../../../../utils/helper/Converter';

import {UserChange} from '../models/userChange.model';

@Injectable({
  providedIn: 'root',
})
export class UsersChangesService {
  private _userChanges: UserChange[] = [];
  public userChangesChange: Subject<UserChange[]> = new Subject<UserChange[]>();

  private _searchedUserChanges: UserChange[] = [];
  public searchedUserChanges: Subject<UserChange[]> = new Subject<UserChange[]>();

  constructor(private httpService: HttpService) {}

  public getUserChanges(page: number = 0): UserChange[] {
    this.fetchUserChanges(page);
    return this._userChanges.slice();
  }

  private fetchUserChanges(page: number) {
    this.httpService.loggedInV1GETRequest('/management/changes/users/' + page + '/35', 'getUserChanges').subscribe(
      (response: any) => {
        console.log(response);
        const users = [];

        for (const userChange of response.user_changes) {
          users.push(
            new UserChange(
              userChange.id,
              userChange.user_id,
              userChange.user_name,
              userChange.editor_id,
              userChange.editor_name,
              Converter.getIOSDate(userChange.created_at),
              userChange.property,
              userChange.old_value,
              userChange.new_value
            )
          );
        }
        this.setUserChanges(users);
      },
      (error) => console.log(error)
    );
  }

  private setUserChanges(userChanges: UserChange[]) {
    this._userChanges = userChanges;
    this.userChangesChange.next(this._userChanges.slice());
  }

  public searchUserChanges(search: string): UserChange[] {
    this.fetchSearchUserChanges(search);
    return this._searchedUserChanges.slice();
  }

  private fetchSearchUserChanges(search: string) {
    const dto = {
      search,
    };
    this.httpService.loggedInV1POSTRequest('/management/changes/users/search', dto, 'fetchSearchUserChanges').subscribe(
      (response: any) => {
        console.log(response);
        const users = [];

        for (const userChange of response.user_changes) {
          users.push(
            new UserChange(
              userChange.id,
              userChange.user_id,
              userChange.user_firstname + ' ' + userChange.user_surname,
              userChange.editor_id,
              userChange.editor_firstname + ' ' + userChange.editor_surname,
              Converter.getIOSDate(userChange.created_at),
              userChange.property,
              userChange.old_value,
              userChange.new_value
            )
          );
        }
        this.setSearchedUserChanges(users);
      },
      (error) => console.log(error)
    );
  }

  private setSearchedUserChanges(userChanges: UserChange[]) {
    this._searchedUserChanges = userChanges;
    this.searchedUserChanges.next(this._searchedUserChanges.slice());
  }

  public deleteUserChange(userChangeId: number) {
    return this.httpService.loggedInV1DELETERequest('/management/changes/users/' + userChangeId, 'deleteUserChange');
  }
}
