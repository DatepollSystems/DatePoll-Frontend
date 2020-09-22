import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DeletedUsersManagementComponent} from './deleted-users-management.component';

const deletedUsersManagementRoutes: Routes = [{path: '', component: DeletedUsersManagementComponent}];

@NgModule({
  imports: [RouterModule.forChild(deletedUsersManagementRoutes)],
  exports: [RouterModule],
})
export class DeletedUsersManagementRoutingModule {}
