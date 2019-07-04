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
  private _showCinema = true;
  private _showEvents = true;
  private _communityName = 'DatePoll Web';

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

  public checkShowEvents() {
    if (!this.getShowEvents()) {
      this.router.navigate(['/home']);
      return;
    }
  }

  public getCommunityName() {
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
}
