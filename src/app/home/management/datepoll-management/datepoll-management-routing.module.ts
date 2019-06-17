import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DatepollManagementComponent} from './datepoll-management.component';

const datepollManagementRoutes: Routes = [
  {path: '', component: DatepollManagementComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(datepollManagementRoutes)
  ],
  exports: [RouterModule]
})
export class DatepollManagementRoutingModule {
}
