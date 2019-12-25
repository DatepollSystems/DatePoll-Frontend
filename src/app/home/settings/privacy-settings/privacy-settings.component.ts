import {Component, OnDestroy} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {Subscription} from 'rxjs';

import {PrivacySettingsService} from './privacySettings.service';

@Component({
  selector: 'app-privacy-settings',
  templateUrl: './privacy-settings.component.html',
  styleUrls: ['./privacy-settings.component.css']
})
export class PrivacySettingsComponent implements OnDestroy {

  public showBirthday = true;
  private showBirthdaySubscription: Subscription;

  constructor(private privacySettingsService: PrivacySettingsService) {
    this.showBirthday = this.privacySettingsService.getShowBirthday();
    this.showBirthdaySubscription = this.privacySettingsService.showBirthdayChange.subscribe((value) => {
      this.showBirthday = value;
    });
  }

  ngOnDestroy(): void {
    this.showBirthdaySubscription.unsubscribe();
  }

  showBirthdayChange(ob: MatSlideToggleChange) {
    this.privacySettingsService.setShowBirthday(ob.checked, true);
  }
}
