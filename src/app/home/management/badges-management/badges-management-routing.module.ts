import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BadgesManagementComponent} from './badges-management.component';

const badgesManagmentRoutes: Routes = [{path: '', component: BadgesManagementComponent}];

@NgModule({
  imports: [RouterModule.forChild(badgesManagmentRoutes)],
  exports: [RouterModule]
})
export class BadgesManagementRoutingModule {}
