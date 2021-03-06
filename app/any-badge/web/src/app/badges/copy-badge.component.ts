import {Component, Input, ViewChild} from "@angular/core";
import {ButtonInfo, DialogBase, JigsawDialog} from "@rdkmaster/jigsaw";

@Component({
  template: `
    <jigsaw-dialog width="600px" caption="Put badge to projects" [buttons]="[{label: 'Close'}]"
                   (answer)="dispose($event)">
      <div class="container">
        <p>Copy the following text, and save it to the <code>README</code> file of your project.</p>
        <p style="margin-top: 12px">Markdown formatted:</p>
        <p class="code-block">{{markdownLink}}</p>
        <p>SVG url:</p>
        <p class="code-block">{{svgUrl}}</p>
        <p>
          Tip: visit the <a routerLink="/guides/getting-started">getting-started</a>
          guide to learn how to update the status of your badge anytime or anywhere you need.
        </p>
      </div>
    </jigsaw-dialog>
  `,
  styles: [`
    .container {
      padding: 12px;
    }
    p {
      width: 574px;
    }
    .code-block {
      padding: 6px;
      border-radius: 2px;
      margin: 12px 0 12px 0;
      font-family: "Courier New";
      background-color: #eee;
      border: 1px solid #aaa;
    }
  `]
})
export class CopyBadgeComponent extends DialogBase {
  @ViewChild(JigsawDialog) dialog: JigsawDialog;

  svgUrl:string = '';
  markdownLink:string = '';

  set initData(value) {
    const subject = value.subject.replace(/[^a-zA-Z0-9-_]/g, found => '%' + found.charCodeAt(0).toString(16));
    this.svgUrl = `http://rdkmaster.com/rdk/service/app/any-badge/server/svg?subject=${subject}&privateKey=${value.privateKey}`;
    this.markdownLink = `[![${value.subject} not found](${this.svgUrl})](https://github.com/rdkmaster/any-badge)`;
  }
}
