import 'rxjs/add/operator/switchMap';
import {Http, RequestOptionsArgs} from "@angular/http";
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {
  AdditionalColumnDefine, ColumnDefine, JigsawErrorAlert, PopupEffect, PopupService, TableCellEditor, TableCellRenderer,
  TableData
} from "@rdkmaster/jigsaw";
import {HttpResult} from "../utils/typings";
import {Subject} from "rxjs/Subject";

const refreshSvgSubject = new Subject();

@Component({
  template: `
    <a (click)="saveBadge(tableData, row)"><i class="fa fa-floppy-o" aria-hidden="true"></i></a>
    <a (click)="removeBadge(tableData.data[row])"><i class="fa fa-trash" aria-hidden="true"></i></a>
  `,
  styles: [`
    a:hover {
      text-decoration: underline
    }

    a {
      font-size: 16px;
    }

    a:first-child {
      margin-right: 12px;
    }
  `]
})
export class OperationTableCell extends TableCellRenderer {
  constructor(private _http: Http, private _popupService: PopupService) {
    super();
  }

  public saveBadge(tableData:TableData, row:number) {
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
        }
      });
  }

  public removeBadge(tableData:TableData, row:number) {
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
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.css']
})
export class BadgeListComponent implements OnInit {
  badges: TableData = new TableData();
  columns: ColumnDefine[] = [
    {
      target: 'badge',
      width: '30%',
      cell: {
        renderer: BadgeSvgTableCell,
      }
    },
    {
      target: 'subject',
      width: '10%'
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
  additionalColumns: AdditionalColumnDefine[] = [
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
      data.data.forEach(item => item.unshift(`/rdk/service/app/any-badge/server/badge-svg?subject=${item[0]}`));
      console.log(data);
      return data;
    }
  }

  ngOnInit() {
    this.badges.fromAjax('/rdk/service/app/any-badge/server/badge');
  }
}
