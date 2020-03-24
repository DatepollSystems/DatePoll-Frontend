import {Component, OnDestroy} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {Subscription} from 'rxjs';

import {SettingsService} from '../../../services/settings.service';

@Component({
  selector: 'app-mobile-app-bottom-sheet',
  templateUrl: './mobile-app-bottom-sheet.component.html',
  styleUrls: ['./mobile-app-bottom-sheet.component.css']
})
export class MobileAppBottomSheetComponent implements OnDestroy {
  appUrl: any = null;
  appUrlSubscription: Subscription;

  constructor(private settingsService: SettingsService, private _bottomSheetRef: MatBottomSheetRef<MobileAppBottomSheetComponent>) {
    let object = {
      type: 'loginV1',
      url: this.settingsService.getAppUrl()
    };
    this.appUrl = JSON.stringify(object);
    this.appUrlSubscription = this.settingsService.appUrlChange.subscribe(value => {
      object = {
        type: 'loginV1',
        url: value
      };
      this.appUrl = JSON.stringify(object);
    });
  }

  ngOnDestroy(): void {
    this.appUrlSubscription.unsubscribe();
  }

  close() {
    this._bottomSheetRef.dismiss();
  }
}
