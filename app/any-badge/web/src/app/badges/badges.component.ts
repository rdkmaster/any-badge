import 'rxjs/add/operator/switchMap';
import {Http, RequestOptionsArgs} from "@angular/http";
import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {
  AdditionalColumnDefine, CallbackRemoval,
  ColumnDefine,
  JigsawErrorAlert, JigsawInput,
  PopupService,
  TableCellEditor,
  TableCellRenderer,
  TableData, TableDataMatrix, TableMatrixRow
} from "@rdkmaster/jigsaw";
import {HttpResult} from "../utils/typings";
import {Utils} from "../utils/utils";

const refreshSvgEvent = new Subject();
const subjectChangeEvent = new Subject();
const tableDataBackup: TableDataMatrix = [];

@Component({
  template: `
    <span [style.background-color]="getColor(tableData, row)" [jigsawTooltip]="saveBadgeMessage">
      <a (click)="saveBadge(tableData, row)">
        <i class="fa fa-floppy-o" aria-hidden="true"></i>
      </a>
      <a (click)="removeBadge(tableData.data[row])">
        <i class="fa fa-trash" aria-hidden="true"></i>
      </a>
    </span>
  `,
  styles: [`
    a {
      font-size: 16px;
    }

    a:last-child {
      margin-left: 12px;
    }
    
    span {
      padding: 8px 26px 6px 26px;
    }
  `]
})
export class OperationTableCell extends TableCellRenderer implements OnDestroy {
  public saveBadgeMessage:string;
  private _removeSubjectChangeEvent:any;

  constructor(private _http: Http, private _popupService: PopupService) {
    super();
    this._removeSubjectChangeEvent = subjectChangeEvent.subscribe(() => {
      this.saveBadgeMessage = Utils.isValidSubject(this.tableData, this.row) ? '' :
        'Invalid subject, these chars only: a-z 0-9 - _';
    });
  }

  ngOnDestroy() {
    this._removeSubjectChangeEvent && this._removeSubjectChangeEvent.unsubscribe();
  }

  public saveBadge(tableData: TableData, row: number) {
    if (!Utils.isValidSubject(tableData, row)) {
      return;
    }
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
          refreshSvgEvent.next();
          tableDataBackup[row] = rowData.concat();
          this.saveBadgeMessage = '';
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

  public getColor(tableData:TableData, row:number): string {
    const row1 = tableData.data[row];
    const row2 = tableDataBackup[row];
    const hasChange = !row1 || !row2 || row1.toString() !== row2.toString();
    // if (hasChange) {
    //   console.log(this.saveBadgeMessage);
    //   if (!this.saveBadgeMessage) {
    //     this.saveBadgeMessage = 'Got unsaved change, click the save button to save your change.';
    //   }
    // }
    return hasChange ? '#F6EBBC' : '';
  }
}

@Component({
  template: '<img src="{{cellData}}&_={{timestamp}}">'
})
export class BadgeSvgTableCell extends TableCellRenderer implements OnDestroy {
  timestamp: number = +new Date;

  private _removeRefreshSvgEvent;

  constructor() {
    super();
    this._removeRefreshSvgEvent = refreshSvgEvent.subscribe(() => {
      //change the time stamp to force the browser to refresh the svg
      this.timestamp = +new Date;
    });
  }

  ngOnDestroy() {
    this._removeRefreshSvgEvent && this._removeRefreshSvgEvent.unsubscribe();
  }
}

@Component({
  template: `
    <jigsaw-input #input [(value)]="cellData" [clearable]="false"
                  (blur)="dispatchChangeEvent(this.cellData)" (cellDataChange)="onChange()">
    </jigsaw-input>
  `
})
export class SubjectEditor extends TableCellRenderer implements AfterViewInit {

  @ViewChild(JigsawInput) input: JigsawInput;
  constructor(private _renderer:Renderer2) {
    super();
  }

  onChange() {
    subjectChangeEvent.next();
  }

  ngAfterViewInit() {
    if (tableDataBackup[this.row]) {
      // if the index of `this.row` can be found in the `tableDataBackup`,
      // it means that this is not a new row, we do not allow user to edit the subject field
      const removeEvent = this._renderer.listen(window, 'click', () => {
        removeEvent();
        this.dispatchChangeEvent(this.cellData);
      });
    } else {
      // it is a new row, user can edit whenever he wants
      this.input.focus();
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
      tableDataBackup.splice(0, tableDataBackup.length);
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
    this.badges.data.push(['', '< new badge >', '< new badge >', '< new badge >', '< new badge >']);
    this.badges.refresh();
  }

  ngOnInit() {
    this.badges.fromAjax('/rdk/service/app/any-badge/server/badge');
  }
}
