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

type SharedInfo = { tooltip: string, svgUrl: string, bgColor: { 'background-color': string } };

const tableDataBackup: TableDataMatrix = [];
const shared: SharedInfo[] = [];

@Component({
  template: `
    <span [ngStyle]="shared[row]?.bgColor" [jigsawTooltip]="shared[row]?.tooltip">
      <a (click)="saveBadge(tableData, row)">
        <i class="fa fa-floppy-o" aria-hidden="true"></i>
      </a>
      <a (click)="removeBadge(tableData, row)">
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
export class OperationTableCell extends TableCellRenderer {
  // the template can not directly read the global object, use this property to make sure
  // the template can access to the `shared` object
  public shared = shared;

  constructor(private _http: Http, private _popupService: PopupService) {
    super();
  }

  public saveBadge(tableData: TableData, row: number) {
    if (!Utils.isValidSubject(tableData, row)) {
      return;
    }
    const rowData = tableData.data[row];
    const method = tableDataBackup[row] ? 'put' : 'post';
    this._http[method]('/rdk/service/app/any-badge/server/badge', {
      subject: rowData[1], status: rowData[2], color: rowData[3], description: rowData[4]
    })
      .map(resp => resp.json())
      .subscribe((result: HttpResult) => {
        if (result.error) {
          const popupInfo = this._popupService.popup(JigsawErrorAlert, {}, {
            message: 'Unable to save your change! Detail: ' + result.detail
          });
        } else {
          tableDataBackup[row] = rowData.concat();
          shared[row].tooltip = '';
          shared[row].bgColor['background-color'] = '';
          //change the time stamp to force the browser to refresh the svg
          shared[row].svgUrl = `/rdk/service/app/any-badge/server/badge-svg?subject=${rowData[1]}&_=${+new Date}`;
        }
      });
  }

  public removeBadge(tableData: TableData, row: number) {
    const rowData = tableDataBackup[row];
    if (!rowData) {
      //not being saved yet
      shared.splice(row, 1);
      tableDataBackup.splice(row, 1);
      tableData.data.splice(row, 1);
      tableData.refresh();
      return;
    }

    let opt = <RequestOptionsArgs>{body: {subject: rowData[1]}};
    this._http.delete('/rdk/service/app/any-badge/server/badge', opt)
      .map(resp => resp.json())
      .subscribe((result: HttpResult) => {
        if (result.error) {
          const popupInfo = this._popupService.popup(JigsawErrorAlert, {}, {
            message: 'Unable to delete the badge! Detail: ' + result.detail
          });
        } else {
          shared.splice(row, 1);
          tableDataBackup.splice(row, 1);
          tableData.data.splice(row, 1);
          tableData.refresh();
        }
      });
  }
}

@Component({
  template: '<img src="{{shared[row]?.svgUrl}}">'
})
export class BadgeSvgTableCell extends TableCellRenderer {
  // the template can not directly read the global object, use this property to make sure
  // the template can access to the `shared` object
  public shared = shared;
}

@Component({
  template: `
    <jigsaw-input #input [(value)]="cellData" [clearable]="false" jigsawTooltip="these chars only: a-z 0-9 - _"
                  (blur)="dispatchChangeEvent(this.cellData)" (cellDataChange)="onChange()">
    </jigsaw-input>
  `
})
export class SubjectEditor extends TableCellRenderer implements AfterViewInit {
  @ViewChild(JigsawInput) input: JigsawInput;

  constructor(private _renderer: Renderer2) {
    super();
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
        const svg = `/rdk/service/app/any-badge/server/badge-svg?subject=${item[0]}`;
        item.unshift(svg);
        tableDataBackup.push(item.concat());
        shared.push({tooltip: '', svgUrl: svg, bgColor: {'background-color': ''}});
      });
      return data;
    }
  }

  public newBadge(): void {
    shared.push({
      tooltip: 'Invalid subject, these chars only:<br>a-z 0-9 - _',
      svgUrl: '',
      bgColor: {'background-color': '#F6EBBC'}
    });
    this.badges.data.push(['', '< new badge >', '< new badge >', 'good', 'a awesome badge']);
    this.badges.refresh();
  }

  public onDataChange(info: TableDataChangeEvent) {
    const row = +info.row;
    shared[row].tooltip = Utils.isValidSubject(this.badges, row) ?
      'Unsaved change found, click the save<br>button to save your change.' :
      'Invalid subject, these chars only:<br>a-z 0-9 - _';

    const row1 = this.badges.data[row];
    const row2 = tableDataBackup[row];
    shared[row].bgColor['background-color'] = !row1 || !row2 || row1.toString() !== row2.toString() ? '#F6EBBC' : '';
  }

  ngOnInit() {
    this.badges.fromAjax('/rdk/service/app/any-badge/server/badge');
  }
}
