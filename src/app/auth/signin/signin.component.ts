import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Response} from '@angular/http';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit{
  projectName = 'priv. uni. Buergerkorps Eggenburg';

  loginSuccess = false;
  loginFail = false;

  constructor(private router: Router, private snackBar: MatSnackBar, private authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.isAutenticated()) {
      this.router.navigate(['/home']);
    }
  }

  onSignin(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    this.authService.signinUser(email, password).subscribe(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        this.authService.setToken(data.token);
        console.log('signIn | token: ' + data.token);
        this.loginSuccess = true;
        this.loginFail = false;
        this.router.navigate(['/home']);
        this.snackBar.open('Login erfolgreich');
      },
      (error) => {
        console.log(error);
        this.loginFail = true;
        this.loginSuccess = false;
      }
    );
  }

}
