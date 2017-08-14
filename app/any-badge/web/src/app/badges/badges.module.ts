import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from "@angular/http";

import {JigsawButtonModule, JigsawTableModule, PopupService} from "@rdkmaster/jigsaw";

import {BadgeListComponent, BadgeSvgTableCell, OperationTableCell} from './badges.component';
import {BadgeRoutingModule} from './badges-routing.module';


@NgModule({
  imports: [
    CommonModule, FormsModule, BadgeRoutingModule, HttpModule, JigsawButtonModule, JigsawTableModule
  ],
  declarations: [
    BadgeListComponent, OperationTableCell, BadgeSvgTableCell
  ],
  entryComponents: [OperationTableCell, BadgeSvgTableCell],
  providers: [PopupService]
})
export class BadgesModule {
}
