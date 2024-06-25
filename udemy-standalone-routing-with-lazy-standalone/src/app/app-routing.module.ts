import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';

import { WelcomeComponent } from './welcome/welcome.component';

const routes: Route[] = [
  {
    path: '',
    component: WelcomeComponent,
    // welcomeComponent is eager stand alone
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then((module) => module.AboutComponent)
    // lazy load stand alone components
    // with stand alone components i can lazy load individual components without wrapping them into modules.
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/routes').then(
        (mod) => mod.DASHBOARD_ROUTES
      ),
  },//it loads these routes lazily 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
