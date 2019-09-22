import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MovieAdministrationComponent} from './movie-administration.component';

const movieAdministrationRoutes: Routes = [
  {path: '', component: MovieAdministrationComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(movieAdministrationRoutes)
  ],
  exports: [RouterModule]
})
export class MovieAdministrationRoutingModule {
}
