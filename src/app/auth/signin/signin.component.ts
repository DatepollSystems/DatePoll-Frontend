import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) { }

  apiUrl: string;
  projectName = '';

  ngOnInit() {
    let url = window.location.href;
    let arr = url.split('/');
    this.projectName = arr[2] + ' | Hier kann stehen was sie wollen';
  }

  ngOnDestroy() {
    document.body.style.backgroundColor = '#ffffff';
  }

  onSignin(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    this.authService.signinUser(email, password);
  }

}
