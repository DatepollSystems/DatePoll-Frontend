import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {StartComponent} from './start.component';

const startRoutes: Routes = [{path: '', component: StartComponent}];

@NgModule({
  imports: [RouterModule.forChild(startRoutes)],
  exports: [RouterModule]
})
export class StartRoutingModule {}
