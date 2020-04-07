import {Component, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {AuthService} from '../auth/auth.service';
import {SettingsService} from '../utils/settings.service';

import {MobileAppBottomSheetComponent} from '../auth/signin/mobile-app-bottom-sheet/mobile-app-bottom-sheet.component';

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
    private settingsService: SettingsService
  ) {
    this.serverInfo = this.settingsService.getServerInfo();
    this.serverInfoSubscription = this.settingsService.serverInfoChange.subscribe(value => {
      this.serverInfo = value;
      // this.serverInfo.community_description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo gravida metus, eu pretium augue eleifend venenatis. Nam vehicula, sem eu fermentum euismod, est risus venenatis tortor, vel dapibus quam turpis eget nulla. Curabitur purus dui, mattis quis erat vitae, venenatis accumsan diam. Duis consequat augue eu nisi pretium consectetur. Aenean porta nisl ut elit tempus, condimentum fringilla nunc semper. Morbi pretium ex enim, eget commodo magna bibendum eget. Nullam convallis sit amet dui ac semper. Cras pellentesque nulla nisl, euismod cursus sem auctor vitae. Integer laoreet finibus tellus sit amet vulputate. Pellentesque fermentum nisi sed orci euismod, in dictum arcu suscipit. Sed sit amet consequat enim. In ut molestie est. Sed auctor, mi quis tincidunt consequat, sapien dolor ultricies felis, feugiat bibendum leo diam ut nisl. Nullam eleifend tempor nunc, id viverra est euismod eu. Mauris rutrum sapien a malesuada porttitor. Praesent vitae nulla sed elit faucibus semper et ut turpis. Proin tincidunt interdum nulla, eu luctus mauris tempor non. Etiam hendrerit malesuada diam, sed rhoncus magna semper quis. Suspendisse a fermentum diam. In consequat quam vestibulum sapien pellentesque rhoncus. Etiam accumsan, augue ac tempor semper, metus turpis facilisis lacus, eu vestibulum augue neque non metus. In non ex at ex euismod semper Phasellus bibendum euismod scelerisque. Maecenas scelerisque nunc non ex luctus vestibulum. Cras dignissim elit ut urna faucibus, vel auctor dolor faucibus. Donec sed faucibus nunc, tincidunt porta arcu. Nulla pretium augue velit, sed consectetur purus suscipit ac. Nullam congue laoreet mi, fermentum luctus nulla suscipit ac. Suspendisse fermentum metus sapien, vel molestie odio luctus id.Quisque facilisis lectus at sem convallis, sit amet convallis risus suscipit. Aliquam dictum dolor id nunc gravida efficitur. Curabitur nibh elit, sodales ac velit in, sagittis mollis nunc. Aliquam erat volutpat. Fusce maximus tortor justo, laoreet pharetra ipsum dapibus in. Nulla facilisi. Praesent a ullamcorper magna, at ullamcorper dui. Phasellus faucibus lectus ac aliquam pretium. Nulla luctus dolor facilisis lectus placerat congue. Duis auctor enim eu orci fermentum, nec bibendum urna tincidunt. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin turpis nibh, luctus et vehicula quis, consectetur vitae urna. Donec lacinia aliquet felis at posuere. Pellentesque ac massa sed urna sagittis lacinia imperdiet et turpis. Vivamus scelerisque dolor vitae elit convallis semper. Fusce a arcu sed neque fringilla sollicitudin non in metus. Ut fringilla tincidunt erat. Nunc a mauris nec sapien cursus sollicitudin at in urna. Nunc non mi lacus. Duis non varius orci. Donec erat ex, finibus vel gravida fermentum, venenatis a orci. Maecenas vitae ultricies tortor. Donec hendrerit pulvinar dapibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas Morbi vestibulum elit a faucibus fringilla. Vivamus vel nibh a arcu lobortis commodo. Aliquam mattis diam erat, sit amet mattis nunc scelerisque ac. Nulla condimentum dui eu tempor dignissim. Duis bibendum consectetur convallis. Donec at consequat lectus. Suspendisse fringilla ligula a vulputate bibendum. Duis egestas sodales ipsum, in convallis ante consectetur ut. Morbi interdum velit ac mi consectetur tempus non.';
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

  getDescriptionPreview(community_description: string) {
    if (community_description.length < 512) {
      return null;
    }

    return community_description.substring(0, 512).slice();
  }
}
