import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AppCustomPreloader} from './custom.preloader';

import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

const appRoutes = [
  {path: '', redirectTo: '/auth/signin', pathMatch: 'full'},
  {path: '', loadChildren: () => import('./about/about.module').then(m => m.AboutModule)},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  {path: '', loadChildren: () => import('./footer/footer.module').then(m => m.FooterModule)},
  {path: 'not-found', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: AppCustomPreloader})],
  exports: [RouterModule],
  providers: [AppCustomPreloader]
})
export class AppRoutingModule {}
