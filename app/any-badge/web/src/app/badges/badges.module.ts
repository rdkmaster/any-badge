import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from "@angular/http";

import {
  JigsawButtonModule, JigsawDialogModule,
  JigsawInputModule,
  JigsawTableModule,
  JigsawTooltipModule,
  PopupService
} from "@rdkmaster/jigsaw";

import {BadgeListComponent, BadgeSvgTableCell, OperationTableCell, SubjectEditor} from './badges.component';
import {BadgeRoutingModule} from './badges-routing.module';
import {CopyBadgeComponent} from "app/badges/copy-badge.component";


@NgModule({
  imports: [
    CommonModule, FormsModule, BadgeRoutingModule, HttpModule,
    JigsawButtonModule, JigsawTableModule, JigsawInputModule,
    JigsawTooltipModule, JigsawDialogModule
  ],
  declarations: [
    BadgeListComponent, OperationTableCell, BadgeSvgTableCell, SubjectEditor, CopyBadgeComponent
  ],
  entryComponents: [OperationTableCell, BadgeSvgTableCell, SubjectEditor, CopyBadgeComponent],
  providers: [PopupService]
})
export class BadgesModule {
}
