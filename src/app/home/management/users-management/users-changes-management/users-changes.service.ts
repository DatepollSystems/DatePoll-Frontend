import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from '../../../../utils/http.service';
import {Converter} from '../../../../utils/converter';

import {UserChange} from './userChange.model';

@Injectable({
  providedIn: 'root',
})
export class UsersChangesService {
  private _userChanges: UserChange[] = [];
  public userChangesChange: Subject<UserChange[]> = new Subject<UserChange[]>();

  constructor(private httpService: HttpService) {}

  public getUserChanges(): UserChange[] {
    this.fetchUserChanges();
    return this._userChanges.slice();
  }

  private fetchUserChanges() {
    this.httpService.loggedInV1GETRequest('/management/changes/users', 'getUserChanges').subscribe(
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
}
