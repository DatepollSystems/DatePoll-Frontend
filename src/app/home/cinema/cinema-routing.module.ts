import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MovieServiceComponent} from './movie-service/movie-service.component';
import {MovieTicketsComponent} from './movie-tickets/movie-tickets.component';

const cinemaRoutes: Routes = [
  {
    path: '',
    children: [
      {path: 'tickets', component: MovieTicketsComponent},
      {path: 'service', component: MovieServiceComponent},
      {
        path: 'administration',
        loadChildren: () => import('./movie-administration/movie-administration.module').then(m => m.MovieAdministrationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(cinemaRoutes)],
  exports: [RouterModule]
})
export class CinemaRoutingModule {}
