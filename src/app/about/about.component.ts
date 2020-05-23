import {Component, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {AuthService} from '../auth/auth.service';
import {SettingsService} from '../utils/settings.service';

import {MobileAppBottomSheetComponent} from '../auth/signin/mobile-app-bottom-sheet/mobile-app-bottom-sheet.component';

import {DomSanitizer} from '@angular/platform-browser';
import {ServerInfoModel} from '../utils/server-info.model';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnDestroy {
  serverInfo: ServerInfoModel;
  serverInfoSubscription: Subscription;

  showMoreCommunityDescription = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer
  ) {
    this.serverInfo = this.settingsService.getServerInfo();
    this.serverInfoSubscription = this.settingsService.serverInfoChange.subscribe(value => {
      this.serverInfo = value;
    });
  }

  ngOnDestroy(): void {
    this.serverInfoSubscription.unsubscribe();
  }

  onSignin(form: NgForm) {
    const username = form.value.username;
    const password = form.value.password;

    this.authService.trySignin(username, password).subscribe(
      (data: any) => {
        console.log(data);
        if (data.error_code != null) {
          if (data.error_code === 'notActivated' || data.error_code === 'changePassword') {
            this.router.navigateByUrl('/auth/signin', {state: {routingReason: 'forward', state: data.error_code, username, password}});
          }

          return;
        }

        this.authService.signin(data.token, data.session_token);
        this.uiLogin();
      },
      error => {
        console.log(error);
        this.router.navigateByUrl('/auth/signin', {state: {routingReason: 'loginFailed', username, password}});
      }
    );
  }

  private uiLogin() {
    this.router.navigate(['/home']);
  }

  openMobileAppBottomSheet() {
    this.bottomSheet.open(MobileAppBottomSheetComponent);
  }

  getSanitizedDescription(community_description: string) {
    return this.sanitizer.bypassSecurityTrustHtml(community_description);
  }

  getDescriptionPreview(community_description: string) {
    if (community_description.length < 512) {
      return null;
    }

    return this.sanitizer.bypassSecurityTrustHtml(community_description.substring(0, 512).slice() + '...');
  }
}
