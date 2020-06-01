import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {IsAuthenticatedGuardService} from './is-authenticated-guard.service';

import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {SigninComponent} from './signin/signin.component';

const authRoutes: Routes = [
  {
    path: '',
    canActivate: [IsAuthenticatedGuardService],
    children: [
      {path: 'signin', component: SigninComponent},
      {path: 'forgotPassword', component: ForgotPasswordComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
