import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {HttpService} from '../../../utils/http.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent {
  @ViewChild('stepper', {static: true}) stepper;

  showCheckingOldPasswordSpinner = false;
  showOldPasswordIncorrectCard = false;
  oldPassword = '';

  showChangingPasswordSpinner = false;

  passwordChangeForm = this.fb.group({
    passwords: this.fb.group(
      {
        password: ['', [Validators.required, Validators.min(6)]],
        repeat: ['', [Validators.required, Validators.min(6)]],
      },
      {validator: this.checkPasswords}
    ),
  });

  constructor(private httpService: HttpService, private fb: FormBuilder) {}

  checkOldPassword() {
    this.showOldPasswordIncorrectCard = false;
    this.showCheckingOldPasswordSpinner = true;

    const body = {
      password: this.oldPassword,
    };

    this.httpService.loggedInV1POSTRequest('/user/myself/changePassword/checkOldPassword', body, 'checkOldPassword').subscribe(
      (data: any) => {
        console.log(data);
        console.log('checkOldPasswort | Password is correct');
        this.nextStep();
      },
      (error) => {
        console.log(error);
        console.log('checkOldPasswort | Password is incorrect');
        this.showOldPasswordIncorrectCard = true;
        this.showCheckingOldPasswordSpinner = false;
      }
    );
  }

  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    const pass = group.get('password').value;
    if (pass?.length < 6) {
      return {wrongLength: true};
    }
    const confirmPass = group.get('repeat').value;

    return pass === confirmPass ? null : {notSame: true};
  }

  changePassword(form: FormGroup) {
    this.showChangingPasswordSpinner = true;

    const body = {
      old_password: this.oldPassword,
      new_password: form.controls.passwords.get('password').value,
    };

    this.httpService.loggedInV1POSTRequest('/user/myself/changePassword/changePassword', body, 'changePassword').subscribe(
      (data: any) => {
        console.log(data);
        console.log('changePassword | Changed successful');
        this.nextStep();
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
