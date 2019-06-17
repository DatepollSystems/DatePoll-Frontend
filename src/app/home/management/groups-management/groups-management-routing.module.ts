import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GroupsManagementComponent} from './groups-management.component';

const groupsManagmentRoutes: Routes = [
  {path: '', component: GroupsManagementComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(groupsManagmentRoutes)
  ],
  exports: [RouterModule]
})
export class GroupsManagementRoutingModule {
}
