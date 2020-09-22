import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UsersManagementComponent} from './users-management.component';

const usersManagementRoutes: Routes = [
  {path: '', component: UsersManagementComponent},
  {
    path: 'deleted',
    loadChildren: () => import('./deleted-users-management/deleted-users-management.module').then(m => m.DeletedUsersManagementModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(usersManagementRoutes)],
  exports: [RouterModule]
})
export class UsersManagementRoutingModule {
}
