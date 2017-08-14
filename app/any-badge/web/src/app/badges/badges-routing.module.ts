import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BadgeListComponent }    from './badges.component';

const badgesRoutes: Routes = [
  { path: '',  component: BadgeListComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(badgesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class BadgeRoutingModule { }
