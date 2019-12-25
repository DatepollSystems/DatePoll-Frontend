import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';
import {HttpService} from '../../../services/http.service';
import {NotificationsService} from 'angular2-notifications';
import {TranslateService} from '../../../translation/translate.service';

@Injectable({
  providedIn: 'root'
})
export class PrivacySettingsService {

  public showBirthdayChange: Subject<boolean> = new Subject<boolean>();
  private _showBirthday = true;

  constructor(private httpService: HttpService, private notificationsService: NotificationsService, private translate: TranslateService) {
  }

  public setShowBirthday(showBirthday: boolean, saveInCloud = false) {
    this._showBirthday = showBirthday;
    this.showBirthdayChange.next(this._showBirthday);
    if (saveInCloud) {
      this.setSettingsRequest('shareBirthday', this._showBirthday);
    }
  }

  public getShowBirthday(): boolean {
    this.fetchShowBirthday();
    return this._showBirthday;
  }

  private fetchShowBirthday() {
    this.httpService.loggedInV1GETRequest('/user/myself/settings/shareBirthday').subscribe(
      (response: any) => {
        console.log(response);
        this.setShowBirthday(response.setting_value);
      },
      (error) => console.log(error)
    );
  }

  private setSettingsRequest(url: string, value: boolean) {
    const body = {
      'setting_value': value
    };
    this.httpService.loggedInV1POSTRequest('/user/myself/settings/' + url, body, 'setSettingsRequest').subscribe(
      (response: any) => {
        console.log(response);
        this.notificationsService.success(this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('SETTINGS_SECURITY_MODAL_SETTINGS_SAVE_SUCCESS'));
      },
      (error) => console.log(error)
    );
  }
}
