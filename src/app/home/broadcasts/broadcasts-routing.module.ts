import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BroadcastInfoComponent} from './broadcast-info/broadcast-info.component';
import {BroadcastsViewComponent} from './broadcasts-view/broadcasts-view.component';

const broadcastRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'administration',
        loadChildren: () =>
          import('./broadcasts-administration/broadcasts-administration.module').then((m) => m.BroadcastsAdministrationModule),
      },
      {path: 'messages', component: BroadcastsViewComponent},
      {path: ':id', component: BroadcastInfoComponent},
      {path: '', redirectTo: 'messages'},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(broadcastRoutes)],
  exports: [RouterModule],
})
export class BroadcastsRoutingModule {}
