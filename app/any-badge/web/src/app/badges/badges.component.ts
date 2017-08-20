import 'rxjs/add/operator/switchMap';
import {Http, RequestOptionsArgs} from "@angular/http";
import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {
  AdditionalColumnDefine,
  ColumnDefine,
  JigsawErrorAlert, JigsawInput, LoadingService, PopupInfo,
  PopupService,
  TableCellEditor,
  TableCellRenderer,
  TableData, TableDataChangeEvent, TableDataMatrix
} from "@rdkmaster/jigsaw";
import {HttpResult} from "../utils/typings";
import {Utils} from "../utils/utils";
import {CopyBadgeComponent} from "./copy-badge.component";
import {AuthService} from "../services/auth.service";

type SharedInfo = { tooltip: string, svgUrl: string, bgColor: { 'background-color': string } };

const tableDataBackup: TableDataMatrix = [];
const shared: SharedInfo[] = [];

@Component({
  template: `
    <span [ngStyle]="shared[row]?.bgColor" [jigsawTooltip]="shared[row]?.tooltip">
      <a (click)="saveBadge(tableData, row)">
        <i class="fa fa-floppy-o"></i>
      </a>
      <a (click)="removeBadge($event)">
        <i class="fa fa-trash"></i>
      </a>
      <a (click)="popCopyDialog(tableData, row)">
        <i class="fa fa-copy"></i>
      </a>
    </span>
    <ng-template #confirm>
      <jigsaw-tooltip-dialog>
        <h4>Confirm</h4>
        <p style="margin: 12px 0 12px 0">Are you sure to remove this badge?<br>This action is not recoverable.</p>
        <jigsaw-button (click)="removeBadgeDo(tableData, row)" width="50px">Yes</jigsaw-button>
        <jigsaw-button (click)="closeConfirmDialog()" width="50px">Cancel</jigsaw-button>
      </jigsaw-tooltip-dialog>
    </ng-template>
  `,
  styles: [`
    a {
      font-size: 15px;
    }
    
    a:last-child {
      margin-left: 8px;
    }

    span {
      padding: 6px;
    }
  `]
})
export class OperationTableCell extends TableCellRenderer {
  // the template can not directly read the global object, use this property to make sure
  // the template can access to the `shared` object
  public shared = shared;
  @ViewChild('confirm') confirmDialog:TemplateRef<any>;

  constructor(private _http: Http, private _popupService: PopupService, private _renderer:Renderer2,
              private _authService:AuthService, private _loading: LoadingService) {
    super();
  }

  public saveBadge(tableData: TableData, row: number) {
    if (!Utils.isValidSubject(tableData, row)) {
      return;
    }
    const blockInfo = this._loading.show();
    const rowData = tableData.data[row];
    const method = tableDataBackup[row] ? 'put' : 'post';
    this._http[method]('/rdk/service/app/any-badge/server/badge', {
      subject: rowData[1], subjectColor: rowData[2], status: rowData[3], statusColor: rowData[4], description: rowData[5]
    })
      .map(resp => resp.json())
      .subscribe((result: HttpResult) => {
        blockInfo.dispose();
        if (result.error) {
          const popupInfo = this._popupService.popup(JigsawErrorAlert, {}, {
            message: 'Unable to save your change! Detail: ' + result.detail
          });
          popupInfo.answer.subscribe(() => popupInfo.dispose());
        } else {
          tableDataBackup[row] = rowData.concat();
          shared[row].tooltip = '';
          shared[row].bgColor['background-color'] = '';
          //change the time stamp to force the browser to refresh the svg
          shared[row].svgUrl = `/rdk/service/app/any-badge/server/svg?subject=${rowData[1]}&_=${+new Date}`;
        }
      });
  }

  private _confirmDialogInfo:PopupInfo;

  public closeConfirmDialog() {
    if (this._confirmDialogInfo) {
      this._confirmDialogInfo.dispose();
    }
  }

  public removeBadge(event:MouseEvent) {
    this.closeConfirmDialog();
    this._confirmDialogInfo = this._popupService.popup(this.confirmDialog, {
      modal: false,
      pos:{ x:event.clientX, y:event.clientY },
      posOffset: { top: -130, left: -15 }
    });
    const removeEvent = this._renderer.listen(window, 'click', (event1) => {
      if (event.target === event1.target) {
        return;
      }

      if (this._isInTooltipDialog(event1, this._confirmDialogInfo.element)) {
        // user click at any element from the dialog
        return;
      }
      this.closeConfirmDialog();
      removeEvent();
    });
  }

