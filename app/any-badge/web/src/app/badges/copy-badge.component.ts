import {Component, Input, ViewChild} from "@angular/core";
import {ButtonInfo, DialogBase, JigsawDialog} from "@rdkmaster/jigsaw";

@Component({
  template: `
    <jigsaw-dialog width="600px" caption="Put badge to projects" [buttons]="[{label: 'Close'}]" (answer)="dispose($event)">
      <div class="container">
        <p>Copy the following text, and save it to the readme of your project.</p>
        <jigsaw-input width="576px" [clearable]="false" [disabled]="true" [value]="badgeLink"></jigsaw-input>
      </div>
    </jigsaw-dialog>
  `,
  styles: [`
    .container {
      padding: 12px;
    }
  `]
})
export class CopyBadgeComponent extends DialogBase {
  @ViewChild(JigsawDialog) dialog: JigsawDialog;
  badgeLink:string = '[![e2e testcases count](http://rdkmaster.com/rdk/service/app/badges/server/get-badge?type=e2e%20testcases)](http://rdk.zte.com.cn)'
}
