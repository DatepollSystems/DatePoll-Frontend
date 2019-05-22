import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MovieTicketsComponent} from './movie-tickets/movie-tickets.component';
import {MovieServiceComponent} from './movie-service/movie-service.component';
import {MovieAdministrationComponent} from './movie-administration/movie-administration.component';

const cinemaRoutes: Routes = [
  {path: '', children: [
      {path: 'tickets', component: MovieTicketsComponent},
      {path: 'service', component: MovieServiceComponent},
      {path: 'administration', component: MovieAdministrationComponent},
    ]}
];

@NgModule({
  imports: [
    RouterModule.forChild(cinemaRoutes)
  ],
  exports: [RouterModule]
})
export class CinemaRoutingModule {}
