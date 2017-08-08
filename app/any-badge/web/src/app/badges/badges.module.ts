import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { BadgeListComponent }    from './badge-list.component';
import { BadgeDetailComponent }  from './badge-detail.component';
import { BadgeRoutingModule } from './badges-routing.module';
import { BadgeService } from '../services/badge.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BadgeRoutingModule
  ],
  declarations: [
    BadgeListComponent,
    BadgeDetailComponent
  ],
  providers: [ BadgeService ]
})
export class BadgesModule {}
