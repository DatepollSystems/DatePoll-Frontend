import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const broadcastRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'administration',
        loadChildren: () =>
          import('./broadcasts-administration/broadcasts-administration.module').then(m => m.BroadcastsAdministrationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(broadcastRoutes)],
  exports: [RouterModule]
})
export class BroadcastsRoutingModule {}
