import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {DataStorageService} from '../../data-storage.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private authService: AuthService, private dataStorageService: DataStorageService) { }

  message: string;

  ngOnInit() {
    this.dataStorageService.getServerStartMessage().subscribe(
      (servers: any[]) => {
        console.log(servers);

      },
      (error) => console.log(error)
    );
  }

  onSignin(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    this.authService.signinUser(email, password);
  }

}
