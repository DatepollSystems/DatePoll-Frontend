import {Component, ViewChild} from '@angular/core';
import {HttpService} from '../../../http.service';
import {Response} from '@angular/http';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {

  @ViewChild('stepper') stepper;

  showCheckingOldPasswordSpinner = false;
  showOldPasswordIncorrectCard = false;
  oldPassword = '';

  newPassword = '';
  newPasswordRepeat = '';
  showChangingPasswordSpinner = false;

  constructor(private httpService: HttpService) {
  }

  checkOldPassword() {
    this.showOldPasswordIncorrectCard = false;
    this.showCheckingOldPasswordSpinner = true;

    const body = {
      'password': this.oldPassword
    };

    this.httpService.loggedInV1POSTRequest('/user/myself/changePassword/checkOldPassword', body, 'checkOldPassword').subscribe(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        if (data.msg === 'password_correct') {
          console.log('checkOldPasswort | Password is correct');
          this.nextStep();
        }
      },
      (error) => {
        console.log(error);
        console.log('checkOldPasswort | Password is incorrect');
        this.showOldPasswordIncorrectCard = true;
        this.showCheckingOldPasswordSpinner = false;
      }
    );
  }

  changePassword() {
    this.showChangingPasswordSpinner = true;

    const body = {
      'old_password': this.oldPassword,
      'new_password': this.newPassword
    };

    this.httpService.loggedInV1POSTRequest('/user/myself/changePassword/changePassword', body, 'changePassword').subscribe(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        if (data.msg === 'password_changed') {
          console.log('changePassword | Changed successful');
          this.nextStep();
        } else {
          console.log('changePassword | Unknown message');
        }
      },
      (error) => {
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
