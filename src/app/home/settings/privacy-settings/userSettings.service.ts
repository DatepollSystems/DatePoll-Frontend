import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from '../../../utils/http.service';
import {NotificationService} from '../../../utils/notification.service';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  public showBirthdayChange: Subject<boolean> = new Subject<boolean>();
  private _showBirthday = true;

  public shareMovieWorkerPhoneNumberChange: Subject<boolean> = new Subject<boolean>();
  private _shareMovieWorkerPhoneNumber = true;

  public showMoviesInCalendarChange: Subject<boolean> = new Subject<boolean>();
  private _showMoviesInCalendar = true;

  public showEventsInCalendarChange: Subject<boolean> = new Subject<boolean>();
  private _showEventsInCalendar = true;

  public showBirthdaysInCalendarChange: Subject<boolean> = new Subject<boolean>();
  private _showBirthdaysInCalendar = true;

  public notifyMeOnNewEventViaEmailChange: Subject<boolean> = new Subject<boolean>();
  private _notifyMeOnNewEventViaEmail = false;

  public notifyMeViaEmailOnBroadcastChange: Subject<boolean> = new Subject<boolean>();
  private _notifyMeViaEmailOnBroadcast = true;

  constructor(private httpService: HttpService, private notificationService: NotificationService) {}

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

  public setShareMovieWorkerPhoneNumber(shareMovieWorkerPhoneNumber: boolean, saveInCloud = false) {
    this._shareMovieWorkerPhoneNumber = shareMovieWorkerPhoneNumber;
    this.shareMovieWorkerPhoneNumberChange.next(this._shareMovieWorkerPhoneNumber);
    if (saveInCloud) {
      this.setSettingsRequest('shareMovieWorkerPhoneNumber', this._shareMovieWorkerPhoneNumber);
    }
  }

  public getShareMovieWorkerPhoneNumber(): boolean {
    this.fetchShareMovieWorkerPhoneNumber();
    return this._shareMovieWorkerPhoneNumber;
  }

  private fetchShareMovieWorkerPhoneNumber() {
    this.httpService.loggedInV1GETRequest('/user/myself/settings/shareMovieWorkerPhoneNumber').subscribe(
      (response: any) => {
        console.log(response);
        this.setShareMovieWorkerPhoneNumber(response.setting_value);
      },
      (error) => console.log(error)
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
      (error) => console.log(error)
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
      (error) => console.log(error)
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
      (error) => console.log(error)
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
      (error) => console.log(error)
    );
  }

  public setNotifyMeViaEmailOnBroadcast(notifyMeViaEmailOnBroadcast: boolean, saveInCloud = false) {
    this._notifyMeViaEmailOnBroadcast = notifyMeViaEmailOnBroadcast;
    this.notifyMeViaEmailOnBroadcastChange.next(this._notifyMeViaEmailOnBroadcast);
    if (saveInCloud) {
      this.setSettingsRequest('notifyMeViaEmailOnBroadcast', this._notifyMeViaEmailOnBroadcast);
    }
  }

  public getNotifyMeViaEmailOnBroadcast(): boolean {
    this.fetchNotifyMeViaEmailOnBroadcast();
    return this._notifyMeViaEmailOnBroadcast;
  }

  private fetchNotifyMeViaEmailOnBroadcast() {
    this.httpService.loggedInV1GETRequest('/user/myself/settings/notifyMeViaEmailOnBroadcast').subscribe(
      (response: any) => {
        console.log(response);
        this.setNotifyMeViaEmailOnBroadcast(response.setting_value);
      },
      (error) => console.log(error)
    );
  }

  private setSettingsRequest(url: string, value: boolean) {
    const body = {
      setting_value: value,
    };
    this.httpService.loggedInV1POSTRequest('/user/myself/settings/' + url, body, 'setSettingsRequest').subscribe(
      (response: any) => {
        console.log(response);
        this.notificationService.info('SETTINGS_SECURITY_MODAL_SETTINGS_SAVE_SUCCESS');
      },
      (error) => console.log(error)
    );
  }
}
