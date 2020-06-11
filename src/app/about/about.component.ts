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

  instanceUsersString = '0';
  instanceEventsString = '0';
  instanceMoviesString = '0';

  showMoreCommunityDescription = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer
  ) {
    this.serverInfo = this.settingsService.getServerInfo();
    // noinspection JSIgnoredPromiseFromCall
    this.count();
    this.serverInfoSubscription = this.settingsService.serverInfoChange.subscribe(value => {
      this.serverInfo = value;
      // noinspection JSIgnoredPromiseFromCall
      this.count();
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

        this.authService.signin(data.token, data.session_token);
        this.uiLogin();
      },
      error => {
        console.log(error);

        if (error.error.error_code != null) {
          if (error.error.error_code === 'not_activated' || error.error.error_code === 'change_password') {
            this.router.navigateByUrl('/auth/signin', {
              state: {routingReason: 'forward', state: error.error.error_code, username, password}
            });

            return;
          }
        }

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

  async count() {
    // noinspection ES6MissingAwait
    this.showInstanceUsers(this.validateFactor(this.serverInfo.users_count), this.serverInfo.users_count);
    // noinspection ES6MissingAwait
    this.showInstanceEvents(this.validateFactor(this.serverInfo.events_count), this.serverInfo.events_count);
    // noinspection ES6MissingAwait
    this.showInstanceMovies(this.validateFactor(this.serverInfo.movies_count), this.serverInfo.movies_count);
  }

  validateFactor(max: number): number {
    if (max > 4000) {
      return 24;
    } else if (max > 1000) {
      return 19;
    } else if (max > 500) {
      return 6;
    } else {
      return 1;
    }
  }

  async showInstanceUsers(factor: number, max: number) {
    this.instanceUsersString = '0';
    for (let i = 0; i < max; ) {
      i += factor;
      await sleep(1);
      this.instanceUsersString = i.toString();
    }
  }

  async showInstanceEvents(factor: number, max: number) {
    this.instanceEventsString = '0';
    for (let i = 0; i < max; ) {
      i += factor;
      await sleep(1);
      this.instanceEventsString = i.toString();
    }
  }

  async showInstanceMovies(factor: number, max: number) {
    this.instanceMoviesString = '0';
    for (let i = 0; i < max; ) {
      i += factor;
      await sleep(1);
      this.instanceMoviesString = i.toString();
    }
  }
}

async function sleep(msec) {
  return new Promise(resolve => setTimeout(resolve, msec * 2));
}
