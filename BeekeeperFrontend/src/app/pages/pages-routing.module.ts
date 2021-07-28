import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule)
      },
      // {
      //   path: 'project/:id',
      //   canActivateChild: [SetProjectIdGuard],
      //   loadChildren: () =>
      //     import('./project/project.module').then((m) => m.ProjectModule)
      // },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
