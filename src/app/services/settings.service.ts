import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public showCinemaChange: Subject<boolean> = new Subject<boolean>();
  public showEventsChange: Subject<boolean> = new Subject<boolean>();
  public communityNameChange: Subject<string> = new Subject<string>();
  public communityUrlChange: Subject<string> = new Subject<string>();
  public openWeatherMapKeyChange: Subject<string> = new Subject<string>();
  public openWeatherMapCinemaCityIdChange: Subject<string> = new Subject<string>();
  private _showCinema = true;
  private _showEvents = true;
  private _communityName = 'DatePoll Web';
  private _communityUrl = 'https://datepoll.dafnik.me';
  private _openWeatherMapKey = '';
  private _openWeatherMapCinemaCityId = '';

  constructor(private httpService: HttpService, private router: Router) {
  }

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

  public setAdminShowCinema(showCinema: boolean) {
    this.setShowCinema(showCinema);

    const body = {
      'isEnabled': showCinema
    };

    this.httpService.setSettingsRequest('/cinema', body, 'setCinemaFeatureEnabled').subscribe(
      (response: any) => {
        console.log(response);
      },
      (error) => console.log(error)
    );
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

  public setAdminShowEvents(showEvents: boolean) {
    this.setShowEvents(showEvents);

    const body = {
      'isEnabled': showEvents
    };

    this.httpService.setSettingsRequest('/events', body, 'setEventsFeatureEnabled').subscribe(
      (response: any) => {
        console.log(response);
      },
      (error) => console.log(error)
    );
  }

  public getCommunityName(): string {
    this.httpService.getSettingRequest('/name', 'settingsCommunityName').subscribe(
      (response: any) => {
        console.log(response);
        this.setCommunityName(response.community_name);
      },
      (error) => console.log(error)
    );
    return this._communityName;
  }

  public setAdminCommunityName(communityName: string) {
    this.setCommunityName(communityName);

    const body = {
      'community_name': '"' + communityName + '"'
    };
    return this.httpService.setSettingsRequest('/name', body, 'setCommunityName');
  }

  public getCommunityUrl(): string {
    this.httpService.getSettingRequest('/url', 'settingsCommunityUrl').subscribe(
      (response: any) => {
        console.log(response);
        this.setCommunityUrl(response.community_url);
      },
      (error) => console.log(error)
    );
    return this._communityUrl;
  }

  public setAdminCommunityUrl(communityUrl: string) {
    this.setCommunityUrl(communityUrl);

    const body = {
      'community_url': '"' + communityUrl + '"'
    };
    return this.httpService.setSettingsRequest('/url', body, 'setCommunityUrl');
  }

  public getOpenWeatherMapKey(): string {
    this.httpService.getSettingRequest('/openweathermap/key', 'settingsOpenWeatherMapKey').subscribe(
      (response: any) => {
        console.log(response);
        this.setOpenWeatherMapKey(response.openweathermap_key);
      },
      (error) => console.log(error)
    );
    return this._openWeatherMapKey;
  }

  public setAdminOpenWeatherMapKey(key: string) {
    this.setOpenWeatherMapKey(key);

    const body = {
      'openweathermap_key': '"' + key + '"'
    };
    return this.httpService.setSettingsRequest('/openweathermap/key', body, 'setOpenWeatherMapKey');
  }

  public getOpenWeatherMapCinemaCityId(): string {
    this.httpService.getSettingRequest('/openweathermap/cinemaCityId', 'settingsOpenWeatherMapCinemaCityId').subscribe(
      (response: any) => {
        console.log(response);
        this.setOpenWeatherMapCinemaCityId(response.openweathermap_cinema_city_id);
      },
      (error) => console.log(error)
    );
    return this._openWeatherMapCinemaCityId;
  }

  public setAdminOpenWeatherMapCinemaCityId(id: string) {
    this.setOpenWeatherMapCinemaCityId(id);

    const body = {
      'openweathermap_cinema_city_id': '"' + id + '"'
    };
    return this.httpService.setSettingsRequest('/openweathermap/cinemaCityId', body, 'setOpenWeatherMapCinemaCityId');
  }

  private setShowCinema(showCinema: boolean) {
    this._showCinema = showCinema;
    this.showCinemaChange.next(this._showCinema);
  }

  private setShowEvents(showEvents: boolean) {
    this._showEvents = showEvents;
    this.showEventsChange.next(this._showEvents);
  }

  private setCommunityName(communityName: string) {
    this._communityName = communityName;
    this.communityNameChange.next(this._communityName);
  }

  private setCommunityUrl(communityUrl: string) {
    this._communityUrl = communityUrl;
    this.communityUrlChange.next(this._communityUrl);
  }

  private setOpenWeatherMapKey(key: string) {
    this._openWeatherMapKey = key;
    this.openWeatherMapKeyChange.next(this._openWeatherMapKey);
  }

  private setOpenWeatherMapCinemaCityId(id: string) {
    this._openWeatherMapCinemaCityId = id;
    this.openWeatherMapCinemaCityIdChange.next(this._openWeatherMapCinemaCityId);
  }
}
