import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SigninComponent} from './signin/signin.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';

const authRoutes: Routes = [
  {path: '', children: [
      {path: 'signin', component: SigninComponent},
      {path: 'forgotPassword', component: ForgotPasswordComponent},
    ]}
];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
