import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {
  JigsawAlertModule,
  JigsawButtonModule,
  JigsawDialogModule,
  JigsawInputModule,
  JigsawLoadingModule,
  JigsawTableModule,
  JigsawTooltipModule,
  LoadingService,
  PopupService
} from "@rdkmaster/jigsaw";

import {BadgeListComponent, BadgeSvgTableCell, OperationTableCell, SubjectEditor} from './badges.component';
import {BadgeRoutingModule} from './badges-routing.module';
import {CopyBadgeComponent} from "app/badges/copy-badge.component";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  imports: [
    CommonModule, FormsModule, BadgeRoutingModule, HttpClientModule,
    JigsawButtonModule, JigsawTableModule, JigsawInputModule,
    JigsawTooltipModule, JigsawDialogModule, JigsawAlertModule,
    JigsawLoadingModule
  ],
  declarations: [
    BadgeListComponent, OperationTableCell, BadgeSvgTableCell, SubjectEditor, CopyBadgeComponent
  ],
  entryComponents: [OperationTableCell, BadgeSvgTableCell, SubjectEditor, CopyBadgeComponent],
  providers: [PopupService, LoadingService]
})
export class BadgesModule {
}
