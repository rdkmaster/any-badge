import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from "@angular/http";

import {JigsawButtonModule, JigsawTableModule, JigsawInputModule, PopupService} from "@rdkmaster/jigsaw";

import {BadgeListComponent, BadgeSvgTableCell, OperationTableCell, SubjectEditor} from './badges.component';
import {BadgeRoutingModule} from './badges-routing.module';


@NgModule({
  imports: [
    CommonModule, FormsModule, BadgeRoutingModule, HttpModule, JigsawButtonModule, JigsawTableModule, JigsawInputModule
  ],
  declarations: [
    BadgeListComponent, OperationTableCell, BadgeSvgTableCell, SubjectEditor
  ],
  entryComponents: [OperationTableCell, BadgeSvgTableCell, SubjectEditor],
  providers: [PopupService]
})
export class BadgesModule {
}
