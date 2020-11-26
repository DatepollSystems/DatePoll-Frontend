import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BroadcastDownloadComponent} from './broadcast-download.component';

const broadcastDownloadRoutes: Routes = [
  {
    path: '',
    children: [
      {path: ':token', component: BroadcastDownloadComponent},
      {path: '', redirectTo: '/not-found'},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(broadcastDownloadRoutes)],
  exports: [RouterModule],
})
export class BroadcastDownloadRoutingModule {}
