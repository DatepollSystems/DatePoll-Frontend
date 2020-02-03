import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';
import {HttpService} from '../../../services/http.service';
import {NotificationsService} from 'angular2-notifications';
import {TranslateService} from '../../../translation/translate.service';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  public showBirthdayChange: Subject<boolean> = new Subject<boolean>();
  private _showBirthday = true;

  public showMoviesInCalendarChange: Subject<boolean> = new Subject<boolean>();
  private _showMoviesInCalendar = true;

  public showEventsInCalendarChange: Subject<boolean> = new Subject<boolean>();
  private _showEventsInCalendar = true;

  public showBirthdaysInCalendarChange: Subject<boolean> = new Subject<boolean>();
  private _showBirthdaysInCalendar = true;

  public notifyMeOnNewEventViaEmailChange: Subject<boolean> = new Subject<boolean>();
  private _notifyMeOnNewEventViaEmail = false;

  constructor(private httpService: HttpService, private notificationsService: NotificationsService, private translate: TranslateService) {}

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
      error => console.log(error)
    );
  }

  public setShowMoviesInCalendar(showMoviesInCalendar: boolean, saveInCloud = false) {
    this._showMoviesInCalendar = showMoviesInCalendar;
    this.showMoviesInCalendarChange.next(this._showMoviesInCalendar);
    if (saveInCloud) {
      this.setSettingsRequest('showMoviesInCalendar', this._showMoviesInCalendar);
    }
  }

  public getShowMoviesInCalendar(): boolean {
    this.fetchShowMoviesInCalendar();
    return this._showMoviesInCalendar;
  }

  private fetchShowMoviesInCalendar() {
    this.httpService.loggedInV1GETRequest('/user/myself/settings/showMoviesInCalendar').subscribe(
      (response: any) => {
        console.log(response);
        this.setShowMoviesInCalendar(response.setting_value);
      },
      error => console.log(error)
    );
  }

  public setShowEventsInCalendar(showEventsInCalendar: boolean, saveInCloud = false) {
    this._showEventsInCalendar = showEventsInCalendar;
    this.showEventsInCalendarChange.next(this._showEventsInCalendar);
    if (saveInCloud) {
      this.setSettingsRequest('showEventsInCalendar', this._showEventsInCalendar);
    }
  }

  public getShowEventsInCalendar(): boolean {
    this.fetchShowEventsInCalendar();
    return this._showEventsInCalendar;
  }

  private fetchShowEventsInCalendar() {
    this.httpService.loggedInV1GETRequest('/user/myself/settings/showEventsInCalendar').subscribe(
      (response: any) => {
        console.log(response);
        this.setShowEventsInCalendar(response.setting_value);
      },
      error => console.log(error)
    );
  }

  public setShowBirthdaysInCalendar(showBirthdaysInCalendar: boolean, saveInCloud = false) {
    this._showBirthdaysInCalendar = showBirthdaysInCalendar;
    this.showBirthdaysInCalendarChange.next(this._showBirthdaysInCalendar);
    if (saveInCloud) {
      this.setSettingsRequest('showBirthdaysInCalendar', this._showBirthdaysInCalendar);
    }
  }

  public getShowBirthdaysInCalendar(): boolean {
    this.fetchShowBirthdaysInCalendar();
    return this._showBirthdaysInCalendar;
  }

  private fetchShowBirthdaysInCalendar() {
    this.httpService.loggedInV1GETRequest('/user/myself/settings/showBirthdaysInCalendar').subscribe(
      (response: any) => {
        console.log(response);
        this.setShowBirthdaysInCalendar(response.setting_value);
      },
      error => console.log(error)
    );
  }

  public setNotifyMeOnNewEventViaEmail(notifyMeOnNewEventViaEmail: boolean, saveInCloud = false) {
    this._notifyMeOnNewEventViaEmail = notifyMeOnNewEventViaEmail;
    this.notifyMeOnNewEventViaEmailChange.next(this._notifyMeOnNewEventViaEmail);
    if (saveInCloud) {
      this.setSettingsRequest('notifyMeOfNewEvents', this._notifyMeOnNewEventViaEmail);
    }
  }

  public getNotifyMeOnNewEventViaEmail(): boolean {
    this.fetchNotifyMeOnNewEventViaEmail();
    return this._notifyMeOnNewEventViaEmail;
  }

  private fetchNotifyMeOnNewEventViaEmail() {
    this.httpService.loggedInV1GETRequest('/user/myself/settings/notifyMeOfNewEvents').subscribe(
      (response: any) => {
        console.log(response);
        this.setNotifyMeOnNewEventViaEmail(response.setting_value);
      },
      error => console.log(error)
    );
  }

  private setSettingsRequest(url: string, value: boolean) {
    const body = {
      setting_value: value
    };
    this.httpService.loggedInV1POSTRequest('/user/myself/settings/' + url, body, 'setSettingsRequest').subscribe(
      (response: any) => {
        console.log(response);
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('SETTINGS_SECURITY_MODAL_SETTINGS_SAVE_SUCCESS')
        );
      },
      error => console.log(error)
    );
  }
}
