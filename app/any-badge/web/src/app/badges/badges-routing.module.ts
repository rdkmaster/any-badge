import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BadgeListComponent }    from './badge-list.component';
import { BadgeDetailComponent }  from './badge-detail.component';

const badgesRoutes: Routes = [
  { path: 'badges',  component: BadgeListComponent },
  { path: 'badge/:id', component: BadgeDetailComponent }
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