  /**
   * notice: it is not necessary to do this in this specific scenario,
   * because that after whatever you clicked in the tooltip dialog, we will need to dispose the dialog.
   * but since this is a teaching project, I'll still show you how in case you have to do this in your case.
   * @param {MouseEvent} event
   * @returns {boolean}
   * @private
   */
  private _isInTooltipDialog(event, dialogElement):boolean {
    return event.path.indexOf(dialogElement) != -1;
  }

  public removeBadgeDo(tableData: TableData, row: number) {
    this.closeConfirmDialog();
    const rowData = tableDataBackup[row];
    if (!rowData) {
      //not being saved yet
      shared.splice(row, 1);
      tableDataBackup.splice(row, 1);
      tableData.data.splice(row, 1);
      tableData.refresh();
      return;
    }

    const blockInfo = this._loading.show();
    let opt = <RequestOptionsArgs>{body: {subject: rowData[1]}};
    this._http.delete('/rdk/service/app/any-badge/server/badge', opt)
      .map(resp => resp.json())
      .subscribe((result: HttpResult) => {
        blockInfo.dispose();
        if (result.error) {
          const popupInfo = this._popupService.popup(JigsawErrorAlert, {}, {
            message: 'Unable to delete the badge! Detail: ' + result.detail
          });
          popupInfo.answer.subscribe(() => popupInfo.dispose());
        } else {
          shared.splice(row, 1);
          tableDataBackup.splice(row, 1);
          tableData.data.splice(row, 1);
          tableData.refresh();
        }
      });
  }

  public popCopyDialog(tableData: TableData, row: number) {
    this._popupService.popup(CopyBadgeComponent, {}, {
      subject: this.tableData.data[this.row][1], privateKey: this._authService.privateKey
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
                  (blur)="dispatchChangeEvent(this.cellData)">
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
      width: '294px',
      cell: {
        renderer: BadgeSvgTableCell,
      }
    },
    {
      target: 'subject', width: '149px',
      cell: {
        editable: true,
        editorRenderer: SubjectEditor,
      }
    },
    {
      target: 'subject_color', width: '117px',
      cell: {
        editable: true,
        editorRenderer: TableCellEditor,
      }
    },
    {
      target: 'status', width: '117px',
      cell: {
        editable: true,
        editorRenderer: TableCellEditor,
      }
    },
    {
      target: 'status_color', width: '117px',
      cell: {
        editable: true,
        editorRenderer: TableCellEditor,
      }
    },
    {
      target: 'description', width: '117px',
      cell: {
        editable: true,
        editorRenderer: TableCellEditor,
      }
    }
  ];
  public additionalColumns: AdditionalColumnDefine[] = [
    {
      width: '69px',
      header: {
        text: 'Operation'
      },
      cell: {
        renderer: OperationTableCell
      }
    }
  ];

  constructor(http: Http, private _loading: LoadingService) {
    this.badges.http = http;
    this.badges.dataReviser = (data) => {
      tableDataBackup.splice(0, tableDataBackup.length);
      data.header = ['Badge', 'Subject', 'Subject Color', 'Status', 'Status Color', 'Description'];
      data.field = ['badge', 'subject', 'subject_color', 'status', 'status_color', 'description'];
      data.data.forEach(item => {
        const svg = `/rdk/service/app/any-badge/server/svg?subject=${item[0]}`;
        item.unshift(svg);
        tableDataBackup.push(item.concat());
        shared.push({tooltip: '', svgUrl: svg, bgColor: {'background-color': ''}});
      });
      this
      return data;
    }
  }

  public newBadge(): void {
    shared.push({
      tooltip: 'Invalid subject, these chars only:<br>a-z 0-9 - _',
      svgUrl: '/rdk/service/app/any-badge/server/svg?subject=new&privateKey=jigsaw-any-badge',
      bgColor: {'background-color': '#F6EBBC'}
    });
    this.badges.data.push(['', '<new badge>', '#555', '--', 'bad', 'an awesome badge']);
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

    const blockInfo = this._loading.show();
    this.badges.onRefresh(() => blockInfo.dispose());
  }
}
