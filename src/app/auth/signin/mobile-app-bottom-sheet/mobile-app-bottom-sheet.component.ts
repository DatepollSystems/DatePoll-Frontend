import {Component, OnDestroy} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {Subscription} from 'rxjs';

import {SettingsService} from '../../../utils/settings.service';

@Component({
  selector: 'app-mobile-app-bottom-sheet',
  templateUrl: './mobile-app-bottom-sheet.component.html',
  styleUrls: ['./mobile-app-bottom-sheet.component.css']
})
export class MobileAppBottomSheetComponent implements OnDestroy {
  appUrl: any = null;
  serverInfoSubscription: Subscription;

  constructor(private settingsService: SettingsService, private _bottomSheetRef: MatBottomSheetRef<MobileAppBottomSheetComponent>) {
    let object = {
      type: 'loginV1',
      url: this.settingsService.getServerInfo()?.application_url
    };
    this.appUrl = JSON.stringify(object);
    this.serverInfoSubscription = this.settingsService.serverInfoChange.subscribe(value => {
      object = {
        type: 'loginV1',
        url: value?.application_url
      };
      this.appUrl = JSON.stringify(object);
    });
  }

  ngOnDestroy(): void {
    this.serverInfoSubscription.unsubscribe();
  }

  close() {
    this._bottomSheetRef.dismiss();
  }
}
