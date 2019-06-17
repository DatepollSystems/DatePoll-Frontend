import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private httpService: HttpService, private router: Router) {
  }

  public showCinemaChange: Subject<boolean> = new Subject<boolean>();
  private _showCinema = true;

  public showEventsChange: Subject<boolean> = new Subject<boolean>();
  private _showEvents = true;

  public getShowCinema(): boolean {
    this.httpService.getSettingRequest('/cinema', 'settingsCinema').subscribe(
      (response: any) => {
        console.log(response);
        this.setShowCinema(response.enabled);
      },
      (error) => console.log(error)
    );

    return this._showCinema;
  }

  public setShowCinema(showCinema: boolean) {
    this._showCinema = showCinema;
    this.showCinemaChange.next(this._showCinema);
  }

  public setAdminShowCinema(showCinema: boolean) {
    this.setShowCinema(showCinema);

    const body = {
      'isEnabled': showCinema
    };

    this.httpService.setSettingsRequest('/cinema', body, 'setCinemaFeatureEnabled');
  }

  public checkShowCinema() {
    if (!this.getShowCinema()) {
      this.router.navigate(['/home']);
      return;
    }
  }

  public getShowEvents(): boolean {
    this.httpService.getSettingRequest('/events', 'settingsEvents').subscribe(
      (response: any) => {
        console.log(response);
        this.setShowEvents(response.enabled);
      },
      (error) => console.log(error)
    );

    return this._showEvents;
  }

  public setShowEvents(showEvents: boolean) {
    this._showEvents = showEvents;
    this.showEventsChange.next(this._showEvents);
  }

  public setAdminShowEvents(showEvents: boolean) {
    this.setShowEvents(showEvents);

    const body = {
      'isEnabled': showEvents
    };

    this.httpService.setSettingsRequest('/events', body, 'setEventsFeatureEnabled');
  }

  public checkShowEvents() {
    if (!this.getShowEvents()) {
      this.router.navigate(['/home']);
      return;
    }
  }
}
