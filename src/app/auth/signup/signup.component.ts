import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', './../signin/signin.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService) { }

  apiUrl: string;
  projectName = '';

  ngOnInit() {
    let url = window.location.href;
    let arr = url.split('/');
    this.projectName = arr[2] + ' | Hier kann stehen was sie wollen';
  }

  onSignup(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    this.authService.signupUser(email, password);
  }

}
