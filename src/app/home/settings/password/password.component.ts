import {Component, ViewChild} from '@angular/core';
import {HttpService} from '../../../utils/http.service';
import {NotificationsService} from 'angular2-notifications';
import {TranslateService} from '../../../translation/translate.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  @ViewChild('stepper', {static: true}) stepper;

  showCheckingOldPasswordSpinner = false;
  showOldPasswordIncorrectCard = false;
  oldPassword = '';

  newPassword = '';
  newPasswordRepeat = '';
  showChangingPasswordSpinner = false;

  constructor(private httpService: HttpService, private notificationsService: NotificationsService, private translate: TranslateService) {}

  checkOldPassword() {
    this.showOldPasswordIncorrectCard = false;
    this.showCheckingOldPasswordSpinner = true;

    const body = {
      password: this.oldPassword
    };

    this.httpService.loggedInV1POSTRequest('/user/myself/changePassword/checkOldPassword', body, 'checkOldPassword').subscribe(
      (data: any) => {
        console.log(data);
        console.log('checkOldPasswort | Password is correct');
        this.nextStep();
      },
      error => {
        console.log(error);
        console.log('checkOldPasswort | Password is incorrect');
        this.showOldPasswordIncorrectCard = true;
        this.showCheckingOldPasswordSpinner = false;
      }
    );
  }

  changePassword() {
    if (this.newPassword !== this.newPasswordRepeat) {
      this.notificationsService.info(
        null,
        this.translate.getTranslationFor('SETTINGS_SECURITY_MODAL_CHANGE_PASSWORD_NEW_PASSWORDS_ARE_NOT_EQUAL')
      );
      return;
    }

    this.showChangingPasswordSpinner = true;

    const body = {
      old_password: this.oldPassword,
      new_password: this.newPassword
    };

    this.httpService.loggedInV1POSTRequest('/user/myself/changePassword/changePassword', body, 'changePassword').subscribe(
      (data: any) => {
        console.log(data);
        console.log('changePassword | Changed successful');
        this.nextStep();
      },
      error => {
        console.log(error);
        console.log('changePassword | Password is incorrect');
      }
    );

    this.showChangingPasswordSpinner = false;
  }

  nextStep() {
    this.stepper.selectedIndex++;
  }
}
