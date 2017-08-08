import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PageNotFoundComponent} from './not-found.component';
import {CanDeactivateGuard} from './services/can-deactivate-guard.service';
import {AuthGuard} from './services/auth-guard.service';
import {SelectivePreloadingStrategy} from './utils/selective-preloading-strategy';
import {FrontPageComponent} from "./front-page/front-page.component";

const appRoutes: Routes = [
  {
    path: 'badges',
    loadChildren: 'app/badges/badges.module#BadgesModule',
    canLoad: [AuthGuard]
  },
  { path: '', component: FrontPageComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: true, // <-- debugging purposes only
        preloadingStrategy: SelectivePreloadingStrategy,
      }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CanDeactivateGuard,
    SelectivePreloadingStrategy
  ]
})
export class AppRoutingModule {
}
