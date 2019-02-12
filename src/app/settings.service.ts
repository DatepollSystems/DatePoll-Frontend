import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private httpService: HttpService, private router: Router) { }

  public showCinemaChange: Subject<boolean> = new Subject<boolean>();
  private _showCinema = true;

  public getShowCinema(): boolean {
    this.httpService.settingRequest('/cinema', 'settingsCinema').subscribe(
      (response: any) => {
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

  public checkShowCinema() {
    if (!this.getShowCinema()) {
      this.router.navigate(['/home']);
      return;
    }

    this.showCinemaChange.subscribe((value) => {
      if (!value) {
        this.router.navigate(['/home']);
      }
    });
  }
}
