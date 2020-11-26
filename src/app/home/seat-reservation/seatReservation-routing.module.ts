import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SeatReservationComponent} from './seat-reservation.component';

const seatReservationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'administration',
        // loadChildren: () =>
        //   import('./broadcasts-administration/broadcasts-administration.module').then(m => m.BroadcastsAdministrationModule)
      },
      // {path: ':id', component: BroadcastInfoComponent},
      {path: '', component: SeatReservationComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(seatReservationRoutes)],
  exports: [RouterModule],
})
export class SeatReservationRoutingModule {}
