import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RedirectIfAuthenticatedGuard } from './@core/guards/redirect-if-authenticated.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pages'
  },
  {
    path: 'pages',
    // canActivate: [AuthGuard],
    // canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: 'pages'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
