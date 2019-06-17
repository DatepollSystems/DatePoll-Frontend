import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsersManagementComponent} from './users-management.component';

const usersManagementRoutes: Routes = [
  {path: '', component: UsersManagementComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(usersManagementRoutes)
  ],
  exports: [RouterModule]
})
export class UsersManagementRoutingModule {
}
