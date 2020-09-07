import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DeletedUsersManagementComponent} from './deleted-users-management/deleted-users-management.component';
import {UsersManagementComponent} from './users-management.component';

const usersManagementRoutes: Routes = [
  {path: '', component: UsersManagementComponent},
  {path: 'deleted', component: DeletedUsersManagementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(usersManagementRoutes)],
  exports: [RouterModule]
})
export class UsersManagementRoutingModule {}
