import {Component, Input, ViewChild} from "@angular/core";
import {ButtonInfo, DialogBase, JigsawDialog} from "@rdkmaster/jigsaw";

@Component({
  template: `
    <jigsaw-dialog width="450px" caption="Put badge to projects" [buttons]="[{label: 'Close'}]" (answer)="dispose($event)">
      <div class="container">
        <p>Copy the following text, and save it to the <code>README.md</code> of your project.</p>
        <p class="code-block">{{badgeLink}}</p>
        <p>
          Tip: visit the <a routerLink="/guides/getting-started">getting-started</a>
          guide to learn how to update the status of your badge anytime you need.
        </p>
      </div>
    </jigsaw-dialog>
  `,
  styles: [`
    .container {
      padding: 12px;
    }
    p {
      width: 424px;
    }
    .code-block {
      padding: 6px;
      border-radius: 2px;
      margin: 12px 0 12px 0;
      font-family: Monospaced;
      background-color: #ccc;
      border: 1px solid #aaa;
    }
  `]
})
export class CopyBadgeComponent extends DialogBase {
  @ViewChild(JigsawDialog) dialog: JigsawDialog;
  badgeLink:string = '[![e2e testcases count](http://rdkmaster.com/rdk/service/app/badges/server/get-badge?type=e2e%20testcases)](http://rdk.zte.com.cn)'
}
