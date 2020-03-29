import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AppCustomPreloader} from './custom.preloader';

import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

const appRoutes = [
  {path: '', redirectTo: '/auth/signin', pathMatch: 'full'},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), data: {preload: true}},
  {path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), data: {preload: true}},
  {path: 'not-found', component: PageNotFoundComponent, data: {preload: true}},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: AppCustomPreloader})],
  exports: [RouterModule],
  providers: [AppCustomPreloader]
})
export class AppRoutingModule {}
