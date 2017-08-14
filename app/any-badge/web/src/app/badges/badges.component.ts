import 'rxjs/add/operator/switchMap';
import {Http, RequestOptionsArgs} from "@angular/http";
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {
  AdditionalColumnDefine,
  ColumnDefine,
  JigsawErrorAlert, JigsawInput,
  PopupService,
  TableCellEditor,
  TableCellRenderer,
  TableData, TableDataMatrix, TableMatrixRow
} from "@rdkmaster/jigsaw";
import {HttpResult} from "../utils/typings";
import {Utils} from "../utils/utils";

const refreshSvgSubject = new Subject();
const NEW_BADGE = '< new badge >';
const tableDataBackup: TableDataMatrix = [];

@Component({
  template: `
    <span [style.background-color]="getColor(tableData, row)">
      <a *ngIf="isValidRowData(tableData, row)" (click)="saveBadge(tableData, row)">
        <i class="fa fa-floppy-o" aria-hidden="true"></i>
      </a>
      <a *ngIf="isValidRowData(tableData, row)" (click)="removeBadge(tableData.data[row])">
        <i class="fa fa-trash" aria-hidden="true"></i>
      </a>
    </span>
  `,
  styles: [`
    a:hover {
      text-decoration: underline
    }

    a {
      font-size: 16px;
    }

    a:last-child {
      margin-left: 12px;
    }
  `]
})
export class OperationTableCell extends TableCellRenderer {
  constructor(private _http: Http, private _popupService: PopupService) {
    super();
  }

  public saveBadge(tableData: TableData, row: number) {
    const rowData = tableData.data[row];
    this._http.put('/rdk/service/app/any-badge/server/badge', {
      subject: rowData[1], status: rowData[2], color: rowData[3], description: rowData[4]
    })
      .map(resp => resp.json())
      .subscribe((result: HttpResult) => {
        if (result.error) {
          const popupInfo = this._popupService.popup(JigsawErrorAlert, {}, {
            message: 'Unable to save your change! Detail: ' + result.detail
          });
        } else {
          refreshSvgSubject.next();
          tableDataBackup[row] = rowData.concat();
        }
      });
  }

  public removeBadge(tableData: TableData, row: number) {
    const rowData = tableData.data[row];
    let opt = <RequestOptionsArgs>{params: `subject=${rowData[1]}`};
    this._http.delete('/rdk/service/app/any-badge/server/badge', opt)
      .map(resp => resp.json())
      .subscribe((result: HttpResult) => {
        if (result.error) {
          const popupInfo = this._popupService.popup(JigsawErrorAlert, {}, {
            message: 'Unable to delete the badge! Detail: ' + result.detail
          });
        } else {

        }
      });
  }

  public isValidRowData(tableData:TableData, row:number):boolean {
    return Utils.isValidRowData(tableData, row);
  }

  public getColor(tableData:TableData, row:number): string {
    const row1 = tableData.data[row];
    const row2 = tableDataBackup[row];
    return row1 && row2 && row1.toString() === row2.toString() ? '#fff' : 'red';
  }
}

@Component({
  template: '<img src="{{cellData}}&_={{timestamp}}">'
})
export class BadgeSvgTableCell extends TableCellRenderer {
  timestamp: number = +new Date;

  constructor() {
    super();
    refreshSvgSubject.subscribe(() => {
      //change the time stamp to force the browser to refresh the svg
      this.timestamp = +new Date;
    });
  }
}

@Component({
  template: `
    <jigsaw-input #input [(value)]="cellData" [clearable]="false"
                  (focus)="onFocus()" (blur)="dispatchChangeEvent(cellData)">
    </jigsaw-input>
  `
})
export class SubjectEditor extends TableCellRenderer implements AfterViewInit {

  @ViewChild(JigsawInput) input: JigsawInput;

  ngAfterViewInit() {
    this.input.focus();
  }

  onFocus() {
    if (Utils.isValidRowData(this.tableData, this.row)) {
      setTimeout(() => {
        this.dispatchChangeEvent(this.cellData);
      });
    }
  }
}

@Component({
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.css']
})
export class BadgeListComponent implements OnInit {
  public badges: TableData = new TableData();
  public columns: ColumnDefine[] = [
    {
      target: 'badge',
      width: '30%',
      cell: {
        renderer: BadgeSvgTableCell,
      }
    },
    {
      target: 'subject',
      width: '10%',
      cell: {
        editable: true,
        editorRenderer: SubjectEditor,
      }
    },
    {
      target: 'status',
      width: '10%',
      cell: {
        editable: true,
        editorRenderer: TableCellEditor,
      }
    },
    {
      target: 'color',
      width: '10%',
      cell: {
        editable: true,
        editorRenderer: TableCellEditor,
      }
    },
    {
      target: 'description',
      width: '30%',
      cell: {
        editable: true,
        editorRenderer: TableCellEditor,
      }
    }
  ];
  public additionalColumns: AdditionalColumnDefine[] = [
    {
      width: '10%',
      header: {
        text: 'Operation'
      },
      cell: {
        renderer: OperationTableCell
      }
    }
  ];

  constructor(http: Http) {
    this.badges.http = http;
    this.badges.dataReviser = (data) => {
      data.header = ['Badge', 'Subject', 'Status', 'Color', 'Description'];
      data.field = ['badge', 'subject', 'status', 'color', 'description'];
      data.data.forEach(item => {
        item.unshift(`/rdk/service/app/any-badge/server/badge-svg?subject=${item[0]}`);
        tableDataBackup.push(item.concat());
      });
      return data;
    }
  }

  public newBadge(): void {
    this.badges.data.push(['', NEW_BADGE, NEW_BADGE, NEW_BADGE, NEW_BADGE]);
    this.badges.refresh();
  }

  ngOnInit() {
    this.badges.fromAjax('/rdk/service/app/any-badge/server/badge');
  }
}
