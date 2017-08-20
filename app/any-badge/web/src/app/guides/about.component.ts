import 'rxjs/add/operator/switchMap';
import {Http, RequestOptionsArgs} from "@angular/http";
import {AfterViewInit, Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {
  AdditionalColumnDefine,
  ColumnDefine,
  JigsawErrorAlert, JigsawInput,
  PopupService,
  TableCellEditor,
  TableCellRenderer,
  TableData, TableDataChangeEvent, TableDataMatrix
} from "@rdkmaster/jigsaw";
import {HttpResult} from "../utils/typings";
import {Utils} from "../utils/utils";

@Component({
  template:`
    <h1>about</h1>
  `
})
export class FeaturesComponent {
}
