import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {SettingsService} from '../../../utils/settings.service';

import {ServerInfoModel} from '../../../utils/server-info.model';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css'],
})
export class PrivacyPolicyComponent implements OnDestroy {
  serverInfo: ServerInfoModel;
  serverInfoSubscription: Subscription;

  constructor(private settingsService: SettingsService) {
    this.serverInfo = this.settingsService.getServerInfo();
    this.serverInfoSubscription = this.settingsService.serverInfoChange.subscribe((value) => {
      this.serverInfo = value;
    });
  }

  ngOnDestroy() {
    this.serverInfoSubscription.unsubscribe();
  }
}
