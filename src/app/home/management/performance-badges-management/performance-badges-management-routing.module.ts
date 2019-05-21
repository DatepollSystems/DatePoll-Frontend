import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PerformanceBadgesManagmentComponent} from './performance-badges-managment.component';

const performanceBadgesRoutes: Routes = [
  {path: '', component: PerformanceBadgesManagmentComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(performanceBadgesRoutes)
  ],
  exports: [RouterModule]
})
export class PerformanceBadgesManagementRoutingModule {}
