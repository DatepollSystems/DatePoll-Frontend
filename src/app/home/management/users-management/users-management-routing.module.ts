import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UsersManagementComponent} from './users-management.component';
import {UsersChangesManagementComponent} from './users-changes-management/users-changes-management.component';

const usersManagementRoutes: Routes = [
  {path: '', component: UsersManagementComponent},
  {
    path: 'deleted',
    loadChildren: () => import('./deleted-users-management/deleted-users-management.module').then((m) => m.DeletedUsersManagementModule),
  },
  {path: 'changes', component: UsersChangesManagementComponent},
];

@NgModule({
  imports: [RouterModule.forChild(usersManagementRoutes)],
  exports: [RouterModule],
})
export class UsersManagementRoutingModule {}
