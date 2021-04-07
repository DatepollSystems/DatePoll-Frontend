import {Component, OnDestroy} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {Subscription} from 'rxjs';

import {UserSettingsService} from './userSettings.service';

@Component({
  selector: 'app-privacy-settings',
  templateUrl: './privacy-settings.component.html',
  styleUrls: ['./privacy-settings.component.css'],
})
export class PrivacySettingsComponent implements OnDestroy {
  public showBirthday = true;
  private showBirthdaySubscription: Subscription;

  public shareMovieWorkerPhoneNumber = true;
  private shareMovieWorkerPhoneNumberSubscription: Subscription;

  constructor(private privacySettingsService: UserSettingsService) {
    this.showBirthday = this.privacySettingsService.getShowBirthday();
    this.showBirthdaySubscription = this.privacySettingsService.showBirthdayChange.subscribe((value) => {
      this.showBirthday = value;
    });

    this.shareMovieWorkerPhoneNumber = this.privacySettingsService.getShareMovieWorkerPhoneNumber();
    this.shareMovieWorkerPhoneNumberSubscription = this.privacySettingsService.shareMovieWorkerPhoneNumberChange.subscribe((value) => {
      this.shareMovieWorkerPhoneNumber = value;
    });
  }

  ngOnDestroy(): void {
    this.showBirthdaySubscription.unsubscribe();
    this.shareMovieWorkerPhoneNumberSubscription.unsubscribe();
  }

  showBirthdayChange(ob: MatSlideToggleChange) {
    this.privacySettingsService.setShowBirthday(ob.checked, true);
  }

  shareMovieWorkerPhoneNumberChange(ob: MatSlideToggleChange) {
    this.privacySettingsService.setShareMovieWorkerPhoneNumber(ob.checked, true);
  }
}
