import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BadgeListComponent} from './badges.component';
import {BadgeAuthGuard} from "../services/auth-guard.service";

const badgesRoutes: Routes = [
  {path: '', component: BadgeListComponent, canActivate: [BadgeAuthGuard], canActivateChild: [BadgeAuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forChild(badgesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class BadgeRoutingModule {
}
