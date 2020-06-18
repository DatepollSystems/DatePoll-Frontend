import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BroadcastsAdministrationComponent} from './broadcasts-administration.component';
import {CreateBroadcastComponent} from './create-broadcast/create-broadcast.component';

const broadcastsAdministrationRoutes: Routes = [
  {path: '', component: BroadcastsAdministrationComponent},
  {path: 'create', component: CreateBroadcastComponent}
];

@NgModule({
  imports: [RouterModule.forChild(broadcastsAdministrationRoutes)],
  exports: [RouterModule]
})
export class BroadcastsAdministrationRoutingModule {}
