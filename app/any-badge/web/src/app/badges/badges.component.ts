import 'rxjs/add/operator/switchMap';
import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {
  JigsawErrorAlert, JigsawInput, LoadingService, PopupInfo, PopupOptions,
  PopupService, TableCellRendererBase, TableCellTextEditorRenderer,
  TableData, TableDataChangeEvent, TableDataMatrix
} from "@rdkmaster/jigsaw";
import {HttpResult} from "../utils/typings";
import {Utils} from "../utils/utils";
import {CopyBadgeComponent} from "./copy-badge.component";
import {AuthService} from "../services/auth.service";
import {HttpClient} from "@angular/common/http";

enum BadgeEvent {
  updateSvg, newBadgeAdded
}

const tableDataBackup: TableDataMatrix = [];

// const shared: SharedInfo[] = [];

@Component({
  template: `
    <span [ngStyle]="bgColor" [jigsawTooltip]="tooltip">
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
export class OperationTableCell extends TableCellRendererBase implements OnInit, OnDestroy {
  @ViewChild('confirm') confirmDialog: TemplateRef<any>;
  public tooltip: string = '';
  public bgColor = {'background-color': ''};
  private _subscription;

  constructor(private _http: HttpClient, private _popupService: PopupService, private _renderer: Renderer2,
              private _authService: AuthService, private _loading: LoadingService) {
    super();
  }

  public ngOnInit() {
    this._subscription = this.tableData.subscribe(change => {

      if (change == BadgeEvent.newBadgeAdded) {
        this.tooltip = 'Invalid subject, these chars only:<br>a-z 0-9 - _';
        this.bgColor = {'background-color': '#F6EBBC'};
      } else if (change.hasOwnProperty('row') && change.row[0] == this.row) {
        // we do not care the other row's change.
        // notice: we can't use `change instanceof TableDataChangeEvent` here to check the type of `change`
        // this maybe a bug of typescript, because that Jigsaw do emmit a `TableDataChangeEvent` value.

        this.tooltip = Utils.isValidSubject(this.tableData, this.row) ?
          'Unsaved change found, click the save<br>button to save your change.' :
          'Invalid subject, these chars only:<br>a-z 0-9 - _';

        const row1 = this.tableData.data[this.row];
        const row2 = tableDataBackup[this.row];
        this.bgColor['background-color'] = !row1 || !row2 || row1.toString() !== row2.toString() ? '#F6EBBC' : '';
      }
    });
  }

  public saveBadge(tableData: TableData, row: number) {
    if (!Utils.isValidSubject(tableData, row)) {
      return;
    }
    const blockInfo = this._loading.show();
    const rowData = tableData.data[row];
    const method = tableDataBackup[row] ? 'put' : 'post';
    this._http[method]('/rdk/service/app/any-badge/server/badge', {
      subject: rowData[1],
      subjectColor: rowData[2],
      status: rowData[3],
      statusColor: rowData[4],
      description: rowData[5]
    })
      .subscribe((result: HttpResult) => {
        blockInfo.dispose();
        if (result.error) {
          JigsawErrorAlert.show('Unable to save your change! Detail: ' + result.detail);
        } else {
          tableDataBackup[row] = rowData.concat();
          this.tooltip = '';
          this.bgColor['background-color'] = '';
          // tell the svg cell to update the picture.
          this.tableData.emit(BadgeEvent.updateSvg);
        }
      });
  }

  private _confirmDialogInfo: PopupInfo;

  public closeConfirmDialog() {
    if (this._confirmDialogInfo) {
      this._confirmDialogInfo.dispose();
    }
  }

  public removeBadge(event: MouseEvent) {
    this.closeConfirmDialog();
    const option: any = {
      modal: false,
      pos: {x: event.clientX, y: event.clientY},
      posOffset: {top: -130, left: -15}
    };
    this._confirmDialogInfo = this._popupService.popup(this.confirmDialog, option);
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
   * @param dialogElement
   * @returns {boolean}
   * @private
   */
  private _isInTooltipDialog(event, dialogElement): boolean {
    return event.path.indexOf(dialogElement) != -1;
  }

  public removeBadgeDo(tableData: TableData, row: number) {
    this.closeConfirmDialog();
    const rowData = tableDataBackup[row];
    if (!rowData) {
      //not being saved yet
      tableDataBackup.splice(row, 1);
      tableData.data.splice(row, 1);
      tableData.refresh();
      return;
    }

    const blockInfo = this._loading.show();
    this._http.delete('/rdk/service/app/any-badge/server/badge', {params: {subject: rowData[1]}})
      .subscribe((result: HttpResult) => {
        blockInfo.dispose();
        if (result.error) {
          JigsawErrorAlert.show('Unable to delete the badge! Detail: ' + result.detail);
        } else {
          tableDataBackup.splice(row, 1);
          tableData.data.splice(row, 1);
          tableData.refresh();
        }
      });
  }

  public popCopyDialog(tableData: TableData, row: number) {
    this._popupService.popup(CopyBadgeComponent, null, {
      subject: this.tableData.data[this.row][1], privateKey: this._authService.privateKey
    });
  }

  public ngOnDestroy() {
    //don't forget to remove the subscription while the cell is destroyed.
    this._subscription.unsubscribe();
  }
}

@Component({
  template: `<img [src]="this.tableData.data[this.row][0] + '&_=' + timestamp">`
})
export class BadgeSvgTableCell extends TableCellRendererBase implements OnInit, OnDestroy {
  public timestamp;
  private _subscription;

  ngOnInit() {
    this._subscription = this.tableData.subscribe(change => {
      if (change == BadgeEvent.updateSvg) {
        // just simply update the timestamp to force the browser to refresh the picture.
        this.timestamp = +new Date;
      }
    });
  }

  ngOnDestroy() {
    //don't forget to remove the subscription while the cell is destroyed.
    this._subscription.unsubscribe();
  }
}

@Component({
  template: `
    <jigsaw-input #input [(value)]="cellData" [clearable]="false" jigsawTooltip="these chars only: a-z 0-9 - _"
                  (blur)="dispatchChangeEvent(this.cellData)">
    </jigsaw-input>
  `
})
export class SubjectEditor extends TableCellRendererBase implements AfterViewInit {
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
  public columns = [
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
        editorRenderer: TableCellTextEditorRenderer,
      }
    },
    {
      target: 'status', width: '117px',
      cell: {
        editable: true,
        editorRenderer: TableCellTextEditorRenderer,
      }
    },
    {
      target: 'status_color', width: '117px',
      cell: {
        editable: true,
        editorRenderer: TableCellTextEditorRenderer,
      }
    },
    {
      target: 'description', width: '117px',
      cell: {
        editable: true,
        editorRenderer: TableCellTextEditorRenderer,
      }
    }
  ];
  public additionalColumns = [
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

  constructor(http: HttpClient, private _loading: LoadingService) {
    this.badges.http = http;
    this.badges.dataReviser = (data) => {
      tableDataBackup.splice(0, tableDataBackup.length);
      if (!data.data) {
        data.data = [];
      }
      data.header = ['Badge', 'Subject', 'Subject Color', 'Status', 'Status Color', 'Description'];
      data.field = ['badge', 'subject', 'subject_color', 'status', 'status_color', 'description'];
      data.data.forEach(item => {
        const svg = `/rdk/service/app/any-badge/server/svg?subject=${item[0]}`;
        item.unshift(svg);
        tableDataBackup.push(item.concat());
      });
      return data;
    }
  }

  public newBadge(): void {
    this.badges.data.push([
      '/rdk/service/app/any-badge/server/svg?subject=new&privateKey=jigsaw-any-badge',
      '<new badge>', '#555', '--', 'bad', 'an awesome badge'
    ]);
    this.badges.refresh();
    this.badges.emit(BadgeEvent.newBadgeAdded);
  }

  public onDataChange(change: TableDataChangeEvent) {
    this.badges.emit(change);
  }

  ngOnInit() {
    this.badges.fromAjax('/rdk/service/app/any-badge/server/badge');

    const blockInfo = this._loading.show();
    this.badges.onRefresh(() => blockInfo.dispose());
  }
}
